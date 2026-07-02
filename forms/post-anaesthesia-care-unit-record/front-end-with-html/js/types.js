// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Post-Anaesthesia Care Unit
// (PACU) Record form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_post_anaesthesia_care_unit_record.sql`. This file builds
// and exports the canonical empty PacuRecord shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers.

/**
 * @typedef {'recovery-nurse' | 'odp' | 'anaesthetist' | 'other' | ''} NurseRole
 * @typedef {'general' | 'regional' | 'sedation' | 'combined' | ''} AnaestheticTechnique
 * @typedef {'16-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'I' | 'II' | 'III' | 'IV' | 'V' | ''} AsaStatus
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'all-four' | 'two' | 'none' | ''} Activity
 * @typedef {'deep-cough' | 'limited' | 'apnoeic' | ''} Respiration
 * @typedef {'within-20' | 'within-50' | 'over-50' | ''} Circulation
 * @typedef {'awake' | 'arousable' | 'unresponsive' | ''} Consciousness
 * @typedef {'room-air' | 'needs-o2' | 'low-on-o2' | ''} OxygenSaturation
 * @typedef {'patent' | 'oral-airway' | 'other' | ''} AirwayStatus
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} PonvSeverity
 * @typedef {'within-20' | 'within-40' | 'over-40' | ''} PadssVitalSigns
 * @typedef {'steady' | 'with-assistance' | 'unable' | ''} PadssAmbulation
 * @typedef {'minimal' | 'moderate' | 'severe' | ''} PadssTriState
 * @typedef {'not-ready' | 'discharge-ready'} ReadinessBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — recovery context.
 * @typedef {Object} Context
 * @property {string} nurseName
 * @property {NurseRole} nurseRole
 * @property {string} anaesthetistName
 * @property {string} admittedAt              - ISO-ish datetime-local string; '' when unset
 * @property {AnaestheticTechnique} anaestheticTechnique
 * @property {string} procedure
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {AsaStatus} asaStatus
 * @property {number | null} baselineSystolicBp  - mmHg pre-anaesthetic baseline
 * @property {YesNo} ambulatoryCase              - day-surgery case → enables PADSS
 */

/**
 * Steps 3-7 — the five Modified Aldrete parameter inputs. Each is held in its
 * own single-field section so the wizard step-list can track completion of each
 * parameter independently.
 * @typedef {Object} ActivitySection      @property {Activity} activity
 * @typedef {Object} RespirationSection   @property {Respiration} respiration
 * @typedef {Object} CirculationSection   @property {Circulation} circulation
 * @typedef {Object} ConsciousnessSection @property {Consciousness} consciousness
 * @typedef {Object} OxygenSaturationSection @property {OxygenSaturation} oxygenSaturation
 */

/**
 * Step 8 — airway, pain and PONV.
 * @typedef {Object} Observations
 * @property {AirwayStatus} airwayStatus
 * @property {number | null} painScore       - verbal / numeric rating scale 0-10
 * @property {PonvSeverity} ponvSeverity
 * @property {string} analgesiaGiven
 * @property {string} antiemeticsGiven
 */

/**
 * Step 9 — PADSS criterion inputs (optional; ambulatory cases only).
 * @typedef {Object} Padss
 * @property {PadssVitalSigns} padssVitalSigns
 * @property {PadssAmbulation} padssAmbulation
 * @property {PadssTriState} padssNauseaVomiting
 * @property {PadssTriState} padssPain
 * @property {PadssTriState} padssSurgicalBleeding
 */

/**
 * Step 10 — clinician free-text recovery note.
 * @typedef {Object} Note
 * @property {string} recoveryNote
 */

/**
 * @typedef {Object} PacuRecord
 * @property {Context} context
 * @property {Identification} identification
 * @property {ActivitySection} activity
 * @property {RespirationSection} respiration
 * @property {CirculationSection} circulation
 * @property {ConsciousnessSection} consciousness
 * @property {OxygenSaturationSection} oxygenSaturation
 * @property {Observations} observations
 * @property {Padss} padss
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredParameter
 * @property {string} id           - stable rule id, e.g. R-ACTIVITY-01
 * @property {string} parameter    - activity | respiration | ... | band | padss
 * @property {number} points       - 0, 1, or 2 contributed
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
 * @property {0 | 1 | 2} activityScore
 * @property {0 | 1 | 2} respirationScore
 * @property {0 | 1 | 2} circulationScore
 * @property {0 | 1 | 2} consciousnessScore
 * @property {0 | 1 | 2} oxygenSaturationScore
 * @property {number} aldreteTotal          - 0..10
 * @property {ReadinessBand} readinessBand
 * @property {number | null} padssTotal     - 0..10 or null
 * @property {boolean | null} padssStreetFit
 * @property {FiredParameter[]} firedParameters
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.PostAnaesthesiaCareUnitRecord`.
(function () {
'use strict';
window.PostAnaesthesiaCareUnitRecord =
  window.PostAnaesthesiaCareUnitRecord || {};

/**
 * Build a fresh, fully-blank record.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {PacuRecord}
 */
function emptyAssessment() {
  return {
    context: {
      nurseName: '',
      nurseRole: '',
      anaesthetistName: '',
      admittedAt: '',
      anaestheticTechnique: '',
      procedure: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      asaStatus: '',
      baselineSystolicBp: null,
      ambulatoryCase: ''
    },
    activity: { activity: '' },
    respiration: { respiration: '' },
    circulation: { circulation: '' },
    consciousness: { consciousness: '' },
    oxygenSaturation: { oxygenSaturation: '' },
    observations: {
      airwayStatus: '',
      painScore: null,
      ponvSeverity: '',
      analgesiaGiven: '',
      antiemeticsGiven: ''
    },
    padss: {
      padssVitalSigns: '',
      padssAmbulation: '',
      padssNauseaVomiting: '',
      padssPain: '',
      padssSurgicalBleeding: ''
    },
    note: { recoveryNote: '' }
  };
}

/** Readiness-band label for display. */
function readinessBandLabel(band) {
  switch (band) {
    case 'discharge-ready': return 'Discharge-ready (Aldrete >= 9, SpO2 met)';
    case 'not-ready': return 'Not ready';
    default: return '';
  }
}

/** CSS class hint for the readiness-band badge (reuses the shared risk palette). */
function readinessBandClass(band) {
  switch (band) {
    case 'discharge-ready': return 'risk-low';
    case 'not-ready': return 'risk-high';
    default: return '';
  }
}

/** Recording-staff role label. */
function nurseRoleLabel(role) {
  switch (role) {
    case 'recovery-nurse': return 'Recovery nurse';
    case 'odp': return 'Operating-department practitioner';
    case 'anaesthetist': return 'Anaesthetist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Anaesthetic-technique label. */
function anaestheticTechniqueLabel(technique) {
  switch (technique) {
    case 'general': return 'General anaesthesia';
    case 'regional': return 'Regional anaesthesia';
    case 'sedation': return 'Procedural sedation';
    case 'combined': return 'Combined';
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

/** ASA physical-status label. */
function asaStatusLabel(status) {
  return status ? `ASA ${status}` : '';
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

Object.assign(window.PostAnaesthesiaCareUnitRecord, {
  emptyAssessment,
  readinessBandLabel,
  readinessBandClass,
  nurseRoleLabel,
  anaestheticTechniqueLabel,
  sexLabel,
  ageBandLabel,
  asaStatusLabel,
  priorityLabel
});
})();
