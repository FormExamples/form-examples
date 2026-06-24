import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { CoagulationResult } from './types';

/** A fully-completed, normal coagulation report fixture. */
function createNormalResult(): CoagulationResult {
	return {
		reportingClinician: 'Dr A Haematologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenCondition: 'satisfactory',
		clinicalHistory: 'Routine pre-operative coagulation screen.',
		onAnticoagulant: false,
		anticoagulantAgent: '',
		prothrombinTimeSeconds: 12.0,
		inr: 1.0,
		activatedPartialThromboplastinTimeSeconds: 30.0,
		apttRatio: 1.0,
		fibrinogenGL: 3.0,
		dDimer: 200,
		thrombinTimeSeconds: 15.0,
		factorAssays: '',
		findingsNarrative: 'PT, APTT, fibrinogen and D-dimer all within reference ranges.',
		overallResultStatus: 'normal',
		criticalValuePresent: false,
		criticalValueDetail: '',
		comparisonWithPrevious: 'No prior coagulation results available for comparison.',
		reportingCategory: '',
		impression: 'Normal coagulation screen. No evidence of a bleeding diathesis.',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: therapeutic warfarin effect, no critical value. */
function createAbnormalResult(): CoagulationResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Warfarin monitoring; target INR 2.0–3.0.',
		onAnticoagulant: true,
		anticoagulantAgent: 'warfarin',
		prothrombinTimeSeconds: 28.0,
		inr: 2.8,
		findingsNarrative: 'PT/INR prolonged in keeping with the recorded warfarin therapy.',
		overallResultStatus: 'abnormal',
		impression: 'Therapeutic warfarin effect; INR within the target range.',
		recommendedFollowUp: 'Continue current warfarin dose; repeat INR per anticoagulation clinic.'
	};
}

/** A critical report fixture: very high INR (> 8). */
function createCriticalResult(): CoagulationResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Warfarin patient, presenting with bruising.',
		onAnticoagulant: true,
		anticoagulantAgent: 'warfarin',
		prothrombinTimeSeconds: 90.0,
		inr: 9.5,
		findingsNarrative: 'Markedly prolonged PT with an INR of 9.5.',
		overallResultStatus: 'critical',
		criticalValuePresent: true,
		criticalValueDetail: 'INR 9.5 (> 8 critical threshold).',
		impression: 'Critically high INR; high bleeding risk.',
		recommendedFollowUp: 'Withhold warfarin; consider vitamin K; urgent clinical review.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Coagulation four-axis grading engine', () => {
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

	it('grades an abnormal report with a therapeutic anticoagulant effect', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
		expect(g.reportingCategory).toBe('anticoagulant-effect');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a critical INR (> 8) to critical-alert regardless of other axes', () => {
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

	it('escalates a low fibrinogen (< 1.0 g/L) to a critical alert', () => {
		const r = createNormalResult();
		r.fibrinogenGL = 0.7;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
	});

	it('detects a DIC picture and grades it major', () => {
		const r = createNormalResult();
		r.fibrinogenGL = 1.2;
		r.dDimer = 4000;
		r.prothrombinTimeSeconds = 18.0;
		r.activatedPartialThromboplastinTimeSeconds = 48.0;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.reportingCategory).toBe('DIC-picture');
		expect(g.followUpUrgency).toBe('critical-alert');
	});

	it('grades an isolated APTT prolongation as moderate with a recommended work-up', () => {
		const r = createNormalResult();
		r.activatedPartialThromboplastinTimeSeconds = 52.0;
		r.apttRatio = 1.7;
		r.overallResultStatus = 'abnormal';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.reportingCategory).toBe('isolated-APTT-prolongation');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MODERATE-02')).toBe(true);
	});

	it('classifies a spoiled specimen with no impression as inconclusive', () => {
		const r = createNormalResult();
		r.specimenCondition = 'clotted';
		r.impression = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
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

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Coagulation flag detection', () => {
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

	it('flags a specimen-quality issue', () => {
		const r = createNormalResult();
		r.specimenCondition = 'haemolysed';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'specimen-quality-issue')).toBe(true);
	});

	it('flags a report with no recorded result value', () => {
		const r = createNormalResult();
		r.prothrombinTimeSeconds = null;
		r.inr = null;
		r.activatedPartialThromboplastinTimeSeconds = null;
		r.apttRatio = null;
		r.fibrinogenGL = null;
		r.dDimer = null;
		r.thrombinTimeSeconds = null;
		r.factorAssays = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-result-value')).toBe(true);
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
