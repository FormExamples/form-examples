import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { NerveConductionStudyResult } from './types';

/** A fully-completed, normal NCS / EMG report fixture. */
function createNormalResult(): NerveConductionStudyResult {
	return {
		reportingClinician: 'Dr A Neurophysiologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		studyType: 'nerve-conduction-and-emg',
		region: 'upper-limb',
		laterality: 'bilateral',
		studyAdequacy: 'adequate',
		clinicalHistory: 'Bilateral hand paraesthesia; query carpal tunnel syndrome.',
		comparisonWithPrevious: 'No prior electrodiagnostic studies available for comparison.',
		nerveConductionFindings:
			'Normal median and ulnar motor and sensory studies bilaterally. Normal distal latencies and conduction velocities.',
		emgFindings: 'Normal insertional activity, motor-unit morphology, and recruitment.',
		carpalTunnelSyndrome: false,
		peripheralNeuropathy: false,
		radiculopathy: false,
		motorNeuroneDiseaseFeatures: false,
		myopathy: false,
		neuromuscularJunctionDisorder: false,
		normalStudy: true,
		severity: 'not-applicable',
		pattern: 'not-applicable',
		impression: 'Normal electrodiagnostic study. No evidence of carpal tunnel syndrome.',
		reportingCategory: 'normal',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: mild carpal tunnel syndrome, no critical finding. */
function createAbnormalResult(): NerveConductionStudyResult {
	return {
		...createNormalResult(),
		nerveConductionFindings:
			'Prolonged median distal sensory and motor latencies at the wrist, bilaterally; normal ulnar studies.',
		carpalTunnelSyndrome: true,
		normalStudy: false,
		severity: 'mild',
		pattern: 'not-applicable',
		impression: 'Mild bilateral carpal tunnel syndrome.',
		reportingCategory: 'carpal-tunnel-syndrome-mild',
		recommendedFollowUp: 'Conservative management; consider repeat study if symptoms progress.'
	};
}

/** A critical report fixture: motor neurone disease features. */
function createCriticalResult(): NerveConductionStudyResult {
	return {
		...createNormalResult(),
		studyType: 'nerve-conduction-and-emg',
		region: 'all-limbs',
		clinicalHistory: 'Progressive limb weakness and fasciculations; query motor neurone disease.',
		emgFindings:
			'Widespread active denervation (fibrillations, fasciculations) with chronic neurogenic motor-unit changes across multiple regions.',
		carpalTunnelSyndrome: false,
		motorNeuroneDiseaseFeatures: true,
		normalStudy: false,
		severity: 'severe',
		pattern: 'axonal',
		impression: 'Electrodiagnostic features consistent with motor neurone disease.',
		reportingCategory: 'motor-neurone-disease',
		recommendedFollowUp: 'Urgent neurology referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

/** A critical report fixture: severe acute demyelinating neuropathy (GBS pattern). */
function createGbsResult(): NerveConductionStudyResult {
	return {
		...createNormalResult(),
		region: 'all-limbs',
		clinicalHistory: 'Rapidly progressive ascending weakness; query Guillain-Barré syndrome.',
		nerveConductionFindings:
			'Prolonged distal motor latencies, conduction block, and absent F-waves consistent with an acute demyelinating polyneuropathy.',
		peripheralNeuropathy: true,
		normalStudy: false,
		severity: 'severe',
		pattern: 'demyelinating',
		impression: 'Acute demyelinating polyneuropathy consistent with Guillain-Barré syndrome.',
		reportingCategory: 'acute-demyelinating-neuropathy',
		recommendedFollowUp: 'Urgent neurology admission.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('NCS / EMG four-axis grading engine', () => {
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

	it('grades an abnormal report with mild carpal tunnel syndrome', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MINOR-01')).toBe(true);
	});

	it('auto-escalates motor neurone disease features to critical-alert regardless of other axes', () => {
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

	it('auto-escalates a severe acute neuropathy (GBS pattern) to critical-alert', () => {
		const g = calculateGrade(createGbsResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('escalates a severe (non-critical) abnormality to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.severity = 'severe';
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies a non-diagnostic study as inconclusive', () => {
		const r = createNormalResult();
		r.normalStudy = false;
		r.studyAdequacy = 'non-diagnostic';
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

	it('grades a moderate abnormal finding as moderate severity with recommended follow-up', () => {
		const r = createAbnormalResult();
		r.severity = 'moderate';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('specialist-referral');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('NCS / EMG flag detection', () => {
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

	it('flags an abnormal finding with no recorded findings narrative', () => {
		const r = createAbnormalResult();
		r.nerveConductionFindings = '';
		r.emgFindings = '';
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
