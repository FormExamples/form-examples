import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { MicrobiologyCultureResult } from './types';

/** A fully-completed, normal (no-growth) microbiology report fixture. */
function createNormalResult(): MicrobiologyCultureResult {
	return {
		reportingClinician: 'Dr A Microbiologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-02',
		specimenType: 'urine',
		specimenSiteDetail: 'Midstream urine',
		specimenCondition: 'satisfactory',
		clinicalHistory: 'Dysuria; query urinary tract infection.',
		gramStainResult: 'No organisms seen.',
		cultureResult: 'no-growth',
		organismIsolated: '',
		secondOrganismIsolated: '',
		colonyCount: '<10,000 CFU/mL',
		antibioticSensitivities: 'Not applicable — no growth.',
		resistanceMrsa: false,
		resistanceEsbl: false,
		resistanceCpe: false,
		cDifficileToxin: 'not-tested',
		acidFastBacilli: 'not-tested',
		pcrResult: '',
		criticalOrganism: false,
		findingsNarrative: 'No significant bacterial growth after 24 hours incubation.',
		impression: 'No evidence of urinary tract infection.',
		reportingCategory: '',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: significant growth, no critical organism. */
function createAbnormalResult(): MicrobiologyCultureResult {
	return {
		...createNormalResult(),
		cultureResult: 'significant-growth',
		organismIsolated: 'Escherichia coli',
		colonyCount: '>100,000 CFU/mL',
		antibioticSensitivities: 'Sensitive: nitrofurantoin, trimethoprim. Resistant: amoxicillin.',
		findingsNarrative: 'Pure growth of E. coli >100,000 CFU/mL.',
		impression: 'E. coli urinary tract infection; treat per sensitivities.',
		recommendedFollowUp: 'Treat per sensitivities; repeat if symptoms persist.'
	};
}

/** A critical report fixture: positive blood culture. */
function createCriticalResult(): MicrobiologyCultureResult {
	return {
		...createNormalResult(),
		specimenType: 'blood-culture',
		specimenSiteDetail: 'Peripheral blood culture set',
		clinicalHistory: 'Pyrexia, rigors; query sepsis.',
		gramStainResult: 'Gram-positive cocci in clusters.',
		cultureResult: 'positive',
		organismIsolated: 'Staphylococcus aureus',
		colonyCount: 'N/A',
		antibioticSensitivities: 'Sensitive: flucloxacillin.',
		findingsNarrative: 'Staphylococcus aureus isolated from blood culture.',
		impression: 'Staphylococcus aureus bacteraemia.',
		recommendedFollowUp: 'Urgent infection review; repeat blood cultures.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Microbiology culture four-axis grading engine', () => {
	it('grades a normal, complete (no-growth) report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades an abnormal report with significant growth', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('auto-escalates a positive blood culture to critical-alert regardless of other axes', () => {
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

	it('auto-escalates a CPE-positive isolate to critical-alert and major severity', () => {
		const r = createAbnormalResult();
		r.resistanceCpe = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MAJOR-01')).toBe(true);
	});

	it('grades a resistant (MRSA) significant culture as major and urgent', () => {
		const r = createAbnormalResult();
		r.organismIsolated = 'Staphylococcus aureus';
		r.resistanceMrsa = true;
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
		expect(g.recommendation).toBe('further-testing');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.antibioticSensitivities = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
	});

	it('grades a positive C. difficile toxin as moderate with recommended follow-up', () => {
		const r = createNormalResult();
		r.specimenType = 'stool';
		r.cDifficileToxin = 'positive';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-testing');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Microbiology culture flag detection', () => {
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

	it('flags a positive culture with no recorded sensitivities', () => {
		const r = createAbnormalResult();
		r.antibioticSensitivities = '';
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
