// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the CHA2DS2-VASc Score for Atrial
// Fibrillation Stroke Risk form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_cha2ds2_vasc.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (riskBandLabel,
// riskBandClass, clinicianRoleLabel, careSettingLabel, atrialFibrillationTypeLabel,
// sexLabel, ageBandLabel, anticoagulationLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'primary-care' | 'cardiology' | 'anticoagulation-clinic' | 'emergency-department' | 'other' | ''} CareSetting
 * @typedef {'paroxysmal' | 'persistent' | 'permanent' | 'flutter' | ''} AtrialFibrillationType
 * @typedef {'female' | 'male' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'intermediate' | 'high'} RiskBand
 * @typedef {'none' | 'consider' | 'recommended'} AnticoagulationRecommendation
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {AtrialFibrillationType} atrialFibrillationType
 */

/**
 * Step 2 — patient identification. Age (years) drives the age criterion; sex
 * drives the sex-category point.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears
 * @property {Sex} sex
 */

/**
 * Step 3 — cardiac history (criteria C, H, V).
 * @typedef {Object} Cardiac
 * @property {YesNo} congestiveHeartFailure        - C — CHF / LV dysfunction (1)
 * @property {YesNo} hypertension                  - H — hypertension (1)
 * @property {YesNo} vascularDisease               - V — vascular disease (1)
 */

/**
 * Step 4 — metabolic and thromboembolic history (criteria D, S2).
 * @typedef {Object} Metabolic
 * @property {YesNo} diabetes                          - D — diabetes mellitus (1)
 * @property {YesNo} priorStrokeTiaThromboembolism     - S2 — prior stroke / TIA / TE (2)
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
 * @property {Cardiac} cardiac
 * @property {Metabolic} metabolic
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-STROKE-2POINT-01
 * @property {string} criterion    - congestive-heart-failure | hypertension | age | diabetes | stroke | vascular-disease | sex | risk-band
 * @property {number} points       - points contributed
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
 * @property {0 | 1} congestiveHeartFailurePoint
 * @property {0 | 1} hypertensionPoint
 * @property {0 | 1 | 2} agePoint
 * @property {0 | 1} diabetesPoint
 * @property {0 | 2} strokePoint
 * @property {0 | 1} vascularDiseasePoint
 * @property {0 | 1} sexPoint
 * @property {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9} cha2ds2VascScore
 * @property {RiskBand} riskBand
 * @property {number} annualStrokeRatePercent
 * @property {AnticoagulationRecommendation} anticoagulationRecommendation
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.Cha2ds2VascScoreForAtrialFibrillationStrokeRisk`.
(function () {
'use strict';
window.Cha2ds2VascScoreForAtrialFibrillationStrokeRisk =
  window.Cha2ds2VascScoreForAtrialFibrillationStrokeRisk || {};

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
      atrialFibrillationType: ''
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    cardiac: {
      congestiveHeartFailure: '',
      hypertension: '',
      vascularDisease: ''
    },
    metabolic: {
      diabetes: '',
      priorStrokeTiaThromboembolism: ''
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
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'intermediate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Anticoagulation-recommendation label. */
function anticoagulationLabel(rec) {
  switch (rec) {
    case 'none': return 'No antithrombotic therapy recommended';
    case 'consider': return 'Consider oral anticoagulation';
    case 'recommended': return 'Oral anticoagulation recommended';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'primary-care': return 'Primary care';
    case 'cardiology': return 'Cardiology / arrhythmia clinic';
    case 'anticoagulation-clinic': return 'Anticoagulation clinic';
    case 'emergency-department': return 'Emergency department';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Atrial-fibrillation-type label. */
function atrialFibrillationTypeLabel(type) {
  switch (type) {
    case 'paroxysmal': return 'Paroxysmal';
    case 'persistent': return 'Persistent';
    case 'permanent': return 'Permanent';
    case 'flutter': return 'Atrial flutter';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Derived age-band label from age in years. */
function ageBandLabel(ageYears) {
  if (ageYears === null || ageYears === undefined || ageYears === '') return '';
  if (ageYears >= 75) return 'Age 75 and over (2 points)';
  if (ageYears >= 65) return 'Age 65-74 (1 point)';
  return 'Age under 65 (0 points)';
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

Object.assign(window.Cha2ds2VascScoreForAtrialFibrillationStrokeRisk, {
  emptyAssessment,
  riskBandLabel,
  riskBandClass,
  anticoagulationLabel,
  clinicianRoleLabel,
  careSettingLabel,
  atrialFibrillationTypeLabel,
  sexLabel,
  ageBandLabel,
  priorityLabel
});
})();
