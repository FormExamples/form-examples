import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { SleepStudyResult } from './types';

/** A fully-completed, normal sleep-study report fixture. */
function createNormalResult(): SleepStudyResult {
	return {
		reportingClinician: 'Dr A Sleep-Physician',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		studyType: 'home-sleep-apnoea-test',
		studyAdequacy: 'adequate',
		clinicalHistory: 'Snoring and daytime sleepiness; exclude OSA.',
		comparisonWithPrevious: 'No prior sleep study available for comparison.',
		totalRecordingTimeHours: 7.5,
		totalSleepTimeHours: 6.8,
		apnoeaHypopnoeaIndex: 2.4,
		oxygenDesaturationIndex: 1.8,
		minimumSpo2Percent: 93,
		timeBelow90PercentSpo2: 0.5,
		meanHeartRateBpm: 62,
		osaSeverity: 'none',
		obstructiveSleepApnoea: false,
		centralSleepApnoea: false,
		periodicLimbMovements: false,
		nocturnalHypoventilation: false,
		significantDesaturation: false,
		normalStudy: true,
		findingsNarrative: 'AHI 2.4/h. Oxygen saturation well maintained. No significant events.',
		impression: 'Normal sleep study. No evidence of obstructive sleep apnoea.',
		reportingCategory: 'No OSA (AHI <5)',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: mild-to-moderate OSA, no critical finding. */
function createAbnormalResult(): SleepStudyResult {
	return {
		...createNormalResult(),
		apnoeaHypopnoeaIndex: 20.5,
		oxygenDesaturationIndex: 18,
		minimumSpo2Percent: 87,
		timeBelow90PercentSpo2: 4.2,
		osaSeverity: 'moderate',
		obstructiveSleepApnoea: true,
		normalStudy: false,
		findingsNarrative: 'AHI 20.5/h, predominantly obstructive events.',
		impression: 'Moderate obstructive sleep apnoea.',
		reportingCategory: 'Moderate OSA (AHI 15 to <30)',
		recommendedFollowUp: 'Sleep-clinic review; consider CPAP if symptomatic.'
	};
}

/** A critical report fixture: severe OSA with significant desaturation. */
function createCriticalResult(): SleepStudyResult {
	return {
		...createNormalResult(),
		apnoeaHypopnoeaIndex: 48,
		oxygenDesaturationIndex: 45,
		minimumSpo2Percent: 74,
		timeBelow90PercentSpo2: 28,
		osaSeverity: 'severe',
		obstructiveSleepApnoea: true,
		significantDesaturation: true,
		normalStudy: false,
		findingsNarrative: 'AHI 48/h with profound desaturation; nadir SpO2 74%.',
		impression: 'Severe obstructive sleep apnoea with significant nocturnal desaturation.',
		reportingCategory: 'Severe OSA (AHI >=30)',
		recommendedFollowUp: 'Urgent CPAP review.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Sleep study four-axis grading engine', () => {
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

	it('grades an abnormal report with moderate OSA', () => {
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
		// Recommended action references the urgent CPAP / ventilation review.
		expect(g.recommendedAction.toLowerCase()).toContain('cpap');
	});

	it('auto-escalates nocturnal hypoventilation to critical-alert even without severe OSA', () => {
		const r = createNormalResult();
		r.apnoeaHypopnoeaIndex = 8;
		r.osaSeverity = 'mild';
		r.nocturnalHypoventilation = true;
		r.normalStudy = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('escalates severe OSA (AHI >= 30) to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.apnoeaHypopnoeaIndex = 36;
		r.osaSeverity = 'severe';
		// No significant desaturation, so not a critical finding.
		r.significantDesaturation = false;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies a failed study as inconclusive', () => {
		const r = createNormalResult();
		r.studyAdequacy = 'failed';
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

	it('grades mild OSA as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.apnoeaHypopnoeaIndex = 8;
		r.osaSeverity = 'mild';
		r.obstructiveSleepApnoea = true;
		r.normalStudy = false;
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

describe('Sleep study flag detection', () => {
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

	it('flags a study with no recorded AHI', () => {
		const r = createAbnormalResult();
		r.apnoeaHypopnoeaIndex = null;
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
