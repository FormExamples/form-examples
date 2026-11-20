import { estimatedStateTax, odometerDisclosureRequired, outstandingItems, stateRule, titleBrandOrLienIssue, vinStatus } from './rules.js';

// United States vehicle title and registration application grader. Pure
// functions: take a `TitleApplication` object, test it against the federal rules
// and the state's rule table, and assign exactly one application class. It makes
// NO legal judgement; the issuing state agency decides whether to issue a title.
//
// Algorithm (spec §4), first matching class wins:
//   titleBrandOrLienIssue                 -> 'title-brand-or-lien-issue'
//   outstandingItems(a).length > 0        -> 'incomplete'
//   otherwise                             -> 'ready-to-submit'
//
// `title-brand-or-lien-issue` takes precedence over completeness: a branded
// title, an NMVTIS brand or theft record, an unreleased lien, or a "not actual
// mileage" disclosure needs the agency's special handling however complete the
// rest of the application is. A `ready-to-submit` application is still decided
// by the agency.

/**
 * @typedef {import('./types.js').TitleApplication} TitleApplication
 * @typedef {import('./types.js').ApplicationClass} ApplicationClass
 */

/**
 * Assign the single application class (spec §4).
 * @param {TitleApplication} a
 * @returns {ApplicationClass}
 */
function deriveApplicationClass(a) {
  if (titleBrandOrLienIssue(a)) return 'title-brand-or-lien-issue';
  if (outstandingItems(a).length > 0) return 'incomplete';
  return 'ready-to-submit';
}

/**
 * Compute the full classification for the supplied application. This checks
 * completeness and rule consistency only; it does NOT decide eligibility for a
 * title.
 * @param {TitleApplication} a
 * @returns {{ applicationClass: ApplicationClass,
 *             vinStatus: string,
 *             odometerDisclosureRequired: boolean,
 *             brandOrLienIssue: boolean,
 *             outstandingItemCount: number,
 *             stateRuleKnown: boolean,
 *             estimatedStateTaxUsd: number | null }}
 */
function validateApplication(a) {
  return {
    applicationClass: deriveApplicationClass(a),
    vinStatus: vinStatus(a),
    odometerDisclosureRequired: odometerDisclosureRequired(a),
    brandOrLienIssue: titleBrandOrLienIssue(a),
    outstandingItemCount: outstandingItems(a).length,
    stateRuleKnown: stateRule(a.application.state).known,
    estimatedStateTaxUsd: estimatedStateTax(a)
  };
}

export { deriveApplicationClass, validateApplication };
