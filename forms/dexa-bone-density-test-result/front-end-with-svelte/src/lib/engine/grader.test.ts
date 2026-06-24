import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { deriveWhoClassification } from './utils';
import type { DexaBoneDensityResult } from './types';

/** A fully-completed, normal DEXA report fixture (T ≥ −1.0). */
function createNormalResult(): DexaBoneDensityResult {
	return {
		reportingClinician: 'Dr A Radiologist',
		originatingRequestReference: 'REQ-1001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		scanRegion: 'hip-and-spine',
		examinationAdequacy: 'adequate',
		clinicalHistory: 'Postmenopausal fracture-risk assessment.',
		lumbarSpineTScore: -0.4,
		lumbarSpineZScore: 0.2,
		femoralNeckTScore: -0.6,
		femoralNeckZScore: 0.1,
		totalHipTScore: -0.5,
		lowestTScore: -0.6,
		boneMineralDensityGCm2: 0.98,
		whoClassification: 'normal',
		fraxMajorFracturePercent: 6.2,
		fraxHipFracturePercent: 0.9,
		vertebralFractureIdentified: false,
		comparisonWithPrevious: 'No prior DEXA available for comparison.',
		percentChangeSincePrevious: null,
		impression: 'Normal bone mineral density. No evidence of osteoporosis.',
		recommendedFollowUp: 'Routine fracture-risk management.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** An osteopenic DEXA report fixture (−1.0 > T > −2.5). */
function createOsteopeniaResult(): DexaBoneDensityResult {
	return {
		...createNormalResult(),
		lumbarSpineTScore: -1.8,
		femoralNeckTScore: -1.6,
		totalHipTScore: -1.5,
		lowestTScore: -1.8,
		boneMineralDensityGCm2: 0.84,
		whoClassification: 'osteopenia',
		impression: 'Osteopenia (low bone mass).',
		recommendedFollowUp: 'Lifestyle measures; interval DEXA.'
	};
}

/** An osteoporotic DEXA report fixture (T ≤ −2.5, no fracture). */
function createOsteoporosisResult(): DexaBoneDensityResult {
	return {
		...createNormalResult(),
		lumbarSpineTScore: -2.8,
		femoralNeckTScore: -2.6,
		totalHipTScore: -2.5,
		lowestTScore: -2.8,
		boneMineralDensityGCm2: 0.71,
		whoClassification: 'osteoporosis',
		fraxMajorFracturePercent: 18.4,
		fraxHipFracturePercent: 4.7,
		impression: 'Osteoporosis at the lumbar spine.',
		recommendedFollowUp: 'Treatment review.'
	};
}

/** A severe (established) osteoporosis fixture (T ≤ −2.5 with a vertebral fracture). */
function createSevereResult(): DexaBoneDensityResult {
	return {
		...createOsteoporosisResult(),
		lowestTScore: -3.4,
		boneMineralDensityGCm2: 0.62,
		whoClassification: 'severe-osteoporosis',
		vertebralFractureIdentified: true,
		fraxMajorFracturePercent: 28.9,
		fraxHipFracturePercent: 9.1,
		impression: 'Severe (established) osteoporosis with a vertebral fragility fracture.',
		recommendedFollowUp: 'Urgent treatment review.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('DEXA four-axis grading engine', () => {
	it('derives the WHO classification from the lowest T-score', () => {
		expect(deriveWhoClassification(-0.5, false)).toBe('normal');
		expect(deriveWhoClassification(-1.8, false)).toBe('osteopenia');
		expect(deriveWhoClassification(-2.8, false)).toBe('osteoporosis');
		expect(deriveWhoClassification(-2.8, true)).toBe('severe-osteoporosis');
		expect(deriveWhoClassification(null, false)).toBe('');
	});

	it('grades a normal, complete report', () => {
		const g = calculateGrade(createNormalResult());
		expect(g.resultClassification).toBe('normal');
		expect(g.abnormalitySeverity).toBe('none');
		expect(g.reportingCategory).toBe('normal');
		expect(g.reportCompletenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('routine');
		expect(g.recommendation).toBe('no-action');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-NORMAL-01')).toBe(true);
	});

	it('grades osteopenia as abnormal / moderate / recommended', () => {
		const g = calculateGrade(createOsteopeniaResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.reportingCategory).toBe('osteopenia');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('routine-follow-up');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('grades osteoporosis as abnormal / major / urgent', () => {
		const g = calculateGrade(createOsteoporosisResult());
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.reportingCategory).toBe('osteoporosis');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-URGENT-01')).toBe(true);
	});

	it('auto-escalates severe osteoporosis to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createSevereResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.reportingCategory).toBe('severe-osteoporosis');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The critical-result-alert flag is raised.
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('treats osteoporosis with a vertebral fracture as severe (critical)', () => {
		const r = createOsteoporosisResult();
		r.vertebralFractureIdentified = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.followUpUrgency).toBe('critical-alert');
	});

	it('classifies a non-diagnostic study as inconclusive', () => {
		const r = createNormalResult();
		r.examinationAdequacy = 'non-diagnostic';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
	});

	it('classifies a result with no lowest T-score as inconclusive', () => {
		const r = createNormalResult();
		r.lowestTScore = null;
		r.whoClassification = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-INCONCLUSIVE-03')).toBe(true);
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
		const g = calculateGrade(createSevereResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('DEXA flag detection', () => {
	it('flags a severe result not yet communicated', () => {
		const flags = detectFlags(createSevereResult());
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags osteoporosis as abnormal-requiring-action and urgent-referral', () => {
		const flags = detectFlags(createOsteoporosisResult());
		expect(flags.some((f) => f.category === 'abnormal-requiring-action')).toBe(true);
		expect(flags.some((f) => f.category === 'urgent-referral')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags a missing lowest T-score measurement', () => {
		const r = createNormalResult();
		r.lowestTScore = null;
		r.whoClassification = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-measurement')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const flags = detectFlags(createSevereResult());
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
