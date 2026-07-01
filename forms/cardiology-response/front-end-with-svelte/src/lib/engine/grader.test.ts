import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CardiologyResponse } from './types';

/** A fully-completed, reassuring (no-abnormality) response fixture. */
function createNoAbnormalityResponse(): CardiologyResponse {
	return {
		respondingClinician: 'Dr A Cardiologist',
		originatingRequestReference: 'REQ-2001',
		patientName: 'Jane Patient',
		patientNhsNumber: '943 476 5919',
		patientBirthDate: '1962-03-14',
		responseStatus: 'final',
		consultationType: 'clinic-review',
		assessedDate: '2026-06-01',
		respondedDate: '2026-06-01',
		clinicalSummary:
			'Reviewed in clinic with atypical chest pain. History and examination reassuring.',
		examinationFindings: 'Normal cardiovascular examination. No murmurs. Normal heart sounds.',
		investigationsPerformed: 'Resting ECG normal. Exercise tolerance test negative for ischaemia.',
		ischaemiaOrCad: false,
		significantArrhythmia: false,
		reducedEjectionFraction: false,
		significantValveDisease: false,
		structuralAbnormality: false,
		uncontrolledHypertension: false,
		nonCardiacCause: true,
		primaryDiagnosisCategory: 'non-cardiac',
		diagnosisNarrative: 'Non-cardiac chest pain; most likely musculoskeletal.',
		lvEjectionFractionPercent: 60,
		managementPlan: 'Reassurance. No cardiac intervention required.',
		medicationChanges: 'No changes.',
		recommendedFollowUp: 'Discharge back to GP. No cardiology follow-up required.',
		criticalResult: false,
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** A cardiac-condition HFrEF response fixture: reduced ejection fraction. */
function createHfrefResponse(): CardiologyResponse {
	return {
		...createNoAbnormalityResponse(),
		clinicalSummary: 'Breathlessness and ankle oedema. Echocardiogram performed.',
		examinationFindings: 'Raised JVP, bibasal crepitations, mild peripheral oedema.',
		investigationsPerformed: 'Echocardiogram: dilated left ventricle, LVEF 32 %. ECG sinus rhythm.',
		ischaemiaOrCad: false,
		reducedEjectionFraction: true,
		nonCardiacCause: false,
		primaryDiagnosisCategory: 'heart-failure',
		diagnosisNarrative: 'Heart failure with reduced ejection fraction (HFrEF).',
		lvEjectionFractionPercent: 32,
		managementPlan: 'Start guideline-directed medical therapy and optimise.',
		medicationChanges: 'Started ACE inhibitor and beta-blocker.',
		recommendedFollowUp: 'Heart-failure nurse-led clinic in 4 weeks.',
		criticalResult: false
	};
}

/** A critical response fixture: severe symptomatic aortic stenosis. */
function createCriticalResponse(): CardiologyResponse {
	return {
		...createNoAbnormalityResponse(),
		consultationType: 'inpatient-review',
		clinicalSummary: 'Exertional syncope and breathlessness; urgent echocardiogram performed.',
		examinationFindings: 'Slow-rising pulse, ejection systolic murmur radiating to the carotids.',
		investigationsPerformed:
			'Echocardiogram: severe aortic stenosis, peak velocity 4.6 m/s, valve area 0.7 cm².',
		significantValveDisease: true,
		nonCardiacCause: false,
		primaryDiagnosisCategory: 'valve-disease',
		diagnosisNarrative: 'Severe symptomatic aortic stenosis.',
		lvEjectionFractionPercent: 55,
		managementPlan: 'Urgent referral to the structural heart team for aortic valve intervention.',
		medicationChanges: 'Avoid vasodilators.',
		recommendedFollowUp: 'Urgent Heart Team review.',
		criticalResult: true,
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Cardiology response four-axis grading engine', () => {
	it('grades a reassuring, complete no-abnormality response', () => {
		const g = calculateGrade(createNoAbnormalityResponse());
		expect(g.responseClassification).toBe('no-abnormality');
		expect(g.severity).toBe('none');
		expect(g.completenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NONE-01')).toBe(true);
	});

	it('grades a cardiac-condition HFrEF response as major / urgent', () => {
		const g = calculateGrade(createHfrefResponse());
		expect(g.responseClassification).toBe('cardiac-condition');
		expect(g.severity).toBe('major');
		expect(g.severityCategory).toBe('reduced-ejection-fraction');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-management');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-CARDIAC-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEVERITY-MAJOR-03')).toBe(true);
		expect(g.flags.some((f) => f.category === 'reduced-ejection-fraction')).toBe(true);
	});

	it('auto-escalates a critical result to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResponse());
		expect(g.responseClassification).toBe('critical');
		expect(g.severity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FOLLOWUP-CRITICAL-01')).toBe(true);
		// The critical-finding flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-finding')).toBe(true);
	});

	it('grades a low ejection fraction (< 40 %) as reduced even without the flag', () => {
		const r = createNoAbnormalityResponse();
		r.nonCardiacCause = false;
		r.primaryDiagnosisCategory = 'heart-failure';
		r.diagnosisNarrative = 'Heart failure.';
		r.lvEjectionFractionPercent = 35;
		const g = calculateGrade(r);
		expect(g.responseClassification).toBe('cardiac-condition');
		expect(g.severity).toBe('major');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEVERITY-MAJOR-03')).toBe(true);
	});

	it('grades a moderate cardiac finding as recommended follow-up', () => {
		const r = createNoAbnormalityResponse();
		r.nonCardiacCause = false;
		r.ischaemiaOrCad = true;
		r.primaryDiagnosisCategory = 'coronary-artery-disease';
		r.diagnosisNarrative = 'Stable coronary artery disease.';
		const g = calculateGrade(r);
		expect(g.responseClassification).toBe('cardiac-condition');
		expect(g.severity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-investigation');
	});

	it('classifies a response with no clinical summary as inconclusive', () => {
		const r = createNoAbnormalityResponse();
		r.clinicalSummary = '';
		const g = calculateGrade(r);
		expect(g.responseClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-investigation');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNoAbnormalityResponse();
		r.examinationFindings = '';
		r.managementPlan = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.completenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-EXAMINATION-01')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResponse());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Cardiology response flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResponse());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-FINDING-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-FINDING-002')).toBe(true);
	});

	it('flags severe valve disease', () => {
		const flags = detectFlags(createCriticalResponse());
		expect(flags.some((f) => f.category === 'severe-valve-disease')).toBe(true);
	});

	it('flags reduced ejection fraction for an HFrEF response', () => {
		const flags = detectFlags(createHfrefResponse());
		expect(flags.some((f) => f.category === 'reduced-ejection-fraction')).toBe(true);
	});

	it('flags a missing diagnosis', () => {
		const r = createNoAbnormalityResponse();
		r.primaryDiagnosisCategory = '';
		r.diagnosisNarrative = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-diagnosis')).toBe(true);
	});

	it('flags an incomplete response', () => {
		const r = createNoAbnormalityResponse();
		r.managementPlan = '';
		r.recommendedFollowUp = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'incomplete-response')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createCriticalResponse());
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a reassuring complete response', () => {
		const flags = detectFlags(createNoAbnormalityResponse());
		expect(flags).toHaveLength(0);
	});
});
