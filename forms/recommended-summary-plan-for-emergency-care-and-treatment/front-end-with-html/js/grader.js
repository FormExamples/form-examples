// ReSPECT completeness grader. Pure functions: take a `RespectPlan` object,
// evaluate the eight mandatory rules in `mandatoryRules`, and derive the
// documentation status and completeness percentage.
//
// Grading algorithm (spec §4):
//   firedRules     = each mandatory rule with { satisfied: boolean }
//   satisfiedCount = count(rules where satisfied)
//   status              = satisfiedCount === 8 ? 'complete' : 'incomplete'
//   completenessPercent = round(100 * presentSlots / applicableSlots)
//
// There is NO numeric clinical score. `completenessPercent` counts populated
// mandatory fields (via `completenessSlots`), reported for both statuses so an
// incomplete plan still shows progress. The capacity proxy slot is conditional
// and only enters the denominator when the person lacks capacity.

/**
 * @typedef {import('./types.js').RespectPlan} RespectPlan
 * @typedef {import('./types.js').Status} Status
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via
// window.RecommendedSummaryPlanForEmergencyCareAndTreatment.
(function () {
'use strict';
window.RecommendedSummaryPlanForEmergencyCareAndTreatment =
  window.RecommendedSummaryPlanForEmergencyCareAndTreatment || {};
const { mandatoryRules, completenessSlots } =
  window.RecommendedSummaryPlanForEmergencyCareAndTreatment;

/**
 * Evaluate the eight mandatory rules against the plan.
 * @param {RespectPlan} plan
 * @returns {FiredRule[]}
 */
function evaluateRules(plan) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of mandatoryRules) {
    let satisfied = false;
    try {
      satisfied = rule.evaluate(plan) === true;
    } catch (e) {
      console.warn(`ReSPECT rule ${rule.id} evaluation failed:`, e);
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
 * Compute the completeness percentage (0..100) from the field-slots.
 * A slot contributes to the denominator only when it applies (all slots apply
 * except the conditional capacity-proxy slot, which applies only when the
 * person lacks capacity).
 * @param {RespectPlan} plan
 * @returns {number}
 */
function completenessPercent(plan) {
  let applicable = 0;
  let present = 0;
  for (const slot of completenessSlots) {
    const applies = slot.applies ? slot.applies(plan) === true : true;
    if (!applies) continue;
    applicable++;
    if (slot.present(plan) === true) present++;
  }
  if (applicable === 0) return 0;
  return Math.round((100 * present) / applicable);
}

/**
 * Compute the full completeness grade for the supplied plan.
 * @param {RespectPlan} plan
 * @returns {{ status: Status, completenessPercent: number,
 *             satisfiedCount: number, mandatoryCount: number,
 *             firedRules: FiredRule[] }}
 */
function gradePlan(plan) {
  const firedRules = evaluateRules(plan);
  const satisfiedCount = firedRules.filter((r) => r.satisfied).length;
  const mandatoryCount = firedRules.length;
  /** @type {Status} */
  const status = satisfiedCount === mandatoryCount ? 'complete' : 'incomplete';
  return {
    status,
    completenessPercent: completenessPercent(plan),
    satisfiedCount,
    mandatoryCount,
    firedRules
  };
}

Object.assign(window.RecommendedSummaryPlanForEmergencyCareAndTreatment, {
  evaluateRules,
  completenessPercent,
  gradePlan
});
})();
