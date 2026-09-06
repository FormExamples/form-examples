import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { TumorMarkerResult } from './types';

/** A fully-completed, normal tumour-marker report fixture. */
function createNormalResult(): TumorMarkerResult {
	return {
		reportingClinician: 'Dr A Biochemist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenCondition: 'satisfactory',
		clinicalHistory: 'Surveillance after treated colorectal cancer.',
		knownCancerSite: 'colorectal',
		psa: null,
		ca125: null,
		ca19_9: null,
		carcinoembryonicAntigenCea: 2.1,
		alphaFetoproteinAfp: null,
		betaHcg: null,
		ca15_3: null,
		lactateDehydrogenaseLdh: null,
		calcitonin: null,
		chromograninA: null,
		previousValue: 2.4,
		trend: 'stable',
		comparisonWithPrevious: 'Stable versus the previous CEA of 2.4 ng/mL.',
		overallResultStatus: 'normal',
		markedlyElevated: false,
		findingsNarrative: 'CEA within the reference range; no significant change.',
		impression: 'Normal tumour-marker result. No evidence of recurrence.',
		reportingCategory: '',
		recommendedFollowUp: 'Routine surveillance per protocol.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: markedly elevated CA125, rising trend. */
function createAbnormalResult(): TumorMarkerResult {
	return {
		...createNormalResult(),
		knownCancerSite: 'ovary',
		carcinoembryonicAntigenCea: null,
		ca125: 480,
		previousValue: 210,
		trend: 'rising',
		comparisonWithPrevious: 'Risen from a previous CA125 of 210 IU/mL.',
		overallResultStatus: 'abnormal',
		markedlyElevated: true,
		findingsNarrative: 'CA125 markedly elevated and rising on treatment.',
		impression: 'Markedly elevated, rising CA125; correlate clinically.',
		recommendedFollowUp: 'Urgent oncology review.'
	};
}

/** A critical report fixture: very high AFP suggesting a germ-cell tumour. */
function createCriticalResult(): TumorMarkerResult {
	return {
		...createNormalResult(),
		knownCancerSite: 'testis',
		carcinoembryonicAntigenCea: null,
		alphaFetoproteinAfp: 4200,
		betaHcg: 18000,
		lactateDehydrogenaseLdh: 880,
		previousValue: null,
		trend: 'not-applicable',
		comparisonWithPrevious: 'No prior values for comparison.',
		overallResultStatus: 'critical',
		markedlyElevated: true,
		findingsNarrative: 'Very high AFP and beta-hCG; germ-cell-marker pattern.',
		impression: 'Germ-cell-marker pattern; critical result.',
		recommendedFollowUp: 'Immediate germ-cell tumour pathway.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Tumour-marker four-axis grading engine', () => {
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

	it('grades a markedly elevated, rising result as abnormal and urgent', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('urgent');
		// 'moderate' shares 'repeat-marker' with 'inconclusive', aligned with
		// every sibling *-test-result engine — deriveRecommendation reads
		// severity, not followUpUrgency, for this tier, so a 'moderate'
		// severity result maps here even though Axis D is independently
		// 'urgent' via the action-signal rule below.
		expect(g.recommendation).toBe('repeat-marker');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-URGENT-01')).toBe(true);
	});

	it('auto-escalates a very high AFP / beta-hCG to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.reportingCategory).toBe('germ-cell-marker-pattern');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('treats a very high AFP alone as critical even when overall status is not critical', () => {
		const r = createNormalResult();
		r.alphaFetoproteinAfp = 2500;
		r.overallResultStatus = 'abnormal';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
	});

	it('classifies a result with no measured marker as inconclusive', () => {
		const r = createNormalResult();
		r.carcinoembryonicAntigenCea = null;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('repeat-marker');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.specimenCondition = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades a mildly raised abnormal result as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.overallResultStatus = 'abnormal';
		r.markedlyElevated = false;
		r.trend = 'stable';
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

describe('Tumour-marker flag detection', () => {
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

	it('flags an inadequate specimen', () => {
		const r = createNormalResult();
		r.specimenCondition = 'haemolysed';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'inadequate-technique')).toBe(true);
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
