import { validationRules } from './validation-rules.js';

// Discharge summary completeness validator. Pure functions: take an
// `AssessmentData` object, return the per-rule audit trail and the
// overall completeness level.
//
// Completeness cutoffs (NICE NG27):
//   All mandatory rules satisfied + all optional rules satisfied -> Complete
//   All mandatory rules satisfied + some optional rules missing  -> Partial
//   Any mandatory rule unsatisfied                                -> Incomplete

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').CompletenessLevel} CompletenessLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Validate the discharge summary against all NICE NG27 rules.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   completenessLevel: CompletenessLevel,
 *   mandatorySatisfied: number,
 *   mandatoryTotal: number,
 *   optionalSatisfied: number,
 *   optionalTotal: number,
 *   firedRules: FiredRule[]
 * }}
 */
function validateDischarge(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let mandatorySatisfied = 0;
  let mandatoryTotal = 0;
  let optionalSatisfied = 0;
  let optionalTotal = 0;

  for (const rule of validationRules) {
    let satisfied = false;
    try {
      satisfied = rule.evaluate(data) === true;
    } catch (e) {
      console.warn(`Validation rule ${rule.id} evaluation failed:`, e);
      satisfied = false;
    }
    if (rule.mandatory) {
      mandatoryTotal++;
      if (satisfied) mandatorySatisfied++;
    } else {
      optionalTotal++;
      if (satisfied) optionalSatisfied++;
    }
    firedRules.push({
      id: rule.id,
      category: rule.category,
      description: rule.description,
      mandatory: rule.mandatory,
      satisfied
    });
  }

  /** @type {CompletenessLevel} */
  let completenessLevel;
  if (mandatorySatisfied < mandatoryTotal) {
    completenessLevel = 'incomplete';
  } else if (optionalSatisfied < optionalTotal) {
    completenessLevel = 'partial';
  } else {
    completenessLevel = 'complete';
  }

  return {
    completenessLevel,
    mandatorySatisfied,
    mandatoryTotal,
    optionalSatisfied,
    optionalTotal,
    firedRules
  };
}

export { validateDischarge };
