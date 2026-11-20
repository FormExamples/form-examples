import { dateInconsistencies, daysSinceBirth, evidenceGaps, lateRegistration, missingItems, outOfScopeReason } from './rules.js';

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

/**
 * @typedef {import('./types.js').BirthRegistration} BirthRegistration
 * @typedef {import('./types.js').ReadinessClass} ReadinessClass
 */

/**
 * Assign the single readiness class (spec section 4).
 * @param {BirthRegistration} d
 * @returns {ReadinessClass}
 */
function deriveReadinessClass(d) {
  if (outOfScopeReason(d)) return 'out-of-scope';
  if (missingItems(d).length > 0 || dateInconsistencies(d).length > 0) return 'incomplete';
  if (evidenceGaps(d).length > 0) return 'needs-additional-evidence';
  return 'ready-to-submit';
}

/**
 * Compute the full readiness classification for the supplied application. This
 * classifies completeness and evidence only: it does NOT register the birth.
 * @param {BirthRegistration} d
 * @returns {{ readinessClass: ReadinessClass,
 *             daysSinceBirth: number | null,
 *             lateRegistration: 'yes' | 'no' | '',
 *             missingItemCount: number }}
 */
function validateRegistration(d) {
  const days = daysSinceBirth(d);
  return {
    readinessClass: deriveReadinessClass(d),
    daysSinceBirth: days,
    lateRegistration: days === null ? '' : (lateRegistration(d) ? 'yes' : 'no'),
    missingItemCount: missingItems(d).length
  };
}

export { deriveReadinessClass, validateRegistration };
