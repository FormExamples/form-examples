// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Body Mass Index and Body Surface
// Area Calculator.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_body_mass_index_and_body_surface_area_calculator.sql`
// (`height_cm` -> `heightCm`, `weight_kg` -> `weightKg`, `bsa_formula` ->
// `bsaFormula`). This file builds and exports the canonical empty
// AssessmentData shape used by the wizard, so that newly-added fields
// automatically default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers (bmiCategoryLabel,
// bmiCategoryClass, clinicianRoleLabel, careSettingLabel, purposeLabel,
// sexLabel, ageBandLabel, ancestryLabel, bsaFormulaLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'dietitian' | 'other' | ''} ClinicianRole
 * @typedef {'primary-care' | 'outpatient' | 'inpatient' | 'oncology' | 'pre-operative' | 'other' | ''} CareSetting
 * @typedef {'screening' | 'drug-dosing' | 'monitoring' | 'other' | ''} Purpose
 * @typedef {'18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'asian' | 'other' | 'unspecified' | ''} Ancestry
 * @typedef {'mosteller' | 'du-bois' | ''} BsaFormula
 * @typedef {'underweight' | 'normal' | 'overweight' | 'obese-class-1' | 'obese-class-2' | 'obese-class-3' | ''} BmiCategory
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {Purpose} purpose
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {Ancestry} ancestry         - drives the Asian lower-threshold flags
 */

/**
 * Step 3 — measured height (calculation input 1).
 * @typedef {Object} Height
 * @property {number | null} heightCm     - measured height in centimetres
 */

/**
 * Step 4 — measured weight (calculation input 2).
 * @typedef {Object} Weight
 * @property {number | null} weightKg     - measured weight in kilograms
 */

/**
 * Step 5 — results, preferred BSA formula, and clinician free-text note.
 * @typedef {Object} Results
 * @property {BsaFormula} bsaFormula       - which BSA value to show as primary
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Height} height
 * @property {Weight} weight
 * @property {Results} results
 */

/**
 * @typedef {Object} FiredThreshold
 * @property {string} id           - stable threshold id, e.g. T-WHO-OVERWEIGHT-01
 * @property {string} instrument   - bmi-category | asian-threshold
 * @property {string} band         - WHO category or asian action point
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
 * @property {number | null} bmi                - kg/m², rounded to 1 dp for display
 * @property {number | null} bmiRaw             - unrounded; used for banding and flag thresholds
 * @property {BmiCategory} bmiCategory
 * @property {number | null} bsaMosteller       - m², rounded to 2 dp for display
 * @property {number | null} bsaDuBois          - m², rounded to 2 dp for display
 * @property {FiredThreshold[]} firedThresholds
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
      purpose: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      ancestry: ''
    },
    height: {
      heightCm: null
    },
    weight: {
      weightKg: null
    },
    results: {
      bsaFormula: 'mosteller',
      clinicalNote: ''
    }
  };
}

/** WHO BMI category label for display. */
function bmiCategoryLabel(category) {
  switch (category) {
    case 'underweight': return 'Underweight (< 18.5)';
    case 'normal': return 'Normal (18.5–24.9)';
    case 'overweight': return 'Overweight (25.0–29.9)';
    case 'obese-class-1': return 'Obese class I (30.0–34.9)';
    case 'obese-class-2': return 'Obese class II (35.0–39.9)';
    case 'obese-class-3': return 'Obese class III (≥ 40.0)';
    default: return 'Awaiting height and weight';
  }
}

/** CSS class hint for the category badge (reuses the shared risk palette). */
function bmiCategoryClass(category) {
  switch (category) {
    case 'normal': return 'risk-low';
    case 'underweight': return 'risk-medium';
    case 'overweight': return 'risk-medium';
    case 'obese-class-1': return 'risk-high';
    case 'obese-class-2': return 'risk-high';
    case 'obese-class-3': return 'risk-high';
    default: return '';
  }
}

/** Recording-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'dietitian': return 'Dietitian';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'primary-care': return 'Primary care';
    case 'outpatient': return 'Outpatient';
    case 'inpatient': return 'Inpatient';
    case 'oncology': return 'Oncology';
    case 'pre-operative': return 'Pre-operative';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Purpose label. */
function purposeLabel(purpose) {
  switch (purpose) {
    case 'screening': return 'Screening';
    case 'drug-dosing': return 'Drug dosing';
    case 'monitoring': return 'Monitoring';
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

/** Ancestry label (drives the Asian lower-threshold action points). */
function ancestryLabel(ancestry) {
  switch (ancestry) {
    case 'asian': return 'Asian ancestry';
    case 'other': return 'Other ancestry';
    case 'unspecified': return 'Unspecified';
    default: return '';
  }
}

/** Preferred BSA-formula label. */
function bsaFormulaLabel(formula) {
  switch (formula) {
    case 'mosteller': return 'Mosteller';
    case 'du-bois': return 'Du Bois';
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

export { emptyAssessment, bmiCategoryLabel, bmiCategoryClass, clinicianRoleLabel, careSettingLabel, purposeLabel, sexLabel, ageBandLabel, ancestryLabel, bsaFormulaLabel, priorityLabel };
