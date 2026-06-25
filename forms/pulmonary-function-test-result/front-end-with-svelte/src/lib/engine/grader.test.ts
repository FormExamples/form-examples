import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { PulmonaryFunctionResult } from './types';

/** A fully-completed, normal lung-function report fixture. */
function createNormalResult(): PulmonaryFunctionResult {
	return {
		reportingClinician: 'Dr A Respiratory',
		originatingRequestReference: 'REQ-2001',
		testType: 'spirometry',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		testQuality: 'acceptable',
		clinicalHistory: 'Breathlessness on exertion; assess lung function.',
		fev1Litres: 3.2,
		fev1PercentPredicted: 98,
		fvcLitres: 4.1,
		fvcPercentPredicted: 99,
		fev1FvcRatio: 0.78,
		peakExpiratoryFlow: 540,
		dlcoPercentPredicted: 95,
		ventilatoryPattern: 'normal',
		severity: 'none',
		bronchodilatorReversibility: 'not-tested',
		airflowObstruction: false,
		restriction: false,
		reducedGasTransfer: false,
		significantReversibility: false,
		normalSpirometry: true,
		findingsNarrative: 'Spirometry within normal limits. No obstruction or restriction.',
		comparisonWithPrevious: 'No prior studies available for comparison.',
		impression: 'Normal spirometry. No evidence of airflow obstruction or restriction.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: moderate airflow obstruction, no critical finding. */
function createAbnormalResult(): PulmonaryFunctionResult {
	return {
		...createNormalResult(),
		testType: 'spirometry-with-reversibility',
		fev1Litres: 1.9,
		fev1PercentPredicted: 62,
		fvcLitres: 3.6,
		fvcPercentPredicted: 90,
		fev1FvcRatio: 0.53,
		ventilatoryPattern: 'obstructive',
		severity: 'moderate',
		bronchodilatorReversibility: 'negative',
		airflowObstruction: true,
		normalSpirometry: false,
		findingsNarrative: 'Moderate airflow obstruction; FEV1/FVC 0.53, FEV1 62% predicted.',
		impression: 'Moderate airflow obstruction consistent with COPD.',
		recommendedFollowUp: 'Respiratory clinic review.'
	};
}

/** A critical report fixture: severe airflow obstruction. */
function createCriticalResult(): PulmonaryFunctionResult {
	return {
		...createAbnormalResult(),
		fev1Litres: 1.0,
		fev1PercentPredicted: 34,
		fev1FvcRatio: 0.41,
		severity: 'severe',
		airflowObstruction: true,
		findingsNarrative: 'Severe airflow obstruction; FEV1 34% predicted, FEV1/FVC 0.41.',
		impression: 'Severe airflow obstruction.',
		recommendedFollowUp: 'Urgent respiratory review.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Pulmonary function four-axis grading engine', () => {
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

	it('grades an abnormal report with moderate airflow obstruction', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
		expect(g.reportingCategory).toBe('GOLD 2 (moderate)');
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
		expect(g.reportingCategory).toBe('GOLD 3 (severe)');
	});

	it('grades very-severe obstruction as major with urgent escalation', () => {
		const r = createCriticalResult();
		r.severity = 'very-severe';
		r.fev1PercentPredicted = 25;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
		expect(g.reportingCategory).toBe('GOLD 4 (very-severe)');
	});

	it('classifies an unacceptable-quality test as inconclusive', () => {
		const r = createNormalResult();
		r.testQuality = 'unacceptable';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.findingsNarrative = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades mild impairment / reduced gas transfer as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.normalSpirometry = false;
		r.reducedGasTransfer = true;
		r.dlcoPercentPredicted = 58;
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

describe('Pulmonary function flag detection', () => {
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

	it('flags an abnormal pattern with no recorded spirometry value', () => {
		const r = createAbnormalResult();
		r.fev1Litres = null;
		r.fvcLitres = null;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
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
