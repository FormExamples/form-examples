import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CardiacStressResult } from './types';

/** A fully-completed, normal / negative cardiac stress test fixture. */
function createNormalResult(): CardiacStressResult {
	return {
		reportingClinician: 'Dr A Cardiologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		testType: 'exercise-treadmill-ecg',
		protocol: 'Standard Bruce protocol.',
		clinicalHistory: 'Atypical chest pain; assess for inducible ischaemia.',
		comparisonWithPrevious: 'No prior stress testing available.',
		maximumHeartRateBpm: 165,
		percentPredictedHeartRate: 95,
		exerciseDurationMinutes: 9.5,
		metsAchieved: 11,
		peakBloodPressure: '170/85',
		bloodPressureResponse: 'normal',
		ischaemicStChanges: false,
		chestPainInduced: false,
		arrhythmiaInduced: false,
		terminatedEarly: false,
		testPositive: false,
		testNegative: true,
		testInconclusive: false,
		reasonForTermination: 'Target heart rate reached.',
		dukeTreadmillScore: 9.5,
		impression: 'Negative exercise treadmill ECG. Low-risk Duke treadmill score.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/**
 * An abnormal-positive fixture: an actionable finding (chest pain induced)
 * at an adequate workload, with an intermediate Duke score and no critical
 * trigger (not strongly positive, no exertional hypotension, METs > 5).
 */
function createAbnormalResult(): CardiacStressResult {
	return {
		...createNormalResult(),
		metsAchieved: 8,
		bloodPressureResponse: 'normal',
		ischaemicStChanges: false,
		chestPainInduced: true,
		testPositive: false,
		testNegative: false,
		dukeTreadmillScore: 1,
		impression: 'Inducible chest pain at moderate workload; no diagnostic ST changes.',
		recommendedFollowUp: 'Cardiology review and consider functional imaging.'
	};
}

/** A critical fixture: strongly positive test with high-risk Duke score. */
function createCriticalResult(): CardiacStressResult {
	return {
		...createNormalResult(),
		metsAchieved: 4,
		bloodPressureResponse: 'normal',
		ischaemicStChanges: true,
		chestPainInduced: true,
		testPositive: true,
		testNegative: false,
		dukeTreadmillScore: -14,
		impression: 'Strongly positive test; high-risk Duke treadmill score.',
		recommendedFollowUp: 'Urgent cardiology referral for coronary angiography.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('cardiac stress four-axis grading engine', () => {
	it('grades a normal, complete, negative report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal report with induced ischaemia at adequate workload', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.reportingCategory).toBe('duke-intermediate-risk');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a strongly positive high-risk-Duke result to critical-alert', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.reportingCategory).toBe('duke-high-risk');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('auto-escalates exertional hypotension to critical-alert', () => {
		const r = createNormalResult();
		r.bloodPressureResponse = 'hypotensive';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('auto-escalates ischaemia induced at low workload to critical-alert', () => {
		const r = createNormalResult();
		r.ischaemicStChanges = true;
		r.testPositive = true;
		r.testNegative = false;
		r.metsAchieved = 4;
		// No high-risk Duke; the low-workload ischaemia trigger drives the escalation.
		r.dukeTreadmillScore = 0;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
	});

	it('auto-escalates a high-risk Duke score alone to critical-alert', () => {
		const r = createNormalResult();
		r.dukeTreadmillScore = -12;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.reportingCategory).toBe('duke-high-risk');
	});

	it('classifies an inconclusive study as inconclusive with recommended follow-up', () => {
		const r = createNormalResult();
		r.testNegative = false;
		r.testInconclusive = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.protocol = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-PROTOCOL-01')).toBe(true);
	});

	it('grades an early-terminated test without an actionable finding as minor', () => {
		const r = createNormalResult();
		r.terminatedEarly = true;
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

describe('cardiac stress flag detection', () => {
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

	it('flags an inadequate / submaximal test', () => {
		const r = createNormalResult();
		r.percentPredictedHeartRate = 70;
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
