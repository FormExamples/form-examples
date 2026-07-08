// Pure plastic surgery grading engine. Mirrors the SvelteKit reference
// `plastics-grader.ts`: derives ASA class, wound class, complexity score,
// runs every declarative rule, and reduces fired-rule grades plus the three
// classifications down to an overall risk level.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 */

(function () {
'use strict';
window.PlasticSurgeryAssessment = window.PlasticSurgeryAssessment || {};
const { plasticsRules, detectAdditionalFlags } = window.PlasticSurgeryAssessment;

/** Derive ASA class from clinician input. */
function deriveASAClass(data) {
  const v = data.anaestheticRisk.asaClass;
  if (v === '1') return 1;
  if (v === '2') return 2;
  if (v === '3') return 3;
  if (v === '4') return 4;
  if (v === '5') return 5;
  return null;
}

/** Derive wound class from clinician input. */
function deriveWoundClass(data) {
  const v = data.woundTissueAssessment.woundClassification;
  if (v === 'clean') return 1;
  if (v === 'clean-contaminated') return 2;
  if (v === 'contaminated') return 3;
  if (v === 'dirty') return 4;
  return null;
}

/** Derive surgical complexity score from clinician input. */
function deriveComplexityScore(data) {
  const v = data.procedurePlanningConsent.procedureComplexity;
  if (v === '1') return 1;
  if (v === '2') return 2;
  if (v === '3') return 3;
  if (v === '4') return 4;
  return null;
}

/**
 * Reduce fired rules + classifications to an overall risk level.
 * @returns {RiskLevel}
 */
function deriveOverallRisk(firedRules, asaClass, woundClass, complexityScore) {
  const maxGrade = firedRules.length > 0
    ? Math.max(...firedRules.map((r) => r.grade))
    : 0;

  if (maxGrade >= 4 || (asaClass !== null && asaClass >= 4) || woundClass === 4 || complexityScore === 4) {
    return 'critical';
  }
  if (maxGrade >= 3 || asaClass === 3 || woundClass === 3 || complexityScore === 3) {
    return 'high';
  }
  if (maxGrade >= 2 || asaClass === 2 || woundClass === 2 || complexityScore === 2) {
    return 'moderate';
  }
  return 'low';
}

/**
 * Grade an assessment.
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculatePlasticsGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of plasticsRules) {
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
      console.warn(`Plastics rule ${rule.id} evaluation failed:`, e);
    }
  }

  const asaClass = deriveASAClass(data);
  const woundClass = deriveWoundClass(data);
  const complexityScore = deriveComplexityScore(data);
  const overallRisk = deriveOverallRisk(firedRules, asaClass, woundClass, complexityScore);
  const additionalFlags = detectAdditionalFlags(data);

  return {
    asaClass,
    woundClass,
    complexityScore,
    overallRisk,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

window.PlasticSurgeryAssessment.calculatePlasticsGrade = calculatePlasticsGrade;
})();
