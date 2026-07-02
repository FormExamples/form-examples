// Mental Health Act legal-completeness grader. Pure functions: take a
// `MentalHealthActAssessment` object, classify the recommended section, look up
// that class's required signatories and criteria (from `rules.js`), and derive
// the completeness status and urgency (spec §4). It makes NO automated detention
// decision; the prescribed statutory forms remain the definitive legal record.
//
// Algorithm (spec §4):
//   recommendedSectionClass = sectionToClass(recommendedSection)
//   requiredSignatories     = SIGNATORIES[class] evaluated present/absent
//   criteriaSummary         = CRITERIA[class] evaluated met/not-met + evidence
//   completenessStatus:
//     class != 'none' : 'valid' when EVERY required signatory is present AND
//                        EVERY required criterion is 'met' with non-empty
//                        evidence; else 'incomplete'.
//     class == 'none' : 'valid' when outcome is a resolved value
//                        (informal-admission / community / no-action);
//                        else 'incomplete'.
//   urgencyClass:
//     'emergency' when class in {s4, s5-2, s5-4, s136} OR riskImminence=='imminent'
//     'urgent'    when class in {s2, s3}
//     'routine'   otherwise

/**
 * @typedef {import('./types.js').MentalHealthActAssessment} MentalHealthActAssessment
 * @typedef {import('./types.js').CompletenessStatus} CompletenessStatus
 * @typedef {import('./types.js').RecommendedSectionClass} RecommendedSectionClass
 * @typedef {import('./types.js').UrgencyClass} UrgencyClass
 * @typedef {import('./types.js').RequiredSignatory} RequiredSignatory
 * @typedef {import('./types.js').CriterionResult} CriterionResult
 */

// Wrapped in an IIFE; published via window.MentalHealthActAssessment.
(function () {
'use strict';
window.MentalHealthActAssessment = window.MentalHealthActAssessment || {};
const {
  nonEmpty,
  sectionToClass,
  SIGNATORIES,
  CRITERIA
} = window.MentalHealthActAssessment;

/**
 * Build the required-signatory checklist for the recommended section.
 * @param {MentalHealthActAssessment} data
 * @param {RecommendedSectionClass} cls
 * @returns {RequiredSignatory[]}
 */
function evaluateSignatories(data, cls) {
  const slots = SIGNATORIES[cls] || [];
  return slots.map((slot) => ({
    role: slot.role,
    label: slot.label,
    present: slot.present(data) === true
  }));
}

/**
 * Build the required-criteria summary for the recommended section.
 * @param {MentalHealthActAssessment} data
 * @param {RecommendedSectionClass} cls
 * @returns {CriterionResult[]}
 */
function evaluateCriteria(data, cls) {
  const slots = CRITERIA[cls] || [];
  return slots.map((slot) => {
    const status = slot.status(data);
    return {
      criterion: slot.criterion,
      label: slot.label,
      status: status || '',
      evidencePresent: nonEmpty(slot.evidence(data))
    };
  });
}

/**
 * Derive the completeness status (spec §4 step 4).
 * @param {MentalHealthActAssessment} data
 * @param {RecommendedSectionClass} cls
 * @param {RequiredSignatory[]} signatories
 * @param {CriterionResult[]} criteria
 * @returns {CompletenessStatus}
 */
function deriveCompleteness(data, cls, signatories, criteria) {
  if (cls === 'none') {
    const outcome = data.recommendation.outcome;
    const resolved =
      outcome === 'informal-admission' ||
      outcome === 'community' ||
      outcome === 'no-action';
    return resolved ? 'valid' : 'incomplete';
  }
  const allSignatoriesPresent = signatories.every((s) => s.present);
  const allCriteriaMet = criteria.every(
    (c) => c.status === 'met' && c.evidencePresent
  );
  return allSignatoriesPresent && allCriteriaMet ? 'valid' : 'incomplete';
}

/**
 * Derive the urgency class (spec §4 step 5).
 * @param {MentalHealthActAssessment} data
 * @param {RecommendedSectionClass} cls
 * @returns {UrgencyClass}
 */
function deriveUrgency(data, cls) {
  const emergencyClasses = [
    'section-4', 'section-5-2', 'section-5-4', 'section-136'
  ];
  if (
    emergencyClasses.indexOf(cls) !== -1 ||
    data.risk.riskImminence === 'imminent'
  ) {
    return 'emergency';
  }
  if (cls === 'section-2' || cls === 'section-3') return 'urgent';
  return 'routine';
}

/**
 * Compute the full legal-completeness grade for the supplied assessment.
 * This validates documentation and classifies only — it does NOT decide whether
 * to detain.
 * @param {MentalHealthActAssessment} data
 * @returns {{ completenessStatus: CompletenessStatus,
 *             recommendedSectionClass: RecommendedSectionClass,
 *             urgencyClass: UrgencyClass,
 *             requiredSignatories: RequiredSignatory[],
 *             criteriaSummary: CriterionResult[] }}
 */
function gradeMentalHealthActAssessment(data) {
  const recommendedSectionClass = sectionToClass(
    data.recommendation.recommendedSection
  );
  const requiredSignatories = evaluateSignatories(data, recommendedSectionClass);
  const criteriaSummary = evaluateCriteria(data, recommendedSectionClass);
  const completenessStatus = deriveCompleteness(
    data,
    recommendedSectionClass,
    requiredSignatories,
    criteriaSummary
  );
  const urgencyClass = deriveUrgency(data, recommendedSectionClass);

  return {
    completenessStatus,
    recommendedSectionClass,
    urgencyClass,
    requiredSignatories,
    criteriaSummary
  };
}

Object.assign(window.MentalHealthActAssessment, {
  evaluateSignatories,
  evaluateCriteria,
  deriveCompleteness,
  deriveUrgency,
  gradeMentalHealthActAssessment
});
})();
