// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Edinburgh Postnatal Depression
// Scale (EPDS) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_edinburgh_postnatal_depression_scale.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (bandLabel, bandClass, clinicianRoleLabel, careSettingLabel,
// perinatalStageLabel, ageBandLabel, assistanceNeededLabel, priorityLabel).
//
// Item responses. Each of the ten items stores the RAW selected option index
// 0..3 (the printed top-to-bottom order shown on the questionnaire), or `null`
// when unanswered. The reverse-scoring for items 3, 5, 6, 7, 8, 9 and 10 is
// applied in the grader (`grader.js` via `rules.js`), which converts the raw
// option index into the 0..3 symptom score (higher = more symptomatic).

/**
 * @typedef {'midwife' | 'health-visitor' | 'gp' | 'perinatal-mh' | 'other' | ''} ClinicianRole
 * @typedef {'maternity' | 'community' | 'general-practice' | 'perinatal-mh' | 'other' | ''} CareSetting
 * @typedef {'antenatal' | 'postnatal' | ''} PerinatalStage
 * @typedef {'under-20' | '20-29' | '30-39' | '40-plus' | ''} AgeBand
 * @typedef {'none' | 'interpreter' | 'clinician-read' | 'other' | ''} AssistanceNeeded
 * @typedef {'lower' | 'possible' | 'likely'} Band
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {CareSetting} careSetting
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {PerinatalStage} perinatalStage
 * @property {number | null} perinatalWeek - gestational week (antenatal) or postnatal week
 */

/**
 * Step 2 — respondent identification.
 * @typedef {Object} Identification
 * @property {string} respondentIdentifier
 * @property {AgeBand} ageBand
 * @property {string} preferredLanguage
 * @property {AssistanceNeeded} assistanceNeeded
 */

/**
 * Steps 3-5 — the ten item responses. Each value is the RAW selected option
 * index 0..3 (printed order), or null when unanswered.
 * @typedef {Object} Items
 * @property {number | null} item1
 * @property {number | null} item2
 * @property {number | null} item3
 * @property {number | null} item4
 * @property {number | null} item5
 * @property {number | null} item6
 * @property {number | null} item7
 * @property {number | null} item8
 * @property {number | null} item9
 * @property {number | null} item10
 */

/**
 * Step 6 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Items} items
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredItem
 * @property {string} id           - stable rule id, e.g. R-ITEM-10-SCORE
 * @property {string} parameter    - item | total | band | self-harm | anxiety-subscale
 * @property {number} points       - points contributed (0..3), where applicable
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
 * @property {number[]} itemScores   - ten entries, each 0..3 (reverse-corrected)
 * @property {number} totalScore     - 0..30
 * @property {Band} band
 * @property {number} item10Score    - item 10 reverse-corrected score 0..3
 * @property {boolean} selfHarmFlag  - item10Score > 0 (independent of total)
 * @property {FiredItem[]} firedItems
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.EdinburghPostnatalDepressionScale`.
(function () {
'use strict';
window.EdinburghPostnatalDepressionScale =
  window.EdinburghPostnatalDepressionScale || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields (perinatalWeek, item responses)
 * default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      careSetting: '',
      assessedAt: '',
      perinatalStage: '',
      perinatalWeek: null
    },
    identification: {
      respondentIdentifier: '',
      ageBand: '',
      preferredLanguage: '',
      assistanceNeeded: ''
    },
    items: {
      item1: null,
      item2: null,
      item3: null,
      item4: null,
      item5: null,
      item6: null,
      item7: null,
      item8: null,
      item9: null,
      item10: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Interpretation-band label for display. */
function bandLabel(band) {
  switch (band) {
    case 'lower': return 'Lower likelihood (0-9)';
    case 'possible': return 'Possible depression (10-12)';
    case 'likely': return 'Likely depression (13-30)';
    default: return '';
  }
}

/** CSS class hint for the band badge (reuses the shared risk palette). */
function bandClass(band) {
  switch (band) {
    case 'lower': return 'risk-low';
    case 'possible': return 'risk-medium';
    case 'likely': return 'risk-high';
    default: return '';
  }
}

/** Administering-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'midwife': return 'Midwife';
    case 'health-visitor': return 'Health visitor';
    case 'gp': return 'General practitioner';
    case 'perinatal-mh': return 'Perinatal mental-health practitioner';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'maternity': return 'Maternity service';
    case 'community': return 'Community / health visiting';
    case 'general-practice': return 'General practice';
    case 'perinatal-mh': return 'Perinatal mental-health service';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Perinatal-stage label. */
function perinatalStageLabel(stage) {
  switch (stage) {
    case 'antenatal': return 'Antenatal (during pregnancy)';
    case 'postnatal': return 'Postnatal (after birth)';
    default: return '';
  }
}

/** Respondent age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'under-20': return 'Under 20';
    case '20-29': return '20-29';
    case '30-39': return '30-39';
    case '40-plus': return '40 and over';
    default: return '';
  }
}

/** Assistance-needed label. */
function assistanceNeededLabel(value) {
  switch (value) {
    case 'none': return 'None — self-completed';
    case 'interpreter': return 'Interpreter';
    case 'clinician-read': return 'Clinician read the items aloud';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'URGENT';
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

Object.assign(window.EdinburghPostnatalDepressionScale, {
  emptyAssessment,
  bandLabel,
  bandClass,
  clinicianRoleLabel,
  careSettingLabel,
  perinatalStageLabel,
  ageBandLabel,
  assistanceNeededLabel,
  priorityLabel
});
})();
