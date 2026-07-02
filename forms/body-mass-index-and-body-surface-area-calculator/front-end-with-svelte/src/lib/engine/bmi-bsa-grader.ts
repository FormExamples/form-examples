import type { AssessmentData, BmiCategory, FiredThreshold, GradingResult } from './types';
import {
	ASIAN_INCREASED,
	ASIAN_HIGH,
	MOSTELLER_DIVISOR,
	DUBOIS_COEFF,
	DUBOIS_HEIGHT_EXP,
	DUBOIS_WEIGHT_EXP,
	categoryRules
} from './bmi-bsa-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Round a number to `dp` decimal places (returns null unchanged). */
export function roundTo(n: number | null, dp: number): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	const f = Math.pow(10, dp);
	return Math.round(n * f) / f;
}

/** Round to one decimal place (BMI display). */
export function roundOne(n: number | null): number | null {
	return roundTo(n, 1);
}

/** Round to two decimal places (BSA display). */
export function roundTwo(n: number | null): number | null {
	return roundTo(n, 2);
}

/**
 * Pure function: compute the BMI, WHO category, and both BSA values for the
 * supplied assessment data.
 *
 * Algorithm (spec §4):
 *   heightM      = heightCm / 100
 *   bmi          = weightKg / (heightM * heightM)                 // kg/m²
 *   bsaMosteller = sqrt((heightCm * weightKg) / 3600)             // m²
 *   bsaDuBois    = 0.007184 * heightCm^0.725 * weightKg^0.425     // m²
 *
 * Both `heightCm` and `weightKg` must be non-null and strictly positive;
 * otherwise every numeric output is null and the category is ''. The unrounded
 * BMI drives banding and every flag threshold; values are rounded for display
 * only (BMI to 1 dp, BSA to 2 dp). When `ancestry == 'asian'` the Asian
 * lower-threshold action points (≥ 23, ≥ 27.5) are recorded as fired thresholds
 * without changing the primary WHO category.
 */
export function calculateBmiBsa(data: AssessmentData): GradingResult {
	const heightCm = data.height.heightCm;
	const weightKg = data.weight.weightKg;
	const ancestry = data.identification.ancestry;

	const firedThresholds: FiredThreshold[] = [];

	// ─── Guard: both inputs must be present and strictly positive ───────
	const valid =
		heightCm !== null && heightCm !== undefined && heightCm > 0 &&
		weightKg !== null && weightKg !== undefined && weightKg > 0;

	if (!valid) {
		return {
			bmi: null,
			bmiRaw: null,
			bmiCategory: '',
			bsaMosteller: null,
			bsaDuBois: null,
			firedThresholds,
			flaggedIssues: detectFlaggedIssues(data, null),
			timestamp: new Date().toISOString()
		};
	}

	// ─── Formulae ───────────────────────────────────────────────────────
	const heightM = heightCm / 100;
	const bmiRaw = weightKg / (heightM * heightM);
	const bsaMostellerRaw = Math.sqrt((heightCm * weightKg) / MOSTELLER_DIVISOR);
	const bsaDuBoisRaw =
		DUBOIS_COEFF *
		Math.pow(heightCm, DUBOIS_HEIGHT_EXP) *
		Math.pow(weightKg, DUBOIS_WEIGHT_EXP);

	// ─── WHO banding (unrounded BMI, first match wins) ──────────────────
	let bmiCategory: BmiCategory = '';
	for (const rule of categoryRules) {
		try {
			if (rule.evaluate(bmiRaw)) {
				bmiCategory = rule.band as BmiCategory;
				firedThresholds.push({
					id: rule.id,
					instrument: rule.instrument,
					band: rule.band,
					category: rule.category,
					description: rule.description
				});
				break;
			}
		} catch (e) {
			console.warn(`BMI category rule ${rule.id} evaluation failed:`, e);
		}
	}

	// ─── Asian lower-threshold action points (flags only, not category) ─
	if (ancestry === 'asian') {
		if (bmiRaw >= ASIAN_HIGH) {
			firedThresholds.push({
				id: 'T-ASIAN-HIGH-01',
				instrument: 'asian-threshold',
				band: 'asian-high-risk',
				category: 'asian-action-point',
				description: 'BMI ≥ 27.5 kg/m² — high cardiometabolic risk (Asian threshold)'
			});
		} else if (bmiRaw >= ASIAN_INCREASED) {
			firedThresholds.push({
				id: 'T-ASIAN-INCREASED-01',
				instrument: 'asian-threshold',
				band: 'asian-increased-risk',
				category: 'asian-action-point',
				description: 'BMI ≥ 23 kg/m² — increased cardiometabolic risk (Asian threshold)'
			});
		}
	}

	return {
		bmi: roundOne(bmiRaw),
		bmiRaw,
		bmiCategory,
		bsaMosteller: roundTwo(bsaMostellerRaw),
		bsaDuBois: roundTwo(bsaDuBoisRaw),
		firedThresholds,
		flaggedIssues: detectFlaggedIssues(data, bmiRaw),
		timestamp: new Date().toISOString()
	};
}
