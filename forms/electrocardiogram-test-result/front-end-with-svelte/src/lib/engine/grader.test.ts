import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { ElectrocardiogramResult } from './types';

/** A fully-completed, normal ECG report fixture (normal sinus rhythm). */
function createNormalResult(): ElectrocardiogramResult {
	return {
		reportingClinician: 'Dr A Cardiologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		ecgType: 'resting-12-lead',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		recordingQuality: 'good',
		clinicalHistory: 'Routine pre-operative ECG.',
		comparisonWithPrevious: 'No prior ECG available for comparison.',
		ventricularRateBpm: 72,
		rhythm: 'sinus',
		prIntervalMs: 160,
		qrsDurationMs: 90,
		qtIntervalMs: 380,
		qtcMs: 420,
		cardiacAxis: 'normal',
		stElevation: false,
		stDepression: false,
		tWaveInversion: false,
		pathologicalQWaves: false,
		leftVentricularHypertrophy: false,
		bundleBranchBlock: false,
		ischaemia: false,
		normalEcg: true,
		interpretation: 'Normal sinus rhythm. Normal axis. Normal intervals. No acute changes.',
		reportingCategory: 'normal',
		impression: 'Normal ECG.',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal ECG report fixture: atrial fibrillation, no critical finding. */
function createAbnormalResult(): ElectrocardiogramResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Palpitations; query atrial fibrillation.',
		ventricularRateBpm: 118,
		rhythm: 'atrial-fibrillation',
		normalEcg: false,
		interpretation: 'Atrial fibrillation with a rapid ventricular response.',
		reportingCategory: 'actionable-finding',
		impression: 'Atrial fibrillation; rate control and anticoagulation review advised.',
		recommendedFollowUp: 'Cardiology review.'
	};
}

/** A critical ECG report fixture: ST-elevation (STEMI). */
function createCriticalResult(): ElectrocardiogramResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Central chest pain; query acute coronary syndrome.',
		ventricularRateBpm: 96,
		rhythm: 'sinus',
		stElevation: true,
		ischaemia: true,
		normalEcg: false,
		interpretation: 'ST-segment elevation in the anterior leads consistent with an acute STEMI.',
		reportingCategory: 'acute-ischaemia',
		impression: 'Acute anterior STEMI.',
		recommendedFollowUp: 'Immediate primary PCI referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('ECG four-axis grading engine', () => {
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

	it('grades an abnormal report with an abnormal rhythm', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a STEMI (ST elevation) to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('same hour');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('auto-escalates ventricular tachycardia to critical-alert', () => {
		const r = createNormalResult();
		r.rhythm = 'ventricular-tachycardia';
		r.normalEcg = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('auto-escalates a markedly prolonged QTc (>= 500 ms) to critical-alert', () => {
		const r = createNormalResult();
		r.qtcMs = 520;
		r.normalEcg = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
	});

	it('auto-escalates complete heart block to critical-alert', () => {
		const r = createNormalResult();
		r.rhythm = 'heart-block';
		r.normalEcg = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
	});

	it('classifies a poor-quality study with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.recordingQuality = 'poor';
		r.impression = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.interpretation = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades an isolated minor finding as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.tWaveInversion = true;
		r.normalEcg = false;
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

describe('ECG flag detection', () => {
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

	it('flags missing measurements', () => {
		const r = createAbnormalResult();
		r.prIntervalMs = null;
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
