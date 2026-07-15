import { validityRules } from './validity-rules.js';

// Pure functions: evaluate all validity rules against ADRT data and
// classify the document into a `ValidityStatus`. Mirrors
// `src/lib/engine/validity-grader.ts` from the SvelteKit reference.
//
// - If ANY critical rule fires (life-sustaining treatment requirements not met): Invalid
// - If ANY required rule fires (missing legal requirements): Invalid
// - If ONLY recommended rules fire: Complete (all required sections filled but could be improved)
// - If NO rules fire: Valid (fully legally compliant)
// - If the document looks like it has barely been started, Invalid is downgraded to Draft.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ValidityStatus} ValidityStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AdvanceDecisionToRefuseTreatment.

/** Heuristic: if core identification fields are empty, treat as draft.
 * @param {AssessmentData} data
 */
function isLikelyDraft(data) {
  return (
    data.personalInformation.fullLegalName.trim() === '' &&
    data.personalInformation.dateOfBirth === '' &&
    data.legalSignatures.patientSignature !== 'yes'
  );
}

/**
 * @param {AssessmentData} data
 * @returns {{ validityStatus: ValidityStatus, firedRules: FiredRule[] }}
 */
function calculateValidity(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of validityRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          severity: rule.severity
        });
      }
    } catch (e) {
      console.warn(`Validity rule ${rule.id} evaluation failed:`, e);
    }
  }

  const hasCritical = firedRules.some((r) => r.severity === 'critical');
  const hasRequired = firedRules.some((r) => r.severity === 'required');
  const hasRecommended = firedRules.some((r) => r.severity === 'recommended');

  /** @type {ValidityStatus} */
  let validityStatus;
  if (hasCritical || hasRequired) {
    validityStatus = isLikelyDraft(data) ? 'draft' : 'invalid';
  } else if (hasRecommended) {
    validityStatus = 'complete';
  } else {
    validityStatus = 'valid';
  }

  return { validityStatus, firedRules };
}

export { calculateValidity };
