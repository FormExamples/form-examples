// Donor eligibility grader. Pure functions: take an `AssessmentData`
// object, evaluate every declarative rule from `donation-rules.js`, then
// classify the donor into:
//
//   - `eligibility` — suitable | conditionally-suitable | unsuitable
//   - `riskLevel`   — low | moderate | high | critical
//
// Classification logic
// --------------------
// Any single Grade-4 finding (other than the "ideal donor" markers, which
// are explicitly low-grade — e.g. SU-001 ASA-I) → unsuitable / critical.
// Any Grade-3 finding → conditionally-suitable / high.
// Any Grade-2 finding → conditionally-suitable / moderate.
// Otherwise → suitable / low.
//
// Note: SU-001 (ASA Grade I) is a positive Grade-1 marker and is excluded
// from penalty counting, similar to the bone-marrow grader pattern.

(function () {
'use strict';
window.OrganDonationAssessment = window.OrganDonationAssessment || {};
const NS = window.OrganDonationAssessment;
const { donationRules } = NS;

/**
 * Evaluate every declarative donor rule against the given assessment data.
 * Returns the list of fired rules (`{ id, category, description, grade }`).
 * @param {import('./types.js').AssessmentData} data
 * @returns {import('./types.js').FiredRule[]}
 */
function evaluateRules(data) {
  const fired = [];
  for (const rule of donationRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      console.warn(`Donor rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute final eligibility + risk level from the fired rules and (where
 * recorded) the assessor's eligibility decision in step 10 — when the
 * assessor explicitly recorded one, that decision wins for the displayed
 * eligibility, but the engine-derived risk level is preserved.
 */
function classifyEligibility(firedRules, data) {
  // Ignore the explicit "ideal donor" Grade-1 markers when counting penalties.
  const positiveIdealIds = new Set(['SU-001']);

  const flagged = firedRules.filter((r) => !positiveIdealIds.has(r.id));
  const grade4 = flagged.filter((r) => r.grade === 4).length;
  const grade3 = flagged.filter((r) => r.grade === 3).length;
  const grade2 = flagged.filter((r) => r.grade === 2).length;

  let suggestedEligibility = 'suitable';
  let riskLevel = 'low';

  if (grade4 > 0) {
    suggestedEligibility = 'unsuitable';
    riskLevel = 'critical';
  } else if (grade3 > 0) {
    suggestedEligibility = 'conditionally-suitable';
    riskLevel = 'high';
  } else if (grade2 > 0) {
    suggestedEligibility = 'conditionally-suitable';
    riskLevel = 'moderate';
  }

  const assessorDecision = data.eligibilityAllocation.eligibilityDecision;
  const eligibility = assessorDecision || suggestedEligibility;

  return { eligibility, riskLevel, suggestedEligibility };
}

/**
 * High-level grader: returns `{ eligibility, riskLevel, suggestedEligibility,
 * firedRules }`.
 * @param {import('./types.js').AssessmentData} data
 */
function gradeDonor(data) {
  const firedRules = evaluateRules(data);
  const { eligibility, riskLevel, suggestedEligibility } =
    classifyEligibility(firedRules, data);

  return {
    eligibility,
    riskLevel,
    suggestedEligibility,
    firedRules
  };
}

Object.assign(window.OrganDonationAssessment, {
  evaluateRules,
  classifyEligibility,
  gradeDonor
});
})();
