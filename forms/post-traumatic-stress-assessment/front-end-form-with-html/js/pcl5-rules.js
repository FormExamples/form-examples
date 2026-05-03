// PCL-5 (PTSD Checklist for DSM-5) clinical-summary rules.
//
// These rules fire based on the computed total score, severity category, and
// DSM-5 symptom pattern. They mirror the SvelteKit reference engine
// (`src/lib/engine/rules.ts`).
//
// PCL-001: Provisional PTSD cut-off — total score ≥ 33
// PCL-002: DSM-5 symptom pattern — B ≥ 1, C ≥ 1, D ≥ 2, E ≥ 2 items rated ≥ 2
// PCL-003: Severe symptom burden — total score ≥ 38

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').SeverityCategory} SeverityCategory
 */

(function () {
'use strict';
window.PostTraumaticStressAssessment = window.PostTraumaticStressAssessment || {};

/**
 * @param {AssessmentData} _data
 * @param {number} total
 * @param {SeverityCategory} category
 * @param {boolean} probableDsm5
 * @returns {FiredRule[]}
 */
function detectFiredRules(_data, total, category, probableDsm5) {
  /** @type {FiredRule[]} */
  const fired = [];

  if (total >= 33) {
    fired.push({
      id: 'PCL-001',
      category: 'Provisional PTSD cut-off',
      description: `Total score ${total} meets or exceeds the provisional PTSD cut-off of 33.`,
      severity: total >= 38 ? 'high' : 'medium'
    });
  }

  if (probableDsm5) {
    fired.push({
      id: 'PCL-002',
      category: 'DSM-5 symptom pattern',
      description:
        'Symptom pattern meets DSM-5 criteria for probable PTSD (B ≥ 1, C ≥ 1, D ≥ 2, E ≥ 2 items rated ≥ 2).',
      severity: 'high'
    });
  }

  if (category === 'Severe') {
    fired.push({
      id: 'PCL-003',
      category: 'Severe symptom burden',
      description: 'Total score ≥ 38 indicates clinically significant PTSD.',
      severity: 'critical'
    });
  }

  return fired;
}

window.PostTraumaticStressAssessment.detectFiredRules = detectFiredRules;
})();
