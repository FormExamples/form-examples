// CFS (Clinical Frailty Scale) grader. Pure functions: takes an
// `AssessmentData` object, returns the CFS score (1-9) and the audit trail
// of fired rules. Mirrors `src/lib/engine/cfs-grader.ts` from the SvelteKit
// reference.
//
// Algorithm: evaluate every rule; the CFS score is the maximum score among
// fired rules (worst frailty level), defaulting to CFS 1 (very fit) when no
// rules fire.

(function () {
'use strict';
window.GerontologyAssessment = window.GerontologyAssessment || {};
const { cfsRules } = window.GerontologyAssessment;

/**
 * Pure function: evaluates all CFS rules against patient data.
 */
function calculateCFS(data) {
  const firedRules = [];

  for (const rule of cfsRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          domain: rule.domain,
          description: rule.description,
          score: rule.score
        });
      }
    } catch (e) {
      // Rule evaluation failed - log for debugging but continue grading.
      console.warn(`CFS rule ${rule.id} evaluation failed:`, e);
    }
  }

  const cfsScore = firedRules.length === 0
    ? 1
    : Math.max.apply(null, firedRules.map((r) => r.score));

  return { cfsScore, firedRules };
}

window.GerontologyAssessment.calculateCFS = calculateCFS;
})();
