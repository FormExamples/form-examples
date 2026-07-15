import { timiRules } from './rules.js';
import { FOURTEEN_DAY_RISK_PERCENT } from './types.js';

// TIMI UA/NSTEMI grader. Pure functions: take an `AssessmentData` object,
// evaluate the seven criterion rules in `timiRules`, award 0 or 1 point each,
// sum the total (0-7), derive the risk band, and look up the 14-day
// composite-event risk.
//
// Grading algorithm (spec §4):
//   agePoint           = ageOver65                  == 'yes' ? 1 : 0
//   riskFactorPoint    = threeOrMoreCadRiskFactors  == 'yes' ? 1 : 0
//   knownCadPoint      = knownCadStenosis           == 'yes' ? 1 : 0
//   aspirinPoint       = aspirinUsePrior7Days       == 'yes' ? 1 : 0
//   anginaPoint        = twoOrMoreAnginaEpisodes24h == 'yes' ? 1 : 0
//   stDeviationPoint   = stDeviation                == 'yes' ? 1 : 0
//   cardiacMarkerPoint = positiveCardiacMarker      == 'yes' ? 1 : 0
//   timiScore = sum (0..7)
//   riskBand  = timiScore <= 1 ? 'low' : timiScore <= 4 ? 'intermediate' : 'high'
//   fourteenDayRiskPercent = lookup(timiScore)
//
// A missing enum input ('') counts as absent (0 points) for its criterion;
// `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

/**
 * Evaluate the seven TIMI criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of timiRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          criterion: rule.criterion,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`TIMI rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Derive the risk band from the total TIMI score.
 * @param {number} timiScore
 * @returns {RiskBand}
 */
function deriveRiskBand(timiScore) {
  if (timiScore <= 1) return 'low';
  if (timiScore <= 4) return 'intermediate';
  return 'high';
}

/**
 * Compute the full TIMI grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ agePoint: 0|1, riskFactorPoint: 0|1, knownCadPoint: 0|1,
 *             aspirinPoint: 0|1, anginaPoint: 0|1, stDeviationPoint: 0|1,
 *             cardiacMarkerPoint: 0|1, timiScore: number, riskBand: RiskBand,
 *             fourteenDayRiskPercent: number, firedCriteria: FiredCriterion[] }}
 */
function calculateTimiGrade(data) {
  const firedCriteria = evaluateCriteria(data);
  const has = (criterion) =>
    firedCriteria.some((f) => f.criterion === criterion);

  const agePoint = has('age') ? 1 : 0;
  const riskFactorPoint = has('risk-factors') ? 1 : 0;
  const knownCadPoint = has('known-cad') ? 1 : 0;
  const aspirinPoint = has('aspirin') ? 1 : 0;
  const anginaPoint = has('angina') ? 1 : 0;
  const stDeviationPoint = has('st-deviation') ? 1 : 0;
  const cardiacMarkerPoint = has('cardiac-marker') ? 1 : 0;

  const timiScore =
    agePoint + riskFactorPoint + knownCadPoint + aspirinPoint +
    anginaPoint + stDeviationPoint + cardiacMarkerPoint;

  const riskBand = deriveRiskBand(timiScore);
  const fourteenDayRiskPercent = FOURTEEN_DAY_RISK_PERCENT[timiScore];

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` criterion.
  firedCriteria.push({
    id: 'R-BAND-01',
    criterion: 'band',
    points: 0,
    category: 'risk-band',
    description:
      `TIMI ${timiScore} of 7 — ${riskBand} risk band; ` +
      `~${fourteenDayRiskPercent}% 14-day risk of death, MI, or urgent revascularisation`
  });

  return {
    agePoint,
    riskFactorPoint,
    knownCadPoint,
    aspirinPoint,
    anginaPoint,
    stDeviationPoint,
    cardiacMarkerPoint,
    timiScore,
    riskBand,
    fourteenDayRiskPercent,
    firedCriteria
  };
}

export { evaluateCriteria, deriveRiskBand, calculateTimiGrade };
