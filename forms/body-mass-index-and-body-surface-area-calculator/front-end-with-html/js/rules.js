// Declarative BMI/BSA rules and constants.
//
// Unlike an additive score, BMI and BSA are *formulae*: the numeric values are
// computed once (see `grader.js`) and then BMI is banded into the WHO adult
// weight-status categories. The rules below describe (a) the WHO category bands
// and (b) the Asian lower-threshold action points, plus the physiologically
// plausible ranges used by the extreme-value safety flag. The grader evaluates
// the category rules against the unrounded BMI and records the matching band as
// an audit row. Rows here mirror the
// `body_mass_index_and_body_surface_area_calculator_grade_rule` SQL table
// (rule_id, instrument, band, category, description).

/**
 * @typedef {import('./types.js').FiredThreshold} FiredThreshold
 *
 * @typedef {Object} CategoryRule
 * @property {string} id
 * @property {string} instrument   - bmi-category
 * @property {string} band         - underweight | normal | overweight | obese-class-1 | obese-class-2 | obese-class-3
 * @property {string} category
 * @property {string} description
 * @property {(bmi: number) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.BmiBsaCalculator.

// ─── WHO adult BMI band boundaries (spec §4, inclusive lower bounds) ──────
/** Underweight upper bound (exclusive) — normal begins here. */
const BMI_NORMAL = 18.5;
/** Overweight lower bound (inclusive). */
const BMI_OVERWEIGHT = 25.0;
/** Obese class I lower bound (inclusive). */
const BMI_OBESE_1 = 30.0;
/** Obese class II lower bound (inclusive). */
const BMI_OBESE_2 = 35.0;
/** Obese class III lower bound (inclusive). */
const BMI_OBESE_3 = 40.0;

// ─── Asian lower-threshold action points (spec §4) ───────────────────────
/** Increased cardiometabolic risk in Asian populations (inclusive). */
const ASIAN_INCREASED = 23.0;
/** High cardiometabolic risk in Asian populations (inclusive). */
const ASIAN_HIGH = 27.5;

// ─── Mosteller BSA divisor constant (spec §4) ────────────────────────────
/** Mosteller denominator: BSA = √((cm × kg) / 3600). */
const MOSTELLER_DIVISOR = 3600;

// ─── Du Bois BSA constants (spec §4) ─────────────────────────────────────
/** Du Bois leading coefficient. */
const DUBOIS_COEFF = 0.007184;
/** Du Bois height exponent. */
const DUBOIS_HEIGHT_EXP = 0.725;
/** Du Bois weight exponent. */
const DUBOIS_WEIGHT_EXP = 0.425;

// ─── Physiologically plausible adult ranges (extreme-value flag, spec §5) ─
/** Minimum plausible adult height in cm. */
const HEIGHT_MIN = 100;
/** Maximum plausible adult height in cm. */
const HEIGHT_MAX = 250;
/** Minimum plausible adult weight in kg. */
const WEIGHT_MIN = 20;
/** Maximum plausible adult weight in kg. */
const WEIGHT_MAX = 400;
/** Minimum plausible BMI. */
const BMI_MIN = 10;
/** Maximum plausible BMI. */
const BMI_MAX = 80;

/**
 * WHO adult weight-status bands, evaluated against the unrounded BMI. Lower
 * bounds are inclusive; the first matching rule wins (list is ascending).
 * @type {CategoryRule[]}
 */
const categoryRules = [
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
    description: 'BMI 18.5–24.9 kg/m² — normal (healthy) weight',
    evaluate: (bmi) => bmi >= BMI_NORMAL && bmi < BMI_OVERWEIGHT
  },
  {
    id: 'T-WHO-OVERWEIGHT-01',
    instrument: 'bmi-category',
    band: 'overweight',
    category: 'who-weight-status',
    description: 'BMI 25.0–29.9 kg/m² — overweight (pre-obesity)',
    evaluate: (bmi) => bmi >= BMI_OVERWEIGHT && bmi < BMI_OBESE_1
  },
  {
    id: 'T-WHO-OBESE-1-01',
    instrument: 'bmi-category',
    band: 'obese-class-1',
    category: 'who-weight-status',
    description: 'BMI 30.0–34.9 kg/m² — obese class I',
    evaluate: (bmi) => bmi >= BMI_OBESE_1 && bmi < BMI_OBESE_2
  },
  {
    id: 'T-WHO-OBESE-2-01',
    instrument: 'bmi-category',
    band: 'obese-class-2',
    category: 'who-weight-status',
    description: 'BMI 35.0–39.9 kg/m² — obese class II',
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

export { BMI_NORMAL, BMI_OVERWEIGHT, BMI_OBESE_1, BMI_OBESE_2, BMI_OBESE_3, ASIAN_INCREASED, ASIAN_HIGH, MOSTELLER_DIVISOR, DUBOIS_COEFF, DUBOIS_HEIGHT_EXP, DUBOIS_WEIGHT_EXP, HEIGHT_MIN, HEIGHT_MAX, WEIGHT_MIN, WEIGHT_MAX, BMI_MIN, BMI_MAX, categoryRules };
