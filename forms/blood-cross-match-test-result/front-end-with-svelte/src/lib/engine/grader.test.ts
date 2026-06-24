import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { BloodCrossMatchResult } from './types';

/** A fully-completed, routine-compatible report fixture. */
function createNormalResult(): BloodCrossMatchResult {
	return {
		reportingClinician: 'A Biomedical Scientist',
		originatingRequestReference: 'XM-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		requestType: 'crossmatch',
		clinicalHistory: 'Elective surgery; group and crossmatch 2 units.',
		aboGroup: 'o',
		rhdGroup: 'positive',
		historicalGroupConcordant: true,
		antibodyScreenResult: 'negative',
		antibodiesIdentified: '',
		crossmatchResult: 'compatible',
		component: 'red-cells',
		unitsCrossmatched: 2,
		unitsAvailable: 2,
		specialRequirements: '',
		twoSampleRuleMet: true,
		overallResultStatus: 'normal',
		findingsNarrative: 'ABO/RhD confirmed concordant with historical group. Antibody screen negative.',
		impression: 'Compatible. Two units available for issue.',
		recommendedFollowUp: 'Issue per standard pathway.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: positive antibody screen, no identity event. */
function createAbnormalAntibodiesResult(): BloodCrossMatchResult {
	return {
		...createNormalResult(),
		antibodyScreenResult: 'positive',
		antibodiesIdentified: 'Anti-K identified; K-negative units required.',
		crossmatchResult: 'compatible',
		findingsNarrative: 'Antibody screen positive; anti-K identified. K-negative units crossmatched.',
		impression: 'Clinically-significant antibody (anti-K). K-negative compatible units provided.',
		recommendedFollowUp: 'Provide antigen-negative units for future transfusion.'
	};
}

/** A critical report fixture: incompatible crossmatch. */
function createCriticalIncompatibleResult(): BloodCrossMatchResult {
	return {
		...createNormalResult(),
		antibodyScreenResult: 'positive',
		antibodiesIdentified: 'Anti-Jka; antigen-negative units unavailable.',
		crossmatchResult: 'incompatible',
		unitsAvailable: 0,
		overallResultStatus: 'critical',
		findingsNarrative: 'Crossmatch incompatible; no compatible units identified in current stock.',
		impression: 'Incompatible crossmatch. Do not issue.',
		recommendedFollowUp: 'Refer to reference laboratory for antigen-negative units.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Blood cross-match four-axis grading engine', () => {
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

	it('grades clinically-significant antibodies as abnormal / moderate and auto-escalates urgency', () => {
		const g = calculateGrade(createAbnormalAntibodiesResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		// A positive antibody screen is a critical result per spec; it auto-escalates Axis D.
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('auto-escalates an incompatible crossmatch to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalIncompatibleResult());
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('classifies an ABO discrepancy as critical and raises discrepancy-with-request', () => {
		const r = createNormalResult();
		r.historicalGroupConcordant = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.flags.some((f) => f.category === 'discrepancy-with-request')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-CRITICAL-01')).toBe(true);
	});

	it('escalates an unmet two-sample rule to critical-alert', () => {
		const r = createNormalResult();
		r.twoSampleRuleMet = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.flags.some((f) => f.category === 'discrepancy-with-request')).toBe(true);
	});

	it('classifies an incomplete work-up as inconclusive', () => {
		const r = createNormalResult();
		r.crossmatchResult = 'not-performed';
		r.aboGroup = '';
		r.rhdGroup = '';
		r.impression = '';
		r.twoSampleRuleMet = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.antibodyScreenResult = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades insufficient compatible units as moderate with a recommended follow-up', () => {
		const r = createNormalResult();
		r.unitsCrossmatched = 4;
		r.unitsAvailable = 2;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalIncompatibleResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Blood cross-match flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createCriticalIncompatibleResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags an ABO discrepancy as discrepancy-with-request', () => {
		const r = createNormalResult();
		r.historicalGroupConcordant = false;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'discrepancy-with-request')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags insufficient compatible units', () => {
		const r = createNormalResult();
		r.unitsCrossmatched = 4;
		r.unitsAvailable = 1;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createCriticalIncompatibleResult());
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
