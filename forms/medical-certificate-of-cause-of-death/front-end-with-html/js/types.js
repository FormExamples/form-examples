// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Medical Certificate of Cause of
// Death (MCCD) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_medical_certificate_of_cause_of_death.sql`. This file
// builds and exports the canonical empty DeathCertificate shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (enum labels and
// validity-class / CSS-class hints).
//
// This is a STATUTORY DOCUMENTATION instrument, not a numeric severity score and
// NOT a substitute for the certifying doctor's, coroner's, or medical examiner's
// statutory judgement. The engine checks that the certificate is internally
// complete and internally consistent, classifies it as `valid` / `incomplete` /
// `refer-to-coroner`, derives the underlying cause, and raises flags. The
// prescribed statutory certificate remains the definitive legal record.

/**
 * @typedef {'female' | 'male' | 'other' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'consultant' | 'sas' | 'registrar' | 'foundation' | 'gp' | 'other' | ''} DoctorGrade
 * @typedef {'certifier' | 'another-practitioner' | 'not-seen' | ''} SeenAfterDeathBy
 * @typedef {'unnatural' | 'violent' | 'suspicious' | 'unknown-cause' | 'industrial-disease' | 'medical-procedure' | 'custody' | 'no-attending-practitioner' | 'other' | 'none' | ''} CoronerReason
 * @typedef {'scrutinised' | 'discussed' | 'pending' | 'not-required' | ''} MedicalExaminerStatus
 * @typedef {'valid' | 'incomplete' | 'refer-to-coroner'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — certification context.
 * @typedef {Object} Certification
 * @property {string} certifyingDoctorName
 * @property {DoctorGrade} certifyingDoctorGrade
 * @property {string} gmcReference
 * @property {string} placeOfCertification
 * @property {string | null} certificationDate   - ISO date; null when unset
 * @property {YesNo} attendedDeceased
 * @property {string | null} lastSeenAliveDate    - ISO date; null when unset
 */

/**
 * Step 2 — deceased identification.
 * @typedef {Object} Deceased
 * @property {string} deceasedName
 * @property {Sex} sex
 * @property {string | null} dateOfBirth          - ISO date; null when unset
 * @property {number | null} ageYears
 * @property {string} patientIdentifier
 */

/**
 * Step 3 — death details.
 * @typedef {Object} Death
 * @property {string | null} dateOfDeath          - ISO date; null when unset
 * @property {string | null} timeOfDeath          - HH:MM; null when unset
 * @property {string} placeOfDeath
 * @property {SeenAfterDeathBy} seenAfterDeathBy
 */

/**
 * Step 4 — Part I direct causal sequence (I(a) -> I(b) -> I(c)).
 * @typedef {Object} PartI
 * @property {string} causeIaCondition
 * @property {string} causeIaInterval
 * @property {string} causeIbCondition
 * @property {string} causeIbInterval
 * @property {string} causeIcCondition
 * @property {string} causeIcInterval
 */

/**
 * Step 5 — Part II contributory conditions.
 * @typedef {Object} PartII
 * @property {string} partIiConditions
 * @property {string} partIiInterval
 */

/**
 * Step 6 — coroner and medical-examiner referral.
 * @typedef {Object} Referral
 * @property {YesNo} referredToCoroner
 * @property {CoronerReason} coronerReason
 * @property {MedicalExaminerStatus} medicalExaminerStatus
 * @property {string} certifierNote
 */

/**
 * @typedef {Object} DeathCertificate
 * @property {Certification} certification
 * @property {Deceased} deceased
 * @property {Death} death
 * @property {PartI} partI
 * @property {PartII} partII
 * @property {Referral} referral
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} ValidationResult
 * @property {ValidityClass} validityClass
 * @property {string} underlyingCause            - '' when Part I empty
 * @property {boolean} coronerReferralIndicated
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank certificate.
 * Text / enum fields default to `''`; numeric, date, and time fields to `null`.
 * @returns {DeathCertificate}
 */
function emptyCertificate() {
  return {
    certification: {
      certifyingDoctorName: '',
      certifyingDoctorGrade: '',
      gmcReference: '',
      placeOfCertification: '',
      certificationDate: null,
      attendedDeceased: '',
      lastSeenAliveDate: null
    },
    deceased: {
      deceasedName: '',
      sex: '',
      dateOfBirth: null,
      ageYears: null,
      patientIdentifier: ''
    },
    death: {
      dateOfDeath: null,
      timeOfDeath: null,
      placeOfDeath: '',
      seenAfterDeathBy: ''
    },
    partI: {
      causeIaCondition: '',
      causeIaInterval: '',
      causeIbCondition: '',
      causeIbInterval: '',
      causeIcCondition: '',
      causeIcInterval: ''
    },
    partII: {
      partIiConditions: '',
      partIiInterval: ''
    },
    referral: {
      referredToCoroner: '',
      coronerReason: '',
      medicalExaminerStatus: '',
      certifierNote: ''
    }
  };
}

/** Validity-class label for display. */
function validityClassLabel(cls) {
  switch (cls) {
    case 'valid': return 'Valid';
    case 'incomplete': return 'Incomplete';
    case 'refer-to-coroner': return 'Refer to coroner';
    default: return '';
  }
}

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'valid': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'refer-to-coroner': return 'risk-high';
    default: return '';
  }
}

/** Certifying-doctor-grade label. */
function gradeLabel(value) {
  switch (value) {
    case 'consultant': return 'Consultant';
    case 'sas': return 'SAS doctor';
    case 'registrar': return 'Registrar';
    case 'foundation': return 'Foundation doctor';
    case 'gp': return 'General practitioner';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Sex label. */
function sexLabel(value) {
  switch (value) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'other': return 'Other';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Seen-after-death-by label. */
function seenAfterDeathByLabel(value) {
  switch (value) {
    case 'certifier': return 'By the certifying doctor';
    case 'another-practitioner': return 'By another practitioner';
    case 'not-seen': return 'Not seen after death';
    default: return '';
  }
}

/** Coroner-referral-reason label. */
function coronerReasonLabel(value) {
  switch (value) {
    case 'unnatural': return 'Unnatural death';
    case 'violent': return 'Violent death';
    case 'suspicious': return 'Suspicious circumstances';
    case 'unknown-cause': return 'Cause of death unknown';
    case 'industrial-disease': return 'Industrial disease or occupational exposure';
    case 'medical-procedure': return 'Possibly due to a medical procedure, treatment, or neglect';
    case 'custody': return 'Death in custody or state detention';
    case 'no-attending-practitioner': return 'No attending practitioner able to certify';
    case 'other': return 'Other reportable circumstance';
    case 'none': return 'None — no referral criterion met';
    default: return '';
  }
}

/** Medical-examiner-status label. */
function medicalExaminerStatusLabel(value) {
  switch (value) {
    case 'scrutinised': return 'Scrutinised by a medical examiner';
    case 'discussed': return 'Discussed with a medical examiner';
    case 'pending': return 'Scrutiny pending';
    case 'not-required': return 'Not required (coroner case)';
    default: return '';
  }
}

/** Yes / No label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyCertificate, validityClassLabel, validityClassClass, gradeLabel, sexLabel, seenAfterDeathByLabel, coronerReasonLabel, medicalExaminerStatusLabel, yesNoLabel, priorityLabel };
