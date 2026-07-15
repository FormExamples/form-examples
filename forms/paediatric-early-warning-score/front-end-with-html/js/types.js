// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Paediatric Early Warning Score
// (PEWS) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_paediatric_early_warning_score.sql` (and the patient
// table). This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage. It also
// exports display helpers (escalationBandLabel, escalationBandClass,
// ageBandLabel, clinicianRoleLabel, careSettingLabel, respiratoryEffortLabel,
// supplementalOxygenLabel, capillaryRefillLabel, consciousnessLabel, sexLabel,
// yesNoLabel, priorityLabel).

/**
 * @typedef {'nurse' | 'healthcare-assistant' | 'doctor' | 'other' | ''} ClinicianRole
 * @typedef {'ward' | 'childrens-assessment-unit' | 'emergency-department' | 'other' | ''} CareSetting
 * @typedef {'neonate' | 'infant' | 'young-child' | 'child' | 'adolescent' | ''} AgeBand
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} RespiratoryEffort
 * @typedef {'room-air' | 'low-flow' | 'high-flow' | ''} SupplementalOxygen
 * @typedef {'under-2s' | '2-3s' | '3-4s' | 'over-4s' | ''} CapillaryRefill
 * @typedef {'alert' | 'voice' | 'pain' | 'unresponsive' | ''} Consciousness
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'routine' | 'low' | 'medium' | 'high'} EscalationBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} observationAt   - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 */

/**
 * Step 2 — patient identification and age band. The age band is selected
 * first and drives the normal ranges for the rate parameters.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — respiratory domain.
 * @typedef {Object} Respiratory
 * @property {number | null} respiratoryRate  - breaths/min (scored vs age band)
 * @property {RespiratoryEffort} respiratoryEffort
 * @property {number | null} oxygenSaturation - SpO2 %
 * @property {SupplementalOxygen} supplementalOxygen
 */

/**
 * Step 4 — cardiovascular domain.
 * @typedef {Object} Cardiovascular
 * @property {number | null} heartRate        - beats/min (scored vs age band)
 * @property {CapillaryRefill} capillaryRefill
 */

/**
 * Step 5 — behaviour / neurological domain.
 * @typedef {Object} Behaviour
 * @property {Consciousness} consciousness    - ACVPU consciousness level
 */

/**
 * Step 6 — documented-concern override triggers.
 * @typedef {Object} Concern
 * @property {YesNo} nurseConcern
 * @property {YesNo} parentConcern
 */

/**
 * Step 7 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Respiratory} respiratory
 * @property {Cardiovascular} cardiovascular
 * @property {Behaviour} behaviour
 * @property {Concern} concern
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-RESP-RATE-3-HIGH-01
 * @property {string} instrument   - respiratory-rate | respiratory-effort | oxygen-saturation | supplemental-oxygen | heart-rate | capillary-refill | consciousness | aggregate | single-parameter | concern
 * @property {string} band         - routine | low | medium | high | ''
 * @property {number | null} points - subscore points contributed (0-3), or null for non-scoring rules
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FiredTrigger
 * @property {string} id
 * @property {string} category     - single-parameter | nurse-concern | parent-concern
 * @property {string} description
 */

/**
 * @typedef {Object} Flag
 * @property {string} id
 * @property {string} category     - urgent-review | single-parameter-3 | parent-nurse-concern | deteriorating-trend | incomplete | other
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} Subscores
 * @property {0|1|2|3|null} respiratoryRate
 * @property {0|1|2|3|null} respiratoryEffort
 * @property {0|1|2|3|null} oxygenSaturation
 * @property {0|1|3|null} supplementalOxygen
 * @property {0|1|2|3|null} heartRate
 * @property {0|1|2|3|null} capillaryRefill
 * @property {0|1|2|3|null} consciousness
 */

/**
 * @typedef {Object} GradingResult
 * @property {Subscores} subscores
 * @property {number} aggregateScore
 * @property {0|1|2|3} maxParameterScore
 * @property {boolean} singleParameterTrigger
 * @property {EscalationBand} escalationBand
 * @property {string} monitoringFrequency
 * @property {string} recommendation
 * @property {boolean} complete
 * @property {FiredRule[]} firedRules
 * @property {FiredTrigger[]} firedTriggers
 * @property {Flag[]} flaggedIssues
 * @property {string} timestamp
 */

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
      careSetting: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    respiratory: {
      respiratoryRate: null,
      respiratoryEffort: '',
      oxygenSaturation: null,
      supplementalOxygen: ''
    },
    cardiovascular: {
      heartRate: null,
      capillaryRefill: ''
    },
    behaviour: {
      consciousness: ''
    },
    concern: {
      nurseConcern: '',
      parentConcern: ''
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Escalation-band label for display. */
function escalationBandLabel(band) {
  switch (band) {
    case 'routine': return 'Routine (low)';
    case 'low': return 'Low escalation';
    case 'medium': return 'Medium escalation';
    case 'high': return 'High escalation';
    default: return '';
  }
}

/** CSS class hint for the escalation-band badge (reuses the shared risk palette). */
function escalationBandClass(band) {
  switch (band) {
    case 'routine': return 'risk-low';
    case 'low': return 'risk-moderate';
    case 'medium': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Age-band label for display, including the mapped age range. */
function ageBandLabel(band) {
  switch (band) {
    case 'neonate': return 'Neonate (0–<1 month)';
    case 'infant': return 'Infant (1–11 months)';
    case 'young-child': return 'Young child (1–4 years)';
    case 'child': return 'Child (5–11 years)';
    case 'adolescent': return 'Adolescent (≥ 12 years)';
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
    case 'ward': return 'Paediatric ward';
    case 'childrens-assessment-unit': return "Children's assessment unit";
    case 'emergency-department': return 'Emergency department';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Respiratory-effort label. */
function respiratoryEffortLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'mild': return 'Mild recession';
    case 'moderate': return 'Moderate recession';
    case 'severe': return 'Severe recession / grunting';
    default: return '';
  }
}

/** Supplemental-oxygen label. */
function supplementalOxygenLabel(value) {
  switch (value) {
    case 'room-air': return 'Room air';
    case 'low-flow': return 'Low-flow oxygen';
    case 'high-flow': return 'High-flow / FiO₂ ≥ 0.5';
    default: return '';
  }
}

/** Capillary-refill label. */
function capillaryRefillLabel(value) {
  switch (value) {
    case 'under-2s': return '< 2 s, pink';
    case '2-3s': return '2–3 s';
    case '3-4s': return '3–4 s, pale';
    case 'over-4s': return '> 4 s, mottled / cyanosed';
    default: return '';
  }
}

/** Consciousness (ACVPU) label. */
function consciousnessLabel(value) {
  switch (value) {
    case 'alert': return 'Alert / playing';
    case 'voice': return 'Responds to Voice / irritable';
    case 'pain': return 'Responds to Pain';
    case 'unresponsive': return 'Unresponsive';
    default: return '';
  }
}

/** Patient sex label. */
function sexLabel(value) {
  switch (value) {
    case 'male': return 'Male';
    case 'female': return 'Female';
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

export { emptyAssessment, escalationBandLabel, escalationBandClass, ageBandLabel, clinicianRoleLabel, careSettingLabel, respiratoryEffortLabel, supplementalOxygenLabel, capillaryRefillLabel, consciousnessLabel, sexLabel, yesNoLabel, priorityLabel };
