import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CytologyResult } from './types';

/** A fully-completed, normal (negative) cytology report fixture. */
function createNormalResult(): CytologyResult {
	return {
		reportingClinician: 'Dr A Cytopathologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenType: 'cervical-smear',
		specimenAdequacy: 'satisfactory',
		clinicalHistory: 'Routine cervical screening; previous results normal.',
		comparisonWithPrevious: 'No previous abnormal cytology.',
		cytologyResultCategory: 'negative',
		hpvResult: 'negative',
		malignancyPresent: false,
		dysplasiaPresent: false,
		microscopicDescription: 'Squamous and endocervical cells within normal limits. No dyskaryosis.',
		diagnosis: 'Negative for intraepithelial lesion or malignancy.',
		impression: 'Negative cytology; return to routine recall.',
		reportingCategory: 'negative',
		recommendedFollowUp: 'Routine recall in 3 years.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** A low-grade abnormal report fixture: low-grade dyskaryosis, no malignancy. */
function createAbnormalResult(): CytologyResult {
	return {
		...createNormalResult(),
		cytologyResultCategory: 'low-grade dyskaryosis',
		hpvResult: 'positive',
		dysplasiaPresent: true,
		microscopicDescription: 'Squamous cells showing low-grade dyskaryotic changes.',
		diagnosis: 'Low-grade dyskaryosis.',
		impression: 'Low-grade dyskaryosis; HPV positive.',
		reportingCategory: 'low-grade dyskaryosis',
		recommendedFollowUp: 'Refer for colposcopy.'
	};
}

/** A critical report fixture: high-grade dyskaryosis with malignant cells. */
function createCriticalResult(): CytologyResult {
	return {
		...createNormalResult(),
		cytologyResultCategory: 'high-grade dyskaryosis (severe)',
		hpvResult: 'positive',
		malignancyPresent: true,
		dysplasiaPresent: true,
		microscopicDescription: 'High-grade dyskaryosis with features suspicious for invasion.',
		diagnosis: 'High-grade dyskaryosis; malignant cells present.',
		impression: 'High-grade dyskaryosis with malignant cells.',
		reportingCategory: 'high-grade dyskaryosis (severe)',
		recommendedFollowUp: 'Urgent colposcopy / MDT referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Cytology four-axis grading engine', () => {
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

	it('grades a low-grade abnormal report', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
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

	it('escalates a high-grade category (no malignancy boolean) to critical via the category text', () => {
		const r = createNormalResult();
		r.cytologyResultCategory = 'high-grade dyskaryosis (moderate)';
		r.reportingCategory = 'high-grade dyskaryosis (moderate)';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('classifies an unsatisfactory specimen as inconclusive', () => {
		const r = createNormalResult();
		r.specimenAdequacy = 'unsatisfactory';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.microscopicDescription = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades an isolated HPV-positive result as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.hpvResult = 'positive';
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

describe('Cytology flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags a suspected-cancer 2-week-wait result when malignancy is present', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-SUSPECTED-CANCER-2WW-001')).toBe(true);
	});

	it('flags previous high-grade cytology recorded in the comparison', () => {
		const r = createAbnormalResult();
		r.comparisonWithPrevious = 'Previous high-grade dyskaryosis on prior smear.';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-PREVIOUS-HIGH-GRADE-001')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
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
