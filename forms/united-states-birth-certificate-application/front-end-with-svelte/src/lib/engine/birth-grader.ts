import type { ApplicationClass, BirthCertificateApplication, ValidationResult } from './types';
import { anyGap, expectedFee, hasStateRule, ineligibleRequester } from './birth-rules';
import { detectFlaggedIssues } from './flagged-issues';

// US birth certificate application grader. Pure functions: take a
// `BirthCertificateApplication`, test the requester against the state rule in
// force (or the uniform default), test completeness, and assign exactly one
// class. It is documentation support, NOT legal advice; the issuing vital
// records office decides whether to issue a certified copy.
//
// Algorithm (spec §4), first matching class wins:
//   ineligibleRequester(d)  -> 'ineligible-requester'
//   anyGap(d)               -> 'incomplete'
//   otherwise               -> 'ready-to-submit'
//
// `ineligible-requester` takes precedence over completeness: completing the
// paperwork cannot cure a requester who has no right to a certified copy.

/** Assign the single application class (spec §4). */
export function deriveApplicationClass(d: BirthCertificateApplication): ApplicationClass {
  if (ineligibleRequester(d)) return 'ineligible-requester';
  if (anyGap(d)) return 'incomplete';
  return 'ready-to-submit';
}

/**
 * Compute the classification and flags for the supplied application. This
 * classifies completeness and eligibility only; it is not legal advice and the
 * issuing vital records office decides.
 */
export function validateApplication(d: BirthCertificateApplication): ValidationResult {
  return {
    applicationClass: deriveApplicationClass(d),
    expectedFeeUsd: expectedFee(d),
    stateRuleApplied: hasStateRule(d) ? 'state' : 'default',
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
