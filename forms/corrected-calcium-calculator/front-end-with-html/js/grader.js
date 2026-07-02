// Corrected-calcium grader. Pure functions: take an `AssessmentData` object,
// apply the albumin-correction formula to the two measured inputs, and classify
// the result against the adult reference range.
//
// Correction algorithm (spec §4):
//   correctedCalcium = (totalCalcium != null && albumin != null)
//                      ? totalCalcium + 0.02 × (40 − albumin)
//                      : null
//
//   classification =
//       correctedCalcium == null   -> 'unknown'
//       correctedCalcium <  2.20   -> 'hypocalcaemia'
//       correctedCalcium <= 2.60   -> 'normal'
//       else                       -> 'hypercalcaemia'
//
// The unrounded value drives classification and every flag threshold; the value
// is rounded to two decimal places for display only. When either input is
// missing the corrected value is null, the classification is 'unknown', and
// `flags.js` raises an incomplete-data flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Classification} Classification
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.CorrectedCalciumCalculator.
(function () {
'use strict';
window.CorrectedCalciumCalculator =
  window.CorrectedCalciumCalculator || {};
const {
  REF_ALBUMIN,
  FACTOR,
  classificationRules
} = window.CorrectedCalciumCalculator;

/** Round a number to two decimal places (returns null unchanged). */
function roundTwo(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.round(n * 100) / 100;
}

/**
 * Compute the corrected calcium grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ correctedCalcium: number|null, correctedCalciumRaw: number|null,
 *             classification: Classification, firedRules: FiredRule[] }}
 */
function calculateCorrectedCalcium(data) {
  const totalCalcium = data.calcium.totalCalcium;
  const albumin = data.albumin.albumin;

  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── Correction ────────────────────────────────────────────────
  let correctedCalciumRaw = null;
  if (totalCalcium !== null && totalCalcium !== undefined &&
      albumin !== null && albumin !== undefined) {
    correctedCalciumRaw = totalCalcium + FACTOR * (REF_ALBUMIN - albumin);
  }

  if (correctedCalciumRaw === null) {
    firedRules.push({
      id: 'R-CORRECTION-INCOMPLETE-01',
      instrument: 'correction',
      band: 'unknown',
      category: 'missing-input',
      description:
        'Correction not computed — total calcium and/or albumin is missing'
    });
    return {
      correctedCalcium: null,
      correctedCalciumRaw: null,
      classification: 'unknown',
      firedRules
    };
  }

  firedRules.push({
    id: 'R-CORRECTION-01',
    instrument: 'correction',
    band: 'unknown',
    category: 'correction',
    description:
      `Corrected calcium = ${totalCalcium} + 0.02 × (40 − ${albumin}) = ` +
      `${roundTwo(correctedCalciumRaw)} mmol/L`
  });

  // ─── Classification ────────────────────────────────────────────
  /** @type {Classification} */
  let classification = 'unknown';
  for (const rule of classificationRules) {
    try {
      if (rule.evaluate(correctedCalciumRaw)) {
        classification = /** @type {Classification} */ (rule.band);
        firedRules.push({
          id: rule.id,
          instrument: rule.instrument,
          band: rule.band,
          category: rule.category,
          description: rule.description
        });
        break;
      }
    } catch (e) {
      console.warn(`Corrected-calcium rule ${rule.id} evaluation failed:`, e);
    }
  }

  return {
    correctedCalcium: roundTwo(correctedCalciumRaw),
    correctedCalciumRaw,
    classification,
    firedRules
  };
}

Object.assign(window.CorrectedCalciumCalculator, {
  roundTwo,
  calculateCorrectedCalcium
});
})();
