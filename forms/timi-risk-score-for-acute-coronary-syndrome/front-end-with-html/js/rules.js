// Declarative TIMI UA/NSTEMI grading rules.
//
// The TIMI risk score has exactly seven scored criteria, each worth 0 or 1
// point. Each rule below evaluates the patient data and returns true when its
// criterion is positive; the grader (`grader.js`) sums the points into the
// total TIMI score (0-7), derives the risk band, and looks up the 14-day
// composite-event risk. Rows here mirror the
// `timi_risk_score_for_acute_coronary_syndrome_grade_rule` SQL table
// (rule_id, criterion, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} TimiRule
 * @property {string} id
 * @property {string} criterion   - age | risk-factors | known-cad | aspirin | angina | st-deviation | cardiac-marker
 * @property {number} points      - point contributed when the rule fires (1)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.TimiRiskScoreForAcuteCoronarySyndrome.
(function () {
'use strict';
window.TimiRiskScoreForAcuteCoronarySyndrome =
  window.TimiRiskScoreForAcuteCoronarySyndrome || {};

/** @type {TimiRule[]} */
const timiRules = [
  // ─── CRITERION 1: AGE >= 65 ───────────────────────────────────
  {
    id: 'R-AGE-OVER-65-01',
    criterion: 'age',
    points: 1,
    category: 'timi-criterion',
    description: 'Age 65 years or older',
    evaluate: (d) => d.riskProfile.ageOver65 === 'yes'
  },

  // ─── CRITERION 2: >= 3 CORONARY RISK FACTORS ──────────────────
  {
    id: 'R-RISK-FACTORS-01',
    criterion: 'risk-factors',
    points: 1,
    category: 'timi-criterion',
    description:
      'Three or more coronary risk factors (hypertension, hypercholesterolaemia, diabetes, current smoking, family history of premature CAD)',
    evaluate: (d) => d.riskProfile.threeOrMoreCadRiskFactors === 'yes'
  },

  // ─── CRITERION 3: KNOWN CORONARY ARTERY DISEASE ───────────────
  {
    id: 'R-KNOWN-CAD-01',
    criterion: 'known-cad',
    points: 1,
    category: 'timi-criterion',
    description: 'Known coronary artery disease (prior stenosis >= 50%)',
    evaluate: (d) => d.cardiacHistory.knownCadStenosis === 'yes'
  },

  // ─── CRITERION 4: ASPIRIN USE IN PRIOR 7 DAYS ─────────────────
  {
    id: 'R-ASPIRIN-01',
    criterion: 'aspirin',
    points: 1,
    category: 'timi-criterion',
    description: 'Aspirin use in the prior 7 days',
    evaluate: (d) => d.cardiacHistory.aspirinUsePrior7Days === 'yes'
  },

  // ─── CRITERION 5: SEVERE RECENT ANGINA ────────────────────────
  {
    id: 'R-ANGINA-01',
    criterion: 'angina',
    points: 1,
    category: 'timi-criterion',
    description: 'At least two anginal episodes in the prior 24 hours',
    evaluate: (d) => d.presentation.twoOrMoreAnginaEpisodes24h === 'yes'
  },

  // ─── CRITERION 6: ST DEVIATION ────────────────────────────────
  {
    id: 'R-ST-DEVIATION-01',
    criterion: 'st-deviation',
    points: 1,
    category: 'timi-criterion',
    description: 'ST-segment deviation >= 0.5 mm on the presenting ECG',
    evaluate: (d) => d.investigations.stDeviation === 'yes'
  },

  // ─── CRITERION 7: POSITIVE CARDIAC MARKER ─────────────────────
  {
    id: 'R-CARDIAC-MARKER-01',
    criterion: 'cardiac-marker',
    points: 1,
    category: 'timi-criterion',
    description: 'Positive cardiac marker (elevated troponin or CK-MB)',
    evaluate: (d) => d.investigations.positiveCardiacMarker === 'yes'
  }
];

window.TimiRiskScoreForAcuteCoronarySyndrome.timiRules = timiRules;
})();
