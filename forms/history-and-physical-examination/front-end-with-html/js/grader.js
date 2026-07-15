import { allergyDocumented, componentRules, coreExamAddressed, nonEmpty } from './rules.js';

// H&P completeness grader. Pure functions: take a flat `ClerkingRecord`,
// evaluate the ten required-component rules in `componentRules`, count how many
// are satisfied, derive the completeness percentage, and classify the clerking
// as complete / partial / incomplete.
//
// This is NOT a numeric clinical score. `completenessPercent` is purely the
// proportion of the ten required components that are documented.
//
// Algorithm (spec §4):
//   satisfied            = componentRules.filter(rule.evaluate)
//   completenessPercent  = round(100 * satisfied.length / 10)
//   blockingFlag         = allergies undocumented  ||  (no impression AND no plan)
//   coreNarrative        = presentingComplaint documented
//                        && historyOfPresentingComplaint documented
//                        && coreExamAddressed
//                        && (impression documented || managementPlan documented)
//   status = blockingFlag || !coreNarrative -> 'incomplete'
//            else all ten satisfied         -> 'complete'
//            else                           -> 'partial'
//
// The two blocking conditions are computed directly here (not via flags.js) so
// the grader stays independent of the flag detector and the module load order
// types -> rules -> grader -> flags is respected.

/**
 * @typedef {import('./types.js').ClerkingRecord} ClerkingRecord
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.HistoryAndPhysicalExamination.

/** allergies undocumented — a blocking condition. */
function allergiesUndocumented(r) {
  return !allergyDocumented(r);
}

/** no impression and no plan — a blocking condition. */
function noImpressionOrPlan(r) {
  return !nonEmpty(r.impression) && !nonEmpty(r.managementPlan);
}

/**
 * Evaluate the ten required-component rules and split into satisfied and
 * missing, collecting an audit row (FiredRule) for each satisfied component.
 * @param {ClerkingRecord} r
 * @returns {{ satisfiedComponents: string[], missingComponents: string[], firedRules: FiredRule[] }}
 */
function evaluateComponents(r) {
  /** @type {string[]} */
  const satisfiedComponents = [];
  /** @type {string[]} */
  const missingComponents = [];
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of componentRules) {
    let ok = false;
    try {
      ok = rule.evaluate(r);
    } catch (e) {
      console.warn(`H&P rule ${rule.id} evaluation failed:`, e);
      ok = false;
    }
    if (ok) {
      satisfiedComponents.push(rule.component);
      firedRules.push({
        id: rule.id,
        component: rule.component,
        section: rule.section,
        category: rule.category,
        description: rule.description
      });
    } else {
      missingComponents.push(rule.component);
    }
  }

  return { satisfiedComponents, missingComponents, firedRules };
}

/**
 * Compute the full completeness grade for the supplied clerking record.
 * @param {ClerkingRecord} r
 * @returns {{ status: CompletenessStatus, completenessPercent: number,
 *             satisfiedComponents: string[], missingComponents: string[],
 *             firedRules: FiredRule[], blocking: boolean }}
 */
function gradeCompleteness(r) {
  const { satisfiedComponents, missingComponents, firedRules } =
    evaluateComponents(r);

  const total = componentRules.length; // 10
  const completenessPercent = Math.round((satisfiedComponents.length / total) * 100);

  const blocking = allergiesUndocumented(r) || noImpressionOrPlan(r);

  const coreNarrative =
    nonEmpty(r.presentingComplaint) &&
    nonEmpty(r.historyOfPresentingComplaint) &&
    coreExamAddressed(r) &&
    (nonEmpty(r.impression) || nonEmpty(r.managementPlan));

  /** @type {CompletenessStatus} */
  let status;
  if (blocking || !coreNarrative) {
    status = 'incomplete';
  } else if (satisfiedComponents.length === total) {
    status = 'complete';
  } else {
    status = 'partial';
  }

  // Record the derived completeness decision as an audit row, mirroring the
  // grade_rule table's `completeness` section.
  firedRules.push({
    id: 'R-COMPLETENESS-STATUS-01',
    component: 'completeness-status',
    section: 'completeness',
    category: 'derived-status',
    description:
      `Status ${status} — ${satisfiedComponents.length} of ${total} required components documented (${completenessPercent}%)` +
      (blocking ? '; a blocking flag forced incomplete' : '')
  });

  return {
    status,
    completenessPercent,
    satisfiedComponents,
    missingComponents,
    firedRules,
    blocking
  };
}

export { allergiesUndocumented, noImpressionOrPlan, evaluateComponents, gradeCompleteness };
