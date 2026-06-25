import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { HearingResult } from './types';

/** A fully-completed, normal hearing-test report fixture. */
function createNormalResult(): HearingResult {
	return {
		reportingClinician: 'Ms A Audiologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		testType: 'pure-tone-audiometry',
		testReliability: 'good',
		clinicalHistory: 'Routine hearing check; no concerns reported.',
		pureToneAverageRightDb: 12,
		pureToneAverageLeftDb: 14,
		hearingLossTypeRight: 'none',
		hearingLossTypeLeft: 'none',
		hearingLossSeverityRight: 'normal',
		hearingLossSeverityLeft: 'normal',
		tympanometryTypeRight: 'A',
		tympanometryTypeLeft: 'A',
		findingsNarrative: 'Thresholds within normal limits bilaterally. Type A tympanograms.',
		hearingLossPresent: false,
		asymmetricLoss: false,
		suddenSensorineuralLoss: false,
		conductiveComponent: false,
		normalHearing: true,
		impression: 'Normal hearing bilaterally.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: bilateral moderate sensorineural loss, no critical finding. */
function createAbnormalResult(): HearingResult {
	return {
		...createNormalResult(),
		pureToneAverageRightDb: 55,
		pureToneAverageLeftDb: 52,
		hearingLossTypeRight: 'sensorineural',
		hearingLossTypeLeft: 'sensorineural',
		hearingLossSeverityRight: 'moderate',
		hearingLossSeverityLeft: 'moderate',
		findingsNarrative: 'Bilateral symmetrical moderate sensorineural hearing loss.',
		hearingLossPresent: true,
		normalHearing: false,
		impression: 'Bilateral moderate sensorineural hearing loss.',
		recommendedFollowUp: 'Bilateral hearing-aid assessment.'
	};
}

/** A critical report fixture: sudden sensorineural hearing loss. */
function createCriticalResult(): HearingResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Sudden onset of right-sided hearing loss over 24 hours.',
		pureToneAverageRightDb: 78,
		pureToneAverageLeftDb: 12,
		hearingLossTypeRight: 'sensorineural',
		hearingLossTypeLeft: 'none',
		hearingLossSeverityRight: 'severe',
		hearingLossSeverityLeft: 'normal',
		findingsNarrative: 'Acute severe right sensorineural hearing loss; left ear normal.',
		hearingLossPresent: true,
		asymmetricLoss: true,
		suddenSensorineuralLoss: true,
		normalHearing: false,
		impression: 'Sudden sensorineural hearing loss, right ear.',
		recommendedFollowUp: 'Urgent ENT referral.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Hearing test four-axis grading engine', () => {
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

	it('grades an abnormal report with bilateral moderate loss', () => {
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

	it('escalates a severe/profound loss (PTA >= 71) to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.pureToneAverageRightDb = 85;
		r.pureToneAverageLeftDb = 82;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies an unreliable test with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.testReliability = 'poor';
		r.impression = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
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

	it('grades a mild loss as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.pureToneAverageRightDb = 30;
		r.pureToneAverageLeftDb = 28;
		r.hearingLossPresent = true;
		r.normalHearing = false;
		r.hearingLossSeverityRight = 'mild';
		r.hearingLossSeverityLeft = 'mild';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		// hearingLossPresent is an actionable finding → moderate severity.
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Hearing test flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags sudden sensorineural hearing loss', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.category === 'sudden-sensorineural-loss')).toBe(true);
	});

	it('flags marked asymmetry as a retrocochlear red flag', () => {
		const r = createAbnormalResult();
		r.asymmetricLoss = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'asymmetric-loss-retrocochlear')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags hearing loss with no recorded measurement', () => {
		const r = createAbnormalResult();
		r.pureToneAverageRightDb = null;
		r.pureToneAverageLeftDb = null;
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
