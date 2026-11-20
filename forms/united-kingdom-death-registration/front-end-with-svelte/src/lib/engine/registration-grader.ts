// Death-registration completeness grader. Pure functions: take a
// `Registration`, evaluate the coroner status, the blocking rules and the
// 5-day clock, and assign exactly one registration class. A process
// classification, not a clinical score, and not legal advice.
//
// Algorithm (spec section 4), first matching class wins:
//   coronerPending             -> 'referred-to-coroner-pending'
//   any blocking rule fires    -> 'incomplete'
//   registrationDate present   -> 'registered'
//   otherwise                  -> 'ready-to-register'

import type { Registration, RegistrationClass, ValidationResult } from './types';
import {
  blockingRules,
  coronerPending,
  daysSinceConfirmation,
  deadlineStatus,
  informantQualified,
  isRegistered
} from './registration-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Assign the single registration class (spec section 4). */
export function deriveRegistrationClass(d: Registration): RegistrationClass {
  if (coronerPending(d)) return 'referred-to-coroner-pending';
  if (blockingRules(d).length > 0) return 'incomplete';
  if (isRegistered(d)) return 'registered';
  return 'ready-to-register';
}

/** Compute the full classification (plus flags and a timestamp) for a registration. */
export function validateRegistration(d: Registration): ValidationResult {
  return {
    registrationClass: deriveRegistrationClass(d),
    deadlineStatus: deadlineStatus(d),
    daysSinceConfirmation: daysSinceConfirmation(d),
    informantQualified: informantQualified(d),
    blockingRules: blockingRules(d),
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
