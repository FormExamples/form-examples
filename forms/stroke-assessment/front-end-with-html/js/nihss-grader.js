import { nihssItems } from './nihss-rules.js';
import { nihssCategory } from './types.js';

// NIHSS grader. Pure functions: take an `AssessmentData` object and produce
// the total NIHSS score (0-42), its category label, and the list of fired
// rules (NIHSS items that contributed any non-zero score). Items left
// unanswered are excluded from both the total and the audit trail.
//
// NIHSS Score categories:
//   0     -> No stroke symptoms
//   1-4   -> Minor stroke
//   5-15  -> Moderate stroke
//   16-20 -> Moderate to severe stroke
//   21-42 -> Severe stroke

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Calculate the NIHSS score from patient assessment data.
 * @param {AssessmentData} data
 * @returns {{ nihssScore: number, nihssCategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateNIHSS(data) {
  
  /** @type {FiredRule[]} */
  const firedRules = [];

  // Aligned 1:1 with nihssItems[] order.
  const scores = [
    data.levelOfConsciousness.loc,
    data.levelOfConsciousness.locQuestions,
    data.levelOfConsciousness.locCommands,
    data.bestGazeVisual.bestGaze,
    data.bestGazeVisual.visual,
    data.facialPalsy.facialPalsy,
    data.facialPalsy.leftArm,
    data.facialPalsy.rightArm,
    data.facialPalsy.leftLeg,
    data.facialPalsy.rightLeg,
    data.limbAtaxiaSensory.limbAtaxia,
    data.limbAtaxiaSensory.sensory,
    data.languageDysarthria.bestLanguage,
    data.languageDysarthria.dysarthria,
    data.extinctionInattention.extinctionInattention
  ];

  let nihssScore = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score === null || score === undefined) continue;
    nihssScore += score;
    if (score > 0) {
      const item = nihssItems[i];
      firedRules.push({
        id: item.id,
        domain: item.domain,
        description: item.text,
        score
      });
    }
  }

  const nihssCategoryLabel = nihssCategory(nihssScore);

  return { nihssScore, nihssCategoryLabel, firedRules };
}

export { calculateNIHSS };
