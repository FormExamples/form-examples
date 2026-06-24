import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { HolterMonitorResult } from './types';

/** A fully-completed, normal Holter report fixture. */
function createNormalResult(): HolterMonitorResult {
	return {
		reportingClinician: 'Dr A Cardiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		monitorType: '24-hour',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		recordingDurationHours: 24,
		analysedPercent: 98,
		clinicalHistory: 'Palpitations; exclude paroxysmal arrhythmia.',
		comparisonWithPrevious: 'No prior ambulatory ECG available for comparison.',
		predominantRhythm: 'sinus',
		meanHeartRateBpm: 72,
		minimumHeartRateBpm: 48,
		maximumHeartRateBpm: 128,
		longestPauseSeconds: 1.2,
		ventricularEctopicPercent: 0.2,
		supraventricularEctopicPercent: 0.5,
		atrialFibrillationDetected: false,
		significantPauses: false,
		ventricularTachycardia: false,
		supraventricularTachycardia: false,
		highGradeAvBlock: false,
		symptomRhythmCorrelation: false,
		normalStudy: true,
		findingsNarrative: 'Sinus rhythm throughout. Rare isolated ectopics. No significant pauses.',
		impression: 'Normal 24-hour ambulatory ECG. No arrhythmia to account for symptoms.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal Holter report fixture: AF with controlled rate, no critical finding. */
function createAbnormalResult(): HolterMonitorResult {
	return {
		...createNormalResult(),
		predominantRhythm: 'atrial-fibrillation',
		maximumHeartRateBpm: 120,
		findingsNarrative: 'Atrial fibrillation throughout with a controlled ventricular response.',
		atrialFibrillationDetected: true,
		normalStudy: false,
		impression: 'Persistent atrial fibrillation with controlled ventricular rate.',
		recommendedFollowUp: 'Cardiology review for anticoagulation and rate control.'
	};
}

/** A critical Holter report fixture: ventricular tachycardia. */
function createCriticalResult(): HolterMonitorResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Syncope; exclude malignant arrhythmia.',
		findingsNarrative: 'A run of non-sustained ventricular tachycardia at 180 bpm.',
		ventricularTachycardia: true,
		normalStudy: false,
		impression: 'Non-sustained ventricular tachycardia.',
		recommendedFollowUp: 'Immediate cardiology referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Holter monitor four-axis grading engine', () => {
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

	it('grades an abnormal report with atrial fibrillation', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-monitoring');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates ventricular tachycardia to critical-alert regardless of other axes', () => {
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

	it('escalates a pause > 3 seconds to critical-alert', () => {
		const r = createNormalResult();
		r.longestPauseSeconds = 4.5;
		r.normalStudy = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('escalates high-grade AV block to critical-alert', () => {
		const r = createNormalResult();
		r.highGradeAvBlock = true;
		r.normalStudy = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('escalates fast atrial fibrillation to critical-alert', () => {
		const r = createNormalResult();
		r.atrialFibrillationDetected = true;
		r.maximumHeartRateBpm = 165;
		r.normalStudy = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
	});

	it('classifies a recording with < 50% analysed as inconclusive', () => {
		const r = createNormalResult();
		r.analysedPercent = 30;
		r.normalStudy = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-monitoring');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.predominantRhythm = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades a high ventricular ectopic burden as moderate with a recommended follow-up', () => {
		const r = createNormalResult();
		r.ventricularEctopicPercent = 15;
		r.normalStudy = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-monitoring');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Holter monitor flag detection', () => {
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

	it('flags an inadequate recording', () => {
		const r = createNormalResult();
		r.analysedPercent = 40;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'inadequate-recording')).toBe(true);
	});

	it('flags a missing mean heart rate measurement', () => {
		const r = createNormalResult();
		r.meanHeartRateBpm = null;
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
