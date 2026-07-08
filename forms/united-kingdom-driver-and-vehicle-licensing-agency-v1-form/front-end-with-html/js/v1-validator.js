// DVLA V1 completeness validator. Pure function: takes an `AssessmentData`
// object, returns a `ValidationResult` with per-section breakdown and the
// list of fired (unsatisfied) rules. Each rule guards its own conditional
// branch via `evaluate`, so dormant branches automatically pass.
//
// Direct port of `src/lib/engine/v1-validator.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ValidationResult} ValidationResult
 * @typedef {import('./types.js').SectionCompleteness} SectionCompleteness
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.DvlaV1Form = window.DvlaV1Form || {};
const { v1Rules } = window.DvlaV1Form;

/**
 * @param {AssessmentData} data
 * @returns {ValidationResult}
 */
function validateV1(data) {
  /** @type {Map<string, SectionCompleteness>} */
  const sectionMap = new Map();
  /** @type {FiredRule[]} */
  const missing = [];
  let totalRequired = 0;
  let totalSatisfied = 0;

  for (const rule of v1Rules) {
    totalRequired++;

    let bucket = sectionMap.get(rule.section);
    if (!bucket) {
      bucket = {
        section: rule.section,
        required: 0,
        satisfied: 0,
        missing: []
      };
      sectionMap.set(rule.section, bucket);
    }
    bucket.required++;

    let ok = false;
    try {
      ok = rule.evaluate(data);
    } catch (e) {
      console.warn(`DVLA V1 rule ${rule.id} evaluation failed:`, e);
    }

    if (ok) {
      totalSatisfied++;
      bucket.satisfied++;
    } else {
      const fired = {
        id: rule.id,
        section: rule.section,
        description: rule.description,
        message: rule.message
      };
      missing.push(fired);
      bucket.missing.push(fired);
    }
  }

  const sections = Array.from(sectionMap.values());

  return {
    complete: missing.length === 0,
    totalRequired,
    totalSatisfied,
    sections,
    missing
  };
}

window.DvlaV1Form.validateV1 = validateV1;
})();
