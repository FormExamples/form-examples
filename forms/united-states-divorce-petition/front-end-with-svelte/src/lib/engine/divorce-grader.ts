import type { DivorcePetition, ReadinessClass, ValidationResult } from './types';
import {
  ruleFor,
  stateResidencyShort,
  countyResidencyShort,
  separationShort,
  decreeBeforeWaitingPeriod,
  earliestDecreeDate,
  missingCore,
  childrenIncomplete,
  faultGroundNotAvailable,
  uncontestedWithoutAgreement,
  decreeWithoutService
} from './divorce-rules';
import { detectFlaggedIssues } from './flagged-issues';

// United States Divorce Petition readiness grader. Pure functions: take a
// `DivorcePetition`, evaluate the filing state's residency, waiting-period and
// separation rules and the completeness of the required items, and assign
// exactly one readiness class. It gives NO legal advice; the court decides.
//
// Algorithm (spec section 4), first matching class wins:
//   stateResidencyShort || countyResidencyShort || separationShort
//     || decreeBeforeWaitingPeriod                       -> 'not-yet-eligible'
//   missing core || children plan/worksheet missing || fault ground unavailable
//     || uncontested without agreement || decree without service -> 'incomplete'
//   otherwise                                            -> 'ready-to-file'
//
// `not-yet-eligible` takes precedence over completeness: a petition filed
// before residency or a waiting period is satisfied is premature however
// complete it is.

/** @param {DivorcePetition} d @returns {boolean} */
function notYetEligible(d: DivorcePetition): boolean {
  return (
    stateResidencyShort(d) ||
    countyResidencyShort(d) ||
    separationShort(d) ||
    decreeBeforeWaitingPeriod(d)
  );
}

/** @param {DivorcePetition} d @returns {boolean} */
function isIncomplete(d: DivorcePetition): boolean {
  const kids = childrenIncomplete(d);
  return (
    missingCore(d).length > 0 ||
    kids.plan ||
    kids.worksheet ||
    faultGroundNotAvailable(d) ||
    uncontestedWithoutAgreement(d) ||
    decreeWithoutService(d)
  );
}

/**
 * Assign the single readiness class (spec section 4).
 * @param {DivorcePetition} d
 * @returns {ReadinessClass}
 */
export function deriveReadinessClass(d: DivorcePetition): ReadinessClass {
  if (notYetEligible(d)) return 'not-yet-eligible';
  if (isIncomplete(d)) return 'incomplete';
  return 'ready-to-file';
}

/**
 * Compute the full readiness classification for the supplied petition,
 * including the flagged issues. Classifies completeness and eligibility only;
 * it gives no legal advice and the court decides.
 */
export function validatePetition(d: DivorcePetition): ValidationResult {
  const { rule, known } = ruleFor(d.filing.state);
  return {
    readinessClass: deriveReadinessClass(d),
    propertyRegime: known ? (rule.property as 'community' | 'equitable') : 'unknown',
    earliestDecreeDate: earliestDecreeDate(d),
    stateRuleKnown: known,
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
