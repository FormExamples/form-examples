import { applyFlagRules } from './flags.js';
import { applyBlockerRules, computeValidityBand } from './rules.js';

// Validation orchestrator for the UK LP1F lasting power of attorney.
//
// Faithful port of the SvelteKit `validator/validator.ts`. Composes the
// blocker rules (rules.js), the flag rules (flags.js), and the validity-band
// derivation (rules.js) into a single pure, deterministic ValidationResult.
// The public entry point is `validateLpa(lpa)` (also exported as
// `calculateGrade` for parity with the reference form). The output shape and
// every rule / flag ID are identical across every front-end and the back-end.
//
//   validateLpa(lpa) -> {
//     validityBand,      // draft | ready_for_signing | partially_signed |
//                        // fully_signed | ready_for_registration |
//                        // submitted | registered | rejected
//     compositeRisk,     // low | moderate | high | critical
//     firedRules[],      // statutory blockers (MCA 2005 + LPA Regs 2007)
//     additionalFlags[]  // non-blocking warnings
//   }
//
// Algorithm (max-grade): any statutory blocker promotes compositeRisk to
// `critical`; otherwise the worst flag wins (high > moderate > low); default
// low.
//
// Wrapped in an IIFE; published via `window.UkLpaFinancialDecisions`.

/** Max-grade composite risk from fired blockers and additional flags. */
function computeCompositeRisk(firedRules, flags) {
  if (firedRules.length > 0) return 'critical';
  if (flags.some((f) => f.priority === 'high')) return 'high';
  if (flags.some((f) => f.priority === 'moderate')) return 'moderate';
  return 'low';
}

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} lpa - the LPA data model from emptyLpa()
 * @returns {{ validityBand:string, compositeRisk:string, firedRules:object[], additionalFlags:object[] }}
 */
function validateLpa(lpa) {
  const firedRules = applyBlockerRules(lpa);
  const additionalFlags = applyFlagRules(lpa);
  const compositeRisk = computeCompositeRisk(firedRules, additionalFlags);
  const validityBand = computeValidityBand(lpa);
  return {
    validityBand,
    compositeRisk,
    firedRules,
    additionalFlags
  };
}

export const calculateGrade = validateLpa;

export { validateLpa, computeCompositeRisk };
