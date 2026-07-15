// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the TIMI Risk Score for Acute
// Coronary Syndrome (UA/NSTEMI) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_timi_risk_score_for_acute_coronary_syndrome.sql`. Each
// of the seven scored criteria is a single yes/no input. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (riskBandLabel,
// riskBandClass, clinicianRoleLabel, careSettingLabel, workingDiagnosisLabel,
// sexLabel, priorityLabel).

/**
 * @typedef {'physician' | 'cardiologist' | 'nurse-practitioner' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'chest-pain-unit' | 'ward' | 'coronary-care' | 'other' | ''} CareSetting
 * @typedef {'unstable-angina' | 'nstemi' | ''} WorkingDiagnosis
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
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
 * @property {WorkingDiagnosis} workingDiagnosis
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {Sex} sex
 */

/**
 * Step 3 — age and coronary risk factors (criteria 1 and 2).
 * @typedef {Object} RiskProfile
 * @property {YesNo} ageOver65                  - criterion 1: age >= 65 years
 * @property {YesNo} threeOrMoreCadRiskFactors  - criterion 2: >= 3 of five CAD risk factors
 */

/**
 * Step 4 — cardiac history and medication (criteria 3 and 4).
 * @typedef {Object} CardiacHistory
 * @property {YesNo} knownCadStenosis     - criterion 3: known CAD, stenosis >= 50%
 * @property {YesNo} aspirinUsePrior7Days - criterion 4: aspirin use in the prior 7 days
 */

/**
 * Step 5 — presentation (criterion 5).
 * @typedef {Object} Presentation
 * @property {YesNo} twoOrMoreAnginaEpisodes24h - criterion 5: >= 2 anginal episodes in 24 h
 */

/**
 * Step 6 — investigations (criteria 6 and 7).
 * @typedef {Object} Investigations
 * @property {YesNo} stDeviation            - criterion 6: ST deviation >= 0.5 mm
 * @property {YesNo} positiveCardiacMarker  - criterion 7: elevated troponin / CK-MB
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
 * @property {RiskProfile} riskProfile
 * @property {CardiacHistory} cardiacHistory
 * @property {Presentation} presentation
 * @property {Investigations} investigations
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-AGE-OVER-65-01
 * @property {string} criterion    - age | risk-factors | known-cad | aspirin | angina | st-deviation | cardiac-marker | band
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
 * @property {0 | 1} agePoint
 * @property {0 | 1} riskFactorPoint
 * @property {0 | 1} knownCadPoint
 * @property {0 | 1} aspirinPoint
 * @property {0 | 1} anginaPoint
 * @property {0 | 1} stDeviationPoint
 * @property {0 | 1} cardiacMarkerPoint
 * @property {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7} timiScore
 * @property {RiskBand} riskBand
 * @property {number} fourteenDayRiskPercent
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; there are no numeric criterion inputs in this form.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      workingDiagnosis: ''
    },
    identification: {
      patientIdentifier: '',
      sex: ''
    },
    riskProfile: {
      ageOver65: '',
      threeOrMoreCadRiskFactors: ''
    },
    cardiacHistory: {
      knownCadStenosis: '',
      aspirinUsePrior7Days: ''
    },
    presentation: {
      twoOrMoreAnginaEpisodes24h: ''
    },
    investigations: {
      stDeviation: '',
      positiveCardiacMarker: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** 14-day composite-event risk (%) looked up by total TIMI score (0-7). */
const FOURTEEN_DAY_RISK_PERCENT = {
  0: 4.7,
  1: 4.7,
  2: 8.3,
  3: 13.2,
  4: 19.9,
  5: 26.2,
  6: 40.9,
  7: 40.9
};

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk (TIMI 0-1)';
    case 'intermediate': return 'Intermediate risk (TIMI 2-4)';
    case 'high': return 'High risk (TIMI 5-7)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
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
    case 'physician': return 'Physician';
    case 'cardiologist': return 'Cardiologist';
    case 'nurse-practitioner': return 'Nurse practitioner';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'chest-pain-unit': return 'Chest-pain unit';
    case 'ward': return 'Ward';
    case 'coronary-care': return 'Coronary-care unit';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Working-diagnosis label. */
function workingDiagnosisLabel(dx) {
  switch (dx) {
    case 'unstable-angina': return 'Unstable angina';
    case 'nstemi': return 'NSTEMI';
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

export { emptyAssessment, FOURTEEN_DAY_RISK_PERCENT, riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel, workingDiagnosisLabel, sexLabel, priorityLabel };
