import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { createDefault } from './defaults';
import type { NuclearMedicineRequest } from './types';

/** A fully-completed, routine, appropriate, safe nuclear medicine request fixture. */
function createAppropriateRequest(): NuclearMedicineRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr Test';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Test';
	d.patient.lastName = 'Patient';
	d.patient.dateOfBirth = '1980-01-01';
	d.patient.nhsNumber = '123 456 7890';
	d.patient.weightKg = 75;
	d.request.scanType = 'bone-scan';
	d.request.primaryIndication = 'suspected-bone-metastases';
	d.request.clinicalQuestion = 'Identify osseous metastatic disease in known prostate cancer.';
	d.safety.pregnancyStatus = 'not-applicable';
	d.justification.irMeRJustification = 'Suspected bone metastases in known malignancy.';
	d.triage.urgency = 'routine';
	return d;
}

describe('Nuclear medicine request four-axis vetting engine', () => {
	it('accepts an appropriate, safe, complete routine request', () => {
		const g = calculateGrade(createAppropriateRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.prepSafetyBand).toBe('ok');
		expect(g.radiationDoseBand).toBe('moderate');
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.completenessPercent).toBeGreaterThanOrEqual(90);
	});

	// --- Axis A band boundaries -------------------------------------------

	it('scores an ideal indication x scan-type pairing as usually-appropriate (score 8)', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'thyroid-uptake';
		r.request.primaryIndication = 'thyroid-function';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
	});

	it('scores a plausible-but-suboptimal pairing as may-be-appropriate (score 5)', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'white-cell-scan';
		r.request.primaryIndication = 'suspected-bone-metastases';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(5);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
	});

	it('scores a mismatched pairing as usually-not-appropriate (score 2) → query-referrer', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'sentinel-node';
		r.request.primaryIndication = 'cardiac-ischaemia';
		const g = calculateGrade(r);
		expect(g.appropriatenessScore).toBe(2);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
	});

	it('defaults to a provisional may-be-appropriate score when indication or scan type is unspecified', () => {
		const g = calculateGrade(createDefault());
		expect(g.appropriatenessScore).toBe(5);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
	});

	// --- Axis B — pregnancy / breastfeeding / interference escalation -----

	it('makes confirmed pregnancy contraindicated → reject, with the F-PREGNANCY-001 flag', () => {
		const r = createAppropriateRequest();
		r.safety.pregnancyStatus = 'pregnant';
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('contraindicated');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((x) => x.ruleId === 'R-SAFETY-PREGNANT')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PREGNANCY-001' && f.priority === 'high')).toBe(true);
	});

	it('escalates possible / unknown pregnancy to caution with the F-PREGNANCY-002 flag', () => {
		const possible = createAppropriateRequest();
		possible.safety.pregnancyStatus = 'possible';
		const gPossible = calculateGrade(possible);
		expect(gPossible.prepSafetyBand).toBe('caution');
		expect(gPossible.flags.some((f) => f.flagId === 'F-PREGNANCY-002')).toBe(true);

		const unknown = createAppropriateRequest();
		unknown.safety.pregnancyStatus = 'unknown';
		expect(calculateGrade(unknown).prepSafetyBand).toBe('caution');
	});

	it('escalates breastfeeding to caution with the F-BREASTFEEDING-001 flag', () => {
		const r = createAppropriateRequest();
		r.safety.breastfeeding = true;
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('caution');
		expect(g.firedRules.some((x) => x.ruleId === 'R-SAFETY-BREASTFEEDING')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-BREASTFEEDING-001')).toBe(true);
	});

	it('escalates a recent other radionuclide study to caution with the interference flag', () => {
		const r = createAppropriateRequest();
		r.safety.recentOtherNuclearScan = true;
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('caution');
		expect(g.firedRules.some((x) => x.ruleId === 'R-SAFETY-RECENT-RADIONUCLIDE')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-RECENT-RADIONUCLIDE-INTERFERENCE-001')).toBe(true);
	});

	it('escalates a low eGFR (< 30) to caution', () => {
		const r = createAppropriateRequest();
		r.safety.egfr = 22;
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('caution');
		expect(g.firedRules.some((x) => x.ruleId === 'R-SAFETY-LOW-EGFR')).toBe(true);
	});

	it('lifts an otherwise-OK band to caution for a high effective-dose study, with the dose flag', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'gallium-octreotide';
		r.request.primaryIndication = 'tumour-localisation';
		const g = calculateGrade(r);
		expect(g.radiationDoseBand).toBe('high');
		expect(g.prepSafetyBand).toBe('caution');
		expect(g.firedRules.some((x) => x.ruleId === 'R-SAFETY-HIGH-DOSE')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-HIGH-RADIATION-DOSE-001')).toBe(true);
		expect(g.recommendation).toBe('redirect');
	});

	it('takes the most-severe band when multiple safety rules fire (pregnancy wins over caution rules)', () => {
		const r = createAppropriateRequest();
		r.safety.pregnancyStatus = 'pregnant';
		r.safety.breastfeeding = true;
		r.safety.recentOtherNuclearScan = true;
		const g = calculateGrade(r);
		expect(g.prepSafetyBand).toBe('contraindicated');
	});

	// --- Radiation dose band per scan type ----------------------------------

	it('maps each scan type to its documented radiation-dose band', () => {
		const cases: Array<[string, string]> = [
			['bone-scan', 'moderate'],
			['myocardial-perfusion', 'high'],
			['vq-lung-scan', 'low'],
			['thyroid-uptake', 'low'],
			['renal-dmsa', 'low'],
			['renal-mag3', 'low'],
			['gallium-octreotide', 'high'],
			['white-cell-scan', 'moderate'],
			['sentinel-node', 'low']
		];
		for (const [scanType, expected] of cases) {
			const r = createAppropriateRequest();
			r.request.scanType = scanType as NuclearMedicineRequest['request']['scanType'];
			const g = calculateGrade(r);
			expect(g.radiationDoseBand).toBe(expected);
		}
	});

	// --- Axis D — high-acuity triage escalation -----------------------------

	it('auto-escalates triage to emergency for suspected pulmonary embolism with a V/Q lung scan', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'vq-lung-scan';
		r.request.primaryIndication = 'pulmonary-embolism';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((x) => x.ruleId === 'R-TRIAGE-SUSPECTED-PE')).toBe(true);
	});

	it('auto-escalates triage to urgent for infection localisation', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'white-cell-scan';
		r.request.primaryIndication = 'infection-localisation';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((x) => x.ruleId === 'R-TRIAGE-ACUTE-INFECTION')).toBe(true);
	});

	it('auto-escalates triage to urgent for cardiac ischaemia', () => {
		const r = createAppropriateRequest();
		r.request.scanType = 'myocardial-perfusion';
		r.request.primaryIndication = 'cardiac-ischaemia';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((x) => x.ruleId === 'R-TRIAGE-CARDIAC-ISCHAEMIA')).toBe(true);
	});

	it('does not downgrade a clinician-requested emergency urgency', () => {
		const r = createAppropriateRequest();
		r.triage.urgency = 'emergency';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
	});

	// --- Axis C — completeness ----------------------------------------------

	it('reports low completeness and queries the referrer for a blank request', () => {
		const g = calculateGrade(createDefault());
		expect(g.completenessPercent).toBeLessThan(50);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.flags.some((f) => f.flagId === 'F-MISSING-INDICATION-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-MISSING-CLINICAL-QUESTION-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-MISSING-JUSTIFICATION-001')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createAppropriateRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
