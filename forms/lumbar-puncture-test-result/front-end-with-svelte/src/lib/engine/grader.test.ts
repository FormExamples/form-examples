import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { LumbarPunctureResult } from './types';

/** A fully-completed, normal CSF report fixture. */
function createNormalResult(): LumbarPunctureResult {
	return {
		reportingClinician: 'Dr A Neurologist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		clinicalHistory: 'Headache; exclude meningitis. CT brain normal.',
		openingPressureCmh2o: 14,
		csfAppearance: 'clear',
		csfWhiteCellCount: 2,
		csfRedCellCount: 0,
		csfProteinGL: 0.3,
		csfGlucoseMmolL: 3.4,
		csfSerumGlucoseRatio: 0.62,
		csfLactateMmolL: 1.6,
		gramStainResult: 'No organisms seen.',
		cultureResult: 'No growth.',
		pcrResult: 'Negative.',
		oligoclonalBands: 'negative',
		xanthochromia: 'negative',
		raisedProtein: false,
		pleocytosis: false,
		lowGlucose: false,
		bacterialMeningitisPattern: false,
		viralPattern: false,
		subarachnoidHaemorrhageSuggested: false,
		normalCsf: true,
		findingsNarrative: 'Clear CSF, normal cell counts, normal biochemistry.',
		impression: 'Normal CSF analysis. No evidence of meningitis or haemorrhage.',
		reportingCategory: 'normal',
		recommendedFollowUp: 'No follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An abnormal report fixture: isolated raised protein, no critical result. */
function createAbnormalResult(): LumbarPunctureResult {
	return {
		...createNormalResult(),
		csfProteinGL: 0.8,
		raisedProtein: true,
		normalCsf: false,
		findingsNarrative: 'Isolated mildly raised CSF protein; cells and glucose normal.',
		impression: 'Mildly raised CSF protein of uncertain significance.',
		reportingCategory: 'raised-protein',
		recommendedFollowUp: 'Clinical correlation advised.'
	};
}

/** A critical CSF report fixture: bacterial meningitis pattern. */
function createBacterialResult(): LumbarPunctureResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Fever, neck stiffness, photophobia; query bacterial meningitis.',
		csfAppearance: 'turbid',
		csfWhiteCellCount: 2400,
		csfProteinGL: 2.1,
		csfGlucoseMmolL: 1.1,
		csfSerumGlucoseRatio: 0.2,
		csfLactateMmolL: 6.4,
		gramStainResult: 'Gram-positive diplococci seen.',
		cultureResult: 'Streptococcus pneumoniae grown.',
		oligoclonalBands: 'not-tested',
		raisedProtein: true,
		pleocytosis: true,
		lowGlucose: true,
		bacterialMeningitisPattern: true,
		normalCsf: false,
		findingsNarrative: 'Neutrophil pleocytosis, raised protein, low glucose, raised lactate.',
		impression: 'CSF profile consistent with bacterial meningitis.',
		reportingCategory: 'bacterial-pattern',
		recommendedFollowUp: 'Immediate antibiotics and ICU review.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

/** A critical CSF report fixture: suggested subarachnoid haemorrhage. */
function createSahResult(): LumbarPunctureResult {
	return {
		...createNormalResult(),
		clinicalHistory: 'Thunderclap headache 14 h ago; CT brain negative.',
		csfAppearance: 'xanthochromic',
		csfRedCellCount: 5000,
		xanthochromia: 'positive',
		subarachnoidHaemorrhageSuggested: true,
		normalCsf: false,
		findingsNarrative: 'Positive xanthochromia on spectrophotometry.',
		impression: 'CSF supports subarachnoid haemorrhage.',
		reportingCategory: 'SAH-pattern',
		recommendedFollowUp: 'Urgent neurosurgical referral and CT angiography.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Lumbar puncture four-axis grading engine', () => {
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

	it('grades an isolated abnormality as minor with a recommended follow-up', () => {
		const g = calculateGrade(createAbnormalResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MINOR-01')).toBe(true);
	});

	it('auto-escalates a bacterial meningitis pattern to critical-alert', () => {
		const g = calculateGrade(createBacterialResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('auto-escalates a suggested subarachnoid haemorrhage to critical-alert', () => {
		const g = calculateGrade(createSahResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.reportingCategory).toBe('SAH-pattern');
		expect(g.flags.some((f) => f.category === 'urgent-referral')).toBe(true);
	});

	it('treats a positive culture alone as a critical result', () => {
		const r = createNormalResult();
		r.cultureResult = 'Neisseria meningitidis grown.';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
	});

	it('grades a moderate viral pattern as recommended follow-up', () => {
		const r = createNormalResult();
		r.csfAppearance = 'clear';
		r.csfWhiteCellCount = 80;
		r.pleocytosis = true;
		r.viralPattern = true;
		r.normalCsf = false;
		r.impression = 'Lymphocytic pleocytosis consistent with viral / aseptic meningitis.';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('classifies a sparse dataset as inconclusive', () => {
		const r = createNormalResult();
		r.csfAppearance = '';
		r.csfWhiteCellCount = null;
		r.csfRedCellCount = null;
		r.csfProteinGL = null;
		r.csfGlucoseMmolL = null;
		r.normalCsf = false;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('computes partial completeness when sections are missing', () => {
		const r = createNormalResult();
		r.clinicalHistory = '';
		r.csfAppearance = '';
		const g = calculateGrade(r);
		// 3 of 5 sections present.
		expect(g.reportCompletenessPercent).toBe(60);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-HISTORY-01')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMP-APPEARANCE-01')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createBacterialResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Lumbar puncture flag detection', () => {
	it('flags a critical result not yet communicated', () => {
		const flags = detectFlags(createBacterialResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags a bacterial meningitis pattern as requiring action', () => {
		const flags = detectFlags(createBacterialResult());
		expect(flags.some((f) => f.category === 'abnormal-requiring-action')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createBacterialResult());
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
