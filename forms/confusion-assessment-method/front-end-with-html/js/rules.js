// Declarative CAM feature rules.
//
// The Confusion Assessment Method has exactly four observational features. Each
// rule below evaluates the patient data and returns true when its feature is
// positive; the grader (`grader.js`) combines them with the fixed boolean
// diagnostic algorithm  1 AND 2 AND (3 OR 4)  into a classification. Unlike a
// numeric-score form there are no points: a feature is simply positive or
// negative. Rows here mirror the `confusion_assessment_method_grade_rule` SQL
// table (rule_id, feature, positive, category, description).
//
// A feature that is left unset ('') is treated as ABSENT for evaluation, per
// spec §3, but the raw tri-state is preserved in storage so an incomplete
// assessment can still be detected by `flags.js`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} CamRule
 * @property {string} id
 * @property {number} featureNumber   - 1..4
 * @property {string} feature         - kebab-case feature key mirroring SQL
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate  - true when the feature is positive
 */

// Wrapped in an IIFE; published via window.ConfusionAssessmentMethod.
(function () {
'use strict';
window.ConfusionAssessmentMethod = window.ConfusionAssessmentMethod || {};

/** @type {CamRule[]} */
const camRules = [
  // ─── FEATURE 1: ACUTE ONSET AND FLUCTUATING COURSE ────────────
  {
    id: 'R-FEATURE-1-POSITIVE-01',
    featureNumber: 1,
    feature: 'acute-onset-fluctuating',
    category: 'feature-evaluation',
    description: 'Feature 1 — acute change in mental status from baseline with a fluctuating course',
    evaluate: (d) => d.feature1.acuteOnsetFluctuating === 'present'
  },

  // ─── FEATURE 2: INATTENTION ───────────────────────────────────
  {
    id: 'R-FEATURE-2-POSITIVE-01',
    featureNumber: 2,
    feature: 'inattention',
    category: 'feature-evaluation',
    description: 'Feature 2 — difficulty focusing attention, confirmed by a formal attention test',
    evaluate: (d) => d.feature2.inattention === 'present'
  },

  // ─── FEATURE 3: DISORGANISED THINKING ─────────────────────────
  {
    id: 'R-FEATURE-3-POSITIVE-01',
    featureNumber: 3,
    feature: 'disorganised-thinking',
    category: 'feature-evaluation',
    description: 'Feature 3 — disorganised or incoherent thinking (rambling, illogical, unpredictable switching)',
    evaluate: (d) => d.feature3.disorganisedThinking === 'present'
  },

  // ─── FEATURE 4: ALTERED LEVEL OF CONSCIOUSNESS ────────────────
  {
    id: 'R-FEATURE-4-POSITIVE-01',
    featureNumber: 4,
    feature: 'altered-consciousness',
    category: 'feature-evaluation',
    description: 'Feature 4 — level of consciousness anything other than alert',
    evaluate: (d) => d.feature4.alteredConsciousness === 'present'
  }
];

window.ConfusionAssessmentMethod.camRules = camRules;
})();
