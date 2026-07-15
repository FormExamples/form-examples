import { auditcRules } from './rules.js';

// AUDIT-C grader. Pure functions: take an `AssessmentData` object, evaluate the
// three consumption-item rules in `auditcRules`, award each item its 0-4 point
// value, sum the total (0-12), and derive the risk band and positive-screen
// indicator against the >= 5 UK cut-off.
//
// Grading algorithm (spec §4):
//   frequencyOfDrinkingPoint   = frequencyOfDrinking   != null ? frequencyOfDrinking   : 0
//   typicalQuantityPoint       = typicalQuantity       != null ? typicalQuantity       : 0
//   heavyEpisodeFrequencyPoint = heavyEpisodeFrequency != null ? heavyEpisodeFrequency : 0
//   auditcScore = sum (0..12)
//   riskBand =
//       auditcScore >= 11 ? 'possible-dependence'
//     : auditcScore >=  8 ? 'higher'
//     : auditcScore >=  5 ? 'increasing'
//     :                     'lower'
//   positiveScreen = auditcScore >= 5
//
// A missing item input ('' / null) contributes 0 points; `flags.js` raises a
// data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredItem} FiredItem
 */

/**
 * Evaluate the three consumption-item rules and collect one fired record per
 * item, carrying the awarded 0-4 point value.
 * @param {AssessmentData} data
 * @returns {FiredItem[]}
 */
function evaluateItems(data) {
  /** @type {FiredItem[]} */
  const fired = [];
  for (const rule of auditcRules) {
    try {
      const points = rule.points(data);
      fired.push({
        id: rule.id,
        item: rule.item,
        points: points,
        category: rule.category,
        description: rule.description
      });
    } catch (e) {
      console.warn(`AUDIT-C rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Derive the risk band from a total AUDIT-C score (0-12).
 * @param {number} auditcScore
 * @returns {RiskBand}
 */
function bandForScore(auditcScore) {
  if (auditcScore >= 11) return 'possible-dependence';
  if (auditcScore >= 8) return 'higher';
  if (auditcScore >= 5) return 'increasing';
  return 'lower';
}

/**
 * Compute the full AUDIT-C grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ frequencyOfDrinkingPoint: number, typicalQuantityPoint: number,
 *             heavyEpisodeFrequencyPoint: number, auditcScore: number,
 *             riskBand: RiskBand, positiveScreen: boolean,
 *             firedItems: FiredItem[] }}
 */
function calculateAuditcGrade(data) {
  const firedItems = evaluateItems(data);
  const pointFor = (item) => {
    const hit = firedItems.find((f) => f.item === item);
    return hit ? hit.points : 0;
  };

  const frequencyOfDrinkingPoint = pointFor('frequency-of-drinking');
  const typicalQuantityPoint = pointFor('typical-quantity');
  const heavyEpisodeFrequencyPoint = pointFor('heavy-episode-frequency');

  const auditcScore =
    frequencyOfDrinkingPoint +
    typicalQuantityPoint +
    heavyEpisodeFrequencyPoint;

  const riskBand = bandForScore(auditcScore);
  const positiveScreen = auditcScore >= 5;

  // Record the derived risk-band decision as a `total` audit row, mirroring the
  // grade_rule table's `total` parameter.
  firedItems.push({
    id: 'R-TOTAL-BAND-01',
    item: 'total',
    points: 0,
    category: 'total-band',
    description:
      positiveScreen
        ? `AUDIT-C ${auditcScore} of 12 (>= 5) — positive screen (${riskBand})`
        : `AUDIT-C ${auditcScore} of 12 — below the positive-screen cut of 5 (lower risk)`
  });

  return {
    frequencyOfDrinkingPoint,
    typicalQuantityPoint,
    heavyEpisodeFrequencyPoint,
    auditcScore,
    riskBand,
    positiveScreen,
    firedItems
  };
}

export { evaluateItems, bandForScore, calculateAuditcGrade };
