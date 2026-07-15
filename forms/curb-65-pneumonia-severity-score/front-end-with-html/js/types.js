// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the CURB-65 Pneumonia Severity
// Score form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_curb_65_pneumonia_severity_score.sql`. This file builds
// and exports the canonical empty AssessmentData shape used by the wizard, so
// that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports display helpers
// (riskBandLabel, riskBandClass, scoreVariantLabel, dispositionLabel,
// clinicianRoleLabel, careSettingLabel, sexLabel, priorityLabel).

/**
 * @typedef {'physician' | 'general-practitioner' | 'advanced-nurse-practitioner' | 'nurse' | 'paramedic' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'primary-care' | 'emergency-department' | 'acute-medical-unit' | 'ward' | 'community' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'intermediate' | 'high'} RiskBand
 * @typedef {'low' | 'intermediate' | 'high' | ''} OverrideBand
 * @typedef {'curb-65' | 'crb-65'} ScoreVariant
 * @typedef {'home-outpatient' | 'short-stay-supervised' | 'hospital-admission'} Disposition
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
 * @property {Sex} sex
 */

/**
 * Step 3 — Confusion (criterion C).
 * @typedef {Object} Confusion
 * @property {YesNo} confusionPresent   - new-onset confusion; positive when 'yes'
 * @property {number | null} amtScore   - Abbreviated Mental Test 0-10 (supporting evidence, not scored)
 */

/**
 * Step 4 — Urea (criterion U). `ureaMeasured` drives the CRB-65 fallback.
 * @typedef {Object} Urea
 * @property {YesNo} ureaMeasured       - when 'no', the four-criterion CRB-65 variant is used
 * @property {number | null} ureaMmolL  - serum urea (mmol/L); positive when > 7
 */

/**
 * Step 5 — Respiratory rate (criterion R).
 * @typedef {Object} Respiratory
 * @property {number | null} respiratoryRate - breaths/min; positive when >= 30
 */

/**
 * Step 6 — Blood pressure (criterion B).
 * @typedef {Object} BloodPressure
 * @property {number | null} systolicBp  - mmHg; positive when < 90
 * @property {number | null} diastolicBp - mmHg; positive when <= 60
 */

/**
 * Step 7 — Age (criterion 65).
 * @typedef {Object} Age
 * @property {number | null} ageYears    - derived from date of birth; positive when >= 65
 */

/**
 * Step 8 — advisory adjuncts (recorded but not scored).
 * @typedef {Object} Adjuncts
 * @property {number | null} oxygenSaturation - SpO2 percentage; raises hypoxia flag when < 92
 * @property {number | null} temperatureC     - body temperature, degrees Celsius
 * @property {YesNo} significantComorbidity
 * @property {YesNo} multilobarChanges
 */

/**
 * Step 9 — clinician disposition override and free-text note.
 * @typedef {Object} Disposition9
 * @property {OverrideBand} clinicianOverrideBand
 * @property {string} overrideReason
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Confusion} confusion
 * @property {Urea} urea
 * @property {Respiratory} respiratory
 * @property {BloodPressure} bloodPressure
 * @property {Age} age
 * @property {Adjuncts} adjuncts
 * @property {Disposition9} disposition
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-CONFUSION-01
 * @property {string} criterion    - confusion | urea | respiratory-rate | blood-pressure | age | band
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
 * @property {0 | 1} confusionScore
 * @property {0 | 1} ureaScore
 * @property {0 | 1} respiratoryRateScore
 * @property {0 | 1} bloodPressureScore
 * @property {0 | 1} ageScore
 * @property {0 | 1 | 2 | 3 | 4 | 5} curb65Score
 * @property {0 | 1 | 2 | 3 | 4 | null} crb65Score
 * @property {number} totalScore
 * @property {ScoreVariant} scoreVariant
 * @property {RiskBand} riskBand
 * @property {Disposition} recommendedDisposition
 * @property {string} recommendedSetting
 * @property {{confusion: boolean, urea: boolean, respiratoryRate: boolean, bloodPressure: boolean, ageOver65: boolean}} criteria
 * @property {FiredCriterion[]} firedCriteria
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
      careSetting: ''
    },
    identification: {
      patientIdentifier: '',
      sex: ''
    },
    confusion: {
      confusionPresent: '',
      amtScore: null
    },
    urea: {
      ureaMeasured: '',
      ureaMmolL: null
    },
    respiratory: {
      respiratoryRate: null
    },
    bloodPressure: {
      systolicBp: null,
      diastolicBp: null
    },
    age: {
      ageYears: null
    },
    adjuncts: {
      oxygenSaturation: null,
      temperatureC: null,
      significantComorbidity: '',
      multilobarChanges: ''
    },
    disposition: {
      clinicianOverrideBand: '',
      overrideReason: '',
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

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'intermediate': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Score-variant label. */
function scoreVariantLabel(variant) {
  switch (variant) {
    case 'curb-65': return 'CURB-65';
    case 'crb-65': return 'CRB-65';
    default: return '';
  }
}

/** Recommended-disposition label. */
function dispositionLabel(disposition) {
  switch (disposition) {
    case 'home-outpatient': return 'Home / outpatient management';
    case 'short-stay-supervised': return 'Short-stay / hospital-supervised';
    case 'hospital-admission': return 'Hospital admission';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'physician': return 'Physician';
    case 'general-practitioner': return 'General practitioner';
    case 'advanced-nurse-practitioner': return 'Advanced nurse practitioner';
    case 'nurse': return 'Nurse';
    case 'paramedic': return 'Paramedic';
    case 'pharmacist': return 'Pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'primary-care': return 'Primary care';
    case 'emergency-department': return 'Emergency department';
    case 'acute-medical-unit': return 'Acute medical unit';
    case 'ward': return 'Ward';
    case 'community': return 'Community';
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

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, riskBandLabel, riskBandClass, scoreVariantLabel, dispositionLabel, clinicianRoleLabel, careSettingLabel, sexLabel, priorityLabel };
