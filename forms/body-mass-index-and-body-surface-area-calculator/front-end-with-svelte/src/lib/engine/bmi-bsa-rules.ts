import type { CategoryRule } from './types';

/**
 * Declarative BMI/BSA constants and rules.
 *
 * Unlike an additive score, BMI and BSA are *formulae*: the numeric values are
 * computed once (see `bmi-bsa-grader.ts`) and then BMI is banded into the WHO
 * adult weight-status categories. The rules below describe the WHO category
 * bands (evaluated against the unrounded BMI); the Asian lower-threshold action
 * points and the physiologically plausible ranges (used by the extreme-value
 * flag) are constants. Rows mirror the
 * `body_mass_index_and_body_surface_area_calculator_grade_rule` SQL table.
 */

// ─── WHO adult BMI band boundaries (spec §4, inclusive lower bounds) ──────
/** Underweight upper bound (exclusive) — normal begins here. */
export const BMI_NORMAL = 18.5;
/** Overweight lower bound (inclusive). */
export const BMI_OVERWEIGHT = 25.0;
/** Obese class I lower bound (inclusive). */
export const BMI_OBESE_1 = 30.0;
/** Obese class II lower bound (inclusive). */
export const BMI_OBESE_2 = 35.0;
/** Obese class III lower bound (inclusive). */
export const BMI_OBESE_3 = 40.0;

// ─── Asian lower-threshold action points (spec §4) ───────────────────────
/** Increased cardiometabolic risk in Asian populations (inclusive). */
export const ASIAN_INCREASED = 23.0;
/** High cardiometabolic risk in Asian populations (inclusive). */
export const ASIAN_HIGH = 27.5;

// ─── Mosteller BSA divisor constant (spec §4) ────────────────────────────
/** Mosteller denominator: BSA = √((cm × kg) / 3600). */
export const MOSTELLER_DIVISOR = 3600;

// ─── Du Bois BSA constants (spec §4) ─────────────────────────────────────
/** Du Bois leading coefficient. */
export const DUBOIS_COEFF = 0.007184;
/** Du Bois height exponent. */
export const DUBOIS_HEIGHT_EXP = 0.725;
/** Du Bois weight exponent. */
export const DUBOIS_WEIGHT_EXP = 0.425;

// ─── Physiologically plausible adult ranges (extreme-value flag, spec §5) ─
/** Minimum plausible adult height in cm. */
export const HEIGHT_MIN = 100;
/** Maximum plausible adult height in cm. */
export const HEIGHT_MAX = 250;
/** Minimum plausible adult weight in kg. */
export const WEIGHT_MIN = 20;
/** Maximum plausible adult weight in kg. */
export const WEIGHT_MAX = 400;
/** Minimum plausible BMI. */
export const BMI_MIN = 10;
/** Maximum plausible BMI. */
export const BMI_MAX = 80;

/**
 * WHO adult weight-status bands, evaluated against the unrounded BMI. Lower
 * bounds are inclusive; the first matching rule wins (list is ascending).
 */
export const categoryRules: CategoryRule[] = [
	{
		id: 'T-WHO-UNDERWEIGHT-01',
		instrument: 'bmi-category',
		band: 'underweight',
		category: 'who-weight-status',
		description: 'BMI below 18.5 kg/m² — underweight',
		evaluate: (bmi) => bmi < BMI_NORMAL
	},
	{
		id: 'T-WHO-NORMAL-01',
		instrument: 'bmi-category',
		band: 'normal',
		category: 'who-weight-status',
		description: 'BMI 18.5-24.9 kg/m² — normal (healthy) weight',
		evaluate: (bmi) => bmi >= BMI_NORMAL && bmi < BMI_OVERWEIGHT
	},
	{
		id: 'T-WHO-OVERWEIGHT-01',
		instrument: 'bmi-category',
		band: 'overweight',
		category: 'who-weight-status',
		description: 'BMI 25.0-29.9 kg/m² — overweight (pre-obesity)',
		evaluate: (bmi) => bmi >= BMI_OVERWEIGHT && bmi < BMI_OBESE_1
	},
	{
		id: 'T-WHO-OBESE-1-01',
		instrument: 'bmi-category',
		band: 'obese-class-1',
		category: 'who-weight-status',
		description: 'BMI 30.0-34.9 kg/m² — obese class I',
		evaluate: (bmi) => bmi >= BMI_OBESE_1 && bmi < BMI_OBESE_2
	},
	{
		id: 'T-WHO-OBESE-2-01',
		instrument: 'bmi-category',
		band: 'obese-class-2',
		category: 'who-weight-status',
		description: 'BMI 35.0-39.9 kg/m² — obese class II',
		evaluate: (bmi) => bmi >= BMI_OBESE_2 && bmi < BMI_OBESE_3
	},
	{
		id: 'T-WHO-OBESE-3-01',
		instrument: 'bmi-category',
		band: 'obese-class-3',
		category: 'who-weight-status',
		description: 'BMI 40.0 kg/m² or above — obese class III',
		evaluate: (bmi) => bmi >= BMI_OBESE_3
	}
];
