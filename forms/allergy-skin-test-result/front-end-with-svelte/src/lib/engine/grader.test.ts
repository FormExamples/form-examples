import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { AllergySkinResult } from './types';

/** A fully-completed, all-negative (normal) allergy report fixture. */
function createNormalResult(): AllergySkinResult {
	return {
		reportingClinician: 'Dr A Allergist',
		originatingRequestReference: 'REQ-2001',
		testType: 'skin-prick-test',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		clinicalHistory: 'Suspected food allergy; intermittent urticaria.',
		antihistaminesWithheld: true,
		positiveControlValid: true,
		allergensTested: 'House dust mite, cat, peanut, egg, milk.',
		whealSizes: 'All test allergens 0 mm; histamine 6 mm; saline 0 mm.',
		specificIgeResults: '',
		sensitisedAllergens: 'None.',
		positiveReactions: false,
		sensitisationConfirmed: false,
		anaphylaxisDuringTest: false,
		allNegative: true,
		testInvalid: false,
		interpretation: 'No sensitisation demonstrated to the panel tested on a valid test.',
		impression: 'Negative skin-prick test. No evidence of sensitisation.',
		reportingCategory: '',
		recommendedFollowUp: 'No allergy follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: confirmed clinically relevant sensitisation. */
function createAbnormalResult(): AllergySkinResult {
	return {
		...createNormalResult(),
		whealSizes: 'Peanut 8 mm; histamine 6 mm; saline 0 mm.',
		specificIgeResults: 'Peanut sIgE 14 kUA/L.',
		sensitisedAllergens: 'Peanut.',
		allNegative: false,
		positiveReactions: true,
		sensitisationConfirmed: true,
		interpretation: 'Positive peanut weal concordant with the convincing clinical history.',
		impression: 'Clinically relevant peanut allergy confirmed.',
		recommendedFollowUp: 'Strict peanut avoidance; prescribe adrenaline auto-injector; dietitian referral.'
	};
}

/** A critical report fixture: anaphylaxis during the test. */
function createCriticalResult(): AllergySkinResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Suspected drug allergy; previous reaction to amoxicillin.',
		testType: 'intradermal-test',
		whealSizes: 'Amoxicillin 12 mm with systemic reaction.',
		sensitisedAllergens: 'Amoxicillin.',
		allNegative: false,
		positiveReactions: true,
		sensitisationConfirmed: true,
		anaphylaxisDuringTest: true,
		interpretation: 'Systemic reaction during intradermal testing; amoxicillin allergy.',
		impression: 'Amoxicillin anaphylaxis during testing.',
		recommendedFollowUp: 'Immediate allergy / immunology referral; amoxicillin avoidance.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Allergy skin test four-axis grading engine', () => {
	it('grades a normal, complete all-negative report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal report with confirmed clinically relevant sensitisation', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('grades a positive reaction without confirmed relevance as abnormal / minor', () => {
		const r = createAbnormalResult();
		r.sensitisationConfirmed = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-ABNORMAL-02')).toBe(true);
	});

	it('auto-escalates anaphylaxis during the test to critical-alert regardless of other axes', () => {
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
		expect(g.flags.some((f) => f.category === 'anaphylaxis-during-test')).toBe(true);
	});

	it('classifies an invalid test as inconclusive', () => {
		const r = createNormalResult();
		r.testInvalid = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-INCONCLUSIVE-01')).toBe(true);
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.interpretation = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-INTERPRETATION-01')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Allergy skin test flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags an invalid test', () => {
		const r = createNormalResult();
		r.testInvalid = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'invalid-test')).toBe(true);
	});

	it('flags a positive reaction with no recorded measurement', () => {
		const r = createAbnormalResult();
		r.whealSizes = '';
		r.specificIgeResults = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
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
