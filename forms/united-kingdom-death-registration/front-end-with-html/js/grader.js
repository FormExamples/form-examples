import { blockingRules, coronerPending, daysSinceConfirmation, deadlineStatus, informantQualified, isRegistered } from './rules.js';

// Death-registration completeness grader. Pure functions: take a
// `Registration` object, evaluate the coroner status, the blocking rules and
// the 5-day clock, and assign exactly one registration class. It is a process
// classification, not a clinical score, and not legal advice.
//
// Algorithm (spec section 4), first matching class wins:
//   coronerPending                -> 'referred-to-coroner-pending'
//   any blocking rule fires       -> 'incomplete'
//   registrationDate present      -> 'registered'
//   otherwise                     -> 'ready-to-register'

/**
 * @typedef {import('./types.js').Registration} Registration
 * @typedef {import('./types.js').RegistrationClass} RegistrationClass
 */

/**
 * Assign the single registration class (spec section 4).
 * @param {Registration} d
 * @returns {RegistrationClass}
 */
function deriveRegistrationClass(d) {
  if (coronerPending(d)) return 'referred-to-coroner-pending';
  if (blockingRules(d).length > 0) return 'incomplete';
  if (isRegistered(d)) return 'registered';
  return 'ready-to-register';
}

/**
 * Compute the full classification for the supplied registration.
 * @param {Registration} d
 * @returns {{ registrationClass: RegistrationClass,
 *             deadlineStatus: import('./types.js').DeadlineStatus,
 *             daysSinceConfirmation: number | null,
 *             informantQualified: boolean,
 *             blockingRules: { ruleId: string, dimension: string, category: string, description: string }[] }}
 */
function validateRegistration(d) {
  return {
    registrationClass: deriveRegistrationClass(d),
    deadlineStatus: deadlineStatus(d),
    daysSinceConfirmation: daysSinceConfirmation(d),
    informantQualified: informantQualified(d),
    blockingRules: blockingRules(d)
  };
}

export { deriveRegistrationClass, validateRegistration };
