// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the HAS-BLED Score for Major
// Bleeding Risk form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_has_bled_score_for_major_bleeding_risk.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel,
// anticoagulationStatusLabel, sexLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'cardiology' | 'general-practice' | 'anticoagulation-clinic' | 'acute-medical' | 'other' | ''} CareSetting
 * @typedef {'on' | 'considering' | ''} AnticoagulationStatus
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'moderate' | 'high'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt              - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {AnticoagulationStatus} anticoagulationStatus
 * @property {number | null} chaDsVascScore   - paired CHA2DS2-VASc stroke-risk score (0-9); context only
 */

/**
 * Step 2 — patient identification. `ageYears` also drives criterion E (step 8).
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears
 * @property {Sex} sex
 */

/**
 * Step 3 — H, hypertension (criterion 1).
 * @typedef {Object} Hypertension
 * @property {YesNo} hypertensionUncontrolled  - uncontrolled, systolic BP > 160 mmHg
 */

/**
 * Step 4 — A, abnormal renal and liver function (criteria 2 and 3).
 * @typedef {Object} OrganFunction
 * @property {YesNo} abnormalRenalFunction  - dialysis, transplant, or creatinine >= 200 umol/L
 * @property {YesNo} abnormalLiverFunction  - cirrhosis, or bilirubin > 2x ULN with transaminases > 3x ULN
 */

/**
 * Step 5 — S, stroke history (criterion 4).
 * @typedef {Object} Stroke
 * @property {YesNo} strokeHistory
 */

/**
 * Step 6 — B, bleeding history or predisposition (criterion 5).
 * @typedef {Object} Bleeding
 * @property {YesNo} bleedingHistory  - prior major bleed, diathesis, or anaemia
 */

/**
 * Step 7 — L, labile INR (criterion 6).
 * @typedef {Object} LabileInr
 * @property {YesNo} labileInr  - unstable/high INR or time in therapeutic range < 60%
 */

/**
 * Step 9 — D, drugs and alcohol (criteria 8 and 9). Criterion E (elderly, step
 * 8) is derived from `identification.ageYears`, so it has no field of its own.
 * @typedef {Object} DrugsAlcohol
 * @property {YesNo} antiplateletOrNsaid       - concomitant antiplatelet agents or NSAIDs
 * @property {number | null} alcoholUnitsPerWeek - alcohol units per week; >= 8 scores the criterion
 */

/**
 * Step 10 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Hypertension} hypertension
 * @property {OrganFunction} organFunction
 * @property {Stroke} stroke
 * @property {Bleeding} bleeding
 * @property {LabileInr} labileInr
 * @property {DrugsAlcohol} drugsAlcohol
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-ELDERLY-01
 * @property {string} criterion    - hypertension | renal | liver | stroke | bleeding | labile-inr | elderly | drugs | alcohol | band
 * @property {number} points       - points contributed (0 or 1)
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
 * @property {0 | 1} hypertensionPoints
 * @property {0 | 1} renalPoints
 * @property {0 | 1} liverPoints
 * @property {0 | 1} strokePoints
 * @property {0 | 1} bleedingPoints
 * @property {0 | 1} labileInrPoints
 * @property {0 | 1} elderlyPoints
 * @property {0 | 1} drugsPoints
 * @property {0 | 1} alcoholPoints
 * @property {number} totalScore   - 0-9
 * @property {RiskBand} riskBand
 * @property {string} modifiableFactors
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.HasBledScoreForMajorBleedingRisk`.

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
      anticoagulationStatus: '',
      chaDsVascScore: null
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    hypertension: {
      hypertensionUncontrolled: ''
    },
    organFunction: {
      abnormalRenalFunction: '',
      abnormalLiverFunction: ''
    },
    stroke: {
      strokeHistory: ''
    },
    bleeding: {
      bleedingHistory: ''
    },
    labileInr: {
      labileInr: ''
    },
    drugsAlcohol: {
      antiplateletOrNsaid: '',
      alcoholUnitsPerWeek: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk (HAS-BLED 0)';
    case 'moderate': return 'Moderate risk (HAS-BLED 1-2)';
    case 'high': return 'High risk (HAS-BLED 3 or more)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
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
    case 'cardiology': return 'Cardiology';
    case 'general-practice': return 'General practice';
    case 'anticoagulation-clinic': return 'Anticoagulation clinic';
    case 'acute-medical': return 'Acute medical';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Anticoagulation-status label. */
function anticoagulationStatusLabel(status) {
  switch (status) {
    case 'on': return 'On anticoagulation';
    case 'considering': return 'Considering anticoagulation';
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

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel, anticoagulationStatusLabel, sexLabel, priorityLabel };
