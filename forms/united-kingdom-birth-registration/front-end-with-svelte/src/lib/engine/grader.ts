import type { BirthRegistration, ReadinessClass, ValidationResult } from './types';
import {
  dateInconsistencies,
  daysSinceBirth,
  evidenceGaps,
  lateRegistration,
  missingItems,
  outOfScopeReason
} from './rules';
import { detectFlaggedIssues } from './flagged-issues';

// United Kingdom Birth Registration readiness grader. Pure functions: take a
// `BirthRegistration` object, test scope, completeness, consistency and
// evidence, and assign exactly one readiness class. It makes NO statutory
// decision; the registrar's decision and the register entry remain the legal
// record.
//
// Algorithm (spec section 4), first matching class wins:
//   outOfScopeReason(d)                          -> 'out-of-scope'
//   missingItems(d).length || dateInconsistencies(d).length -> 'incomplete'
//   evidenceGaps(d).length                       -> 'needs-additional-evidence'
//   otherwise                                    -> 'ready-to-submit'
//
// `out-of-scope` takes precedence: a stillbirth or a birth outside England and
// Wales is registered under different rules, however complete the data. A late
// registration (after 42 days, up to 12 months) is flagged but does not by
// itself block `ready-to-submit`; more than 12 months needs the Registrar
// General's authority and so counts as an evidence gap.

/** Assign the single readiness class (spec §4). */
export function deriveReadinessClass(d: BirthRegistration): ReadinessClass {
  if (outOfScopeReason(d)) return 'out-of-scope';
  if (missingItems(d).length > 0 || dateInconsistencies(d).length > 0) return 'incomplete';
  if (evidenceGaps(d).length > 0) return 'needs-additional-evidence';
  return 'ready-to-submit';
}

/**
 * Compute the full readiness classification for the supplied application. This
 * classifies completeness and evidence only: it does NOT register the birth.
 */
export function validateRegistration(d: BirthRegistration): ValidationResult {
  const days = daysSinceBirth(d);
  return {
    readinessClass: deriveReadinessClass(d),
    daysSinceBirth: days,
    lateRegistration: days === null ? '' : lateRegistration(d) ? 'yes' : 'no',
    missingItemCount: missingItems(d).length,
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
