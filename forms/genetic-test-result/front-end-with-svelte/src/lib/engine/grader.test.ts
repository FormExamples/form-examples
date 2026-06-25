import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import type { GeneticResult } from './types';

/** A fully-completed, normal (no-variant-detected) genomic report fixture. */
function createNormalResult(): GeneticResult {
	return {
		reportingClinician: 'Dr A Geneticist',
		originatingRequestReference: 'REQ-2001',
		reportStatus: 'final',
		performedDate: '2026-06-01',
		reportedDate: '2026-06-01',
		testType: 'gene-panel',
		genesTested: 'Hereditary cancer panel (BRCA1, BRCA2, PALB2, TP53)',
		sampleType: 'blood',
		clinicalHistory: 'Family history of breast cancer; exclude a hereditary predisposition.',
		inheritancePattern: 'Autosomal dominant',
		variantsDetected: 'No clinically significant variant detected in the genes analysed.',
		variantClassification: 'no-variant-detected',
		zygosity: 'not-applicable',
		pathogenicVariantFound: false,
		vusFound: false,
		carrierStatusPositive: false,
		secondaryFinding: false,
		noClinicallySignificantVariant: true,
		interpretation: 'No pathogenic or likely-pathogenic variant identified in the analysed genes.',
		impression: 'Negative hereditary cancer panel.',
		reportingCategory: '',
		recommendedCascadeTesting: false,
		recommendedFollowUp: 'No genetics follow-up required.',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: true
	};
}

/** A VUS report fixture: variant of uncertain significance, no pathogenic variant. */
function createVusResult(): GeneticResult {
	return {
		...createNormalResult(),
		variantsDetected: 'BRCA2 c.1234A>G p.(Lys412Glu), a missense variant.',
		variantClassification: 'variant-uncertain-significance',
		zygosity: 'heterozygous',
		vusFound: true,
		noClinicallySignificantVariant: false,
		interpretation: 'A variant of uncertain significance was identified in BRCA2.',
		impression: 'Variant of uncertain significance in BRCA2.',
		recommendedFollowUp: 'Periodic reclassification review.'
	};
}

/** A critical report fixture: pathogenic actionable variant. */
function createCriticalResult(): GeneticResult {
	return {
		...createNormalResult(),
		variantsDetected: 'BRCA1 c.68_69del p.(Glu23Valfs) — a frameshift loss-of-function variant.',
		variantClassification: 'pathogenic',
		zygosity: 'heterozygous',
		pathogenicVariantFound: true,
		noClinicallySignificantVariant: false,
		interpretation: 'A pathogenic BRCA1 variant consistent with hereditary breast/ovarian cancer.',
		impression: 'Pathogenic BRCA1 variant.',
		reportingCategory: 'Class 5 — pathogenic',
		recommendedCascadeTesting: true,
		recommendedFollowUp: 'Urgent genetics MDT and cascade testing.',
		criticalResultCommunicated: false,
		reportedTo: ''
	};
}

describe('Genetic four-axis grading engine', () => {
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

	it('grades a VUS report as inconclusive with a recommended follow-up', () => {
		const g = calculateGrade(createVusResult());
		expect(g.resultClassification).toBe('inconclusive');
		expect(g.abnormalitySeverity).toBe('minor');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.recommendation).toBe('further-imaging');
		expect(g.firedRules.some((r) => r.ruleId === 'R-CLASS-INCONCLUSIVE-01')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SEV-MINOR-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'variant-uncertain-significance')).toBe(true);
	});

	it('auto-escalates a pathogenic variant to critical-alert regardless of other axes', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('major');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.targetTimeframe).toBe('immediate');
		expect(g.recommendation).toBe('urgent-review');
		// The auto-escalation invariant rule fired.
		expect(g.firedRules.some((r) => r.ruleId === 'R-FU-CRITICAL-01')).toBe(true);
		// The pathogenic-variant + critical-result-alert flags are raised.
		expect(g.flags.some((f) => f.category === 'pathogenic-variant-found')).toBe(true);
		expect(g.flags.some((f) => f.category === 'critical-result-alert')).toBe(true);
	});

	it('grades a likely-pathogenic variant as critical with moderate severity', () => {
		const r = createCriticalResult();
		r.variantClassification = 'likely-pathogenic';
		r.reportingCategory = '';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('critical');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('critical-alert');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SEV-MODERATE-01')).toBe(true);
	});

	it('grades a positive carrier status as abnormal with recommended counselling', () => {
		const r = createNormalResult();
		r.variantClassification = '';
		r.noClinicallySignificantVariant = false;
		r.carrierStatusPositive = true;
		r.variantsDetected = 'Heterozygous CFTR pathogenic variant (carrier).';
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.abnormalitySeverity).toBe('moderate');
		expect(g.followUpUrgency).toBe('recommended');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-ABNORMAL-02')).toBe(true);
	});

	it('grades a secondary finding as abnormal with urgent follow-up', () => {
		const r = createNormalResult();
		r.secondaryFinding = true;
		const g = calculateGrade(r);
		expect(g.resultClassification).toBe('abnormal');
		expect(g.followUpUrgency).toBe('urgent');
		expect(g.recommendation).toBe('specialist-referral');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-CLASS-ABNORMAL-01')).toBe(true);
		expect(g.flags.some((f) => f.category === 'secondary-finding')).toBe(true);
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

	it('carries an ACMG reporting category on Axis B', () => {
		const g = calculateGrade(createCriticalResult());
		expect(g.reportingCategory).toBe('Class 5 — pathogenic');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCriticalResult());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Genetic flag detection', () => {
	it('flags a pathogenic result not yet communicated', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.flagId === 'F-PATHOGENIC-VARIANT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-001')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-CRITICAL-RESULT-002')).toBe(true);
	});

	it('flags cascade testing when recommended', () => {
		const flags = detectFlags(createCriticalResult());
		expect(flags.some((f) => f.category === 'cascade-testing-recommended')).toBe(true);
	});

	it('flags a missing impression', () => {
		const r = createNormalResult();
		r.impression = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-impression')).toBe(true);
	});

	it('flags variants described without a classification', () => {
		const r = createVusResult();
		r.variantClassification = '';
		r.vusFound = false;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-classification')).toBe(true);
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
