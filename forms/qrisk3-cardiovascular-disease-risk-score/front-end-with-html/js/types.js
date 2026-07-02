// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the QRISK3 Cardiovascular Disease
// Risk Score form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_qrisk3_cardiovascular_disease_risk_score.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel, sexLabel,
// ethnicityLabel, smokingLabel, diabetesLabel, ckdStageLabel, priorityLabel).

/**
 * @typedef {'gp' | 'nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'general-practice' | 'pharmacy' | 'nhs-health-check' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | ''} Sex
 * @typedef {'white-or-not-stated' | 'indian' | 'pakistani' | 'bangladeshi' | 'other-asian' | 'black-caribbean' | 'black-african' | 'chinese' | 'other' | ''} Ethnicity
 * @typedef {'non' | 'ex' | 'light' | 'moderate' | 'heavy' | ''} SmokingStatus
 * @typedef {'none' | 'type1' | 'type2' | ''} DiabetesStatus
 * @typedef {'none' | 'stage3' | 'stage4' | 'stage5' | ''} CkdStage
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'raised' | 'high'} RiskBand
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
 * Step 2 — patient identification and demographics.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} age        - years; QRISK3 valid 25-84
 * @property {Sex} sex                  - selects the sex-specific model
 * @property {Ethnicity} ethnicity      - nine-category QRISK3 ethnicity
 * @property {number | null} townsendScore - deprivation score; optional (cohort mean when null)
 * @property {string} postcode
 */

/**
 * Step 3 — eligibility (not model inputs; guard QRISK3 applicability).
 * @typedef {Object} Eligibility
 * @property {YesNo} hasEstablishedCvd
 * @property {YesNo} hasFamilialHypercholesterolaemia
 */

/**
 * Step 4 — lifestyle.
 * @typedef {Object} Lifestyle
 * @property {SmokingStatus} smokingStatus
 * @property {number | null} bodyMassIndex - kg/m^2
 */

/**
 * Step 5 — cardiometabolic measurements.
 * @typedef {Object} Cardiometabolic
 * @property {DiabetesStatus} diabetesStatus
 * @property {number | null} cholesterolHdlRatio    - total-cholesterol : HDL ratio
 * @property {number | null} systolicBloodPressure  - mmHg
 * @property {number | null} systolicBloodPressureSd - mmHg (visit-to-visit variability)
 * @property {YesNo} onBloodPressureTreatment
 */

/**
 * Step 6 — comorbidity history.
 * @typedef {Object} Comorbidities
 * @property {YesNo} familyHistoryChd
 * @property {YesNo} atrialFibrillation
 * @property {CkdStage} chronicKidneyDiseaseStage
 * @property {YesNo} migraine
 * @property {YesNo} rheumatoidArthritis
 * @property {YesNo} systemicLupusErythematosus
 * @property {YesNo} severeMentalIllness
 * @property {YesNo} erectileDysfunction    - men only; ignored for the female model
 */

/**
 * Step 7 — medication.
 * @typedef {Object} Medication
 * @property {YesNo} onAtypicalAntipsychotics
 * @property {YesNo} onCorticosteroids
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Eligibility} eligibility
 * @property {Lifestyle} lifestyle
 * @property {Cardiometabolic} cardiometabolic
 * @property {Comorbidities} comorbidities
 * @property {Medication} medication
 * @property {Note} note
 */

/**
 * One weighted contribution to the linear predictor, for the report audit.
 * @typedef {Object} Contribution
 * @property {string} id           - stable id, e.g. C-AGE
 * @property {string} factor       - human label
 * @property {string} value        - the input value shown to the user
 * @property {number} weight       - LP contribution (beta * centred value)
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
 * @property {number} linearPredictor
 * @property {number | null} tenYearRiskPercent - 0.0..99.9 (one decimal) or null when not computable
 * @property {RiskBand} riskBand
 * @property {number | null} heartAge            - years, or null when not computable
 * @property {boolean} computable                - true when required inputs are present
 * @property {Contribution[]} contributions
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.Qrisk3CardiovascularDiseaseRiskScore`.
(function () {
'use strict';
window.Qrisk3CardiovascularDiseaseRiskScore =
  window.Qrisk3CardiovascularDiseaseRiskScore || {};

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
      age: null,
      sex: '',
      ethnicity: '',
      townsendScore: null,
      postcode: ''
    },
    eligibility: {
      hasEstablishedCvd: '',
      hasFamilialHypercholesterolaemia: ''
    },
    lifestyle: {
      smokingStatus: '',
      bodyMassIndex: null
    },
    cardiometabolic: {
      diabetesStatus: '',
      cholesterolHdlRatio: null,
      systolicBloodPressure: null,
      systolicBloodPressureSd: null,
      onBloodPressureTreatment: ''
    },
    comorbidities: {
      familyHistoryChd: '',
      atrialFibrillation: '',
      chronicKidneyDiseaseStage: '',
      migraine: '',
      rheumatoidArthritis: '',
      systemicLupusErythematosus: '',
      severeMentalIllness: '',
      erectileDysfunction: ''
    },
    medication: {
      onAtypicalAntipsychotics: '',
      onCorticosteroids: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low / not raised (< 10%)';
    case 'raised': return 'Raised (>= 10%) — offer statin';
    case 'high': return 'High (>= 20%) — prioritise statin';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'raised': return 'risk-high';
    case 'high': return 'risk-critical';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'nurse': return 'Nurse';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'pharmacy': return 'Community pharmacy';
    case 'nhs-health-check': return 'NHS Health Check';
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

/** Nine-category QRISK3 ethnicity label. */
function ethnicityLabel(ethnicity) {
  switch (ethnicity) {
    case 'white-or-not-stated': return 'White or not stated';
    case 'indian': return 'Indian';
    case 'pakistani': return 'Pakistani';
    case 'bangladeshi': return 'Bangladeshi';
    case 'other-asian': return 'Other Asian';
    case 'black-caribbean': return 'Black Caribbean';
    case 'black-african': return 'Black African';
    case 'chinese': return 'Chinese';
    case 'other': return 'Other ethnic group';
    default: return '';
  }
}

/** Smoking-status label. */
function smokingLabel(status) {
  switch (status) {
    case 'non': return 'Non-smoker';
    case 'ex': return 'Ex-smoker';
    case 'light': return 'Light smoker (< 10/day)';
    case 'moderate': return 'Moderate smoker (10-19/day)';
    case 'heavy': return 'Heavy smoker (>= 20/day)';
    default: return '';
  }
}

/** Diabetes-status label. */
function diabetesLabel(status) {
  switch (status) {
    case 'none': return 'No diabetes';
    case 'type1': return 'Type 1 diabetes';
    case 'type2': return 'Type 2 diabetes';
    default: return '';
  }
}

/** Chronic-kidney-disease stage label. */
function ckdStageLabel(stage) {
  switch (stage) {
    case 'none': return 'No CKD';
    case 'stage3': return 'CKD stage 3';
    case 'stage4': return 'CKD stage 4';
    case 'stage5': return 'CKD stage 5';
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

Object.assign(window.Qrisk3CardiovascularDiseaseRiskScore, {
  emptyAssessment,
  riskBandLabel,
  riskBandClass,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  ethnicityLabel,
  smokingLabel,
  diabetesLabel,
  ckdStageLabel,
  priorityLabel
});
})();
