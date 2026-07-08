// DAS28-ESR grader. Pure functions: take an `AssessmentData` object,
// return the numeric DAS28 score, the disease-activity classification,
// and the list of fired declarative rules.
//
// Formula: DAS28 = 0.56 * sqrt(TJC28) + 0.28 * sqrt(SJC28)
//                + 0.70 * ln(ESR)     + 0.014 * patientGlobalVAS
//
// Where:
//   TJC28 = Tender Joint Count (0-28)
//   SJC28 = Swollen Joint Count (0-28)
//   ESR   = Erythrocyte Sedimentation Rate (mm/hr); clamped to >= 1 to
//           avoid ln(0)
//   VAS   = Patient Global Assessment (0-100mm)
//
// Returns null `das28Score` and `diseaseActivity` if any of the four
// required components is missing.
//
// Activity boundaries:
//   < 2.6  -> Remission
//   < 3.2  -> Low Disease Activity
//   <= 5.1 -> Moderate Disease Activity
//   > 5.1  -> High Disease Activity

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DiseaseActivity} DiseaseActivity
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.RheumatologyAssessment.
(function () {
'use strict';
window.RheumatologyAssessment = window.RheumatologyAssessment || {};
const { das28Rules, classifyDiseaseActivity } = window.RheumatologyAssessment;

/**
 * Evaluate the DAS28 declarative rules and the numeric DAS28-ESR formula
 * against the supplied assessment data.
 *
 * @param {AssessmentData} data
 * @returns {{ das28Score: number | null, diseaseActivity: DiseaseActivity | null, firedRules: FiredRule[] }}
 */
function calculateDAS28(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of das28Rules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`DAS28 rule ${rule.id} evaluation failed:`, e);
    }
  }

  const tjc = data.jointAssessment.tenderJointCount28;
  const sjc = data.jointAssessment.swollenJointCount28;
  const esr = data.laboratoryResults.esr;
  const vas = data.jointAssessment.patientGlobalVAS;

  if (tjc === null || sjc === null || esr === null || vas === null) {
    return { das28Score: null, diseaseActivity: null, firedRules };
  }

  // Ensure ESR is at least 1 to avoid ln(0).
  const esrClamped = Math.max(esr, 1);

  const das28Score =
    0.56 * Math.sqrt(tjc) +
    0.28 * Math.sqrt(sjc) +
    0.70 * Math.log(esrClamped) +
    0.014 * vas;

  // Round to 2 decimal places.
  const roundedScore = Math.round(das28Score * 100) / 100;
  const diseaseActivity = classifyDiseaseActivity(roundedScore);

  return { das28Score: roundedScore, diseaseActivity, firedRules };
}

window.RheumatologyAssessment.calculateDAS28 = calculateDAS28;
})();
