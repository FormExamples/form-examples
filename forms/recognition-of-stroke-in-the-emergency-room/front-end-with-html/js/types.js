// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Recognition Of Stroke In the
// Emergency Room (ROSIER) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_recognition_of_stroke_in_the_emergency_room.sql`. This
// file builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (bandLabel, bandClass, clinicianRoleLabel, careSettingLabel,
// sexLabel, ageBandLabel, hypoglycaemiaCorrectedLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'paramedic' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'acute-medical' | 'other' | ''} CareSetting
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'na' | ''} YesNoNa
 * @typedef {'stroke-unlikely' | 'stroke-likely'} Band
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} symptomOnsetAt    - ISO-ish datetime-local string; '' when unset
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — blood-glucose precondition. Measured before scoring; a value < 3.5
 * mmol/L flags the hypoglycaemia mimic and the ROSIER score is not valid while
 * the patient is hypoglycaemic.
 * @typedef {Object} Precondition
 * @property {number | null} bloodGlucose          - mmol/L
 * @property {YesNoNa} hypoglycaemiaCorrected
 */

/**
 * Step 4 — mimic-exclusion criteria (each scores -1 if yes).
 * @typedef {Object} Mimics
 * @property {YesNo} lossOfConsciousness   - LOC / syncope
 * @property {YesNo} seizureActivity
 */

/**
 * Step 5 — acute-onset neurological signs (each scores +1 if yes).
 * @typedef {Object} Signs
 * @property {YesNo} facialWeakness
 * @property {YesNo} armWeakness
 * @property {YesNo} legWeakness
 * @property {YesNo} speechDisturbance
 * @property {YesNo} visualFieldDefect
 */

/**
 * Step 6 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Precondition} precondition
 * @property {Mimics} mimics
 * @property {Signs} signs
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-FACIAL-WEAKNESS-01
 * @property {string} criterion    - loss-of-consciousness | seizure-activity | facial-weakness | ... | band
 * @property {number} points       - point contributed (-1, +1, or 0 for the band row)
 * @property {string} category
 * @property {string} description
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
 * @typedef {Object} GradingResult
 * @property {number} rosierScore  - signed total -2..+5
 * @property {Band} band
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      symptomOnsetAt: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    precondition: {
      bloodGlucose: null,
      hypoglycaemiaCorrected: ''
    },
    mimics: {
      lossOfConsciousness: '',
      seizureActivity: ''
    },
    signs: {
      facialWeakness: '',
      armWeakness: '',
      legWeakness: '',
      speechDisturbance: '',
      visualFieldDefect: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Band label for display. */
function bandLabel(band) {
  switch (band) {
    case 'stroke-likely': return 'Stroke likely (ROSIER > 0)';
    case 'stroke-unlikely': return 'Stroke unlikely (ROSIER ≤ 0)';
    default: return '';
  }
}

/** CSS class hint for the band badge (reuses the shared risk palette). */
function bandClass(band) {
  switch (band) {
    case 'stroke-likely': return 'risk-high';
    case 'stroke-unlikely': return 'risk-low';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'paramedic': return 'Paramedic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'acute-medical': return 'Acute medical';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Adult age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case '16-39': return '16-39';
    case '40-59': return '40-59';
    case '60-74': return '60-74';
    case '75-plus': return '75 and over';
    default: return '';
  }
}

/** Hypoglycaemia-corrected label. */
function hypoglycaemiaCorrectedLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'na': return 'Not applicable';
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

export { emptyAssessment, bandLabel, bandClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, hypoglycaemiaCorrectedLabel, priorityLabel };
