import { describe, it, expect } from 'vitest';
import { calculateBmiBsa, roundOne, roundTwo } from './bmi-bsa-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { categoryRules } from './bmi-bsa-rules';
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
			purpose: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '', ancestry: '' },
		height: { heightCm: null },
		weight: { weightKg: null },
		results: { bsaFormula: 'mosteller', clinicalNote: '' }
	};
}

/** A fully-answered patient at a known height and weight. */
function createPatient(heightCm: number, weightKg: number): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'outpatient',
		purpose: 'screening'
	};
	d.identification = {
		patientIdentifier: 'OP-1001',
		ageBand: '40-64',
		sex: 'male',
		ancestry: 'unspecified'
	};
	d.height.heightCm = heightCm;
	d.weight.weightKg = weightKg;
	return d;
}

describe('BMI/BSA engine', () => {
	it('computes BMI, category, and both BSA values (height 180, weight 81)', () => {
		// BMI = 81 / (1.80)² = 81 / 3.24 = 25.0 → overweight (25 is inclusive lower bound)
		const r = calculateBmiBsa(createPatient(180, 81));
		expect(r.bmi).toBe(25);
		expect(r.bmiCategory).toBe('overweight');
		// BSA (Mosteller) = √((180 × 81) / 3600) = √4.05 ≈ 2.01 m²
		expect(r.bsaMosteller).toBe(2.01);
		// BSA (Du Bois) = 0.007184 × 180^0.725 × 81^0.425 ≈ 2.00 m²
		expect(r.bsaDuBois).toBeCloseTo(2.0, 1);
	});

	it('returns null outputs and empty category when either input is missing', () => {
		const missingWeight = createPatient(180, 81);
		missingWeight.weight.weightKg = null;
		const r = calculateBmiBsa(missingWeight);
		expect(r.bmi).toBeNull();
		expect(r.bmiRaw).toBeNull();
		expect(r.bmiCategory).toBe('');
		expect(r.bsaMosteller).toBeNull();
		expect(r.bsaDuBois).toBeNull();

		const missingHeight = createPatient(180, 81);
		missingHeight.height.heightCm = null;
		expect(calculateBmiBsa(missingHeight).bmiCategory).toBe('');
	});

	it('bands each WHO boundary (18.5, 25, 30, 35, 40) as the inclusive lower bound', () => {
		// heightM = 1 m so BMI == weightKg numerically at these weights.
		expect(calculateBmiBsa(createPatient(100, 18.4)).bmiCategory).toBe('underweight');
		expect(calculateBmiBsa(createPatient(100, 18.5)).bmiCategory).toBe('normal');
		expect(calculateBmiBsa(createPatient(100, 24.9)).bmiCategory).toBe('normal');
		expect(calculateBmiBsa(createPatient(100, 25)).bmiCategory).toBe('overweight');
		expect(calculateBmiBsa(createPatient(100, 30)).bmiCategory).toBe('obese-class-1');
		expect(calculateBmiBsa(createPatient(100, 35)).bmiCategory).toBe('obese-class-2');
		expect(calculateBmiBsa(createPatient(100, 40)).bmiCategory).toBe('obese-class-3');
	});

	it('rounds BMI to 1 dp and BSA to 2 dp for display', () => {
		expect(roundOne(24.96)).toBe(25);
		expect(roundOne(null)).toBeNull();
		expect(roundTwo(2.0125)).toBe(2.01);
		expect(roundTwo(null)).toBeNull();
	});

	it('records Asian action-point thresholds without changing the WHO category', () => {
		const increased = createPatient(100, 24); // BMI 24 → normal, but ≥ 23 Asian
		increased.identification.ancestry = 'asian';
		const ri = calculateBmiBsa(increased);
		expect(ri.bmiCategory).toBe('normal');
		expect(ri.firedThresholds.some((t) => t.id === 'T-ASIAN-INCREASED-01')).toBe(true);

		const high = createPatient(100, 28); // BMI 28 → overweight, ≥ 27.5 Asian
		high.identification.ancestry = 'asian';
		const rh = calculateBmiBsa(high);
		expect(rh.bmiCategory).toBe('overweight');
		expect(rh.firedThresholds.some((t) => t.id === 'T-ASIAN-HIGH-01')).toBe(true);
	});

	it('all category rule IDs are unique', () => {
		const ids = categoryRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('BMI/BSA flagged-issue detection', () => {
	it('raises no red flags for a complete normal patient', () => {
		const r = calculateBmiBsa(createPatient(180, 75)); // BMI ≈ 23.1 → normal
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the incomplete-data flag when an input is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), null);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-DATA-001')).toBe(true);
	});

	it('raises severe-obesity at or above BMI 40', () => {
		const r = calculateBmiBsa(createPatient(100, 41)); // BMI 41
		expect(r.flaggedIssues.some((f) => f.id === 'F-SEVERE-OBESITY-001')).toBe(true);
	});

	it('raises underweight below BMI 18.5', () => {
		const r = calculateBmiBsa(createPatient(180, 55)); // BMI ≈ 16.98
		expect(r.flaggedIssues.some((f) => f.id === 'F-UNDERWEIGHT-001')).toBe(true);
	});

	it('raises the extreme-value flag for an implausible height', () => {
		const flags = detectFlaggedIssues(createPatient(60, 70), 30);
		expect(flags.some((f) => f.id === 'F-EXTREME-VALUE-001')).toBe(true);
	});

	it('raises the Asian high-risk flag only when ancestry is Asian and BMI ≥ 27.5', () => {
		const asian = createPatient(100, 28);
		asian.identification.ancestry = 'asian';
		expect(
			calculateBmiBsa(asian).flaggedIssues.some((f) => f.id === 'F-ASIAN-HIGH-RISK-001')
		).toBe(true);

		const other = createPatient(100, 28);
		other.identification.ancestry = 'other';
		expect(
			calculateBmiBsa(other).flaggedIssues.some((f) => f.id === 'F-ASIAN-HIGH-RISK-001')
		).toBe(false);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createPatient(100, 45); // BMI 45 → severe obesity (high)
		d.identification.ancestry = 'asian'; // also Asian high-risk (medium)
		const flags = calculateBmiBsa(d).flaggedIssues;
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
