import { ottawaRules, unableToBearWeight } from './rules.js';

// Ottawa Ankle / Foot Rules decision engine. Pure functions: take an
// `AssessmentData` object and apply the boolean decision rule (NO summation and
// NO risk band — this is a classification instrument). It derives "unable to
// bear weight", then combines each region's zone-of-pain precondition (AND) with
// its positive findings (OR) to produce two independent imaging decisions, along
// with the fired criteria that drove them.
//
// Decision algorithm (spec §4):
//   unableToBearWeight = ableToBearWeightImmediately == 'no'
//                        && ableToBearWeightNow == 'no'
//   ankleXrayIndicated = malleolarZonePain == 'yes'
//     && ( lateralMalleolusTenderness == 'yes'
//          || medialMalleolusTenderness == 'yes'
//          || unableToBearWeight )
//   footXrayIndicated  = midfootZonePain == 'yes'
//     && ( fifthMetatarsalBaseTenderness == 'yes'
//          || navicularTenderness == 'yes'
//          || unableToBearWeight )
//
// The two decisions are independent (ankle only, foot only, both, or neither is
// valid). `unableToBearWeight` feeds both. An unanswered ('') finding is treated
// as negative for the decision itself; `flags.js` raises a data-completeness
// flag separately so the decision is not silently understated.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.OttawaAnkleRules.

/**
 * Evaluate the six Ottawa criteria and collect the ones whose finding is
 * positive. Criteria A3 and F3 share the derived unable-to-bear-weight input,
 * so both fire together when weight-bearing is absent; the shared derivation is
 * flattened to a single 'both'-region row so the report reads cleanly.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  let weightRowAdded = false;

  for (const rule of ottawaRules) {
    try {
      if (!rule.evaluate(data)) continue;
      if (rule.criterion === 'unable-to-bear-weight') {
        // A3 and F3 collapse to a single 'both' row (feeds both decisions).
        if (weightRowAdded) continue;
        weightRowAdded = true;
        fired.push({
          id: 'A3/F3',
          region: 'both',
          criterion: rule.criterion,
          description: rule.description
        });
        continue;
      }
      fired.push({
        id: rule.id,
        region: rule.region,
        criterion: rule.criterion,
        description: rule.description
      });
    } catch (e) {
      console.warn(`Ottawa rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Ottawa Ankle / Foot decision for the supplied assessment.
 * @param {AssessmentData} data
 * @returns {{ unableToBearWeight: boolean, ankleXrayIndicated: boolean,
 *             footXrayIndicated: boolean, firedCriteria: FiredCriterion[] }}
 */
function calculateOttawaDecision(data) {
  const cannotBearWeight = unableToBearWeight(data);

  const ankleXrayIndicated =
    data.painZones.malleolarZonePain === 'yes' &&
    (data.ankleTenderness.lateralMalleolusTenderness === 'yes' ||
      data.ankleTenderness.medialMalleolusTenderness === 'yes' ||
      cannotBearWeight);

  const footXrayIndicated =
    data.painZones.midfootZonePain === 'yes' &&
    (data.footTenderness.fifthMetatarsalBaseTenderness === 'yes' ||
      data.footTenderness.navicularTenderness === 'yes' ||
      cannotBearWeight);

  const firedCriteria = evaluateCriteria(data);

  return {
    unableToBearWeight: cannotBearWeight,
    ankleXrayIndicated,
    footXrayIndicated,
    firedCriteria
  };
}

export { evaluateCriteria, calculateOttawaDecision };
