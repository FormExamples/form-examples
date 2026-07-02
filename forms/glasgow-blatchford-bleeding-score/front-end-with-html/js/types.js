// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Glasgow-Blatchford Bleeding
// Score (GBS) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_glasgow_blatchford_bleeding_score.sql`. This file builds
// and exports the canonical empty AssessmentData shape used by the wizard, so
// that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports display helpers
// (riskBandLabel, riskBandCss, clinicianRoleLabel, careSettingLabel,
// presentingComplaintLabel, sexLabel, ageBandLabel, yesNoLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'advanced-practitioner' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'ward' | 'other' | ''} CareSetting
 * @typedef {'haematemesis' | 'coffee-ground' | 'melaena' | 'other' | ''} PresentingComplaint
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'very-low' | 'low-moderate' | 'high'} RiskBand
 * @typedef {'high' | 'medium' | 'low' | 'info'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {PresentingComplaint} presentingComplaint
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex                  - selects the haemoglobin band table
 */

/**
 * Step 3 — laboratory markers (parameters 1 and 2/3).
 * @typedef {Object} Labs
 * @property {number | null} bloodUrea    - mmol/L; parameter 1
 * @property {number | null} haemoglobin  - g/L; parameters 2/3 (sex-specific)
 */

/**
 * Step 4 — haemodynamics (parameters 4 and 5).
 * @typedef {Object} Haemodynamics
 * @property {number | null} systolicBloodPressure - mmHg; parameter 4
 * @property {number | null} pulse                 - beats/min; parameter 5
 */

/**
 * Step 5 — clinical markers (parameters 6-9).
 * @typedef {Object} ClinicalMarkers
 * @property {YesNo} melaenaPresent   - parameter 6
 * @property {YesNo} syncope          - parameter 7
 * @property {YesNo} hepaticDisease   - parameter 8
 * @property {YesNo} cardiacFailure   - parameter 9
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
 * @property {Labs} labs
 * @property {Haemodynamics} haemodynamics
 * @property {ClinicalMarkers} clinicalMarkers
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-BLOOD-UREA-6POINT-01
 * @property {string} parameter    - blood-urea | haemoglobin | systolic-blood-pressure | pulse | melaena | syncope | hepatic-disease | cardiac-failure | band
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
 * @property {0 | 2 | 3 | 4 | 6} bloodUreaPoints
 * @property {0 | 1 | 3 | 6} haemoglobinPoints
 * @property {0 | 1 | 2 | 3} systolicBloodPressurePoints
 * @property {0 | 1} pulsePoint
 * @property {0 | 1} melaenaPoint
 * @property {0 | 2} syncopePoint
 * @property {0 | 2} hepaticDiseasePoint
 * @property {0 | 2} cardiacFailurePoint
 * @property {number} gbsScore                 - 0..23
 * @property {RiskBand} riskBand
 * @property {string} recommendedManagement
 * @property {boolean} complete                - true when all eight parameters + sex answered
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.GlasgowBlatchfordBleedingScore`.
(function () {
'use strict';
window.GlasgowBlatchfordBleedingScore = window.GlasgowBlatchfordBleedingScore || {};

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
      ageBand: '',
      sex: ''
    },
    labs: {
      bloodUrea: null,
      haemoglobin: null
    },
    haemodynamics: {
      systolicBloodPressure: null,
      pulse: null
    },
    clinicalMarkers: {
      melaenaPresent: '',
      syncope: '',
      hepaticDisease: '',
      cardiacFailure: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'very-low': return 'Very low risk';
    case 'low-moderate': return 'Low–moderate risk';
    case 'high': return 'High risk';
    default: return '';
  }
}

/** CSS class hint for the risk badge (reuses the shared risk palette). */
function riskBandCss(band) {
  switch (band) {
    case 'very-low': return 'risk-low';
    case 'low-moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'advanced-practitioner': return 'Advanced practitioner';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'acute-medical-unit': return 'Acute medical unit';
    case 'ward': return 'Ward';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Presenting-complaint label. */
function presentingComplaintLabel(complaint) {
  switch (complaint) {
    case 'haematemesis': return 'Haematemesis';
    case 'coffee-ground': return 'Coffee-ground vomiting';
    case 'melaena': return 'Melaena';
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

/** Yes/No enum label. */
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
    case 'info': return 'INFO';
    default: return '';
  }
}

Object.assign(window.GlasgowBlatchfordBleedingScore, {
  emptyAssessment,
  riskBandLabel,
  riskBandCss,
  clinicianRoleLabel,
  careSettingLabel,
  presentingComplaintLabel,
  sexLabel,
  ageBandLabel,
  yesNoLabel,
  priorityLabel
});
})();
