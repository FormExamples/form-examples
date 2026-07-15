// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Modified Early Warning Score
// (MEWS) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_modified_early_warning_score.sql`. This file builds and
// exports the canonical empty ObservationData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (riskBandLabel,
// riskBandClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel,
// avpuLabel, priorityLabel).

/**
 * @typedef {'nurse' | 'healthcare-assistant' | 'doctor' | 'other' | ''} ClinicianRole
 * @typedef {'acute-ward' | 'admissions-unit' | 'assessment-unit' | 'other' | ''} CareSetting
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'alert' | 'voice' | 'pain' | 'unresponsive' | ''} Avpu
 * @typedef {'low' | 'medium' | 'high'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} observedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} wardLocation
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — systolic blood pressure (parameter 1).
 * @typedef {Object} BloodPressure
 * @property {number | null} systolicBloodPressure - mmHg
 */

/**
 * Step 4 — heart rate (parameter 2).
 * @typedef {Object} HeartRate
 * @property {number | null} heartRate - beats/min
 */

/**
 * Step 5 — respiratory rate (parameter 3).
 * @typedef {Object} Respiratory
 * @property {number | null} respiratoryRate - breaths/min
 */

/**
 * Step 6 — temperature (parameter 4).
 * @typedef {Object} Temperature
 * @property {number | null} temperature - degrees Celsius
 */

/**
 * Step 7 — level of consciousness (parameter 5).
 * @typedef {Object} Consciousness
 * @property {Avpu} avpu
 */

/**
 * Step 8 — trend input and clinician free-text note.
 * @typedef {Object} Summary
 * @property {number | null} previousMewsScore - aggregate from the previous
 *   observation set, used only for the deteriorating-trend flag
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} ObservationData
 * @property {Context} context
 * @property {Identification} identification
 * @property {BloodPressure} bloodPressure
 * @property {HeartRate} heartRate
 * @property {Respiratory} respiratory
 * @property {Temperature} temperature
 * @property {Consciousness} consciousness
 * @property {Summary} summary
 */

/**
 * @typedef {Object} FiredParameter
 * @property {string} id           - stable rule id, e.g. R-SBP-01
 * @property {string} instrument   - systolic-blood-pressure | heart-rate | respiratory-rate | temperature | avpu | aggregate | single-parameter
 * @property {number} points       - sub-score contributed (0-3), or 0 for band/trigger rows
 * @property {RiskBand | ''} band
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
 * @property {0 | 1 | 2 | 3} systolicBloodPressurePoint
 * @property {0 | 1 | 2 | 3} heartRatePoint
 * @property {0 | 1 | 2 | 3} respiratoryRatePoint
 * @property {0 | 1 | 2 | 3} temperaturePoint
 * @property {0 | 1 | 2 | 3} avpuPoint
 * @property {number} mewsScore              - 0..14
 * @property {RiskBand} riskBand
 * @property {boolean} singleParameterTrigger
 * @property {string} monitoringFrequency
 * @property {FiredParameter[]} firedParameters
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank observation.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {ObservationData}
 */
function emptyObservation() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      observedAt: '',
      careSetting: '',
      wardLocation: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    bloodPressure: {
      systolicBloodPressure: null
    },
    heartRate: {
      heartRate: null
    },
    respiratory: {
      respiratoryRate: null
    },
    temperature: {
      temperature: null
    },
    consciousness: {
      avpu: ''
    },
    summary: {
      previousMewsScore: null,
      clinicalNotes: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low (MEWS 0-1)';
    case 'medium': return 'Medium (MEWS 2-4)';
    case 'high': return 'High (MEWS 5 or more)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'medium': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'nurse': return 'Nurse';
    case 'healthcare-assistant': return 'Healthcare assistant';
    case 'doctor': return 'Doctor';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'acute-ward': return 'Acute ward';
    case 'admissions-unit': return 'Admissions unit';
    case 'assessment-unit': return 'Assessment unit';
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

/** AVPU level-of-consciousness label. */
function avpuLabel(avpu) {
  switch (avpu) {
    case 'alert': return 'Alert';
    case 'voice': return 'Responds to voice';
    case 'pain': return 'Responds to pain';
    case 'unresponsive': return 'Unresponsive';
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

export { emptyObservation, riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel, sexLabel, ageBandLabel, avpuLabel, priorityLabel };
