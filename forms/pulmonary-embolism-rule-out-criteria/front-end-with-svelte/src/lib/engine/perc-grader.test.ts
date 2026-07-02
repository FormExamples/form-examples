import { describe, it, expect } from 'vitest';
import { calculatePercGrade, evaluateCriteria } from './perc-grader';
import { detectFlaggedIssues, hasMissingInputs } from './flagged-issues';
import { percRules } from './perc-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			assessedAt: '',
			careSetting: '',
			presentingComplaint: ''
		},
		identification: { patientIdentifier: '', age: null, sex: '' },
		pretest: { pretestProbability: '' },
		vitals: { heartRate: null, oxygenSaturation: null },
		criteria: {
			unilateralLegSwelling: '',
			haemoptysis: '',
			recentSurgeryOrTrauma: '',
			priorVenousThromboembolism: '',
			oestrogenUse: ''
		},
		result: { clinicalNote: '' }
	};
}

/**
 * A fully reassuring, low-pre-test-probability patient: pre-test low, age 42,
 * HR 78, SpO2 98, and all five clinical findings absent. This is the canonical
 * PERC-negative case; individual tests mutate one field to force a failure.
 */
function createPercNegative(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Fenwick',
		clinicianRole: 'physician',
		assessedAt: '2026-06-24T09:30',
		careSetting: 'emergency-department',
		presentingComplaint: 'Pleuritic chest pain, low suspicion for PE.'
	};
	d.identification = { patientIdentifier: 'MRN-482201', age: 42, sex: 'male' };
	d.pretest.pretestProbability = 'low';
	d.vitals = { heartRate: 78, oxygenSaturation: 98 };
	d.criteria = {
		unilateralLegSwelling: 'no',
		haemoptysis: 'no',
		recentSurgeryOrTrauma: 'no',
		priorVenousThromboembolism: 'no',
		oestrogenUse: 'no'
	};
	return d;
}

describe('PERC classification engine', () => {
	it('classifies PERC-negative when pre-test low and all eight criteria satisfied', () => {
		const r = calculatePercGrade(createPercNegative());
		expect(r.classification).toBe('perc-negative');
		expect(r.allCriteriaSatisfied).toBe(true);
		expect(r.applicable).toBe(true);
		expect(r.failedCriteria).toEqual([]);
	});

	it('is PERC-positive when the pre-test probability is not low, even if all criteria satisfied', () => {
		const d = createPercNegative();
		d.pretest.pretestProbability = 'not-low';
		const r = calculatePercGrade(d);
		expect(r.classification).toBe('perc-positive');
		expect(r.allCriteriaSatisfied).toBe(true);
		expect(r.applicable).toBe(false);
	});

	it('is PERC-positive when the pre-test probability is unrecorded', () => {
		const d = createPercNegative();
		d.pretest.pretestProbability = '';
		expect(calculatePercGrade(d).classification).toBe('perc-positive');
	});

	// ─── Criterion 1: age boundary 49 / 50 ──────────────────────────
	it('satisfies criterion 1 at age 49 but fails at age 50', () => {
		const under = createPercNegative();
		under.identification.age = 49;
		expect(calculatePercGrade(under).classification).toBe('perc-negative');

		const at = createPercNegative();
		at.identification.age = 50;
		const r = calculatePercGrade(at);
		expect(r.classification).toBe('perc-positive');
		expect(r.failedCriteria).toEqual([1]);
	});

	// ─── Criterion 2: heart-rate boundary 99 / 100 ──────────────────
	it('satisfies criterion 2 at HR 99 but fails at HR 100', () => {
		const under = createPercNegative();
		under.vitals.heartRate = 99;
		expect(calculatePercGrade(under).classification).toBe('perc-negative');

		const at = createPercNegative();
		at.vitals.heartRate = 100;
		const r = calculatePercGrade(at);
		expect(r.classification).toBe('perc-positive');
		expect(r.failedCriteria).toEqual([2]);
	});

	// ─── Criterion 3: SpO2 boundary 95 / 94 ─────────────────────────
	it('satisfies criterion 3 at SpO2 95 but fails at SpO2 94', () => {
		const at = createPercNegative();
		at.vitals.oxygenSaturation = 95;
		expect(calculatePercGrade(at).classification).toBe('perc-negative');

		const under = createPercNegative();
		under.vitals.oxygenSaturation = 94;
		const r = calculatePercGrade(under);
		expect(r.classification).toBe('perc-positive');
		expect(r.failedCriteria).toEqual([3]);
	});

	it('fails each yes/no criterion in isolation when the finding is present', () => {
		const cases: { field: keyof AssessmentData['criteria']; number: number }[] = [
			{ field: 'unilateralLegSwelling', number: 4 },
			{ field: 'haemoptysis', number: 5 },
			{ field: 'recentSurgeryOrTrauma', number: 6 },
			{ field: 'priorVenousThromboembolism', number: 7 },
			{ field: 'oestrogenUse', number: 8 }
		];
		for (const c of cases) {
			const d = createPercNegative();
			d.criteria[c.field] = 'yes';
			const r = calculatePercGrade(d);
			expect(r.classification).toBe('perc-positive');
			expect(r.failedCriteria).toEqual([c.number]);
		}
	});

	it('treats missing numeric inputs as failed criteria', () => {
		const d = createPercNegative();
		d.identification.age = null;
		d.vitals.heartRate = null;
		d.vitals.oxygenSaturation = null;
		const r = calculatePercGrade(d);
		expect(r.classification).toBe('perc-positive');
		expect(r.failedCriteria).toEqual([1, 2, 3]);
	});

	it('treats an unset yes/no criterion as failed', () => {
		const d = createPercNegative();
		d.criteria.haemoptysis = '';
		const r = calculatePercGrade(d);
		expect(r.classification).toBe('perc-positive');
		expect(r.failedCriteria).toEqual([5]);
	});

	it('a fully blank assessment is PERC-positive with all eight criteria failed', () => {
		const r = calculatePercGrade(createDefaultAssessment());
		expect(r.classification).toBe('perc-positive');
		expect(r.failedCriteria).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		expect(r.applicable).toBe(false);
	});

	it('evaluateCriteria returns one result and one fired rule per criterion', () => {
		const { criterionResults, firedRules } = evaluateCriteria(createPercNegative());
		expect(criterionResults).toHaveLength(8);
		expect(firedRules).toHaveLength(8);
	});

	it('records the applicability-gate and composite audit rows', () => {
		const r = calculatePercGrade(createPercNegative());
		expect(r.firedRules.some((f) => f.id === 'R-APPLICABILITY-GATE-01')).toBe(true);
		expect(r.firedRules.some((f) => f.id === 'R-CLASSIFICATION-01')).toBe(true);
	});

	it('all rule IDs are unique', () => {
		const ids = percRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids).toHaveLength(8);
	});
});

describe('PERC flagged-issue detection', () => {
	it('raises the requires-workup flag when PERC-positive', () => {
		const flags = detectFlaggedIssues(createPercNegative(), 'perc-positive');
		expect(flags.some((f) => f.id === 'F-REQUIRES-WORKUP-001')).toBe(true);
	});

	it('does not raise the requires-workup flag when PERC-negative', () => {
		const flags = detectFlaggedIssues(createPercNegative(), 'perc-negative');
		expect(flags.some((f) => f.id === 'F-REQUIRES-WORKUP-001')).toBe(false);
	});

	it('raises the not-applicable flag when pre-test probability is not low', () => {
		const d = createPercNegative();
		d.pretest.pretestProbability = 'not-low';
		const flags = detectFlaggedIssues(d, 'perc-positive');
		expect(flags.some((f) => f.id === 'F-NOT-APPLICABLE-001')).toBe(true);
	});

	it('raises the hypoxia flag when SpO2 is below 95', () => {
		const d = createPercNegative();
		d.vitals.oxygenSaturation = 90;
		const flags = detectFlaggedIssues(d, 'perc-positive');
		expect(flags.some((f) => f.id === 'F-HYPOXIA-001')).toBe(true);
	});

	it('raises the tachycardia flag when HR is at least 100', () => {
		const d = createPercNegative();
		d.vitals.heartRate = 110;
		const flags = detectFlaggedIssues(d, 'perc-positive');
		expect(flags.some((f) => f.id === 'F-TACHYCARDIA-001')).toBe(true);
	});

	it('raises the prior-VTE flag when there is a prior DVT/PE', () => {
		const d = createPercNegative();
		d.criteria.priorVenousThromboembolism = 'yes';
		const flags = detectFlaggedIssues(d, 'perc-positive');
		expect(flags.some((f) => f.id === 'F-PRIOR-VTE-001')).toBe(true);
	});

	it('raises the incomplete flag when inputs are missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), 'perc-positive');
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
		expect(hasMissingInputs(createDefaultAssessment())).toBe(true);
	});

	it('raises no flags for a complete PERC-negative patient', () => {
		const flags = detectFlaggedIssues(createPercNegative(), 'perc-negative');
		expect(flags).toEqual([]);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createPercNegative();
		d.pretest.pretestProbability = 'not-low'; // high
		d.vitals.heartRate = 120; // medium
		const flags = detectFlaggedIssues(d, 'perc-positive');
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
