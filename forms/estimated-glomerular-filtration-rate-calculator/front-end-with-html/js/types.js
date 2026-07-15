// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the eGFR Calculator.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_estimated_glomerular_filtration_rate_calculator.sql`
// (`serum_creatinine_umol_l` -> `serumCreatinine`, `age_years` -> `ageYears`,
// `sex` -> `sex`, `steady_state` -> `steadyState`, `equation` -> `equation`).
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (stageLabel, stageClass, clinicianRoleLabel, careSettingLabel,
// sexLabel, equationLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'laboratory' | 'other' | ''} ClinicianRole
 * @typedef {'primary-care' | 'secondary-care' | 'laboratory' | 'pharmacy' | 'other' | ''} CareSetting
 * @typedef {'ckd-epi-2021-creatinine' | 'ckd-epi-2021-cystatin-c' | 'mdrd' | ''} Equation
 * @typedef {'female' | 'male' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null} GStage
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {Equation} equation
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears   - patient age in whole years
 * @property {Sex} sex                  - drives kappa, alpha, and the female multiplier
 */

/**
 * Step 3 — serum creatinine (the single calculation input).
 * @typedef {Object} Creatinine
 * @property {number | null} serumCreatinine - standardised serum creatinine in umol/L
 * @property {string} specimenDate           - ISO date string; '' when unset
 * @property {YesNo} steadyState             - whether renal function is at steady state
 */

/**
 * Step 4 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Creatinine} creatinine
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-STAGE-G3A-01
 * @property {string} instrument   - conversion | equation | staging
 * @property {string} band         - G1 | G2 | G3a | G3b | G4 | G5 | unknown
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
 * @property {number | null} serumCreatinineMgDl - derived serum creatinine in mg/dL
 * @property {number | null} egfr                - mL/min/1.73 m^2, rounded for display
 * @property {number | null} egfrRaw             - unrounded; drives banding and flag thresholds
 * @property {GStage} egfrStage
 * @property {string} egfrStageLabel
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric/date fields default to `null`/`''`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      equation: 'ckd-epi-2021-creatinine'
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    creatinine: {
      serumCreatinine: null,
      specimenDate: '',
      steadyState: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** CKD G-stage label for display. */
function stageLabel(stage) {
  switch (stage) {
    case 'G1': return 'G1 — Normal or high (≥ 90)';
    case 'G2': return 'G2 — Mildly decreased (60–89)';
    case 'G3a': return 'G3a — Mildly to moderately decreased (45–59)';
    case 'G3b': return 'G3b — Moderately to severely decreased (30–44)';
    case 'G4': return 'G4 — Severely decreased (15–29)';
    case 'G5': return 'G5 — Kidney failure (< 15)';
    default: return 'Awaiting required inputs';
  }
}

/** CSS class hint for the stage badge (reuses the shared risk palette). */
function stageClass(stage) {
  switch (stage) {
    case 'G1':
    case 'G2': return 'risk-low';
    case 'G3a':
    case 'G3b': return 'risk-medium';
    case 'G4':
    case 'G5': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'laboratory': return 'Laboratory staff';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'primary-care': return 'Primary care';
    case 'secondary-care': return 'Secondary care';
    case 'laboratory': return 'Laboratory';
    case 'pharmacy': return 'Pharmacy';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    default: return '';
  }
}

/** Estimating-equation label. */
function equationLabel(equation) {
  switch (equation) {
    case 'ckd-epi-2021-creatinine': return 'CKD-EPI 2021 creatinine (race-free)';
    case 'ckd-epi-2021-cystatin-c': return 'CKD-EPI 2021 cystatin C';
    case 'mdrd': return 'MDRD (4-variable)';
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

export { emptyAssessment, stageLabel, stageClass, clinicianRoleLabel, careSettingLabel, sexLabel, equationLabel, priorityLabel };
