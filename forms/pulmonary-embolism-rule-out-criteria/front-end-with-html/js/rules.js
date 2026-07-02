// Declarative PERC criterion rules.
//
// The Pulmonary Embolism Rule-out Criteria has exactly eight objective criteria.
// Each rule below evaluates the patient data and returns true when its criterion
// is SATISFIED (the reassuring, low-risk state); the grader (`grader.js`)
// combines them with a boolean conjunction and the pre-test-probability gate into
// a binary classification. Unlike a numeric-score form there are no points: a
// criterion is simply satisfied or failed, and a single failure is decisive.
//
// Criteria 1-3 are derived from the objective numeric values (age, heart rate,
// SpO2); a missing numeric value cannot satisfy the criterion and is therefore
// treated as FAILED (spec §4). Criteria 4-8 are yes/no clinical findings,
// satisfied only when the answer is 'no' (the reassuring state positively
// documented) — an unset ('') or 'yes' answer is failed. Rows here mirror the
// `pulmonary_embolism_rule_out_criteria_grade_rule` SQL table (rule_id,
// instrument, satisfied, outcome, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} PercRule
 * @property {string} id
 * @property {number} number          - 1..8
 * @property {string} criterion       - kebab-case criterion key mirroring SQL
 * @property {string} label           - short human label
 * @property {string} category
 * @property {string} description      - reassuring-state description
 * @property {(d: AssessmentData) => boolean} evaluate  - true when SATISFIED
 */

// Wrapped in an IIFE; published via window.PulmonaryEmbolismRuleOutCriteria.
(function () {
'use strict';
window.PulmonaryEmbolismRuleOutCriteria = window.PulmonaryEmbolismRuleOutCriteria || {};

/** @type {PercRule[]} */
const percRules = [
  // ─── CRITERION 1: AGE < 50 (derived from the shared age value) ────
  {
    id: 'R-AGE-UNDER-50-01',
    number: 1,
    criterion: 'age-under-50',
    label: 'Age under 50 years',
    category: 'age',
    description: 'Age is under 50 years',
    evaluate: (d) => d.identification.age !== null && d.identification.age < 50
  },

  // ─── CRITERION 2: HEART RATE < 100 ────────────────────────────────
  {
    id: 'R-HEART-RATE-UNDER-100-01',
    number: 2,
    criterion: 'heart-rate-under-100',
    label: 'Heart rate under 100 beats/min',
    category: 'heart-rate',
    description: 'Heart rate is under 100 beats per minute',
    evaluate: (d) => d.vitals.heartRate !== null && d.vitals.heartRate < 100
  },

  // ─── CRITERION 3: SpO2 >= 95% ─────────────────────────────────────
  {
    id: 'R-SPO2-AT-LEAST-95-01',
    number: 3,
    criterion: 'spo2-at-least-95',
    label: 'Oxygen saturation at least 95%',
    category: 'oxygenation',
    description: 'Oxygen saturation (SpO2) is at least 95% on room air',
    evaluate: (d) => d.vitals.oxygenSaturation !== null && d.vitals.oxygenSaturation >= 95
  },

  // ─── CRITERION 4: NO UNILATERAL LEG SWELLING ──────────────────────
  {
    id: 'R-NO-UNILATERAL-LEG-SWELLING-01',
    number: 4,
    criterion: 'no-unilateral-leg-swelling',
    label: 'No unilateral leg swelling',
    category: 'clinical-sign',
    description: 'No unilateral leg swelling',
    evaluate: (d) => d.criteria.unilateralLegSwelling === 'no'
  },

  // ─── CRITERION 5: NO HAEMOPTYSIS ──────────────────────────────────
  {
    id: 'R-NO-HAEMOPTYSIS-01',
    number: 5,
    criterion: 'no-haemoptysis',
    label: 'No haemoptysis',
    category: 'clinical-sign',
    description: 'No haemoptysis',
    evaluate: (d) => d.criteria.haemoptysis === 'no'
  },

  // ─── CRITERION 6: NO RECENT SURGERY OR TRAUMA ─────────────────────
  {
    id: 'R-NO-RECENT-SURGERY-TRAUMA-01',
    number: 6,
    criterion: 'no-recent-surgery-trauma',
    label: 'No recent surgery or trauma',
    category: 'history',
    description: 'No surgery or trauma requiring general anaesthesia within the past 4 weeks',
    evaluate: (d) => d.criteria.recentSurgeryOrTrauma === 'no'
  },

  // ─── CRITERION 7: NO PRIOR DVT / PE ───────────────────────────────
  {
    id: 'R-NO-PRIOR-DVT-PE-01',
    number: 7,
    criterion: 'no-prior-dvt-pe',
    label: 'No prior DVT or PE',
    category: 'history',
    description: 'No prior deep vein thrombosis or pulmonary embolism',
    evaluate: (d) => d.criteria.priorVenousThromboembolism === 'no'
  },

  // ─── CRITERION 8: NO EXOGENOUS OESTROGEN ──────────────────────────
  {
    id: 'R-NO-OESTROGEN-USE-01',
    number: 8,
    criterion: 'no-oestrogen-use',
    label: 'No exogenous oestrogen',
    category: 'history',
    description: 'No exogenous oestrogen use (oral contraceptive or HRT)',
    evaluate: (d) => d.criteria.oestrogenUse === 'no'
  }
];

window.PulmonaryEmbolismRuleOutCriteria.percRules = percRules;
})();
