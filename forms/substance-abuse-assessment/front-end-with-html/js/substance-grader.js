// Pure scoring engine: evaluates all substance abuse rules against patient
// data and returns AUDIT score, DAST score, overall risk level, fired
// rules, and additional flags.
// Mirrors `src/lib/engine/substance-grader.ts` from the SvelteKit reference.
(function () {
'use strict';
const NS = window.SubstanceAbuseAssessment;
const {
  substanceRules,
  detectAdditionalFlags,
  calculateAuditScore,
  calculateDastScore,
  auditRiskCategory,
  dastRiskCategory
} = NS;

/**
 * Pure function: returns full GradingResult.
 */
function calculateSubstanceGrade(data) {
  const firedRules = [];
  for (let i = 0; i < substanceRules.length; i++) {
    const rule = substanceRules[i];
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
      console.warn('Substance rule ' + rule.id + ' evaluation failed:', e);
    }
  }

  const auditScore = calculateAuditScore(data.alcoholUseAudit);
  const auditCategory = auditRiskCategory(auditScore);

  const dastScore = calculateDastScore(data.drugUseDast);
  const dastCategory = dastRiskCategory(dastScore);

  const overallRisk = deriveOverallRisk(firedRules, auditScore, dastScore);
  const additionalFlags = detectAdditionalFlags(data);

  return {
    auditScore: auditScore,
    auditRiskCategory: auditCategory,
    dastScore: dastScore,
    dastRiskCategory: dastCategory,
    overallRisk: overallRisk,
    firedRules: firedRules,
    additionalFlags: additionalFlags,
    timestamp: new Date().toISOString()
  };
}

/** Derive overall substance abuse risk from fired rules and scores. */
function deriveOverallRisk(firedRules, auditScore, dastScore) {
  let maxGrade = 0;
  for (let i = 0; i < firedRules.length; i++) {
    if (firedRules[i].grade > maxGrade) maxGrade = firedRules[i].grade;
  }
  if (maxGrade >= 4 || auditScore >= 20 || dastScore >= 9) return 'critical';
  if (maxGrade >= 3 || auditScore >= 16 || dastScore >= 6) return 'high';
  if (maxGrade >= 2 || auditScore >= 8 || dastScore >= 3) return 'moderate';
  return 'low';
}

Object.assign(NS, { calculateSubstanceGrade });
})();
