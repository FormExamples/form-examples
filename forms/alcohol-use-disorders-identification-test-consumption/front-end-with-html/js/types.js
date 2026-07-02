// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the AUDIT-C (Alcohol Use Disorders
// Identification Test — Consumption) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_audit_c.sql` (the short table base `audit_c`):
//   item_1_frequency        -> items.frequencyOfDrinking
//   item_2_quantity         -> items.typicalQuantity
//   item_3_binge_frequency  -> items.heavyEpisodeFrequency
//   context (free-text)     -> note.clinicalNote
//
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskBandLabel, riskBandClass, clinicianRoleLabel, careSettingLabel,
// administrationModeLabel, sexLabel, ageBandLabel, priorityLabel, itemLabel).

/**
 * @typedef {'gp' | 'nurse' | 'healthcare-assistant' | 'other' | ''} ClinicianRole
 * @typedef {'primary-care' | 'emergency-department' | 'health-check' | 'inpatient' | 'other' | ''} CareSetting
 * @typedef {'self-completed' | 'interview' | ''} AdministrationMode
 * @typedef {'16-24' | '25-39' | '40-59' | '60-74' | '75-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {0 | 1 | 2 | 3 | 4 | null} ItemScore
 * @typedef {'lower' | 'increasing' | 'higher' | 'possible-dependence'} RiskBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt              - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {AdministrationMode} administrationMode
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Steps 3-5 — the three AUDIT-C consumption items. Each holds the chosen
 * response's point value (integer 0-4), or null when unanswered.
 * @typedef {Object} Items
 * @property {ItemScore} frequencyOfDrinking    - Q1: how often you drink
 * @property {ItemScore} typicalQuantity        - Q2: UK units on a typical drinking day
 * @property {ItemScore} heavyEpisodeFrequency  - Q3: frequency of >= 6/>= 8 units in one session
 */

/**
 * Step 6 — clinician free-text note (SQL column `context`).
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
 * @property {string} id           - stable rule id, e.g. R-ITEM-1-FREQUENCY-01
 * @property {string} item         - frequency-of-drinking | typical-quantity | heavy-episode-frequency | total
 * @property {number} points       - point contributed (0-4)
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
 * @property {0 | 1 | 2 | 3 | 4} frequencyOfDrinkingPoint
 * @property {0 | 1 | 2 | 3 | 4} typicalQuantityPoint
 * @property {0 | 1 | 2 | 3 | 4} heavyEpisodeFrequencyPoint
 * @property {number} auditcScore                    - 0..12
 * @property {RiskBand} riskBand
 * @property {boolean} positiveScreen                - auditcScore >= 5
 * @property {FiredItem[]} firedItems
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AlcoholUseDisordersIdentificationTestConsumption`.
(function () {
'use strict';
window.AlcoholUseDisordersIdentificationTestConsumption =
  window.AlcoholUseDisordersIdentificationTestConsumption || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric item fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      administrationMode: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    items: {
      frequencyOfDrinking: null,
      typicalQuantity: null,
      heavyEpisodeFrequency: null
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Risk-band label for display. */
function riskBandLabel(band) {
  switch (band) {
    case 'lower': return 'Lower risk (0-4)';
    case 'increasing': return 'Increasing risk (5-7)';
    case 'higher': return 'Higher risk (8-10)';
    case 'possible-dependence': return 'Possible dependence (11-12)';
    default: return '';
  }
}

/** CSS class hint for the risk-band badge (reuses the shared risk palette). */
function riskBandClass(band) {
  switch (band) {
    case 'lower': return 'risk-low';
    case 'increasing': return 'risk-moderate';
    case 'higher': return 'risk-high';
    case 'possible-dependence': return 'risk-critical';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'nurse': return 'Nurse';
    case 'healthcare-assistant': return 'Healthcare assistant';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'primary-care': return 'Primary care';
    case 'emergency-department': return 'Emergency department';
    case 'health-check': return 'Health check';
    case 'inpatient': return 'Inpatient';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Administration-mode label. */
function administrationModeLabel(mode) {
  switch (mode) {
    case 'self-completed': return 'Self-completed';
    case 'interview': return 'Clinician interview';
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
    case '16-24': return '16-24';
    case '25-39': return '25-39';
    case '40-59': return '40-59';
    case '60-74': return '60-74';
    case '75-plus': return '75 and over';
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

/** Short label for an item key (used in the report table). */
function itemLabel(item) {
  switch (item) {
    case 'frequency-of-drinking': return 'Q1 — Frequency of drinking';
    case 'typical-quantity': return 'Q2 — Typical quantity (UK units)';
    case 'heavy-episode-frequency': return 'Q3 — Heavy episodic drinking';
    default: return '';
  }
}

Object.assign(window.AlcoholUseDisordersIdentificationTestConsumption, {
  emptyAssessment,
  riskBandLabel,
  riskBandClass,
  clinicianRoleLabel,
  careSettingLabel,
  administrationModeLabel,
  sexLabel,
  ageBandLabel,
  priorityLabel,
  itemLabel
});
})();
