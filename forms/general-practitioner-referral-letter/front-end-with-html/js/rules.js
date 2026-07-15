// Declarative General Practitioner Referral Letter completeness rules.
//
// This is a documentation-completeness and urgency-classification instrument,
// not a scored assessment. Completeness is checked against a mandatory-field set
// whose membership depends on the selected urgency (spec §4):
//
//   MANDATORY_ALWAYS = patient identifier / name / date of birth,
//                      referrer name / role / practice,
//                      referral specialty, urgency, reason for referral,
//                      relevant clinical history
//   + urgency in [urgent, two-week-wait]        -> urgencyReason
//   + urgency == two-week-wait                  -> suspectedCancerCriterion,
//                                                  suspectedCancerPathway
//
// The grader (`grader.js`) marks the referral `Complete` only when every
// applicable mandatory field is present, otherwise `Incomplete`, and computes a
// completeness percentage from the same set. Each mandatory slot below carries a
// stable id, category, and human-readable description that mirror the
// `general_practitioner_referral_letter_grade_rule` SQL table.

/**
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').Urgency} Urgency
 *
 * @typedef {Object} MandatoryField
 * @property {string} id
 * @property {string} rule
 * @property {string} category
 * @property {string} label        - short human label, used in reports and flags
 * @property {string} description
 * @property {(r: Referral) => boolean} present
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const hasDate = (d) => d !== null && d !== undefined && d !== '';

/**
 * The always-mandatory field set — required for every urgency. Order matches the
 * spec §4 `MANDATORY_ALWAYS` list.
 * @type {MandatoryField[]}
 */
const MANDATORY_ALWAYS = [
  {
    id: 'R-MANDATORY-PATIENT-IDENTIFIER',
    rule: 'patientIdentifier',
    category: 'mandatory-field',
    label: 'patient identifier',
    description: 'A patient identifier (NHS number or local identifier) is recorded',
    present: (r) => nonEmpty(r.patient.patientIdentifier)
  },
  {
    id: 'R-MANDATORY-PATIENT-NAME',
    rule: 'patientName',
    category: 'mandatory-field',
    label: 'patient name',
    description: 'The patient’s name is recorded',
    present: (r) => nonEmpty(r.patient.patientName)
  },
  {
    id: 'R-MANDATORY-PATIENT-DOB',
    rule: 'patientDateOfBirth',
    category: 'mandatory-field',
    label: 'patient date of birth',
    description: 'The patient’s date of birth is recorded',
    present: (r) => hasDate(r.patient.patientDateOfBirth)
  },
  {
    id: 'R-MANDATORY-REFERRER-NAME',
    rule: 'referrerName',
    category: 'mandatory-field',
    label: 'referrer name',
    description: 'The referring clinician’s name is recorded',
    present: (r) => nonEmpty(r.referrer.referrerName)
  },
  {
    id: 'R-MANDATORY-REFERRER-ROLE',
    rule: 'referrerRole',
    category: 'mandatory-field',
    label: 'referrer role',
    description: 'The referrer’s role is recorded',
    present: (r) => nonEmpty(r.referrer.referrerRole)
  },
  {
    id: 'R-MANDATORY-REFERRING-PRACTICE',
    rule: 'referringPractice',
    category: 'mandatory-field',
    label: 'referring practice',
    description: 'The referring practice is recorded',
    present: (r) => nonEmpty(r.referrer.referringPractice)
  },
  {
    id: 'R-MANDATORY-REFERRAL-SPECIALTY',
    rule: 'referralSpecialty',
    category: 'mandatory-field',
    label: 'referral specialty',
    description: 'The specialty or service being referred to is recorded',
    present: (r) => nonEmpty(r.destination.referralSpecialty)
  },
  {
    id: 'R-MANDATORY-URGENCY',
    rule: 'urgency',
    category: 'mandatory-field',
    label: 'urgency',
    description: 'An urgency classification is selected',
    present: (r) => nonEmpty(r.urgencyInfo.urgency)
  },
  {
    id: 'R-MANDATORY-REASON',
    rule: 'reasonForReferral',
    category: 'mandatory-field',
    label: 'reason for referral',
    description: 'The reason for the referral is recorded',
    present: (r) => nonEmpty(r.clinical.reasonForReferral)
  },
  {
    id: 'R-MANDATORY-HISTORY',
    rule: 'relevantHistory',
    category: 'mandatory-field',
    label: 'relevant clinical history',
    description: 'Relevant clinical history is recorded',
    present: (r) => nonEmpty(r.clinical.relevantHistory)
  }
];

/**
 * Urgency-conditional mandatory fields. `urgent` and `two-week-wait` add an
 * urgency reason; `two-week-wait` additionally adds a named suspected-cancer
 * criterion and pathway.
 * @type {MandatoryField[]}
 */
const MANDATORY_URGENCY_REASON = {
  id: 'R-MANDATORY-URGENCY-REASON',
  rule: 'urgencyReason',
  category: 'conditional-requirement',
  label: 'urgency reason',
  description: 'A reason for the urgency is recorded (required for urgent and two-week-wait)',
  present: (r) => nonEmpty(r.urgencyInfo.urgencyReason)
};

const MANDATORY_SUSPECTED_CANCER_CRITERION = {
  id: 'R-MANDATORY-SUSPECTED-CANCER-CRITERION',
  rule: 'suspectedCancerCriterion',
  category: 'conditional-requirement',
  label: 'suspected-cancer criterion',
  description: 'A named NICE NG12 suspected-cancer criterion is recorded (required for two-week-wait)',
  present: (r) => nonEmpty(r.urgencyInfo.suspectedCancerCriterion)
};

const MANDATORY_SUSPECTED_CANCER_PATHWAY = {
  id: 'R-MANDATORY-SUSPECTED-CANCER-PATHWAY',
  rule: 'suspectedCancerPathway',
  category: 'conditional-requirement',
  label: 'suspected-cancer pathway',
  description: 'A tumour-site suspected-cancer pathway is recorded (required for two-week-wait)',
  present: (r) => nonEmpty(r.urgencyInfo.suspectedCancerPathway)
};

/**
 * The full mandatory-field set for the referral's selected urgency: the
 * always-mandatory set plus any urgency-conditional fields.
 * @param {Referral} r
 * @returns {MandatoryField[]}
 */
function mandatoryFor(r) {
  const urgency = r.urgencyInfo.urgency;
  const fields = MANDATORY_ALWAYS.slice();
  if (urgency === 'urgent' || urgency === 'two-week-wait') {
    fields.push(MANDATORY_URGENCY_REASON);
  }
  if (urgency === 'two-week-wait') {
    fields.push(MANDATORY_SUSPECTED_CANCER_CRITERION);
    fields.push(MANDATORY_SUSPECTED_CANCER_PATHWAY);
  }
  return fields;
}

export { nonEmpty, hasDate, MANDATORY_ALWAYS, MANDATORY_URGENCY_REASON, MANDATORY_SUSPECTED_CANCER_CRITERION, MANDATORY_SUSPECTED_CANCER_PATHWAY, mandatoryFor };
