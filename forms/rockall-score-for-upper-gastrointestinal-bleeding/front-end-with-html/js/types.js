// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Rockall Score for Upper
// Gastrointestinal Bleeding form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_rockall_score_for_upper_gastrointestinal_bleeding.sql`.
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel,
// sexLabel, comorbidityLabel, endoscopyPerformedLabel, diagnosisLabel,
// stigmataLabel, shockLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'gastroenterologist' | 'endoscopist' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'ward' | 'endoscopy-unit' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'none' | 'major' | 'severe' | ''} Comorbidity
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mallory-weiss-or-none' | 'all-other' | 'upper-gi-malignancy' | ''} Diagnosis
 * @typedef {'none-or-dark-spot' | 'high-risk' | ''} Stigmata
 * @typedef {'low' | 'intermediate' | 'high' | 'clinical-only'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} presentingComplaint
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears   - whole years; 0 (<60), 1 (60-79), 2 (>=80)
 * @property {Sex} sex
 */

/**
 * Step 3 — shock (clinical parameter, derived from two vital signs).
 * @typedef {Object} Shock
 * @property {number | null} systolicBloodPressure - mmHg; SBP < 100 scores 2 (hypotension)
 * @property {number | null} heartRate             - bpm; HR >= 100 scores 1 (tachycardia) when not hypotensive
 */

/**
 * Step 4 — comorbidity (clinical parameter).
 * @typedef {Object} ComorbidityStep
 * @property {Comorbidity} comorbidity  - none (0), major (2), severe (3)
 */

/**
 * Step 5 — endoscopy (gates the full score) and the two endoscopic parameters.
 * @typedef {Object} Endoscopy
 * @property {YesNo} endoscopyPerformed
 * @property {Diagnosis} diagnosis      - endoscopic diagnosis (full score only)
 * @property {Stigmata} stigmata        - stigmata of recent haemorrhage (full score only)
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
 * @property {Shock} shock
 * @property {ComorbidityStep} comorbidityStep
 * @property {Endoscopy} endoscopy
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-AGE-2POINT-01
 * @property {string} parameter    - age | shock | comorbidity | diagnosis | stigmata | band
 * @property {number | null} points - points contributed for the parameter, or null
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
 * @property {0 | 1 | 2} agePoints
 * @property {0 | 1 | 2} shockPoints
 * @property {0 | 2 | 3} comorbidityPoints
 * @property {number} clinicalRockallScore     - 0..7
 * @property {0 | 1 | 2} diagnosisPoints
 * @property {0 | 2} stigmataPoints
 * @property {number | null} fullRockallScore   - 0..11 or null (no endoscopy)
 * @property {RiskBand} riskBand
 * @property {number} score                     - fullRockallScore ?? clinicalRockallScore
 * @property {boolean} endoscopyDone
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.RockallScoreForUpperGastrointestinalBleeding`.
(function () {
'use strict';
window.RockallScoreForUpperGastrointestinalBleeding =
  window.RockallScoreForUpperGastrointestinalBleeding || {};

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
      presentingComplaint: ''
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    shock: {
      systolicBloodPressure: null,
      heartRate: null
    },
    comorbidityStep: {
      comorbidity: ''
    },
    endoscopy: {
      endoscopyPerformed: '',
      diagnosis: '',
      stigmata: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk';
    case 'intermediate': return 'Intermediate risk';
    case 'high': return 'High risk';
    case 'clinical-only': return 'Clinical score only (pre-endoscopy)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'intermediate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'clinical-only': return 'risk-moderate';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'gastroenterologist': return 'Gastroenterologist';
    case 'endoscopist': return 'Endoscopist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'ward': return 'Acute / gastroenterology ward';
    case 'endoscopy-unit': return 'Endoscopy unit';
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

/** Comorbidity label. */
function comorbidityLabel(value) {
  switch (value) {
    case 'none': return 'No major comorbidity';
    case 'major': return 'Cardiac failure, ischaemic heart disease, or any major comorbidity';
    case 'severe': return 'Renal failure, liver failure, or disseminated malignancy';
    default: return '';
  }
}

/** Endoscopy-performed label. */
function endoscopyPerformedLabel(value) {
  switch (value) {
    case 'yes': return 'Endoscopy performed';
    case 'no': return 'Endoscopy not yet performed';
    default: return '';
  }
}

/** Endoscopic-diagnosis label. */
function diagnosisLabel(value) {
  switch (value) {
    case 'mallory-weiss-or-none': return 'Mallory-Weiss tear or no lesion / no stigmata';
    case 'all-other': return 'All other diagnoses';
    case 'upper-gi-malignancy': return 'Malignancy of the upper GI tract';
    default: return '';
  }
}

/** Stigmata-of-recent-haemorrhage label. */
function stigmataLabel(value) {
  switch (value) {
    case 'none-or-dark-spot': return 'None, or dark spot only';
    case 'high-risk': return 'Blood, adherent clot, or visible / spurting vessel';
    default: return '';
  }
}

/** Human label for the derived shock band (0/1/2 points). */
function shockLabel(points) {
  switch (points) {
    case 2: return 'Hypotension (systolic BP < 100 mmHg)';
    case 1: return 'Tachycardia (heart rate >= 100 bpm)';
    case 0: return 'No shock';
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

Object.assign(window.RockallScoreForUpperGastrointestinalBleeding, {
  emptyAssessment,
  riskBandLabel,
  riskBandClass,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  comorbidityLabel,
  endoscopyPerformedLabel,
  diagnosisLabel,
  stigmataLabel,
  shockLabel,
  priorityLabel
});
})();
