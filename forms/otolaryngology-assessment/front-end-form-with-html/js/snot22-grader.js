// SNOT-22 grader. Pure functions: take an `AssessmentData`, return total
// (0-110), severity level, answered count, and per-question audit trail.
//
// Severity bands:
//   0  - 7  -> Mild     (minimal impact on daily life)
//   8  - 19 -> Moderate (moderate impact; targeted management advised)
//   >= 20  -> Severe   (significant impact; consider specialist referral)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').SeverityLevel} SeverityLevel
 */

(function () {
'use strict';
window.OtolaryngologyAssessment = window.OtolaryngologyAssessment || {};
const { snot22Rules } = window.OtolaryngologyAssessment;

/** @returns {SeverityLevel} */
function classifySnot22Score(score) {
  if (score >= 20) return 'severe';
  if (score >= 8) return 'moderate';
  return 'mild';
}

function severityLabel(level) {
  switch (level) {
    case 'severe': return 'Severe — significant impact';
    case 'moderate': return 'Moderate — targeted management advised';
    case 'mild': return 'Mild — minimal impact';
    default: return '';
  }
}

function severityClass(level) {
  switch (level) {
    case 'severe': return 'severity-severe';
    case 'moderate': return 'severity-moderate';
    case 'mild': return 'severity-mild';
    default: return '';
  }
}

/**
 * Sum all 22 SNOT items the patient answered, classify the result.
 * @param {AssessmentData} data
 */
function calculateSnot22(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let totalScore = 0;
  let answeredCount = 0;

  for (const rule of snot22Rules) {
    try {
      const { score, answered } = rule.evaluate(data);
      if (answered) {
        answeredCount++;
        totalScore += score;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score
        });
      }
    } catch (e) {
      console.warn(`SNOT-22 rule ${rule.id} evaluation failed:`, e);
    }
  }

  const severityLevel = classifySnot22Score(totalScore);
  return { totalScore, severityLevel, answeredCount, firedRules };
}

Object.assign(window.OtolaryngologyAssessment, {
  classifySnot22Score,
  severityLabel,
  severityClass,
  calculateSnot22
});
})();
