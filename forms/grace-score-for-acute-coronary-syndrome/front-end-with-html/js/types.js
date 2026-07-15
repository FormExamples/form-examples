// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the GRACE Score for Acute Coronary
// Syndrome form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_grace_score_for_acute_coronary_syndrome.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (riskCategoryLabel, riskCategoryClass, bandLabel, clinicianRoleLabel,
// careSettingLabel, presentationTypeLabel, sexLabel, killipClassLabel,
// priorityLabel).

/**
 * @typedef {'emergency-physician' | 'acute-physician' | 'cardiologist' | 'nurse' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'coronary-care-unit' | 'cardiology-ward' | 'other' | ''} CareSetting
 * @typedef {'nstemi' | 'unstable-angina' | 'stemi' | ''} PresentationType
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'I' | 'II' | 'III' | 'IV' | ''} KillipClass
 * @typedef {'mg/dL' | 'umol/L' | ''} CreatinineUnit
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'intermediate' | 'high'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt          - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {PresentationType} presentationType
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears     - variable 1
 * @property {Sex} sex
 */

/**
 * Step 3 — haemodynamics (variables 2 and 3).
 * @typedef {Object} Haemodynamics
 * @property {number | null} heartRate                - beats/min; variable 2
 * @property {number | null} systolicBloodPressure    - mmHg; variable 3 (inverse weight)
 */

/**
 * Step 4 — renal function (variable 4).
 * @typedef {Object} Renal
 * @property {number | null} serumCreatinine          - raw value; variable 4
 * @property {CreatinineUnit} serumCreatinineUnit     - unit for the raw value
 */

/**
 * Step 5 — heart-failure severity (variable 5).
 * @typedef {Object} HeartFailure
 * @property {KillipClass} killipClass
 */

/**
 * Step 6 — high-risk features (variables 6-8).
 * @typedef {Object} HighRiskFeatures
 * @property {YesNo} cardiacArrestAtAdmission   - variable 6
 * @property {YesNo} stSegmentDeviation         - variable 7
 * @property {YesNo} elevatedCardiacEnzymes     - variable 8
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
 * @property {Haemodynamics} haemodynamics
 * @property {Renal} renal
 * @property {HeartFailure} heartFailure
 * @property {HighRiskFeatures} highRiskFeatures
 * @property {Note} note
 */

/**
 * A single per-variable point contribution (mirrors the
 * `grace_score_for_acute_coronary_syndrome_grade_rule` SQL table).
 * @typedef {Object} FiredContributor
 * @property {string} id           - stable rule id, e.g. R-AGE-01
 * @property {string} variable     - age | heart-rate | systolic-blood-pressure | creatinine | killip | cardiac-arrest | st-deviation | elevated-enzymes | band
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
 * @property {number} agePoints
 * @property {number} heartRatePoints
 * @property {number} sbpPoints
 * @property {number} creatininePoints
 * @property {number} killipPoints
 * @property {number} arrestPoints
 * @property {number} stPoints
 * @property {number} enzymePoints
 * @property {number} gracePoints
 * @property {RiskBand} inHospitalMortalityBand
 * @property {RiskBand} sixMonthMortalityBand
 * @property {RiskBand} riskCategory
 * @property {string} invasiveStrategy
 * @property {FiredContributor[]} firedContributors
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.GraceScoreForAcuteCoronarySyndrome`.

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
      presentationType: ''
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    haemodynamics: {
      heartRate: null,
      systolicBloodPressure: null
    },
    renal: {
      serumCreatinine: null,
      serumCreatinineUnit: ''
    },
    heartFailure: {
      killipClass: ''
    },
    highRiskFeatures: {
      cardiacArrestAtAdmission: '',
      stSegmentDeviation: '',
      elevatedCardiacEnzymes: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Overall risk-category label for display. */
function riskCategoryLabel(band) {
  switch (band) {
    case 'low': return 'Low risk';
    case 'intermediate': return 'Intermediate risk';
    case 'high': return 'High risk';
    default: return '';
  }
}

/** Short band label (in-hospital / 6-month cells). */
function bandLabel(band) {
  switch (band) {
    case 'low': return 'Low';
    case 'intermediate': return 'Intermediate';
    case 'high': return 'High';
    default: return 'N/A';
  }
}

/** CSS class hint for the risk badge (reuses the shared risk palette). */
function riskCategoryClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'intermediate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'emergency-physician': return 'Emergency physician';
    case 'acute-physician': return 'Acute physician';
    case 'cardiologist': return 'Cardiologist';
    case 'nurse': return 'Nurse';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'acute-medical-unit': return 'Acute medical unit';
    case 'coronary-care-unit': return 'Coronary care unit';
    case 'cardiology-ward': return 'Cardiology ward';
    case 'other': return 'Other';
    default: return '';
  }
}

/** ACS presentation-type label. */
function presentationTypeLabel(type) {
  switch (type) {
    case 'nstemi': return 'NSTEMI';
    case 'unstable-angina': return 'Unstable angina';
    case 'stemi': return 'STEMI';
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

/** Killip-class label. */
function killipClassLabel(cls) {
  switch (cls) {
    case 'I': return 'Class I — no heart failure';
    case 'II': return 'Class II — rales / raised JVP';
    case 'III': return 'Class III — pulmonary oedema';
    case 'IV': return 'Class IV — cardiogenic shock';
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

export { emptyAssessment, riskCategoryLabel, bandLabel, riskCategoryClass, clinicianRoleLabel, careSettingLabel, presentationTypeLabel, sexLabel, killipClassLabel, priorityLabel };
