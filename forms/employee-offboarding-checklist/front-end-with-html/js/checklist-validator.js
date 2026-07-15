import { validationRules } from './validation-rules.js';

// Pure offboarding checklist validator. Takes an `AssessmentData` object,
// returns the outcome (Complete / Partial / Incomplete), the completion
// percentage (0-100, based on mandatory items satisfied), the list of
// blocker items (mandatory + blocker rules that have fired), and the
// full list of fired rules.
//
// Outcome rules:
//   Incomplete — at least one mandatory blocker rule has fired.
//   Partial    — no mandatory blockers fired, but at least one rule
//                (mandatory or non-mandatory, non-blocker) is outstanding.
//   Complete   — every rule satisfied (no rule fired).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').Blocker} Blocker
 * @typedef {import('./types.js').Outcome} Outcome
 */

// Wrapped in an IIFE; published via window.EmployeeOffboardingChecklist.

/**
 * Validate an offboarding checklist.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   outcome: Outcome,
 *   completionPercent: number,
 *   blockers: Blocker[],
 *   firedRules: FiredRule[],
 *   mandatoryTotal: number,
 *   mandatorySatisfied: number
 * }}
 */
function validateChecklist(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {Blocker[]} */
  const blockers = [];

  let mandatoryTotal = 0;
  let mandatorySatisfied = 0;
  let anyOutstanding = false;
  let anyMandatoryBlockerOutstanding = false;

  for (const rule of validationRules) {
    let outstanding = false;
    try {
      outstanding = !!rule.evaluate(data);
    } catch (e) {
      console.warn(`Validation rule ${rule.id} evaluation failed:`, e);
      outstanding = false;
    }

    if (rule.mandatory) {
      mandatoryTotal++;
      if (!outstanding) mandatorySatisfied++;
    }

    if (outstanding) {
      anyOutstanding = true;
      firedRules.push({
        id: rule.id,
        category: rule.category,
        description: rule.description,
        mandatory: rule.mandatory,
        blocker: rule.blocker
      });

      if (rule.mandatory && rule.blocker) {
        anyMandatoryBlockerOutstanding = true;
        blockers.push({
          id: rule.id,
          category: rule.category,
          description: rule.description
        });
      }
    }
  }

  /** @type {Outcome} */
  let outcome;
  if (anyMandatoryBlockerOutstanding) {
    outcome = 'incomplete';
  } else if (anyOutstanding) {
    outcome = 'partial';
  } else {
    outcome = 'complete';
  }

  const completionPercent = mandatoryTotal === 0
    ? 100
    : Math.round((mandatorySatisfied / mandatoryTotal) * 1000) / 10;

  return {
    outcome,
    completionPercent,
    blockers,
    firedRules,
    mandatoryTotal,
    mandatorySatisfied
  };
}

export { validateChecklist };
