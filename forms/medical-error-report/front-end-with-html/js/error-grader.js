// Medical-error grader. Pure functions: take an `AssessmentData` object,
// evaluate every rule, derive WHO severity, NCC MERP category, and overall
// risk level. Mirrors the SvelteKit `error-grader.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').WHOSeverity} WHOSeverity
 * @typedef {import('./types.js').NCCMERPCategory} NCCMERPCategory
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 */

(function () {
'use strict';
window.MedicalErrorReport = window.MedicalErrorReport || {};
const { errorRules, detectAdditionalFlags } = window.MedicalErrorReport;

/**
 * Evaluate every error rule, then derive WHO severity, NCC MERP category,
 * and overall risk level.
 *
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculateErrorGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of errorRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn(`Error rule ${rule.id} evaluation failed:`, e);
    }
  }

  const whoSeverity = data.errorClassification.whoSeverity || '';
  const nccMerpCategory = data.errorClassification.nccMerpCategory || '';
  const overallRisk = deriveOverallRisk(firedRules, whoSeverity, nccMerpCategory);
  const additionalFlags = detectAdditionalFlags(data);

  return {
    whoSeverity,
    nccMerpCategory,
    overallRisk,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

/**
 * Derive overall risk from worst fired-rule grade and reporter classifications.
 *
 * @param {FiredRule[]} firedRules
 * @param {WHOSeverity} whoSeverity
 * @param {NCCMERPCategory} nccMerpCategory
 * @returns {RiskLevel}
 */
function deriveOverallRisk(firedRules, whoSeverity, nccMerpCategory) {
  const maxGrade =
    firedRules.length > 0 ? Math.max.apply(null, firedRules.map((r) => r.grade)) : 0;

  const whoRisk = {
    'near-miss': 1,
    'mild': 2,
    'moderate': 3,
    'severe': 4,
    'critical': 5
  };
  const merpRisk = {
    A: 1, B: 1, C: 1,
    D: 2,
    E: 3, F: 3,
    G: 4,
    H: 5, I: 5
  };

  const whoLevel = whoSeverity ? (whoRisk[whoSeverity] || 0) : 0;
  const merpLevel = nccMerpCategory ? (merpRisk[nccMerpCategory] || 0) : 0;
  const effectiveMax = Math.max(maxGrade, whoLevel, merpLevel);

  if (effectiveMax >= 5) return 'critical';
  if (effectiveMax >= 4) return 'high';
  if (effectiveMax >= 3) return 'moderate';
  return 'low';
}

Object.assign(window.MedicalErrorReport, { calculateErrorGrade });
})();
