// Declarative CAGE grading rules.
//
// The CAGE instrument has exactly four scored criteria, each worth 0 or 1
// point. Each rule below evaluates the patient data and returns true when its
// criterion is positive (the patient answered 'yes'); the grader (`grader.js`)
// sums the points into the total CAGE score (0-4) and derives the result band.
// Rows here mirror the `cage_alcohol_questionnaire_grade_rule` SQL table
// (rule_id, parameter, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} CageRule
 * @property {string} id
 * @property {string} criterion   - cut-down | annoyed | guilty | eye-opener
 * @property {number} points      - point contributed when the rule fires (1)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.CageAlcoholQuestionnaire.
(function () {
'use strict';
window.CageAlcoholQuestionnaire =
  window.CageAlcoholQuestionnaire || {};

/** @type {CageRule[]} */
const cageRules = [
  // ─── CRITERION C: CUT DOWN ────────────────────────────────────
  {
    id: 'R-CUT-DOWN-1POINT-01',
    criterion: 'cut-down',
    points: 1,
    category: 'criterion-positive',
    description: 'Felt they should cut down on their drinking',
    evaluate: (d) => d.criteria.cutDown === 'yes'
  },

  // ─── CRITERION A: ANNOYED ─────────────────────────────────────
  {
    id: 'R-ANNOYED-1POINT-01',
    criterion: 'annoyed',
    points: 1,
    category: 'criterion-positive',
    description: 'People have annoyed them by criticising their drinking',
    evaluate: (d) => d.criteria.annoyed === 'yes'
  },

  // ─── CRITERION G: GUILTY ──────────────────────────────────────
  {
    id: 'R-GUILTY-1POINT-01',
    criterion: 'guilty',
    points: 1,
    category: 'criterion-positive',
    description: 'Felt bad or guilty about their drinking',
    evaluate: (d) => d.criteria.guilty === 'yes'
  },

  // ─── CRITERION E: EYE-OPENER ──────────────────────────────────
  {
    id: 'R-EYE-OPENER-1POINT-01',
    criterion: 'eye-opener',
    points: 1,
    category: 'criterion-positive',
    description: 'Had a morning drink to steady nerves or cure a hangover (an eye-opener)',
    evaluate: (d) => d.criteria.eyeOpener === 'yes'
  }
];

window.CageAlcoholQuestionnaire.cageRules = cageRules;
})();
