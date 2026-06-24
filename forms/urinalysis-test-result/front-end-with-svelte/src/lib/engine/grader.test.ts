import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { UrinalysisResult } from './types';

/** A fully-completed, normal urinalysis report fixture. */
function createNormalResult(): UrinalysisResult {
	return {
		reportingClinician: 'Dr A Microbiologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		specimenType: 'midstream',
		specimenCondition: 'satisfactory',
		clinicalHistory: 'Routine screen; no urinary symptoms.',
		pregnant: false,
		leucocytes: 'negative',
		nitrites: 'negative',
		protein: 'negative',
		blood: 'negative',
		glucose: 'negative',
		ketones: 'negative',
		bilirubin: 'negative',
		ph: 6.0,
		specificGravity: 1.015,
		redCellCount: '<10 x10^6/L',
		whiteCellCount: '<10 x10^6/L',
		epithelialCells: 'few',
		casts: '',
		organismsSeen: false,
		crystals: '',
		cultureResult: 'no-growth',
		organismIsolated: '',
		colonyCountCfuMl: '',
		antibioticSensitivities: '',
		overallResultStatus: 'normal',
		findingsNarrative: 'No significant abnormality detected.',
		impression: 'Normal urinalysis. No evidence of urinary tract infection.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		visibleHaematuria: false,
		suspectedUrosepsis: false,
		criticalOrganism: false,
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: significant E. coli growth, no critical finding. */
function createAbnormalResult(): UrinalysisResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Dysuria and frequency; query UTI.',
		leucocytes: 'plus-two',
		nitrites: 'positive',
		organismsSeen: true,
		whiteCellCount: '>100 x10^6/L',
		cultureResult: 'significant-growth',
		organismIsolated: 'Escherichia coli',
		colonyCountCfuMl: '>10^5 cfu/mL',
		antibioticSensitivities: 'Trimethoprim R, Nitrofurantoin S',
		overallResultStatus: 'abnormal',
		findingsNarrative: 'Pyuria with significant growth of Escherichia coli.',
		impression: 'Significant E. coli bacteriuria; consistent with urinary tract infection.',
		recommendedFollowUp: 'Treat per sensitivities.'
	};
}

/** A critical report fixture: significant growth in a pregnant patient. */
function createCriticalResult(): UrinalysisResult {
	return {
		...createAbnormalResult(),
		pregnant: true,
		overallResultStatus: 'critical',
		impression: 'Significant bacteriuria in pregnancy; warrants treatment and expedited communication.',
		recommendedFollowUp: 'Urgent treatment per pregnancy guidance.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Urinalysis four-axis grading engine', () => {
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

	it('grades an abnormal report with significant bacteriuria', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates significant growth in pregnancy to critical-alert regardless of other axes', () => {
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

	it('escalates visible haematuria to critical-alert with an urgent-referral flag', () => {
		const r = createNormalResult();
		r.visibleHaematuria = true;
		r.blood = 'plus-three';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.flags.some((f) => f.category === 'urgent-referral')).toBe(true);
	});

	it('classifies an insufficient specimen as inconclusive', () => {
		const r = createNormalResult();
		r.specimenCondition = 'insufficient';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.impression = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades incidental-only findings as minor with a recommended follow-up', () => {
		const r = createNormalResult();
		r.glucose = 'plus-two';
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

describe('Urinalysis flag detection', () => {
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

	it('flags significant growth with no recorded colony count', () => {
		const r = createAbnormalResult();
		r.colonyCountCfuMl = '';
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
