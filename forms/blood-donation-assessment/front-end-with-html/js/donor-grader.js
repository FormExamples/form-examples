import { dsgRules } from './rules.js';

// Donor grader: applies the JPAC Donor Selection Guidelines (DSG) rules
// against an `AssessmentData` and returns the overall eligibility status.
//
// Status hierarchy (most severe wins):
//   permanently-deferred  >  temporarily-deferred  >  eligible

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').EligibilityStatus} EligibilityStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Run all DSG rules against the supplied data.
 *
 * @param {AssessmentData} data
 * @returns {{ eligibilityStatus: EligibilityStatus, deferralWindow: string, firedRules: FiredRule[] }}
 */
function gradeDonor(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of dsgRules) {
    try {
      const fired = rule.evaluate(data);
      if (fired) firedRules.push(fired);
    } catch (e) {
      console.warn(`DSG rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {EligibilityStatus} */
  let eligibilityStatus = 'eligible';
  let deferralWindow = '';

  for (const r of firedRules) {
    if (r.status === 'permanently-deferred') {
      eligibilityStatus = 'permanently-deferred';
      deferralWindow = '';
      break;
    }
    if (r.status === 'temporarily-deferred') {
      eligibilityStatus = 'temporarily-deferred';
      // Keep the first temporary deferral window we see.
      if (!deferralWindow && r.deferralWindow) {
        deferralWindow = r.deferralWindow;
      }
    }
  }

  return { eligibilityStatus, deferralWindow, firedRules };
}

export { gradeDonor };
