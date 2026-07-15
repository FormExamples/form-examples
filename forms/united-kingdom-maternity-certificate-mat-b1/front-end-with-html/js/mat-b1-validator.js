import { detectAdditionalFlags } from './flagged-issues.js';
import { matB1Rules } from './mat-b1-rules.js';
import { priorityOrder, weeksBetween } from './types.js';

// MAT B1 maternity certificate - pure validator.
//
// Branching:
//   - certificateType = 'pre'  -> Part A rules apply; Part B rules skipped.
//   - certificateType = 'post' -> Part B rules apply; Part A rules skipped.
//   - certificateType = ''     -> MATB1-CERT-001 fires; both Part A/B detail
//                                 rules are skipped (avoids noise until the
//                                 user picks a branch).
//
//   - issuer.issuerType = 'doctor'  -> MATB1-DR-* rules apply; midwife rules
//                                      skipped.
//   - issuer.issuerType = 'midwife' -> MATB1-MW-* rules apply; doctor rules
//                                      skipped.
//   - issuer.issuerType = ''        -> MATB1-ISS-001 fires; both branches
//                                      are skipped.
//
// Ported from forms/united-kingdom-maternity-certificate-mat-b1/
//   front-end-form-with-svelte/src/lib/engine/mat-b1-validator.ts

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').ValidationResult} ValidationResult
 */

/**
 * @param {AssessmentData} data
 * @returns {ValidationResult}
 */
function validateMatB1(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of matB1Rules) {
    // Skip Part A / Part B rules when no certificate type is selected;
    // MATB1-CERT-001 covers the missing selection.
    if (
      data.certificateType === '' &&
      (rule.id.indexOf('MATB1-A-') === 0 || rule.id.indexOf('MATB1-B-') === 0)
    ) {
      continue;
    }
    // Skip doctor / midwife rules when no issuer type is selected;
    // MATB1-ISS-001 covers the missing selection.
    if (
      data.issuer.issuerType === '' &&
      (rule.id.indexOf('MATB1-DR-') === 0 || rule.id.indexOf('MATB1-MW-') === 0)
    ) {
      continue;
    }

    let triggered = false;
    try {
      triggered = rule.evaluate(data);
    } catch (e) {
      console.warn(`MAT B1 rule ${rule.id} evaluation failed:`, e);
    }
    if (triggered) {
      firedRules.push({
        id: rule.id,
        category: rule.category,
        priority: rule.priority,
        description: rule.description,
        message: rule.message
      });
    }
  }

  firedRules.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));

  // Detect additional flags via the flagged-issues module (loaded earlier in
  // index.html). The function is added to MatB1Form before this script runs.
  const additionalFlags = (typeof detectAdditionalFlags === 'function')
    ? detectAdditionalFlags(data)
    : (detectAdditionalFlags
        ? detectAdditionalFlags(data)
        : []);

  const complete =
    firedRules.filter((r) => r.category === 'completeness').length === 0;

  const weeksBeforeEwc =
    data.certificateType === 'pre'
      ? weeksBetween(
          data.preConfinement.examinationDate,
          data.preConfinement.expectedDateOfConfinement
        )
      : null;

  return {
    complete,
    certificateType: data.certificateType,
    issuerType: data.issuer.issuerType,
    firedRules,
    additionalFlags,
    weeksBeforeEwc,
    timestamp: new Date().toISOString()
  };
}

export { validateMatB1 };
