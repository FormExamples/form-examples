// EPDS grader. Pure functions: take an `AssessmentData` object, convert each
// item's raw selected option into its 0-3 symptom score (applying reverse
// scoring for items 3, 5, 6, 7, 8, 9 and 10 via `rules.js`), sum the ten
// scores into a 0-30 total, and derive the interpretation band and the
// item-10 self-harm safety flag.
//
// Grading algorithm (spec §4):
//   itemScores[i] = scoreForOption(direction_i, rawOption_i)   // each 0..3, null -> 0
//   totalScore    = sum of itemScores over answered items      // 0..30
//   band          = totalScore >= 13 ? 'likely'
//                 : totalScore >= 10 ? 'possible'
//                 :                    'lower'
//   item10Score   = scoreForOption('reverse', item10)          // 0..3
//   selfHarmFlag  = item10Score != null && item10Score > 0     // INDEPENDENT of total
//
// A missing item response contributes 0 to the total (absent, not zero-symptom)
// and `flags.js` raises a data-completeness flag separately. `selfHarmFlag` is
// evaluated regardless of the total and always drives the urgent flagged issue.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Band} Band
 * @typedef {import('./types.js').FiredItem} FiredItem
 */

// Wrapped in an IIFE; published via window.EdinburghPostnatalDepressionScale.
(function () {
'use strict';
window.EdinburghPostnatalDepressionScale =
  window.EdinburghPostnatalDepressionScale || {};
const { epdsItems, scoreForOption } = window.EdinburghPostnatalDepressionScale;

/**
 * Compute the ten reverse-corrected item scores. Unanswered items map to null.
 * @param {AssessmentData} data
 * @returns {(number | null)[]}  ten entries, each 0..3 or null
 */
function computeItemScores(data) {
  return epdsItems.map((item) =>
    scoreForOption(item.direction, data.items[item.field])
  );
}

/**
 * Compute the full EPDS grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ itemScores: number[], totalScore: number, band: Band,
 *             item10Score: number, selfHarmFlag: boolean,
 *             firedItems: FiredItem[] }}
 */
function calculateEpdsGrade(data) {
  const rawScores = computeItemScores(data);

  // For the total, a missing item contributes 0.
  const itemScores = rawScores.map((s) => (s === null ? 0 : s));
  const totalScore = itemScores.reduce((sum, s) => sum + s, 0);

  /** @type {Band} */
  const band =
    totalScore >= 13 ? 'likely'
    : totalScore >= 10 ? 'possible'
    : 'lower';

  const item10Score = itemScores[9];
  const selfHarmFlag = rawScores[9] !== null && rawScores[9] > 0;

  // Anxiety subscale (EPDS-3A): items 3, 4 and 5 (spec §5).
  const anxietySubscale = itemScores[2] + itemScores[3] + itemScores[4];

  /** @type {FiredItem[]} */
  const firedItems = [];

  // One audit row per item that contributed points.
  epdsItems.forEach((item, i) => {
    const score = itemScores[i];
    if (score > 0) {
      firedItems.push({
        id: `R-ITEM-${item.number}-SCORE`,
        parameter: 'item',
        points: score,
        category: 'item-score',
        description:
          `Item ${item.number} (${item.statement}) scored ${score} of 3` +
          (item.direction === 'reverse' ? ' (reverse-scored)' : '')
      });
    }
  });

  // Total audit row.
  firedItems.push({
    id: 'R-TOTAL-SCORE',
    parameter: 'total',
    points: totalScore,
    category: 'total-score',
    description: `Summed EPDS total ${totalScore} of 30`
  });

  // Band audit row.
  firedItems.push({
    id: 'R-BAND',
    parameter: 'band',
    points: 0,
    category: 'band-threshold',
    description:
      band === 'likely'
        ? 'Total >= 13 — likely depression band'
        : band === 'possible'
          ? 'Total >= 10 and < 13 — possible depression band'
          : 'Total < 10 — lower-likelihood band'
  });

  // Self-harm audit row (only when item 10 is positive).
  if (selfHarmFlag) {
    firedItems.push({
      id: 'R-ITEM-10-SELF-HARM',
      parameter: 'self-harm',
      points: item10Score,
      category: 'safety',
      description:
        `Item 10 (thoughts of self-harm) scored ${item10Score} of 3 — ` +
        'mandatory self-harm flag regardless of the total score'
    });
  }

  // Anxiety-subscale audit row (only when elevated).
  if (anxietySubscale >= 4) {
    firedItems.push({
      id: 'R-ANXIETY-SUBSCALE',
      parameter: 'anxiety-subscale',
      points: anxietySubscale,
      category: 'anxiety-subscale',
      description:
        `Anxiety subscale (items 3, 4, 5) scored ${anxietySubscale} of 9 ` +
        '(EPDS-3A >= 4)'
    });
  }

  return {
    itemScores,
    totalScore,
    band,
    item10Score,
    selfHarmFlag,
    firedItems
  };
}

Object.assign(window.EdinburghPostnatalDepressionScale, {
  computeItemScores,
  calculateEpdsGrade
});
})();
