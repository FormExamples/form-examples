// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Anion Gap Calculator.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_anion_gap_calculator.sql`
// (`sodium_mmol_l` -> `sodium`, `potassium_mmol_l` -> `potassium`,
// `chloride_mmol_l` -> `chloride`, `bicarbonate_mmol_l` -> `bicarbonate`,
// `albumin_g_l` -> `albumin`). Whether potassium is included in the formula
// (`include_potassium`) is *derived* from whether a potassium value is entered
// (`includesPotassium = potassium != null`), per spec §4, so the wizard exposes
// no separate toggle. This file builds and exports the canonical empty
// AssessmentData shape used by the wizard, so that newly-added fields
// automatically default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers (classificationLabel,
// classificationClass, clinicianRoleLabel, careSettingLabel, sexLabel,
// ageBandLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'scientist' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'ward' | 'intensive-care' | 'laboratory' | 'other' | ''} CareSetting
 * @typedef {'18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'low' | 'normal' | 'high' | 'very-high' | 'unknown'} Classification
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} calculatedAt      - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} clinicalContext
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — electrolyte panel (calculation inputs). Sodium, chloride, and
 * bicarbonate are required; potassium is optional and selects the
 * potassium-inclusive formula and reference range.
 * @typedef {Object} Electrolytes
 * @property {number | null} sodium       - serum sodium in mmol/L
 * @property {number | null} potassium    - serum potassium in mmol/L (optional)
 * @property {number | null} chloride     - serum chloride in mmol/L
 * @property {number | null} bicarbonate  - serum bicarbonate (HCO3-) in mmol/L
 */

/**
 * Step 4 — serum albumin (optional; enables the albumin correction).
 * @typedef {Object} Albumin
 * @property {number | null} albumin       - serum albumin in g/L
 */

/**
 * Step 5 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Electrolytes} electrolytes
 * @property {Albumin} albumin
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-CLASSIFY-HIGH-01
 * @property {string} instrument   - formula | correction | classification | composite
 * @property {string} band         - low | normal | high | very-high | ''
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
 * @property {boolean} includesPotassium
 * @property {number | null} anionGap             - mmol/L, rounded to 1 dp for display
 * @property {number | null} anionGapRaw          - unrounded raw anion gap
 * @property {number | null} correctedAnionGap    - mmol/L, rounded to 1 dp for display
 * @property {number | null} correctedAnionGapRaw - unrounded albumin-corrected gap
 * @property {number} normalLow
 * @property {number} normalHigh
 * @property {number | null} classificationValue  - unrounded value driving the band
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
      calculatedAt: '',
      careSetting: '',
      clinicalContext: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    electrolytes: {
      sodium: null,
      potassium: null,
      chloride: null,
      bicarbonate: null
    },
    albumin: {
      albumin: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Classification label for display. */
function classificationLabel(classification) {
  switch (classification) {
    case 'low': return 'Low anion gap';
    case 'normal': return 'Normal anion gap';
    case 'high': return 'High anion gap';
    case 'very-high': return 'Very high anion gap (≥ 20)';
    case 'unknown': return 'Awaiting the electrolyte panel';
    default: return '';
  }
}

/** CSS class hint for the classification badge (reuses the shared risk palette). */
function classificationClass(classification) {
  switch (classification) {
    case 'normal': return 'risk-low';
    case 'low': return 'risk-medium';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'scientist': return 'Clinical scientist';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'ward': return 'Ward';
    case 'intensive-care': return 'Intensive care';
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
    case 'urgent': return 'URGENT';
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, classificationLabel, classificationClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, priorityLabel };
