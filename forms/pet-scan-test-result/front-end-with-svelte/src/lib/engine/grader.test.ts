import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { PetScanResult } from './types';

/** A fully-completed, normal PET report fixture. */
function createNormalResult(): PetScanResult {
	return {
		reportingClinician: 'Dr A Nuclear-Medicine',
		originatingRequestReference: 'REQ-2001',
		scanType: 'fdg-pet-ct',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		clinicalHistory: 'Hodgkin lymphoma; interim response assessment.',
		bloodGlucoseMmolL: 5.4,
		injectedActivityMbq: 350,
		examinationAdequacy: 'adequate',
		findingsNarrative: 'No abnormal FDG uptake. Physiological distribution only.',
		hypermetabolicLesion: false,
		nodalUptake: false,
		distantMetastasis: false,
		noAbnormalUptake: true,
		physiologicalUptakeOnly: true,
		incidentalFinding: false,
		suvMax: null,
		largestLesionSizeMm: null,
		comparisonWithPrevious: 'Reduced uptake compared with the baseline staging PET-CT.',
		treatmentResponse: 'complete',
		impression: 'Complete metabolic response. Deauville 2.',
		reportingCategory: 'Deauville 2',
		recommendedFollowUp: 'Routine surveillance.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal PET report fixture: hypermetabolic nodal disease, no critical finding. */
function createAbnormalResult(): PetScanResult {
	return {
		...createNormalResult(),
		findingsNarrative: 'FDG-avid right cervical nodes, SUVmax 6.2.',
		noAbnormalUptake: false,
		physiologicalUptakeOnly: false,
		hypermetabolicLesion: true,
		nodalUptake: true,
		suvMax: 6.2,
		largestLesionSizeMm: 18,
		treatmentResponse: 'partial',
		impression: 'Residual FDG-avid nodal disease. Deauville 4.',
		reportingCategory: 'Deauville 4',
		recommendedFollowUp: 'Oncology review; interval PET-CT.'
	};
}

/** A critical PET report fixture: distant metastatic disease. */
function createCriticalResult(): PetScanResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Lung cancer staging.',
		findingsNarrative: 'Intensely FDG-avid primary with hepatic and osseous metastases.',
		noAbnormalUptake: false,
		physiologicalUptakeOnly: false,
		hypermetabolicLesion: true,
		nodalUptake: true,
		distantMetastasis: true,
		suvMax: 14.5,
		largestLesionSizeMm: 42,
		treatmentResponse: 'progressive',
		impression: 'Progressive metastatic disease.',
		reportingCategory: 'PERCIST PMD',
		recommendedFollowUp: 'Urgent oncology referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('PET scan four-axis grading engine', () => {
	it('grades a normal, complete report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal report with hypermetabolic nodal disease', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
		// The clinician-entered Deauville label is carried through.
		expect(g.reportingCategory).toBe('Deauville 4');
	});

	it('auto-escalates a critical finding to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('auto-escalates a progressive treatment response to critical', () => {
		const r = createAbnormalResult();
		r.treatmentResponse = 'progressive';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
	});

	it('escalates high tracer avidity (SUVmax >= 10) to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.suvMax = 12;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies a non-diagnostic study as inconclusive', () => {
		const r = createNormalResult();
		r.examinationAdequacy = 'non-diagnostic';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.comparisonWithPrevious = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades incidental-only findings as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.incidentalFinding = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('PET scan flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags a hypermetabolic lesion with no recorded SUVmax', () => {
		const r = createAbnormalResult();
		r.suvMax = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
	});

	it('flags elevated pre-injection blood glucose', () => {
		const r = createNormalResult();
		r.bloodGlucoseMmolL = 13.2;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-INADEQUATE-TECHNIQUE-002')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createCriticalResult());
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a normal complete report', () => {
		const flags = detectFlags(createNormalResult());
		expect(flags).toHaveLength(0);
	});
});
