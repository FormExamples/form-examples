import { counterReferralRules as rules } from './counter-referral-rules.js';

// Pure function: validates the WHO Counter-Referral Form data for completeness.
//
// Each rule in `counterReferralRules` is checked first against `applies()` to
// honour the conditional logic of the form (e.g. "patient/family informed
// Yes -> explanation required"). When a rule applies, it must also be
// `isSatisfied()` for the form to be complete; otherwise the rule is recorded
// as a missing field.
//
// The validator returns an aggregate ValidationResult plus a per-section
// breakdown so the report can highlight exactly which questions are
// outstanding for the patient.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').SectionCompleteness} SectionCompleteness
 * @typedef {import('./types.js').SectionKey} SectionKey
 * @typedef {import('./types.js').ValidationResult} ValidationResult
 */

/**
 * @param {AssessmentData} data
 * @returns {ValidationResult}
 */
function validateCounterReferral(data) {
  

  /** @type {Map<SectionKey, SectionCompleteness>} */
  const sectionMap = new Map();
  /** @type {FiredRule[]} */
  const missing = [];
  let totalRequired = 0;
  let totalSatisfied = 0;

  for (const rule of rules) {
    let applies = false;
    try {
      applies = rule.applies(data);
    } catch (e) {
      console.warn('Counter-referral rule ' + rule.id + ' applies() failed:', e);
    }
    if (!applies) continue;

    totalRequired++;

    let satisfied = false;
    try {
      satisfied = rule.isSatisfied(data);
    } catch (e) {
      console.warn('Counter-referral rule ' + rule.id + ' isSatisfied() failed:', e);
    }

    let bucket = sectionMap.get(rule.section);
    if (!bucket) {
      bucket = {
        section: rule.section,
        required: 0,
        satisfied: 0,
        missing: []
      };
    }
    bucket.required++;

    if (satisfied) {
      totalSatisfied++;
      bucket.satisfied++;
    } else {
      const fired = {
        id: rule.id,
        section: rule.section,
        description: rule.description
      };
      missing.push(fired);
      bucket.missing.push(fired);
    }

    sectionMap.set(rule.section, bucket);
  }

  const sections = Array.from(sectionMap.values());

  return {
    complete: missing.length === 0,
    totalRequired: totalRequired,
    totalSatisfied: totalSatisfied,
    sections: sections,
    missing: missing
  };
}

export { validateCounterReferral };
