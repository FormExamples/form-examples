// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Ottawa Ankle Rules (and Ottawa
// Foot Rules) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ottawa_ankle_rules.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (decisionLabel,
// decisionClass, clinicianRoleLabel, careSettingLabel, injuredSideLabel,
// sexLabel, yesNoLabel, priorityLabel).
//
// This instrument is a boolean DECISION RULE, not a numeric score: there is no
// total and no risk band. The engine emits two independent imaging decisions
// (ankle X-ray indicated yes/no, foot X-ray indicated yes/no) plus the criteria
// that drove them.

/**
 * @typedef {'doctor' | 'nurse-practitioner' | 'paramedic' | 'physiotherapist' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'minor-injury-unit' | 'urgent-care' | 'other' | ''} CareSetting
 * @typedef {'left' | 'right' | ''} InjuredSide
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt         - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {InjuredSide} injuredSide
 * @property {number | null} hoursSinceInjury
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} ageYears
 * @property {Sex} sex
 */

/**
 * Step 3 — applicability.
 * @typedef {Object} Applicability
 * @property {YesNo} assessmentReliable   - no intoxication, distracting injury, or sensory deficit
 */

/**
 * Step 4 — pain zones (the two decision preconditions).
 * @typedef {Object} PainZones
 * @property {YesNo} malleolarZonePain     - ankle precondition
 * @property {YesNo} midfootZonePain       - foot precondition
 */

/**
 * Step 5 — ankle bone tenderness (criteria A1, A2).
 * @typedef {Object} AnkleTenderness
 * @property {YesNo} lateralMalleolusTenderness   - A1: posterior edge/tip lateral malleolus
 * @property {YesNo} medialMalleolusTenderness    - A2: posterior edge/tip medial malleolus
 */

/**
 * Step 6 — foot bone tenderness (criteria F1, F2).
 * @typedef {Object} FootTenderness
 * @property {YesNo} fifthMetatarsalBaseTenderness - F1: base of fifth metatarsal
 * @property {YesNo} navicularTenderness           - F2: navicular
 */

/**
 * Step 7 — weight-bearing (derives "unable to bear weight", criterion A3/F3).
 * @typedef {Object} WeightBearing
 * @property {YesNo} ableToBearWeightImmediately   - four steps immediately after injury
 * @property {YesNo} ableToBearWeightNow           - four steps at assessment
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Applicability} applicability
 * @property {PainZones} painZones
 * @property {AnkleTenderness} ankleTenderness
 * @property {FootTenderness} footTenderness
 * @property {WeightBearing} weightBearing
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. A1, A2, A3, F1, F2, F3
 * @property {'ankle' | 'foot' | 'both'} region
 * @property {string} criterion    - criterion slug
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
 * @property {boolean} unableToBearWeight
 * @property {boolean} ankleXrayIndicated
 * @property {boolean} footXrayIndicated
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.OttawaAnkleRules`.
(function () {
'use strict';
window.OttawaAnkleRules = window.OttawaAnkleRules || {};

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
      injuredSide: '',
      hoursSinceInjury: null
    },
    identification: {
      patientIdentifier: '',
      ageYears: null,
      sex: ''
    },
    applicability: {
      assessmentReliable: ''
    },
    painZones: {
      malleolarZonePain: '',
      midfootZonePain: ''
    },
    ankleTenderness: {
      lateralMalleolusTenderness: '',
      medialMalleolusTenderness: ''
    },
    footTenderness: {
      fifthMetatarsalBaseTenderness: '',
      navicularTenderness: ''
    },
    weightBearing: {
      ableToBearWeightImmediately: '',
      ableToBearWeightNow: ''
    },
    note: {
      clinicalNotes: ''
    }
  };
}

/** Imaging-decision label for display. */
function decisionLabel(indicated) {
  return indicated ? 'X-ray indicated' : 'X-ray not indicated';
}

/** CSS class hint for a decision badge (reuses the shared risk palette). */
function decisionClass(indicated) {
  return indicated ? 'risk-high' : 'risk-low';
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'doctor': return 'Doctor';
    case 'nurse-practitioner': return 'Nurse practitioner';
    case 'paramedic': return 'Paramedic';
    case 'physiotherapist': return 'Physiotherapist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'emergency-department': return 'Emergency department';
    case 'minor-injury-unit': return 'Minor-injury unit';
    case 'urgent-care': return 'Urgent care';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Injured-side label. */
function injuredSideLabel(side) {
  switch (side) {
    case 'left': return 'Left';
    case 'right': return 'Right';
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

/** Yes/No label. */
function yesNoLabel(v) {
  switch (v) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return 'Not recorded';
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

Object.assign(window.OttawaAnkleRules, {
  emptyAssessment,
  decisionLabel,
  decisionClass,
  clinicianRoleLabel,
  careSettingLabel,
  injuredSideLabel,
  sexLabel,
  yesNoLabel,
  priorityLabel
});
})();
