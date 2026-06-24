import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { MammographyResult } from './types';

/** A fully-completed, normal (BI-RADS 1) mammography report fixture. */
function createNormalResult(): MammographyResult {
	return {
		reportingClinician: 'Dr A Radiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		examType: 'screening',
		laterality: 'bilateral',
		examinationAdequacy: 'adequate',
		breastDensity: 'b',
		clinicalHistory: 'Routine NHSBSP screening mammogram.',
		comparisonWithPrevious: 'Compared with prior screening round; stable.',
		findingsNarrative: 'No mass, suspicious calcification, asymmetry, or distortion.',
		mass: false,
		calcifications: false,
		architecturalDistortion: false,
		asymmetry: false,
		skinOrNippleChange: false,
		lymphadenopathy: false,
		incidentalFinding: false,
		largestLesionSizeMm: null,
		impression: 'Normal screening mammogram.',
		biRadsCategory: '1',
		recommendedFollowUp: 'Return to routine screening.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** A BI-RADS 3 (probably benign) abnormal report fixture. */
function createProbablyBenignResult(): MammographyResult {
	return {
		...createNormalResult(),
		examType: 'diagnostic',
		findingsNarrative: 'A 9 mm circumscribed oval mass, probably benign.',
		mass: true,
		largestLesionSizeMm: 9,
		impression: 'Probably benign mass; short-interval follow-up advised.',
		biRadsCategory: '3',
		recommendedFollowUp: '6-month follow-up mammogram.'
	};
}

/** A BI-RADS 4b (suspicious) abnormal report fixture. */
function createSuspiciousResult(): MammographyResult {
	return {
		...createNormalResult(),
		examType: 'diagnostic',
		findingsNarrative: 'Cluster of pleomorphic calcifications, suspicious.',
		calcifications: true,
		largestLesionSizeMm: 12,
		impression: 'Suspicious calcifications; biopsy recommended.',
		biRadsCategory: '4b',
		recommendedFollowUp: 'Stereotactic biopsy.'
	};
}

/** A BI-RADS 5 (highly suggestive of malignancy) critical report fixture. */
function createCriticalResult(): MammographyResult {
	return {
		...createNormalResult(),
		examType: 'symptomatic',
		laterality: 'right',
		breastDensity: 'c',
		clinicalHistory: 'Palpable right breast lump.',
		findingsNarrative: 'A 28 mm spiculated mass with associated skin retraction.',
		mass: true,
		architecturalDistortion: true,
		skinOrNippleChange: true,
		largestLesionSizeMm: 28,
		impression: 'Highly suggestive of malignancy.',
		biRadsCategory: '5',
		recommendedFollowUp: 'Image-guided biopsy and breast MDT referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Mammography four-axis grading engine', () => {
	it('grades a normal, complete BI-RADS 1 report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportingCategory).toBe('BI-RADS 1');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades a BI-RADS 3 probably-benign report as abnormal / minor / recommended', () => {
		const g = calculateGrade(createProbablyBenignResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.targetTimeframe).toBe('6-month short-interval');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-RECOMMENDED-02')).toBe(true);
	});

	it('grades a BI-RADS 4b suspicious report as abnormal / moderate / urgent', () => {
		const g = calculateGrade(createSuspiciousResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-URGENT-01')).toBe(true);
		// BI-RADS 4 raises abnormal-requiring-action + urgent-referral flags.
		expect(g.flags.some((f) => f.category === 'abnormal-requiring-action')).toBe(true);
		expect(g.flags.some((f) => f.category === 'urgent-referral')).toBe(true);
	});

	it('auto-escalates a BI-RADS 5 result to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('two-week-wait biopsy');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('classifies BI-RADS 0 as inconclusive with a further-imaging recommendation', () => {
		const r = createNormalResult();
		r.biRadsCategory = '0';
		r.impression = 'Incomplete; additional imaging required.';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-RECOMMENDED-01')).toBe(true);
	});

	it('classifies BI-RADS 6 (known malignancy) as abnormal / major / recommended', () => {
		const r = createNormalResult();
		r.biRadsCategory = '6';
		r.mass = true;
		r.largestLesionSizeMm = 20;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-RECOMMENDED-03')).toBe(true);
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

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Mammography flag detection', () => {
	it('flags a critical BI-RADS 5 result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('raises a suspected-cancer two-week-wait urgent-referral flag for BI-RADS 4', () => {
		const flags = detectFlags(createSuspiciousResult());
		expect(flags.some((f) => f.flagId === 'F-URGENT-REFERRAL-001')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags a mass with no recorded measurement', () => {
		const r = createProbablyBenignResult();
		r.largestLesionSizeMm = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
	});

	it('flags a screening study assigned a diagnostic BI-RADS category', () => {
		const r = createNormalResult();
		r.examType = 'screening';
		r.biRadsCategory = '4a';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'discrepancy-with-request')).toBe(true);
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
