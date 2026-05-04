// PREVENT risk grader. Pure functions: take an `AssessmentData` object,
// return a complete GradingResult including risk category, percentages,
// fired rules, and additional flags.
//
// Risk category cutoffs (10-year total CVD):
//   < 5%       -> low
//   5-7.4%     -> borderline
//   7.5-19.9%  -> intermediate
//   >= 20%     -> high

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

(function () {
'use strict';
window.PredictingRiskOfCardiovascularDiseaseEvents =
  window.PredictingRiskOfCardiovascularDiseaseEvents || {};

const NS = window.PredictingRiskOfCardiovascularDiseaseEvents;
const {
  estimateTenYearRisk,
  estimateThirtyYearRisk,
  isLikelyDraft,
  evaluateRules,
  detectAdditionalFlags
} = NS;

/**
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculateRisk(data) {
  if (isLikelyDraft(data)) {
    return {
      riskCategory: 'draft',
      tenYearRiskPercent: 0.0,
      thirtyYearRiskPercent: 0.0,
      firedRules: [],
      additionalFlags: [],
      timestamp: new Date().toISOString()
    };
  }

  const tenYear = estimateTenYearRisk(data);
  const thirtyYear = estimateThirtyYearRisk(tenYear);
  const firedRules = evaluateRules(data);
  const additionalFlags = detectAdditionalFlags(data);

  let category;
  if (tenYear < 5.0) category = 'low';
  else if (tenYear < 7.5) category = 'borderline';
  else if (tenYear < 20.0) category = 'intermediate';
  else category = 'high';

  return {
    riskCategory: category,
    tenYearRiskPercent: tenYear,
    thirtyYearRiskPercent: thirtyYear,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

Object.assign(window.PredictingRiskOfCardiovascularDiseaseEvents, {
  calculateRisk
});
})();
