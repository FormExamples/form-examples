// Declarative Mental Health Act classification rules.
//
// This form is a DOCUMENTATION and LEGAL-COMPLETENESS instrument, not a scored
// assessment. It maps the recommended section to a section class, then looks up
// that class's REQUIRED SIGNATORIES and REQUIRED CRITERIA (spec §4, steps 2-3).
// The grader (`grader.js`) marks the assessment `valid` only when every required
// signatory is present AND every required criterion is `met` with evidence;
// otherwise `incomplete`. It makes NO automated detention decision.
//
// Rows here mirror the `mental_health_act_assessment_grade_rule` SQL table
// (rule_id, category, description). Nothing in this file decides whether a
// person should be detained — it only records what the chosen section requires.

/**
 * @typedef {import('./types.js').MentalHealthActAssessment} MentalHealthActAssessment
 * @typedef {import('./types.js').RecommendedSection} RecommendedSection
 * @typedef {import('./types.js').RecommendedSectionClass} RecommendedSectionClass
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/**
 * Map the raw `recommendedSection` enum to the section class (spec §4 step 1).
 * An unanswered section ('') maps to 'none'.
 * @param {RecommendedSection} section
 * @returns {RecommendedSectionClass}
 */
function sectionToClass(section) {
  switch (section) {
    case '2':   return 'section-2';
    case '3':   return 'section-3';
    case '4':   return 'section-4';
    case '5-2': return 'section-5-2';
    case '5-4': return 'section-5-4';
    case '136': return 'section-136';
    case 'none': return 'none';
    default:    return 'none';
  }
}

// A detaining / holding class is any class other than 'none'. All of these
// deprive a person of liberty and therefore require statutory documentation.
const DETAINING_CLASSES = [
  'section-2', 'section-3', 'section-4',
  'section-5-2', 'section-5-4', 'section-136'
];

/**
 * True when the class is a detaining or holding power (i.e. not 'none').
 * @param {RecommendedSectionClass} cls
 */
function isDetaining(cls) {
  return DETAINING_CLASSES.indexOf(cls) !== -1;
}

// ----------------------------------------------------------------------
// Required signatories per section class (spec §4 step 2)
// ----------------------------------------------------------------------
//
// Each entry is a signatory-slot descriptor. `present(d)` reports whether the
// documentation records that signatory. The `role`/`label` describe the slot.

const amhpApproved = (d) => d.professionals.amhpApproved === 'yes';
const amhpPresent = (d) => nonEmpty(d.professionals.amhpName);
const doctor1Present = (d) => nonEmpty(d.professionals.doctor1Name);
const doctor2Present = (d) => nonEmpty(d.professionals.doctor2Name);
const anyS12 = (d) =>
  d.professionals.doctor1Section12Approved === 'yes' ||
  d.professionals.doctor2Section12Approved === 'yes';

/** @type {Record<string, {role: string, label: string, present: (d: MentalHealthActAssessment) => boolean}[]>} */
const SIGNATORIES = {
  'section-2': [
    { role: 'amhp', label: 'AMHP approval confirmed (or nearest-relative applicant)', present: amhpApproved },
    { role: 'doctor1', label: 'First medical recommendation', present: doctor1Present },
    { role: 'doctor2', label: 'Second medical recommendation', present: doctor2Present },
    { role: 's12', label: 'At least one doctor Section 12 approved', present: anyS12 }
  ],
  'section-3': [
    { role: 'amhp', label: 'AMHP approval confirmed (or nearest-relative applicant)', present: amhpApproved },
    { role: 'doctor1', label: 'First medical recommendation', present: doctor1Present },
    { role: 'doctor2', label: 'Second medical recommendation', present: doctor2Present },
    { role: 's12', label: 'At least one doctor Section 12 approved', present: anyS12 }
  ],
  'section-4': [
    { role: 'amhp', label: 'AMHP approval confirmed (or nearest-relative applicant)', present: amhpApproved },
    { role: 'doctor1', label: 'One medical recommendation', present: doctor1Present }
  ],
  'section-5-2': [
    { role: 'doctor1', label: 'Registered clinician in charge of the patient’s treatment', present: doctor1Present }
  ],
  'section-5-4': [
    { role: 'doctor1', label: 'Nurse of the prescribed class (recorded in the practitioner slot)', present: doctor1Present }
  ],
  'section-136': [
    { role: 'amhp', label: 'AMHP present at the place of safety', present: amhpPresent },
    { role: 'doctor1', label: 'Doctor present at the place of safety', present: doctor1Present }
  ],
  'none': []
};

// ----------------------------------------------------------------------
// Required criteria per section class (spec §4 step 3)
// ----------------------------------------------------------------------
//
// Each entry is a criterion-slot descriptor. `status(d)` returns the recorded
// enum; `evidence(d)` returns the supporting-evidence text. A criterion is
// satisfied for VALIDITY when status === 'met' AND evidence is non-empty.
//
// The `risk` criterion is satisfied when ANY of the three risk limbs is 'met';
// its status is derived (met when a limb is met, not-met when a limb is
// explicitly not-met and none is met, else '').

/** Derive the combined risk-limb status. */
function riskLimbStatus(d) {
  const limbs = [
    d.risk.riskToOwnHealth,
    d.risk.riskToOwnSafety,
    d.risk.riskToOthers
  ];
  if (limbs.indexOf('met') !== -1) return 'met';
  if (limbs.indexOf('not-met') !== -1) return 'not-met';
  return '';
}

const CRITERIA_MENTAL_DISORDER = {
  criterion: 'mental-disorder',
  label: 'Mental disorder of a nature or degree (criterion 1)',
  status: (d) => d.mentalDisorder.mentalDisorderPresent,
  evidence: (d) => d.mentalDisorder.mentalDisorderEvidence
};
const CRITERIA_RISK = {
  criterion: 'risk',
  label: 'Risk to own health, own safety, or others (criterion 2)',
  status: (d) => riskLimbStatus(d),
  evidence: (d) => d.risk.riskEvidence
};
const CRITERIA_LEAST_RESTRICTIVE = {
  criterion: 'least-restrictive',
  label: 'No less restrictive alternative (criterion 3)',
  status: (d) => d.leastRestrictive.leastRestrictiveMet,
  evidence: (d) => d.leastRestrictive.alternativesConsidered
};
const CRITERIA_TREATMENT = {
  criterion: 'appropriate-treatment',
  label: 'Appropriate medical treatment available (criterion 4, s3)',
  status: (d) => d.treatment.appropriateTreatmentAvailable,
  evidence: (d) => d.treatment.treatmentPlanSummary
};

const BASE_CRITERIA = [
  CRITERIA_MENTAL_DISORDER,
  CRITERIA_RISK,
  CRITERIA_LEAST_RESTRICTIVE
];

/** @type {Record<string, typeof BASE_CRITERIA>} */
const CRITERIA = {
  'section-2': BASE_CRITERIA,
  'section-4': BASE_CRITERIA,
  'section-5-2': BASE_CRITERIA,
  'section-5-4': BASE_CRITERIA,
  'section-136': BASE_CRITERIA,
  'section-3': BASE_CRITERIA.concat([CRITERIA_TREATMENT]),
  'none': []
};

export { nonEmpty, sectionToClass, isDetaining, riskLimbStatus, DETAINING_CLASSES, SIGNATORIES, CRITERIA };
