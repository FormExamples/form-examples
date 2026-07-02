// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Emergency Department Triage Note
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_emergency_department_triage_note.sql` (and the patient
// table). This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage. It also
// exports display helpers (priority level → colour / name / target time, plus
// ACVPU, air-or-oxygen, care-setting, arrival-mode, age-band, sex, yes/no, and
// flag-priority labels).
//
// This is a CLASSIFICATION form: the engine selects the most urgent Manchester
// Triage System (MTS) level justified by the findings; it does NOT sum a total.

/**
 * @typedef {'emergency-department' | 'urgent-treatment-centre' | 'minor-injuries-unit' | ''} CareSetting
 * @typedef {'walk-in' | 'ambulance' | 'other' | ''} ArrivalMode
 * @typedef {'paediatric' | 'adult' | 'older-adult' | ''} AgeBand
 * @typedef {'female' | 'male' | 'other' | ''} Sex
 * @typedef {'air' | 'oxygen' | ''} AirOrOxygen
 * @typedef {'A' | 'C' | 'V' | 'P' | 'U' | ''} Acvpu
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {1 | 2 | 3 | 4 | 5} PriorityLevel
 * @typedef {'red' | 'orange' | 'yellow' | 'green' | 'blue'} PriorityColour
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — triage context.
 * @typedef {Object} Context
 * @property {string} nurseName
 * @property {string} triagedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 */

/**
 * Step 2 — arrival.
 * @typedef {Object} Arrival
 * @property {ArrivalMode} arrivalMode
 * @property {string} arrivedAt        - ISO-ish datetime-local string; '' when unset
 * @property {string} referralSource
 */

/**
 * Step 3 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 4 — presenting complaint.
 * @typedef {Object} Complaint
 * @property {string} presentingComplaint
 * @property {string} briefHistory
 * @property {string} symptomOnset
 */

/**
 * Step 5 — triage vital signs (NEWS2 inputs + optional GCS).
 * @typedef {Object} Vitals
 * @property {number | null} respiratoryRate    - breaths/min
 * @property {number | null} spo2               - SpO2 %
 * @property {AirOrOxygen} onOxygen             - air or supplemental oxygen (NEWS2 +2)
 * @property {number | null} systolicBp         - mmHg
 * @property {number | null} pulse              - beats/min
 * @property {Acvpu} consciousnessAcvpu         - ACVPU consciousness level
 * @property {number | null} temperature        - degrees Celsius
 * @property {number | null} glasgowComaScale   - optional GCS total (3-15)
 */

/**
 * Step 6 — pain score.
 * @typedef {Object} Pain
 * @property {number | null} painScore          - 0-10 numeric rating
 */

/**
 * Step 7 — Manchester Triage System discriminator flags (each yes/no).
 * @typedef {Object} Discriminators
 * @property {YesNo} airwayThreat
 * @property {YesNo} breathingInadequate
 * @property {YesNo} circulationShock
 * @property {YesNo} haemorrhageMajor
 * @property {YesNo} consciousnessReduced
 * @property {YesNo} seizureActive
 * @property {YesNo} focalNeurology
 * @property {YesNo} sepsisFeatures
 * @property {YesNo} chestPainCardiac
 * @property {YesNo} strokeFeatures
 * @property {YesNo} paediatricRedFlag
 */

/**
 * Step 8 — free-text triage note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Arrival} arrival
 * @property {Identification} identification
 * @property {Complaint} complaint
 * @property {Vitals} vitals
 * @property {Pain} pain
 * @property {Discriminators} discriminators
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredDiscriminator
 * @property {string} id           - stable rule id, e.g. D-AIRWAY-THREAT
 * @property {string} category     - airway | breathing | circulation | disability | temperature | pain | news2
 * @property {PriorityLevel} level - MTS minimum level this discriminator forces
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
 * @typedef {Object} TriageResult
 * @property {Subscores} subscores
 * @property {number} news2Total
 * @property {boolean} news2AnyParameterThree
 * @property {FiredDiscriminator[]} firedDiscriminators
 * @property {PriorityLevel} priorityLevel
 * @property {PriorityColour} priorityColour
 * @property {string} priorityName
 * @property {0|10|60|120|240} targetMinutes
 * @property {boolean} complete
 * @property {Flag[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.EmergencyDepartmentTriageNote`.
(function () {
'use strict';
window.EmergencyDepartmentTriageNote = window.EmergencyDepartmentTriageNote || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric and date fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      nurseName: '',
      triagedAt: '',
      careSetting: ''
    },
    arrival: {
      arrivalMode: '',
      arrivedAt: '',
      referralSource: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    complaint: {
      presentingComplaint: '',
      briefHistory: '',
      symptomOnset: ''
    },
    vitals: {
      respiratoryRate: null,
      spo2: null,
      onOxygen: '',
      systolicBp: null,
      pulse: null,
      consciousnessAcvpu: '',
      temperature: null,
      glasgowComaScale: null
    },
    pain: {
      painScore: null
    },
    discriminators: {
      airwayThreat: '',
      breathingInadequate: '',
      circulationShock: '',
      haemorrhageMajor: '',
      consciousnessReduced: '',
      seizureActive: '',
      focalNeurology: '',
      sepsisFeatures: '',
      chestPainCardiac: '',
      strokeFeatures: '',
      paediatricRedFlag: ''
    },
    note: {
      clinicalNotes: ''
    }
  };
}

// ─── Priority (MTS level) display helpers ───────────────────────────

/** MTS priority colour token for a level. */
function priorityColour(level) {
  switch (level) {
    case 1: return 'red';
    case 2: return 'orange';
    case 3: return 'yellow';
    case 4: return 'green';
    case 5: return 'blue';
    default: return 'green';
  }
}

/** MTS priority name for a level. */
function priorityName(level) {
  switch (level) {
    case 1: return 'Immediate';
    case 2: return 'Very urgent';
    case 3: return 'Urgent';
    case 4: return 'Standard';
    case 5: return 'Non-urgent';
    default: return '';
  }
}

/** Target time to first clinical assessment (minutes) for a level. */
function targetMinutes(level) {
  switch (level) {
    case 1: return 0;
    case 2: return 10;
    case 3: return 60;
    case 4: return 120;
    case 5: return 240;
    default: return 120;
  }
}

/** Human-friendly target-time label. */
function targetLabel(level) {
  const m = targetMinutes(level);
  return m === 0 ? 'Immediately (0 min)' : `Within ${m} min`;
}

/**
 * CSS class hint for the priority badge. MTS levels 1-5 map onto the shared
 * risk palette in severity order (critical > high > medium > moderate > low).
 */
function priorityClass(level) {
  switch (level) {
    case 1: return 'risk-critical';
    case 2: return 'risk-high';
    case 3: return 'risk-medium';
    case 4: return 'risk-moderate';
    case 5: return 'risk-low';
    default: return 'risk-low';
  }
}

// ─── Enum labels ────────────────────────────────────────────────────

/** Care-setting label. */
function careSettingLabel(value) {
  switch (value) {
    case 'emergency-department': return 'Emergency department';
    case 'urgent-treatment-centre': return 'Urgent treatment centre';
    case 'minor-injuries-unit': return 'Minor injuries unit';
    default: return '';
  }
}

/** Arrival-mode label. */
function arrivalModeLabel(value) {
  switch (value) {
    case 'walk-in': return 'Walk-in';
    case 'ambulance': return 'Ambulance';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Age-band label. */
function ageBandLabel(value) {
  switch (value) {
    case 'paediatric': return 'Paediatric';
    case 'adult': return 'Adult';
    case 'older-adult': return 'Older adult';
    default: return '';
  }
}

/** Sex label. */
function sexLabel(value) {
  switch (value) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Air-or-oxygen label. */
function onOxygenLabel(value) {
  switch (value) {
    case 'air': return 'Air';
    case 'oxygen': return 'Supplemental oxygen';
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

Object.assign(window.EmergencyDepartmentTriageNote, {
  emptyAssessment,
  priorityColour,
  priorityName,
  targetMinutes,
  targetLabel,
  priorityClass,
  careSettingLabel,
  arrivalModeLabel,
  ageBandLabel,
  sexLabel,
  onOxygenLabel,
  acvpuLabel,
  yesNoLabel,
  priorityLabel
});
})();
