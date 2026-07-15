import { fouratRules } from './rules.js';

// 4AT grader. Pure functions: take an `AssessmentData` object, evaluate the
// scoring rules in `fouratRules`, group fired rules by item to award each item
// its points, sum the total (0-12), and derive the interpretation band.
//
// Grading algorithm (spec §4):
//   item1Score = alertness === 'abnormal'                       ? 4 : 0
//   item2Score = amt4 oneMistake -> 1, twoOrMoreOrUntestable -> 2, else 0
//   item3Score = attention startsButUnderSevenOrRefuses -> 1,
//                          untestable -> 2, else 0
//   item4Score = acuteChange === 'yes'                          ? 4 : 0
//   totalScore = item1 + item2 + item3 + item4  (0..12)
//   band = totalScore >= 4 ? 'possibleDelirium'
//        : totalScore >= 1 ? 'possibleCognitiveImpairment'
//        : 'unlikely'
//
// An unanswered item contributes 0 points (absent, not positive); `flags.js`
// raises the incomplete-acute-change flag separately when item 4 information
// could not be reliably established.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').InterpretationBand} InterpretationBand
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.FourATestForDelirium.

/**
 * Evaluate the scoring rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredRule[]}
 */
function evaluateRules(data) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of fouratRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          item: rule.item,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`4AT rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full 4AT grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ item1Score: 0|4, item2Score: 0|1|2, item3Score: 0|1|2,
 *             item4Score: 0|4, totalScore: number,
 *             interpretationBand: InterpretationBand,
 *             firedRules: FiredRule[] }}
 */
function calculateFourATGrade(data) {
  const firedRules = evaluateRules(data);
  const pointsFor = (item) =>
    firedRules
      .filter((f) => f.item === item)
      .reduce((sum, f) => sum + f.points, 0);

  const item1Score = pointsFor('alertness');       // 0 or 4
  const item2Score = pointsFor('amt4');             // 0, 1, or 2
  const item3Score = pointsFor('attention');        // 0, 1, or 2
  const item4Score = pointsFor('acute-change');     // 0 or 4

  const totalScore = item1Score + item2Score + item3Score + item4Score;

  /** @type {InterpretationBand} */
  const interpretationBand =
    totalScore >= 4 ? 'possibleDelirium'
    : totalScore >= 1 ? 'possibleCognitiveImpairment'
    : 'unlikely';

  // Record the derived interpretation as a `band` audit row, mirroring the
  // grade_rule table's `band` item.
  firedRules.push({
    id: 'R-BAND-01',
    item: 'band',
    points: 0,
    category: 'interpretation-band',
    description:
      totalScore >= 4
        ? 'Total 4 or more — possible delirium; prompt full clinical assessment'
        : totalScore >= 1
          ? 'Total 1-3 — possible cognitive impairment; further cognitive testing'
          : 'Total 0 — delirium or severe cognitive impairment unlikely'
  });

  return {
    item1Score,
    item2Score,
    item3Score,
    item4Score,
    totalScore,
    interpretationBand,
    firedRules
  };
}

export { evaluateRules, calculateFourATGrade };
