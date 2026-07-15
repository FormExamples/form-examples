// Declarative Ottawa Knee Rule decision rules.
//
// The Ottawa Knee Rule has five objective bedside criteria. Each rule below
// evaluates the patient data and returns true when its criterion is PRESENT.
// This is a DECISION RULE, not a score: the grader (`grader.js`) applies ANY-of
// (logical OR) logic — a knee radiograph is indicated when at least one
// criterion fires. There are no points and no total.
//
// Criterion 2 is special: patellar tenderness indicates imaging ONLY when it is
// isolated, i.e. there is no other bony tenderness. Patellar tenderness WITH
// other bony tenderness does NOT fire this criterion (though the other bony
// tenderness is surfaced as a flagged issue by `flags.js`).
//
// Rows here mirror the `ottawa_knee_rule_grade_rule` SQL table
// (rule_id, criterion, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} OttawaRule
 * @property {string} id
 * @property {string} criterion   - criterion slug
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/** @type {OttawaRule[]} */
const ottawaRules = [
  // ─── CRITERION 1: AGE >= 55 ───────────────────────────────────
  {
    id: 'R-AGE-01',
    criterion: 'age',
    category: 'age',
    description: 'Age 55 years or older',
    evaluate: (d) => d.age.ageYears != null && d.age.ageYears >= 55
  },

  // ─── CRITERION 2: ISOLATED PATELLAR TENDERNESS ────────────────
  // Fires only when patellar tenderness is present AND there is no other
  // bony tenderness (isolation). Both inputs must be answered for the
  // criterion to fire.
  {
    id: 'R-ISOLATED-PATELLAR-01',
    criterion: 'isolated-patellar-tenderness',
    category: 'bony-tenderness',
    description:
      'Isolated tenderness of the patella (patellar tenderness with no other bony tenderness of the knee)',
    evaluate: (d) =>
      d.tenderness.patellarTenderness === 'yes' &&
      d.tenderness.otherBonyTenderness === 'no'
  },

  // ─── CRITERION 3: FIBULAR HEAD TENDERNESS ─────────────────────
  {
    id: 'R-FIBULAR-HEAD-01',
    criterion: 'fibular-head-tenderness',
    category: 'bony-tenderness',
    description: 'Tenderness at the head of the fibula',
    evaluate: (d) => d.tenderness.fibularHeadTenderness === 'yes'
  },

  // ─── CRITERION 4: UNABLE TO FLEX TO 90 DEGREES ────────────────
  {
    id: 'R-FLEXION-01',
    criterion: 'flexion',
    category: 'range-of-motion',
    description: 'Inability to flex the knee to 90 degrees',
    evaluate: (d) => d.flexion.unableToFlex90 === 'yes'
  },

  // ─── CRITERION 5: UNABLE TO BEAR WEIGHT ───────────────────────
  {
    id: 'R-WEIGHT-BEARING-01',
    criterion: 'weight-bearing',
    category: 'weight-bearing',
    description:
      'Inability to bear weight — take four steps (transferring weight twice onto each leg) — both immediately after the injury and in the emergency department',
    evaluate: (d) => d.weightBearing.unableToBearWeight === 'yes'
  }
];

export { ottawaRules };
