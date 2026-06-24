import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { ElectroencephalogramResult } from './types';

/** A fully-completed, normal EEG report fixture. */
function createNormalResult(): ElectroencephalogramResult {
	return {
		reportingClinician: 'Dr A Neurophysiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		eegType: 'routine-awake',
		recordingDurationMinutes: 30,
		recordingQuality: 'good',
		clinicalHistory: 'First unprovoked seizure; characterise.',
		comparisonWithPrevious: 'No prior EEG available for comparison.',
		backgroundRhythm: 'normal',
		epileptiformDischarges: false,
		focalSlowing: false,
		generalisedSlowing: false,
		seizureRecorded: false,
		statusEpilepticus: false,
		photoparoxysmalResponse: false,
		normalEeg: true,
		findingsNarrative: 'Well-organised posterior dominant rhythm. No abnormalities.',
		clinicalCorrelation: 'A normal EEG does not exclude epilepsy.',
		impression: 'Normal awake EEG.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal EEG report fixture: focal slowing, no critical finding. */
function createAbnormalResult(): ElectroencephalogramResult {
	return {
		...createNormalResult(),
		backgroundRhythm: 'asymmetric',
		focalSlowing: true,
		normalEeg: false,
		findingsNarrative: 'Left temporal focal slowing.',
		impression: 'Abnormal EEG with left temporal focal slowing.',
		recommendedFollowUp: 'Neurology review.'
	};
}

/** A critical EEG report fixture: non-convulsive status epilepticus. */
function createCriticalResult(): ElectroencephalogramResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Reduced consciousness; exclude non-convulsive status.',
		backgroundRhythm: 'abnormal',
		epileptiformDischarges: true,
		seizureRecorded: true,
		statusEpilepticus: true,
		normalEeg: false,
		findingsNarrative: 'Continuous generalised epileptiform discharges consistent with NCSE.',
		impression: 'Non-convulsive status epilepticus.',
		recommendedFollowUp: 'Immediate neurology and ITU referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('EEG four-axis grading engine', () => {
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

	it('grades an abnormal report with focal slowing', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
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

	it('escalates epileptiform discharges to major severity and urgent-review recommendation', () => {
		const r = createNormalResult();
		r.normalEeg = false;
		r.epileptiformDischarges = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('classifies a limited recording with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.recordingQuality = 'limited';
		r.impression = '';
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

	it('grades a minor background abnormality as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.backgroundRhythm = 'excess-slow';
		r.normalEeg = false;
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

describe('EEG flag detection', () => {
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

	it('flags status epilepticus as abnormal-requiring-action', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.category === 'abnormal-requiring-action')).toBe(true);
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
