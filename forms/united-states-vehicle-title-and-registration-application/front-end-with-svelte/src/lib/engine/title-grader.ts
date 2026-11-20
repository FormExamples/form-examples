import type { ApplicationClass, Classification, TitleApplication } from './types';
import {
  estimatedStateTax,
  odometerDisclosureRequired,
  outstandingItems,
  stateRule,
  titleBrandOrLienIssue,
  vinStatus
} from './title-rules';

// United States vehicle title and registration application grader. Pure
// functions: a port of the HTML front-end's `js/grader.js`.
//
// Algorithm (spec section 4), first matching class wins:
//   titleBrandOrLienIssue                 -> 'title-brand-or-lien-issue'
//   outstandingItems(a).length > 0        -> 'incomplete'
//   otherwise                             -> 'ready-to-submit'
//
// `title-brand-or-lien-issue` takes precedence over completeness. A
// `ready-to-submit` application is still decided by the issuing state agency.

/** Assign the single application class. */
export function deriveApplicationClass(a: TitleApplication): ApplicationClass {
  if (titleBrandOrLienIssue(a)) return 'title-brand-or-lien-issue';
  if (outstandingItems(a).length > 0) return 'incomplete';
  return 'ready-to-submit';
}

/**
 * Compute the full classification for the supplied application. This checks
 * completeness and rule consistency only; it does NOT decide eligibility for a
 * title.
 */
export function validateApplication(a: TitleApplication): Classification {
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
