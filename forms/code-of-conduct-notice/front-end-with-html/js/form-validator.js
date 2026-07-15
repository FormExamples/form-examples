import { completenessPercent, validationStatus } from './types.js';
import { validationRules } from './validation-rules.js';

// Form validator. Pure function: takes an `AssessmentData` object,
// returns the completeness percentage, the overall status (`Complete` /
// `Incomplete`), and the list of fired (i.e. failing) validation rules.
// Ported 1:1 from `src/lib/engine/form-validator.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').ValidationStatus} ValidationStatus
 */

/**
 * Pure function: validates the completeness of the code of conduct notice form.
 *
 * The Svelte engine returns `{ completeness, status, firedRules }`. We mirror
 * that shape exactly so calling code can be ported 1:1. The wrapper key
 * `validationErrors` is provided as an alias for `firedRules` to satisfy
 * downstream consumers expecting either name.
 *
 * @param {AssessmentData} data
 * @returns {{ completeness: number, status: ValidationStatus, firedRules: FiredRule[], validationErrors: FiredRule[] }}
 */
function validateForm(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of validationRules) {
    const section = data[rule.section];
    if (!section) continue;
    const value = section[rule.field];

    // For the 'agreed' boolean field, false counts as empty
    if (value === '' || value === null || value === undefined || value === false) {
      firedRules.push({
        id: rule.id,
        section: rule.section,
        description: rule.message,
        field: rule.field
      });
    }
  }

  const totalRequired = validationRules.length;
  const completedCount = totalRequired - firedRules.length;
  const completeness = completenessPercent(completedCount, totalRequired);
  const status = validationStatus(completeness);

  return {
    completeness,
    status,
    firedRules,
    validationErrors: firedRules
  };
}

export { validateForm };
