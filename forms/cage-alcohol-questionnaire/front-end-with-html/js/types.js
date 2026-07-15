// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the CAGE Alcohol Questionnaire form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_cage_alcohol_questionnaire.sql`. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers
// (resultBandLabel, resultBandClass, clinicianRoleLabel, careSettingLabel,
// sexLabel, ageBandLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'midwife' | 'other' | ''} ClinicianRole
 * @typedef {'primary-care' | 'ward' | 'emergency-department' | 'antenatal' | 'other' | ''} CareSetting
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'negative' | 'low' | 'positive'} ResultBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Steps 3-6 — the four lifetime CAGE criterion inputs. Each is a yes/no
 * question scoring 1 point for 'yes' and 0 otherwise.
 * @typedef {Object} Criteria
 * @property {YesNo} cutDown    - C: felt you should cut down on drinking
 * @property {YesNo} annoyed    - A: people annoyed you by criticising your drinking
 * @property {YesNo} guilty     - G: felt bad or guilty about your drinking
 * @property {YesNo} eyeOpener  - E: morning drink to steady nerves or cure a hangover
 */

/**
 * Step 7 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Criteria} criteria
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-EYE-OPENER-1POINT-01
 * @property {string} criterion    - cut-down | annoyed | guilty | eye-opener | total
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
 * @property {0 | 1} cutDownPoint
 * @property {0 | 1} annoyedPoint
 * @property {0 | 1} guiltyPoint
 * @property {0 | 1} eyeOpenerPoint
 * @property {0 | 1 | 2 | 3 | 4} cageScore
 * @property {ResultBand} resultBand
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.CageAlcoholQuestionnaire`.

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
      careSetting: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    criteria: {
      cutDown: '',
      annoyed: '',
      guilty: '',
      eyeOpener: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Result-band label for display. */
function resultBandLabel(band) {
  switch (band) {
    case 'negative': return 'Negative (CAGE 0)';
    case 'low': return 'Sub-threshold (CAGE 1)';
    case 'positive': return 'Positive (CAGE 2-4)';
    default: return '';
  }
}

/** CSS class hint for the result-band badge (reuses the shared risk palette). */
function resultBandClass(band) {
  switch (band) {
    case 'negative': return 'risk-low';
    case 'low': return 'risk-moderate';
    case 'positive': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'midwife': return 'Midwife';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'primary-care': return 'Primary care';
    case 'ward': return 'Ward';
    case 'emergency-department': return 'Emergency department';
    case 'antenatal': return 'Antenatal';
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

export { emptyAssessment, resultBandLabel, resultBandClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, priorityLabel };
