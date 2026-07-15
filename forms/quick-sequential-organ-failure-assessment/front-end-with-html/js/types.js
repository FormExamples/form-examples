// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Quick Sequential Organ Failure
// Assessment (qSOFA) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_quick_sequential_organ_failure_assessment.sql`. This
// file builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel,
// sexLabel, ageBandLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'paramedic' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'ward' | 'pre-hospital' | 'other' | ''} CareSetting
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'lower' | 'higher'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} suspectedSource
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — respiratory rate (criterion 1).
 * @typedef {Object} Respiratory
 * @property {number | null} respiratoryRate  - breaths/min; positive when >= 22
 */

/**
 * Step 4 — mentation (criterion 2).
 * @typedef {Object} Mentation
 * @property {number | null} glasgowComaScale - GCS total 3-15; positive when < 15
 * @property {YesNo} mentationAltered         - bedside fallback when GCS unavailable
 */

/**
 * Step 5 — systolic blood pressure (criterion 3).
 * @typedef {Object} Circulation
 * @property {number | null} systolicBloodPressure - mmHg; positive when <= 100
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
 * @property {Respiratory} respiratory
 * @property {Mentation} mentation
 * @property {Circulation} circulation
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-RESPIRATORY-RATE-01
 * @property {string} criterion    - respiratory-rate | mentation | systolic-blood-pressure | band
 * @property {number} points       - point contributed (0 or 1)
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
 * @property {0 | 1} respiratoryRatePoint
 * @property {0 | 1} mentationPoint
 * @property {0 | 1} systolicBloodPressurePoint
 * @property {0 | 1 | 2 | 3} qsofaScore
 * @property {RiskBand} riskBand
 * @property {YesNo} thresholdMet
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.QuickSequentialOrganFailureAssessment`.

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
      suspectedSource: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    respiratory: {
      respiratoryRate: null
    },
    mentation: {
      glasgowComaScale: null,
      mentationAltered: ''
    },
    circulation: {
      systolicBloodPressure: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'lower': return 'Lower risk (qSOFA 0-1)';
    case 'higher': return 'Higher risk (qSOFA 2-3)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'lower': return 'risk-low';
    case 'higher': return 'risk-high';
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
    case 'ward': return 'Ward';
    case 'pre-hospital': return 'Pre-hospital';
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

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, priorityLabel };
