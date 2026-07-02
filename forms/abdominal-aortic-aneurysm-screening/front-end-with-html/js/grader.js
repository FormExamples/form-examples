// AAA grader. Pure functions: take an `AssessmentData` object, apply the
// non-visualised guard, classify the measured maximum aortic diameter against
// the NHS AAA Screening Programme thresholds, and derive the surveillance /
// referral band, the recommended action, and the growth since the prior scan.
//
// Classification algorithm (spec §4):
//   if aortaVisualised == 'no' || maxAorticDiameterCm == null:
//        category          = 'non-visualised'
//        surveillanceBand  = 'rescan'
//   else if maxAorticDiameterCm <  3.0:  category='normal', band='discharge'
//   else if maxAorticDiameterCm <  4.5:  category='small',  band='annual'
//   else if maxAorticDiameterCm <  5.5:  category='medium', band='three-monthly'
//   else:                                category='large',  band='refer-vascular'
//
// Growth (spec §4): growthCm = maxAorticDiameterCm - priorMaxDiameterCm when
// both are present, else null.
//
// Classification is driven solely by the diameter; the value is not rounded.
// When the aorta is not visualised (or the diameter is missing) the result is
// 'non-visualised' and `flags.js` raises the non-visualised flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Category} Category
 * @typedef {import('./types.js').SurveillanceBand} SurveillanceBand
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AbdominalAorticAneurysmScreening.
(function () {
'use strict';
window.AbdominalAorticAneurysmScreening =
  window.AbdominalAorticAneurysmScreening || {};
const { classificationRules } = window.AbdominalAorticAneurysmScreening;

/**
 * Map a diameter band to its surveillance / referral band and the recommended
 * action string.
 * @param {Category} category
 * @returns {{ surveillanceBand: SurveillanceBand, recommendedAction: string }}
 */
function bandForCategory(category) {
  switch (category) {
    case 'normal':
      return {
        surveillanceBand: 'discharge',
        recommendedAction:
          'No aneurysm. Discharge from screening; no further surveillance.'
      };
    case 'small':
      return {
        surveillanceBand: 'annual',
        recommendedAction:
          'Small aneurysm. Annual (12-monthly) ultrasound surveillance.'
      };
    case 'medium':
      return {
        surveillanceBand: 'three-monthly',
        recommendedAction:
          'Medium aneurysm. Three-monthly (quarterly) ultrasound surveillance.'
      };
    case 'large':
      return {
        surveillanceBand: 'refer-vascular',
        recommendedAction:
          'Large aneurysm. Refer to vascular surgery for assessment and consideration of elective repair.'
      };
    case 'non-visualised':
    default:
      return {
        surveillanceBand: 'rescan',
        recommendedAction:
          'Aorta not adequately measured — arrange a re-scan.'
      };
  }
}

/**
 * Round a number to one decimal place (returns null / NaN unchanged).
 * @param {number|null} n
 * @returns {number|null}
 */
function roundOne(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.round(n * 10) / 10;
}

/**
 * Compute the growth since the prior scan, when both diameters are present.
 * @param {AssessmentData} data
 * @returns {number|null}
 */
function calculateGrowth(data) {
  const cur = data.measurement.maxAorticDiameterCm;
  const prior = data.measurement.priorMaxDiameterCm;
  if (cur === null || cur === undefined) return null;
  if (prior === null || prior === undefined) return null;
  return roundOne(cur - prior);
}

/**
 * Compute the full AAA classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ category: Category, surveillanceBand: SurveillanceBand,
 *             recommendedAction: string, maxAorticDiameterCm: number|null,
 *             growthCm: number|null, firedRules: FiredRule[] }}
 */
function classifyAaa(data) {
  const diameter = data.measurement.maxAorticDiameterCm;
  const visualised = data.measurement.aortaVisualised;

  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── Non-visualised guard ───────────────────────────────────
  // An aorta that cannot be adequately measured is never classified as normal.
  if (visualised === 'no' || diameter === null || diameter === undefined) {
    const { surveillanceBand, recommendedAction } = bandForCategory('non-visualised');
    firedRules.push({
      id: 'R-NON-VISUALISED-01',
      instrument: 'classification',
      band: 'non-visualised',
      category: 'guard',
      description:
        'Aorta not adequately visualised or diameter not recorded — result is non-visualised; arrange a re-scan.'
    });
    return {
      category: 'non-visualised',
      surveillanceBand,
      recommendedAction,
      maxAorticDiameterCm: null,
      growthCm: calculateGrowth(data),
      firedRules
    };
  }

  // ─── Diameter classification ────────────────────────────────
  /** @type {Category} */
  let category = 'normal';
  for (const rule of classificationRules) {
    try {
      if (rule.evaluate(diameter)) {
        category = /** @type {Category} */ (rule.band);
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
      console.warn(`AAA rule ${rule.id} evaluation failed:`, e);
    }
  }

  const { surveillanceBand, recommendedAction } = bandForCategory(category);

  return {
    category,
    surveillanceBand,
    recommendedAction,
    maxAorticDiameterCm: roundOne(diameter),
    growthCm: calculateGrowth(data),
    firedRules
  };
}

Object.assign(window.AbdominalAorticAneurysmScreening, {
  bandForCategory,
  calculateGrowth,
  classifyAaa
});
})();
