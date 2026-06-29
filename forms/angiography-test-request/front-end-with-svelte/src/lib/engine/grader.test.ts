import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { scoreAppropriateness, scoreCompleteness } from './rules';
import { createDefaultRequest } from './defaults';
import type { RequestData } from './types';

/** A complete, appropriate, safe routine request (peripheral CTA). */
function routineRequest(): RequestData {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr H Iqbal';
	d.clinician.referralDate = '2026-05-04';
	d.patient.firstName = 'Amara';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1965-02-11';
	d.patient.nhsNumber = '401 234 5678';
	d.request.angiographyType = 'ct-angiography';
	d.request.bodyRegion = 'peripheral-lower-limb';
	d.request.primaryIndication = 'peripheral-arterial-disease';
	d.request.clinicalQuestion = 'Assess extent and run-off of lower-limb arterial disease.';
	d.contrast.contrastRequired = 'iodinated';
	d.contrast.egfr = 80;
	d.pregnancy.pregnancyStatus = 'not-applicable';
	d.pregnancy.irMeRJustification = 'Diagnostic CTA justified for PAD planning.';
	d.triage.urgency = 'routine';
	return d;
}

describe('Angiography four-axis grader', () => {
	it('accepts a complete, appropriate, safe routine request', () => {
		const r = calculateGrade(routineRequest());
		expect(r.appropriatenessBand).toBe('usually-appropriate');
		expect(r.appropriatenessScore).toBe(8);
		expect(r.safetyBand).toBe('ok');
		expect(r.completenessPercent).toBe(100);
		expect(r.triageTier).toBe('routine');
		expect(r.recommendation).toBe('accept');
		expect(r.flags).toHaveLength(0);
	});

	it('rejects when iodinated contrast with severe renal impairment', () => {
		const d = routineRequest();
		d.contrast.egfr = 20;
		const r = calculateGrade(d);
		expect(r.safetyBand).toBe('contraindicated');
		expect(r.recommendation).toBe('reject');
		expect(r.firedRules.some((x) => x.ruleId === 'R-SAFETY-EGFR-SEVERE')).toBe(true);
		expect(r.flags.some((f) => f.flagId === 'F-RENAL-IMPAIRMENT-001')).toBe(true);
	});

	it('contraindicates a contrast allergy with a contrast-requiring exam', () => {
		const d = routineRequest();
		d.contrast.contrastAllergy = true;
		const r = calculateGrade(d);
		expect(r.safetyBand).toBe('contraindicated');
		expect(r.flags.some((f) => f.flagId === 'F-CONTRAST-ALLERGY-001' && f.priority === 'high')).toBe(
			true
		);
	});

	it('escalates GI bleeding to emergency triage', () => {
		const d = routineRequest();
		d.request.angiographyType = 'catheter-dsa';
		d.request.primaryIndication = 'gi-bleeding';
		d.triage.urgency = 'routine';
		const r = calculateGrade(d);
		expect(r.triageTier).toBe('emergency');
		expect(r.targetTimeframe).toBe('Same day / immediate');
		expect(r.firedRules.some((x) => x.ruleId === 'R-TRIAGE-GI-BLEEDING')).toBe(true);
	});

	it('caution + metformin flag for moderate eGFR on metformin', () => {
		const d = routineRequest();
		d.contrast.egfr = 38;
		d.contrast.metformin = true;
		const r = calculateGrade(d);
		expect(r.safetyBand).toBe('caution');
		expect(r.recommendation).toBe('query-referrer');
		expect(r.flags.some((f) => f.flagId === 'F-METFORMIN-CONTRAST-001')).toBe(true);
	});

	it('flags pregnancy with an ionising-radiation examination', () => {
		const d = routineRequest();
		d.pregnancy.pregnancyStatus = 'pregnant';
		const r = calculateGrade(d);
		expect(r.safetyBand).toBe('contraindicated');
		expect(r.flags.some((f) => f.flagId === 'F-PREGNANCY-001')).toBe(true);
	});

	it('marks a clearly mismatched indication/modality as usually-not-appropriate', () => {
		const appr = scoreAppropriateness('gi-bleeding', 'coronary-angiography');
		expect(appr.band).toBe('usually-not-appropriate');
		expect(appr.score).toBe(2);
	});

	it('completeness drops and missing rules fire for a blank request', () => {
		const c = scoreCompleteness(createDefaultRequest());
		expect(c.percent).toBeLessThan(50);
		expect(c.missing.some((m) => m.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(c.missing.some((m) => m.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('raises missing-indication and missing-clinical-question flags when blank', () => {
		const flags = detectFlags(createDefaultRequest());
		expect(flags.some((f) => f.flagId === 'F-MISSING-INDICATION-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-MISSING-CLINICAL-QUESTION-001')).toBe(true);
	});
});
