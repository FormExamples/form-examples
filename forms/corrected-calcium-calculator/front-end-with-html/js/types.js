// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Corrected Calcium Calculator.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_corrected_calcium_calculator.sql`
// (`total_calcium_mmol_l` -> `totalCalcium`, `albumin_g_l` -> `albumin`,
// `symptomatic` -> `symptomatic`). This file builds and exports the canonical
// empty AssessmentData shape used by the wizard, so that newly-added fields
// automatically default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers (classificationLabel,
// classificationClass, clinicianRoleLabel, careSettingLabel, sexLabel,
// ageBandLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'laboratory-staff' | 'other' | ''} ClinicianRole
 * @typedef {'general-practice' | 'ward' | 'emergency-department' | 'outpatient' | 'laboratory' | 'other' | ''} CareSetting
 * @typedef {'18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'hypocalcaemia' | 'normal' | 'hypercalcaemia' | 'unknown'} Classification
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} sampleReference
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — measured total calcium (calculation input 1).
 * @typedef {Object} Calcium
 * @property {number | null} totalCalcium  - measured total serum calcium in mmol/L
 */

/**
 * Step 4 — measured serum albumin (calculation input 2).
 * @typedef {Object} Albumin
 * @property {number | null} albumin       - measured serum albumin in g/L
 */

/**
 * Step 5 — calcium-related symptoms.
 * @typedef {Object} Symptoms
 * @property {YesNo} symptomatic           - supports the symptomatic-hypercalcaemia flag
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
 * @property {Calcium} calcium
 * @property {Albumin} albumin
 * @property {Symptoms} symptoms
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-CLASSIFY-NORMAL-01
 * @property {string} instrument   - correction | classification | severity | composite
 * @property {string} band         - hypocalcaemia | normal | hypercalcaemia | unknown
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
 * @property {number | null} correctedCalcium     - mmol/L, rounded to 2 dp for display
 * @property {number | null} correctedCalciumRaw  - unrounded; used for classification and flag thresholds
 * @property {Classification} classification
 * @property {FiredRule[]} firedRules
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
      sampleReference: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    calcium: {
      totalCalcium: null
    },
    albumin: {
      albumin: null
    },
    symptoms: {
      symptomatic: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Classification label for display. */
function classificationLabel(classification) {
  switch (classification) {
    case 'hypocalcaemia': return 'Hypocalcaemia (< 2.20 mmol/L)';
    case 'normal': return 'Normal (2.20–2.60 mmol/L)';
    case 'hypercalcaemia': return 'Hypercalcaemia (> 2.60 mmol/L)';
    case 'unknown': return 'Awaiting both inputs';
    default: return '';
  }
}

/** CSS class hint for the classification badge (reuses the shared risk palette). */
function classificationClass(classification) {
  switch (classification) {
    case 'normal': return 'risk-low';
    case 'hypocalcaemia': return 'risk-medium';
    case 'hypercalcaemia': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'laboratory-staff': return 'Laboratory staff';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'ward': return 'Ward';
    case 'emergency-department': return 'Emergency department';
    case 'outpatient': return 'Outpatient';
    case 'laboratory': return 'Laboratory';
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
    case '18-39': return '18-39';
    case '40-64': return '40-64';
    case '65-74': return '65-74';
    case '75-84': return '75-84';
    case '85-plus': return '85 and over';
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

export { emptyAssessment, classificationLabel, classificationClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, priorityLabel };
