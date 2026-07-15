import { completenessSlots, mandatoryRules } from './rules.js';

// Child Safeguarding Referral grader. Pure functions: take a
// `SafeguardingReferral` object, evaluate the mandatory rules in
// `mandatoryRules`, and derive the completeness status, completeness
// percentage, and urgency classification.
//
// Grading algorithm (spec §4):
//   firedRules     = each mandatory rule with { satisfied: boolean }
//   mandatoryOk    = every mandatory rule satisfied (name/contact, child id,
//                    concern, primary category, immediate-danger answer, and a
//                    consent / information-sharing basis)
//   status         = !mandatoryOk                 ? 'incomplete'
//                  : allRecommendedPresent        ? 'complete'
//                  :                                'partial'
//   completenessPercent = round(100 * presentSlots / applicableSlots)
//
//   urgency = immediateDanger == 'yes'                       ? 'emergency'
//           : primaryCategory == 'sexual'
//             || childDisclosed == 'yes'
//             || allegedPersonInContact == 'yes'
//             || otherChildrenAtRisk == 'yes'                ? 'urgent'
//           :                                                  'standard'
//
// There is NO numeric clinical score. Urgency is ALWAYS computed — even when the
// referral is `incomplete` — so danger is never hidden by an incomplete form.
// `emergency` maps to the s47 + emergency-services pathway, `urgent` to a s47
// enquiry, `standard` to a s17 assessment.

/**
 * @typedef {import('./types.js').SafeguardingReferral} SafeguardingReferral
 * @typedef {import('./types.js').Status} Status
 * @typedef {import('./types.js').Urgency} Urgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Evaluate the mandatory rules against the referral.
 * @param {SafeguardingReferral} referral
 * @returns {FiredRule[]}
 */
function evaluateRules(referral) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of mandatoryRules) {
    let satisfied = false;
    try {
      satisfied = rule.evaluate(referral) === true;
    } catch (e) {
      console.warn(`Safeguarding rule ${rule.id} evaluation failed:`, e);
    }
    fired.push({
      id: rule.id,
      rule: rule.rule,
      satisfied,
      category: rule.category,
      description: rule.description
    });
  }
  return fired;
}

/**
 * Count populated completeness slots over the slots that apply. A slot
 * contributes to the denominator only when it applies (all slots apply except
 * the conditional unsafe-to-inform-reason slot, which applies only when the
 * child / family are recorded as unaware).
 * @param {SafeguardingReferral} referral
 * @returns {{ presentCount: number, applicableCount: number,
 *             completenessPercent: number, allRecommendedPresent: boolean }}
 */
function completeness(referral) {
  let applicable = 0;
  let present = 0;
  for (const slot of completenessSlots) {
    const applies = slot.applies ? slot.applies(referral) === true : true;
    if (!applies) continue;
    applicable++;
    if (slot.present(referral) === true) present++;
  }
  const completenessPercent = applicable === 0 ? 0 : Math.round((100 * present) / applicable);
  return {
    presentCount: present,
    applicableCount: applicable,
    completenessPercent,
    allRecommendedPresent: applicable > 0 && present === applicable
  };
}

/**
 * Classify the urgency of the referral. Always computed, regardless of
 * completeness, so immediate danger is never hidden behind a partial form.
 * @param {SafeguardingReferral} referral
 * @returns {Urgency}
 */
function classifyUrgency(referral) {
  if (referral.risk.immediateDanger === 'yes') return 'emergency';
  const additionalSexual = /(^|[,;\s])sexual($|[,;\s])/i.test(
    referral.category.additionalCategories || ''
  );
  if (
    referral.category.primaryCategory === 'sexual' ||
    additionalSexual ||
    referral.concern.childDisclosed === 'yes' ||
    referral.risk.allegedPersonInContact === 'yes' ||
    referral.risk.otherChildrenAtRisk === 'yes'
  ) {
    return 'urgent';
  }
  return 'standard';
}

/**
 * Compute the full completeness grade and urgency for the supplied referral.
 * @param {SafeguardingReferral} referral
 * @returns {{ status: Status, urgency: Urgency, completenessPercent: number,
 *             presentCount: number, applicableCount: number,
 *             satisfiedCount: number, mandatoryCount: number,
 *             firedRules: FiredRule[] }}
 */
function gradeReferral(referral) {
  const firedRules = evaluateRules(referral);
  const satisfiedCount = firedRules.filter((r) => r.satisfied).length;
  const mandatoryCount = firedRules.length;
  const mandatoryOk = satisfiedCount === mandatoryCount;

  const c = completeness(referral);

  /** @type {Status} */
  let status;
  if (!mandatoryOk) {
    status = 'incomplete';
  } else if (c.allRecommendedPresent) {
    status = 'complete';
  } else {
    status = 'partial';
  }

  return {
    status,
    urgency: classifyUrgency(referral),
    completenessPercent: c.completenessPercent,
    presentCount: c.presentCount,
    applicableCount: c.applicableCount,
    satisfiedCount,
    mandatoryCount,
    firedRules
  };
}

export { evaluateRules, completeness, classifyUrgency, gradeReferral };
