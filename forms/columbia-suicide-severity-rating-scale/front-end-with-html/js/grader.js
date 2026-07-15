import { cssrsRules } from './rules.js';

// C-SSRS grader. Pure functions, no I/O. C-SSRS is a status- and
// severity-classification instrument — NOT a summed score.
//
// Classification algorithm (spec §4):
//   ideationLevel = highest N in 1..5 whose ideation item == 'yes', else 0
//
//   suicidalBehaviourPresent =
//       actualAttempt == 'yes' || interruptedAttempt == 'yes'
//    || abortedAttempt == 'yes' || preparatoryActs == 'yes'
//   (non-suicidal self-injury does NOT count towards this)
//
//   recentBehaviour = suicidalBehaviourPresent && behaviourRecency == 'within-3-months'
//   highLethality   = (actualLethality != null && actualLethality >= 3)
//                  || (potentialLethality != null && potentialLethality == 2)
//
//   riskTier =
//       HIGH      if ideationLevel >= 4 || recentBehaviour || highLethality
//       MODERATE  else if ideationLevel == 3 || suicidalBehaviourPresent
//       LOW       otherwise    // ideationLevel 1-2 with no behaviour, or none
//
// A missing ideation item is treated as 'no' for levelling; `flags.js` raises a
// data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskTier} RiskTier
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

/** Management recommendation per risk tier (spec §4 tier table). */
const MANAGEMENT = {
  high:
    'Urgent / immediate psychiatric or crisis response. Do not leave the person alone; ensure safety; remove or restrict access to lethal means; complete a safety plan; arrange emergency mental-health evaluation per local protocol.',
  moderate:
    'Timely mental-health / behavioural evaluation; safety planning; means-restriction counselling; increased monitoring and defined follow-up.',
  low:
    'Supportive response; document; discuss with a clinician; provide crisis resources (e.g. helpline); routine follow-up and re-screen on any change.'
};

/**
 * Evaluate every C-SSRS rule and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of cssrsRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          criterion: rule.criterion,
          level: rule.level,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`C-SSRS rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full C-SSRS classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ ideationLevel: (0|1|2|3|4|5),
 *             suicidalBehaviourPresent: boolean, recentBehaviour: boolean,
 *             highLethality: boolean, riskTier: RiskTier,
 *             managementRecommendation: string,
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateCssrsGrade(data) {
  const firedCriteria = evaluateCriteria(data);

  // Highest affirmative ideation item sets the ordinal level (0-5).
  let ideationLevel = 0;
  for (const f of firedCriteria) {
    if (f.criterion === 'ideation' && f.level > ideationLevel) {
      ideationLevel = f.level;
    }
  }

  const b = data.behaviour;
  const suicidalBehaviourPresent =
    b.actualAttempt === 'yes' ||
    b.interruptedAttempt === 'yes' ||
    b.abortedAttempt === 'yes' ||
    b.preparatoryActs === 'yes';

  const recentBehaviour =
    suicidalBehaviourPresent && b.behaviourRecency === 'within-3-months';

  const al = data.lethality.actualLethality;
  const pl = data.lethality.potentialLethality;
  const highLethality =
    (al !== null && al >= 3) || (pl !== null && pl === 2);

  /** @type {RiskTier} */
  let riskTier;
  if (ideationLevel >= 4 || recentBehaviour || highLethality) {
    riskTier = 'high';
  } else if (ideationLevel === 3 || suicidalBehaviourPresent) {
    riskTier = 'moderate';
  } else {
    riskTier = 'low';
  }

  // Record the derived tier decision as a `tier` audit row, mirroring the
  // grade_rule table's `tier` criterion.
  firedCriteria.push({
    id: 'R-TIER-01',
    criterion: 'tier',
    level: 0,
    category: 'risk-tier',
    description:
      riskTier === 'high'
        ? `High risk tier — ideation level ${ideationLevel}${recentBehaviour ? ', recent suicidal behaviour' : ''}${highLethality ? ', high-lethality attempt' : ''}`
        : riskTier === 'moderate'
          ? `Moderate risk tier — ideation level ${ideationLevel}${suicidalBehaviourPresent ? ', non-recent suicidal behaviour' : ''}`
          : `Low risk tier — ideation level ${ideationLevel} with no suicidal behaviour`
  });

  return {
    ideationLevel,
    suicidalBehaviourPresent,
    recentBehaviour,
    highLethality,
    riskTier,
    managementRecommendation: MANAGEMENT[riskTier],
    firedCriteria
  };
}

export { evaluateCriteria, calculateCssrsGrade };
