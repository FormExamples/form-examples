import { ASIAN_HIGH, ASIAN_INCREASED, DUBOIS_COEFF, DUBOIS_HEIGHT_EXP, DUBOIS_WEIGHT_EXP, MOSTELLER_DIVISOR, categoryRules } from './rules.js';

// BMI/BSA grader. Pure functions: take an `AssessmentData` object, apply the
// BMI and BSA formulae to the two measured inputs (height and weight), and band
// the BMI into the WHO adult weight-status category.
//
// Algorithm (spec §4):
//   heightM      = heightCm / 100
//   bmi          = weightKg / (heightM * heightM)                 // kg/m²
//   bsaMosteller = sqrt((heightCm * weightKg) / 3600)             // m²
//   bsaDuBois    = 0.007184 * heightCm^0.725 * weightKg^0.425     // m²
//
// Both `heightCm` and `weightKg` must be non-null and strictly positive;
// otherwise every numeric output is null, the category is '', and `flags.js`
// raises an incomplete-data flag separately. The unrounded BMI drives banding
// and every flag threshold; values are rounded for display only (BMI to 1 dp,
// BSA to 2 dp). When `ancestry == 'asian'` the Asian lower-threshold action
// points (≥ 23, ≥ 27.5) are recorded as fired thresholds without changing the
// primary WHO category.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').BmiCategory} BmiCategory
 * @typedef {import('./types.js').FiredThreshold} FiredThreshold
 */

/** Round a number to `dp` decimal places (returns null unchanged). */
function roundTo(n, dp) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

/** Round to one decimal place (BMI display). */
function roundOne(n) { return roundTo(n, 1); }

/** Round to two decimal places (BSA display). */
function roundTwo(n) { return roundTo(n, 2); }

/**
 * Compute the BMI, WHO category, and both BSA values for the supplied data.
 * @param {AssessmentData} data
 * @returns {{ bmi: number|null, bmiRaw: number|null, bmiCategory: BmiCategory,
 *             bsaMosteller: number|null, bsaDuBois: number|null,
 *             firedThresholds: FiredThreshold[] }}
 */
function calculateBmiBsa(data) {
  const heightCm = data.height.heightCm;
  const weightKg = data.weight.weightKg;
  const ancestry = data.identification.ancestry;

  /** @type {FiredThreshold[]} */
  const firedThresholds = [];

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
      firedThresholds
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
  /** @type {BmiCategory} */
  let bmiCategory = '';
  for (const rule of categoryRules) {
    try {
      if (rule.evaluate(bmiRaw)) {
        bmiCategory = /** @type {BmiCategory} */ (rule.band);
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
    firedThresholds
  };
}

export { roundOne, roundTwo, calculateBmiBsa };
