// WHO Acute Referral Form completeness validator. Pure function: takes an
// `AssessmentData` object, returns a `ValidationResult` with per-section
// breakdown and the list of fired (unsatisfied) rules. Each rule is first
// checked against `applies()` so conditional sections (Other-precaution
// details, receipt-side rules) do not produce false missing-field reports.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ValidationResult} ValidationResult
 * @typedef {import('./types.js').SectionCompleteness} SectionCompleteness
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.WhoAcuteReferralForm = window.WhoAcuteReferralForm || {};
const { referralRules } = window.WhoAcuteReferralForm;

/**
 * @param {AssessmentData} data
 * @returns {ValidationResult}
 */
function validateReferral(data) {
  /** @type {Map<string, SectionCompleteness>} */
  const sectionMap = new Map();
  /** @type {FiredRule[]} */
  const missing = [];
  let totalRequired = 0;
  let totalSatisfied = 0;

  for (const rule of referralRules) {
    let applies = false;
    try {
      applies = rule.applies(data);
    } catch (e) {
      console.warn(`Referral rule ${rule.id} applies() failed:`, e);
    }
    if (!applies) continue;

    totalRequired++;

    let satisfied = false;
    try {
      satisfied = rule.isSatisfied(data);
    } catch (e) {
      console.warn(`Referral rule ${rule.id} isSatisfied() failed:`, e);
    }

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

window.WhoAcuteReferralForm.validateReferral = validateReferral;
})();
