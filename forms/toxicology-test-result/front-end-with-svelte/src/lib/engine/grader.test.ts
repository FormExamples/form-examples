import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { ToxicologyResult } from './types';

/** A fully-completed, normal toxicology report fixture. */
function createNormalResult(): ToxicologyResult {
	return {
		reportingClinician: 'Dr A Biochemist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenCondition: 'satisfactory',
		clinicalHistory: 'Collapse; query overdose. Exclude toxic levels.',
		suspectedAgent: 'Aspirin',
		timeSinceIngestionHours: 6,
		paracetamolLevelMgL: null,
		salicylateLevelMgL: 20,
		ethanolLevel: null,
		lithiumLevelMmolL: null,
		digoxinLevel: null,
		carboxyhaemoglobinPercent: null,
		drugsOfAbuseScreen: 'Negative.',
		specificDrugLevel: '',
		paracetamolNomogram: 'not-applicable',
		overallResultStatus: 'normal',
		toxicLevelPresent: false,
		findingsNarrative: 'Salicylate level within the therapeutic range. No toxic levels detected.',
		impression: 'No toxicological evidence of significant poisoning.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** A paracetamol below-treatment-line (reassuring) report fixture. */
function createBelowLineResult(): ToxicologyResult {
	return {
		...createNormalResult(),
		suspectedAgent: 'Paracetamol',
		paracetamolLevelMgL: 50,
		salicylateLevelMgL: null,
		paracetamolNomogram: 'below-treatment-line',
		findingsNarrative: 'Paracetamol level below the treatment line at 6 hours post-ingestion.',
		impression: 'Paracetamol below the treatment line; antidote not indicated.',
		recommendedFollowUp: 'Routine observation.'
	};
}

/** An abnormal toxicology report fixture: elevated but sub-toxic level. */
function createAbnormalResult(): ToxicologyResult {
	return {
		...createNormalResult(),
		suspectedAgent: 'Lithium',
		salicylateLevelMgL: null,
		lithiumLevelMmolL: 1.0,
		overallResultStatus: 'abnormal',
		toxicLevelPresent: false,
		findingsNarrative: 'Lithium level above the therapeutic range but below the toxic threshold.',
		impression: 'Elevated lithium; repeat level and review dosing.',
		recommendedFollowUp: 'Repeat lithium level in 12 hours.'
	};
}

/** A critical toxicology report fixture: paracetamol above the treatment line. */
function createCriticalResult(): ToxicologyResult {
	return {
		...createNormalResult(),
		suspectedAgent: 'Paracetamol',
		paracetamolLevelMgL: 200,
		salicylateLevelMgL: null,
		paracetamolNomogram: 'above-treatment-line',
		overallResultStatus: 'critical',
		toxicLevelPresent: true,
		findingsNarrative: 'Paracetamol level above the treatment line at 6 hours post-ingestion.',
		impression: 'Paracetamol above the treatment line; toxic level requiring antidote.',
		recommendedFollowUp: 'Start N-acetylcysteine (NAC) immediately.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Toxicology four-axis grading engine', () => {
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

	it('grades a paracetamol below-treatment-line result as minor', () => {
		const g = calculateGrade(createBelowLineResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MINOR-01')).toBe(true);
	});

	it('grades an abnormal report with an elevated sub-toxic level', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a toxic result to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// NAC antidote action.
		expect(g.recommendedAction).toContain('N-acetylcysteine');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('escalates a level over a toxic threshold to major severity and urgent follow-up', () => {
		const r = createAbnormalResult();
		r.lithiumLevelMmolL = 2.5;
		const g = calculateGrade(r);
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-02')).toBe(true);
	});

	it('classifies an insufficient specimen as inconclusive', () => {
		const r = createNormalResult();
		r.specimenCondition = 'insufficient';
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

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Toxicology flag detection', () => {
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

	it('flags a paracetamol level plotted before 4 hours post-ingestion', () => {
		const r = createBelowLineResult();
		r.timeSinceIngestionHours = 2;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'discrepancy-with-request')).toBe(true);
	});

	it('flags a report with no recorded result value', () => {
		const r = createNormalResult();
		r.salicylateLevelMgL = null;
		r.drugsOfAbuseScreen = '';
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
