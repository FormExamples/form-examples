import { tinettiBalanceItems, tinettiGaitItems } from './tinetti-rules.js';
import { tinettiCategory } from './types.js';

// Tinetti grader. Pure functions: take an `AssessmentData` object, return
// the total Tinetti score (0-28), the balance subscore (0-16), the gait
// subscore (0-12), the risk-category label, and the list of fired rules
// (items where the patient scored above zero).
//
// Tinetti Total Score (0-28):
//   25-28 = Low fall risk
//   19-24 = Moderate fall risk
//   0-18  = High fall risk

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.MobilityAssessment.

/**
 * Calculate Tinetti score from assessment data.
 * @param {AssessmentData} data
 * @returns {{ tinettiTotal: number, balanceScore: number, gaitScore: number,
 *            tinettiCategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateTinetti(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const bal = data.balanceAssessment;
  const gait = data.gaitAssessment;

  const balanceScores = [
    bal.sittingBalance,
    bal.risesFromChair,
    bal.attemptingToRise,
    bal.immediateStandingBalance,
    bal.standingBalance,
    bal.nudgedBalance,
    bal.eyesClosed,
    bal.turning360,
    bal.sittingDown
  ];

  const gaitScores = [
    gait.initiationOfGait,
    gait.stepLength,
    gait.stepHeight,
    gait.stepSymmetry,
    gait.stepContinuity,
    gait.path,
    gait.trunk,
    gait.walkingStance
  ];

  let balanceScore = 0;
  for (let i = 0; i < balanceScores.length; i++) {
    const score = balanceScores[i];
    if (score !== null && score !== undefined) {
      const item = tinettiBalanceItems[i];
      if (score > 0) {
        firedRules.push({
          id: item.id,
          domain: 'Balance',
          description: item.text,
          score
        });
      }
      balanceScore += score;
    }
  }

  let gaitScore = 0;
  for (let i = 0; i < gaitScores.length; i++) {
    const score = gaitScores[i];
    if (score !== null && score !== undefined) {
      const item = tinettiGaitItems[i];
      if (score > 0) {
        firedRules.push({
          id: item.id,
          domain: 'Gait',
          description: item.text,
          score
        });
      }
      gaitScore += score;
    }
  }

  const tinettiTotal = balanceScore + gaitScore;
  const tinettiCategoryLabel = tinettiCategory(tinettiTotal);

  return { tinettiTotal, balanceScore, gaitScore, tinettiCategoryLabel, firedRules };
}

export { calculateTinetti };
