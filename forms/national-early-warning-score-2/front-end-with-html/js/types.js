// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the National Early Warning Score 2
// (NEWS2) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_national_early_warning_score_2.sql` (and the patient
// table). This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage. It also
// exports display helpers (riskBandLabel, riskBandClass, monitoring/response
// labels, clinicianRoleLabel, spo2ScaleLabel, acvpuLabel, oxygenDeviceLabel,
// yesNoLabel, priorityLabel).

/**
 * @typedef {'doctor' | 'nurse' | 'healthcare-assistant' | 'paramedic' | 'other' | ''} ClinicianRole
 * @typedef {'scale-1' | 'scale-2' | ''} Spo2Scale
 * @typedef {'air' | 'oxygen' | ''} AirOrOxygen
 * @typedef {'nasal-cannula' | 'simple-face-mask' | 'venturi-mask' | 'non-rebreather-mask' | 'humidified' | 'cpap' | 'niv' | 'tracheostomy' | 'ventilator' | 'other' | ''} OxygenDevice
 * @typedef {'A' | 'C' | 'V' | 'P' | 'U' | ''} Acvpu
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'low-medium' | 'medium' | 'high'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} observationAt      - ISO-ish datetime-local string; '' when unset
 * @property {string} wardOrLocation
 * @property {Spo2Scale} spo2Scale
 * @property {YesNo} spo2Scale2Endorsed  - clinician endorsement for Scale 2
 */

/**
 * Step 2 — patient identification and scope screening.
 * @typedef {Object} Identification
 * @property {string} patientName
 * @property {string} nhsNumber
 * @property {string | null} birthDate    - ISO date string; null when unset
 * @property {YesNo} isUnder16
 * @property {YesNo} isPregnant
 * @property {YesNo} hasSpinalCordInjury
 */

/**
 * Step 3 — respiration rate (parameter 1).
 * @typedef {Object} Respiration
 * @property {number | null} respiratoryRate  - breaths/min
 */

/**
 * Step 4 — oxygen saturation (parameter 2).
 * @typedef {Object} OxygenSaturation
 * @property {number | null} spo2             - SpO2 %
 */

/**
 * Step 5 — air or supplemental oxygen (parameter 3, +2 weighting).
 * @typedef {Object} OxygenSupport
 * @property {AirOrOxygen} onOxygen
 * @property {OxygenDevice} oxygenDevice
 * @property {number | null} oxygenFlowRateLMin           - litres/min
 * @property {number | null} inspiredOxygenFractionPercent - FiO2 %
 */

/**
 * Step 6 — systolic blood pressure (parameter 4).
 * @typedef {Object} BloodPressure
 * @property {number | null} systolicBloodPressure  - mmHg
 * @property {number | null} diastolicBloodPressure - mmHg (optional, unscored)
 */

/**
 * Step 7 — pulse (parameter 5).
 * @typedef {Object} Pulse
 * @property {number | null} pulse  - beats/min
 */

/**
 * Step 8 — consciousness / ACVPU (parameter 6).
 * @typedef {Object} Consciousness
 * @property {Acvpu} consciousnessAcvpu
 */

/**
 * Step 9 — temperature (parameter 7).
 * @typedef {Object} Temperature
 * @property {number | null} temperature  - degrees Celsius
 */

/**
 * Step 10 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Respiration} respiration
 * @property {OxygenSaturation} oxygenSaturation
 * @property {OxygenSupport} oxygenSupport
 * @property {BloodPressure} bloodPressure
 * @property {Pulse} pulse
 * @property {Consciousness} consciousness
 * @property {Temperature} temperature
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-RESP-RATE-3-HIGH-01
 * @property {string} instrument   - respiratory-rate | spo2 | oxygen | blood-pressure | pulse | consciousness | temperature | aggregate | red-score
 * @property {string} band         - low | low-medium | medium | high | ''
 * @property {number} points       - subscore points contributed (0-3)
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} Flag
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} Subscores
 * @property {0|1|2|3|null} respiratoryRate
 * @property {0|1|2|3|null} spo2
 * @property {0|2} oxygen
 * @property {0|1|2|3|null} systolicBp
 * @property {0|1|2|3|null} pulse
 * @property {0|3|null} consciousness
 * @property {0|1|2|3|null} temperature
 */

/**
 * @typedef {Object} GradingResult
 * @property {Subscores} subscores
 * @property {number} aggregate
 * @property {boolean} redScore
 * @property {RiskBand} riskBand
 * @property {string} monitoringFrequency
 * @property {string} recommendation
 * @property {boolean} complete
 * @property {FiredRule[]} firedRules
 * @property {Flag[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.NationalEarlyWarningScore2`.
(function () {
'use strict';
window.NationalEarlyWarningScore2 = window.NationalEarlyWarningScore2 || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric and date fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      observationAt: '',
      wardOrLocation: '',
      spo2Scale: '',
      spo2Scale2Endorsed: ''
    },
    identification: {
      patientName: '',
      nhsNumber: '',
      birthDate: null,
      isUnder16: '',
      isPregnant: '',
      hasSpinalCordInjury: ''
    },
    respiration: {
      respiratoryRate: null
    },
    oxygenSaturation: {
      spo2: null
    },
    oxygenSupport: {
      onOxygen: '',
      oxygenDevice: '',
      oxygenFlowRateLMin: null,
      inspiredOxygenFractionPercent: null
    },
    bloodPressure: {
      systolicBloodPressure: null,
      diastolicBloodPressure: null
    },
    pulse: {
      pulse: null
    },
    consciousness: {
      consciousnessAcvpu: ''
    },
    temperature: {
      temperature: null
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'low': return 'Low risk';
    case 'low-medium': return 'Low–medium risk';
    case 'medium': return 'Medium risk';
    case 'high': return 'High risk';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'low-medium': return 'risk-moderate';
    case 'medium': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse': return 'Nurse';
    case 'healthcare-assistant': return 'Healthcare assistant';
    case 'paramedic': return 'Paramedic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** SpO2 scale label. */
function spo2ScaleLabel(scale) {
  switch (scale) {
    case 'scale-1': return 'Scale 1 (default target)';
    case 'scale-2': return 'Scale 2 (target 88–92%)';
    default: return '';
  }
}

/** ACVPU consciousness label. */
function acvpuLabel(value) {
  switch (value) {
    case 'A': return 'Alert';
    case 'C': return 'New confusion';
    case 'V': return 'Voice';
    case 'P': return 'Pain';
    case 'U': return 'Unresponsive';
    default: return '';
  }
}

/** Supplemental-oxygen device label. */
function oxygenDeviceLabel(device) {
  switch (device) {
    case 'nasal-cannula': return 'Nasal cannula';
    case 'simple-face-mask': return 'Simple face mask';
    case 'venturi-mask': return 'Venturi mask';
    case 'non-rebreather-mask': return 'Non-rebreather mask';
    case 'humidified': return 'Humidified oxygen';
    case 'cpap': return 'CPAP';
    case 'niv': return 'Non-invasive ventilation';
    case 'tracheostomy': return 'Tracheostomy';
    case 'ventilator': return 'Ventilator';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Yes/No label. */
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
    default: return '';
  }
}

Object.assign(window.NationalEarlyWarningScore2, {
  emptyAssessment,
  riskBandLabel,
  riskBandClass,
  clinicianRoleLabel,
  spo2ScaleLabel,
  acvpuLabel,
  oxygenDeviceLabel,
  yesNoLabel,
  priorityLabel
});
})();
