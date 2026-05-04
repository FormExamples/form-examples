// Donor eligibility grader. Pure functions: take an `AssessmentData`
// object, evaluate every declarative rule from `donor-rules.js`, then
// classify the donor into:
//
//   - `eligibility` — suitable | conditionally-suitable | unsuitable
//   - `overallRisk` — low | moderate | high | critical
//
// Classification logic
// --------------------
// Critical (Grade 4) findings are treated as disqualifying / contraindicated
// for donation; any single Grade-4 rule (other than the ASA-I and HLA-001
// "ideal donor" markers, which are explicitly low-grade) drives the donor
// to `unsuitable` and the overall risk to `critical`.
//
// Multiple Grade-3 findings, or any single Grade-3 finding without
// Grade-4s, drive the donor to `conditionally-suitable` with `high` or
// `moderate` overall risk.
//
// Grade-2-only findings drive `conditionally-suitable` with `moderate`
// overall risk. A clean run (Grades 1 only / no rules fired) yields
// `suitable` with `low` overall risk.
//
// Note: Grade-1 ASA / HLA "ideal" rules are positive findings and do not
// degrade eligibility.

(function () {
'use strict';
window.BoneMarrowDonationAssessment = window.BoneMarrowDonationAssessment || {};
const NS = window.BoneMarrowDonationAssessment;
const { donorRules, hlaMatchLabel, collectionMethodLabel } = NS;

/**
 * Evaluate every declarative donor rule against the given assessment data.
 * Returns the list of fired rules (`{ id, category, description, grade }`).
 */
function evaluateRules(data) {
  const fired = [];
  for (const rule of donorRules) {
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
 * Compute final eligibility + overall risk from the fired rules and the
 * clinician's eligibility decision (if the assessor explicitly recorded
 * one in step 10, that decision wins — the engine only suggests).
 */
function classifyEligibility(firedRules, data) {
  // Ignore the explicitly "low-grade ideal donor" markers (HLA-001, AN-001)
  // when counting penalties — they are positive findings, not flags.
  const positiveIdealIds = new Set(['HLA-001', 'AN-001']);

  const flagged = firedRules.filter((r) => !positiveIdealIds.has(r.id));
  const grade4 = flagged.filter((r) => r.grade === 4).length;
  const grade3 = flagged.filter((r) => r.grade === 3).length;
  const grade2 = flagged.filter((r) => r.grade === 2).length;

  let suggestedEligibility = 'suitable';
  let overallRisk = 'low';

  if (grade4 > 0) {
    suggestedEligibility = 'unsuitable';
    overallRisk = 'critical';
  } else if (grade3 >= 2) {
    suggestedEligibility = 'conditionally-suitable';
    overallRisk = 'high';
  } else if (grade3 === 1) {
    suggestedEligibility = 'conditionally-suitable';
    overallRisk = 'high';
  } else if (grade2 >= 2) {
    suggestedEligibility = 'conditionally-suitable';
    overallRisk = 'moderate';
  } else if (grade2 === 1) {
    suggestedEligibility = 'conditionally-suitable';
    overallRisk = 'moderate';
  }

  // If the assessor explicitly recorded an eligibility decision in step 10,
  // honour it for the displayed eligibility — but keep the engine-derived
  // overall risk so the report still surfaces grade 3/4 findings.
  const assessorDecision = data.consentEligibility.eligibilityDecision;
  const eligibility = assessorDecision || suggestedEligibility;

  return { eligibility, overallRisk, suggestedEligibility };
}

/**
 * Pick the final / suggested collection method label.
 * Falls back to `finalCollectionMethod`, then `preferredMethod`, then
 * `recipientPreference`.
 */
function deriveCollectionMethod(data) {
  const cm = data.collectionMethodAssessment;
  return (
    collectionMethodLabel(cm.finalCollectionMethod) ||
    collectionMethodLabel(cm.preferredMethod) ||
    collectionMethodLabel(cm.recipientPreference) ||
    'Not determined'
  );
}

/**
 * High-level grader: returns `{ eligibility, overallRisk, hlaMatchLevel,
 * collectionMethod, firedRules }`.
 */
function gradeDonor(data) {
  const firedRules = evaluateRules(data);
  const { eligibility, overallRisk, suggestedEligibility } =
    classifyEligibility(firedRules, data);

  return {
    eligibility,
    overallRisk,
    suggestedEligibility,
    hlaMatchLevel: hlaMatchLabel(data.donorRegistrationHlaTyping.hlaMatchLevel),
    collectionMethod: deriveCollectionMethod(data),
    firedRules
  };
}

Object.assign(window.BoneMarrowDonationAssessment, {
  evaluateRules,
  classifyEligibility,
  deriveCollectionMethod,
  gradeDonor
});
})();
