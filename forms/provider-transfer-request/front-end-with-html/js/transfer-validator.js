import { validationRules } from './validation-rules.js';

// Provider Transfer Request - completeness validator. Pure function: takes
// an `AssessmentData` object and returns a `ValidationResult` with per-section
// breakdown, an overall `CompletenessLevel`, and the list of fired
// (unsatisfied) rules.
//
// Completeness mapping (mirrors the SvelteKit reference engine):
//   - All applicable rules satisfied                         -> 'complete'
//   - All mandatory rules satisfied; some optional missing   -> 'partial'
//   - Any mandatory rule unsatisfied                         -> 'incomplete'

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ValidationResult} ValidationResult
 * @typedef {import('./types.js').SectionCompleteness} SectionCompleteness
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CompletenessLevel} CompletenessLevel
 */

/**
 * @param {AssessmentData} data
 * @returns {ValidationResult}
 */
function validateTransfer(data) {
  /** @type {Map<string, SectionCompleteness>} */
  const sectionMap = new Map();
  /** @type {FiredRule[]} */
  const missing = [];

  let totalRequired = 0;
  let totalSatisfied = 0;
  let mandatoryRequired = 0;
  let mandatorySatisfied = 0;

  for (const rule of validationRules) {
    let applies = false;
    try {
      applies = rule.applies(data);
    } catch (e) {
      console.warn(`Validation rule ${rule.id} applies() failed:`, e);
    }
    if (!applies) continue;

    let satisfied = false;
    try {
      satisfied = rule.isSatisfied(data);
    } catch (e) {
      console.warn(`Validation rule ${rule.id} isSatisfied() failed:`, e);
    }

    totalRequired++;
    if (rule.mandatory) mandatoryRequired++;
    if (satisfied) {
      totalSatisfied++;
      if (rule.mandatory) mandatorySatisfied++;
    }

    let bucket = sectionMap.get(rule.section);
    if (!bucket) {
      bucket = {
        section: rule.section,
        required: 0,
        satisfied: 0,
        mandatoryRequired: 0,
        mandatorySatisfied: 0,
        missing: []
      };
      sectionMap.set(rule.section, bucket);
    }
    bucket.required++;
    if (rule.mandatory) bucket.mandatoryRequired++;
    if (satisfied) {
      bucket.satisfied++;
      if (rule.mandatory) bucket.mandatorySatisfied++;
    } else {
      const fired = {
        id: rule.id,
        section: rule.section,
        description: rule.description,
        mandatory: rule.mandatory
      };
      missing.push(fired);
      bucket.missing.push(fired);
    }
  }

  const sections = Array.from(sectionMap.values());

  /** @type {CompletenessLevel} */
  let completeness = 'complete';
  if (mandatorySatisfied < mandatoryRequired) {
    completeness = 'incomplete';
  } else if (totalSatisfied < totalRequired) {
    completeness = 'partial';
  }

  return {
    completeness,
    totalRequired,
    totalSatisfied,
    mandatoryRequired,
    mandatorySatisfied,
    sections,
    missing
  };
}

export { validateTransfer };
