// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the History and Physical
// Examination (H&P) clerking form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_history_and_physical_examination.sql`. This file builds
// the canonical empty AssessmentData shape used by the wizard (nested by
// wizard section), a `flatten()` helper that projects the nested state into the
// flat clerking record the completeness engine consumes, and display helpers.
//
// This is a documentation / completeness form, NOT a scored instrument: the
// engine grades how thoroughly the clerking has been documented (complete /
// partial / incomplete) and reports a completeness percentage — it does not
// compute a numeric clinical score.

/**
 * @typedef {'doctor' | 'acp' | 'physician-associate' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'ward' | 'other' | ''} CareSetting
 * @typedef {'self' | 'gp' | 'ambulance' | 'transfer' | 'other' | ''} AdmissionSource
 * @typedef {'18-39' | '40-64' | '65-79' | '80-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'none-known' | 'has-allergies' | 'not-documented' | ''} AllergyStatus
 * @typedef {'alert' | 'voice' | 'pain' | 'unresponsive' | ''} ConsciousnessLevel
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step group — encounter and clinician.
 * @typedef {Object} Encounter
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} registrationNumber
 * @property {string} clerkedAt              - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {AdmissionSource} admissionSource
 */

/**
 * Step group — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step group — history.
 * @typedef {Object} History
 * @property {string} presentingComplaint
 * @property {string} historyOfPresentingComplaint
 * @property {string} pastMedicalSurgicalHistory
 * @property {string} drugHistory
 * @property {AllergyStatus} allergyStatus
 * @property {string} allergyDetail
 * @property {string} familyHistory
 * @property {string} socialHistory
 * @property {string} systemsReview
 */

/**
 * Step group — vital signs (numeric fields are `null` when not measured).
 * @typedef {Object} Vitals
 * @property {number | null} temperature             - degrees Celsius; normal 36.1-38.0
 * @property {number | null} heartRate               - bpm; normal 51-90
 * @property {number | null} respiratoryRate         - /min; normal 12-20
 * @property {number | null} systolicBloodPressure   - mmHg; normal 111-219
 * @property {number | null} oxygenSaturation        - %; normal >= 96
 * @property {ConsciousnessLevel} consciousnessLevel - AVPU; anything but alert is flagged
 */

/**
 * Step group — examination and investigations.
 * @typedef {Object} Examination
 * @property {string} examCardiovascular - core system: findings or "deferred"
 * @property {string} examRespiratory    - core system: findings or "deferred"
 * @property {string} examAbdominal      - core system: findings or "deferred"
 * @property {string} examNeurological   - core system: findings or "deferred"
 * @property {string} examOther          - other systems / general inspection
 * @property {string} investigations     - bedside, laboratory, imaging results
 */

/**
 * Step group — impression, plan, and note.
 * @typedef {Object} Assessment
 * @property {string} impression       - working impression / problem list
 * @property {string} redFlagFindings  - red-flag examination or history findings
 * @property {string} managementPlan   - treatment, referrals, escalation, disposition
 * @property {string} clinicalNote     - free-text note
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Encounter} encounter
 * @property {Identification} identification
 * @property {History} history
 * @property {Vitals} vitals
 * @property {Examination} examination
 * @property {Assessment} assessment
 */

/**
 * Flat clerking record consumed by the completeness engine — the merge of every
 * section's fields into one object keyed by camelCase SQL column name.
 * @typedef {Object} ClerkingRecord
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-COMPONENT-PRESENTING-COMPLAINT-01
 * @property {string} component    - required-component id
 * @property {string} section      - history | examination | vitals | impression | plan | completeness
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {boolean} blocking
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessStatus} status
 * @property {number} completenessPercent   - 0..100
 * @property {string[]} satisfiedComponents
 * @property {string[]} missingComponents
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.HistoryAndPhysicalExamination`.

/**
 * Build a fresh, fully-blank clerking record.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    encounter: {
      clinicianName: '',
      clinicianRole: '',
      registrationNumber: '',
      clerkedAt: '',
      careSetting: '',
      admissionSource: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    history: {
      presentingComplaint: '',
      historyOfPresentingComplaint: '',
      pastMedicalSurgicalHistory: '',
      drugHistory: '',
      allergyStatus: '',
      allergyDetail: '',
      familyHistory: '',
      socialHistory: '',
      systemsReview: ''
    },
    vitals: {
      temperature: null,
      heartRate: null,
      respiratoryRate: null,
      systolicBloodPressure: null,
      oxygenSaturation: null,
      consciousnessLevel: ''
    },
    examination: {
      examCardiovascular: '',
      examRespiratory: '',
      examAbdominal: '',
      examNeurological: '',
      examOther: '',
      investigations: ''
    },
    assessment: {
      impression: '',
      redFlagFindings: '',
      managementPlan: '',
      clinicalNote: ''
    }
  };
}

/**
 * Project the nested wizard state into the flat clerking record the engine
 * consumes. Every section's fields are merged into one object.
 * @param {AssessmentData} state
 * @returns {ClerkingRecord}
 */
function flatten(state) {
  return Object.assign(
    {},
    state.encounter,
    state.identification,
    state.history,
    state.vitals,
    state.examination,
    state.assessment
  );
}

/** Clerking clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'acp': return 'Advanced clinical practitioner';
    case 'physician-associate': return 'Physician associate';
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

/** Admission-source label. */
function admissionSourceLabel(source) {
  switch (source) {
    case 'self': return 'Self-presentation';
    case 'gp': return 'GP referral';
    case 'ambulance': return 'Ambulance';
    case 'transfer': return 'Inter-hospital transfer';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Adult age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case '18-39': return '18-39';
    case '40-64': return '40-64';
    case '65-79': return '65-79';
    case '80-plus': return '80 and over';
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

/** Allergy-status label. */
function allergyStatusLabel(status) {
  switch (status) {
    case 'none-known': return 'No known drug allergies';
    case 'has-allergies': return 'Has documented allergies';
    case 'not-documented': return 'Not documented';
    default: return '';
  }
}

/** Consciousness-level (AVPU) label. */
function consciousnessLabel(level) {
  switch (level) {
    case 'alert': return 'Alert';
    case 'voice': return 'Responds to voice';
    case 'pain': return 'Responds to pain';
    case 'unresponsive': return 'Unresponsive';
    default: return '';
  }
}

/** Completeness-status label. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (reuses the risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-medium';
    case 'incomplete': return 'risk-high';
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

export { emptyAssessment, flatten, clinicianRoleLabel, careSettingLabel, admissionSourceLabel, ageBandLabel, sexLabel, allergyStatusLabel, consciousnessLabel, statusLabel, statusClass, priorityLabel };
