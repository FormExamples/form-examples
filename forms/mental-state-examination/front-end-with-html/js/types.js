// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Mental State Examination (MSE)
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_mental_state_examination.sql`. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (statusLabel,
// statusClass, riskLevelLabel, riskLevelClass, priorityLabel, and enum label
// maps for the context / identification fields).
//
// Unlike a numeric-score form, the engine here grades DOCUMENTATION COMPLETENESS
// and RISK: it classifies the record as Complete / Partial across the seven
// ASEPTIC domains, reports a `completenessPercent`, and — independently — raises
// safety flags whose highest priority determines the risk level
// (none / low / moderate / high). It is not a numeric severity score.

/**
 * @typedef {'psychiatrist' | 'mental-health-nurse' | 'gp' | 'liaison' | 'other' | ''} ClinicianRole
 * @typedef {'outpatient' | 'inpatient' | 'liaison' | 'crisis' | 'primary-care' | 'other' | ''} CareSetting
 * @typedef {'under-18' | '18-25' | '26-39' | '40-64' | '65-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'complete' | 'partial'} CompletenessStatus
 * @typedef {'none' | 'low' | 'moderate' | 'high'} RiskLevel
 * @typedef {'high' | 'moderate' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} assessmentReason
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Domain 1 — appearance and behaviour.
 * @typedef {Object} Appearance
 * @property {string} appearanceGrooming
 * @property {string} appearanceEyeContact
 * @property {string} appearanceRapport
 * @property {string} appearancePsychomotor
 * @property {string} appearanceAbnormalMovements
 * @property {string} appearanceNotes
 */

/**
 * Domain 2 — speech.
 * @typedef {Object} Speech
 * @property {string} speechRate
 * @property {string} speechVolume
 * @property {string} speechQuantity
 * @property {string} speechFluency
 * @property {string} speechNotes
 */

/**
 * Domain 3 — emotion (mood and affect).
 * @typedef {Object} Emotion
 * @property {string} moodSubjective
 * @property {string} moodDescriptor
 * @property {string} affectRange
 * @property {string} affectCongruence
 * @property {string} affectReactivity
 * @property {string} emotionNotes
 */

/**
 * Domain 4 — perception.
 * @typedef {Object} Perception
 * @property {string} hallucinationsPresent
 * @property {string} commandHallucinations
 * @property {string} illusions
 * @property {string} depersonalisation
 * @property {string} derealisation
 * @property {string} perceptionNotes
 */

/**
 * Domain 5 — thought (form and content).
 * @typedef {Object} Thought
 * @property {string} thoughtForm
 * @property {string} delusions
 * @property {string} obsessions
 * @property {string} suicidalIdeation
 * @property {string} homicidalIdeation
 * @property {string} selfHarmThoughts
 * @property {string} thoughtNotes
 */

/**
 * Domain 6 — insight and judgement.
 * @typedef {Object} Insight
 * @property {string} insightLevel
 * @property {string} treatmentUnderstanding
 * @property {string} judgement
 * @property {string} insightNotes
 */

/**
 * Domain 7 — cognition.
 * @typedef {Object} Cognition
 * @property {string} orientation
 * @property {string} attention
 * @property {string} memory
 * @property {string} cognitiveImpression
 * @property {string} cognitionNotes
 */

/**
 * Step 10 — summary and formulation.
 * @typedef {Object} Summary
 * @property {string} clinicalFormulation
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Appearance} appearance
 * @property {Speech} speech
 * @property {Emotion} emotion
 * @property {Perception} perception
 * @property {Thought} thought
 * @property {Insight} insight
 * @property {Cognition} cognition
 * @property {Summary} summary
 */

/**
 * Per-domain documentation status row.
 * @typedef {Object} DomainStatus
 * @property {string} domain      - stable domain key, e.g. appearance-behaviour
 * @property {string} label       - human-readable domain name
 * @property {boolean} documented - true when any finding in the domain is recorded
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-DOMAIN-THOUGHT-01
 * @property {string} domain       - appearance-behaviour | ... | completeness | risk
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - suicidal-ideation | homicidal-ideation | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessStatus} status
 * @property {RiskLevel} riskLevel
 * @property {number} completenessPercent      - 0..100
 * @property {DomainStatus[]} domainStatuses
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.MentalStateExamination`.
(function () {
'use strict';
window.MentalStateExamination = window.MentalStateExamination || {};

/**
 * Build a fresh, fully-blank assessment. Every text / enum field defaults to
 * `''`; there are no numeric input fields in this documentation instrument.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      assessmentReason: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    appearance: {
      appearanceGrooming: '',
      appearanceEyeContact: '',
      appearanceRapport: '',
      appearancePsychomotor: '',
      appearanceAbnormalMovements: '',
      appearanceNotes: ''
    },
    speech: {
      speechRate: '',
      speechVolume: '',
      speechQuantity: '',
      speechFluency: '',
      speechNotes: ''
    },
    emotion: {
      moodSubjective: '',
      moodDescriptor: '',
      affectRange: '',
      affectCongruence: '',
      affectReactivity: '',
      emotionNotes: ''
    },
    perception: {
      hallucinationsPresent: '',
      commandHallucinations: '',
      illusions: '',
      depersonalisation: '',
      derealisation: '',
      perceptionNotes: ''
    },
    thought: {
      thoughtForm: '',
      delusions: '',
      obsessions: '',
      suicidalIdeation: '',
      homicidalIdeation: '',
      selfHarmThoughts: '',
      thoughtNotes: ''
    },
    insight: {
      insightLevel: '',
      treatmentUnderstanding: '',
      judgement: '',
      insightNotes: ''
    },
    cognition: {
      orientation: '',
      attention: '',
      memory: '',
      cognitiveImpression: '',
      cognitionNotes: ''
    },
    summary: {
      clinicalFormulation: ''
    }
  };
}

/**
 * The seven ASEPTIC domains, in order. Each entry names the state section and
 * the stable domain key used across the grade / grade_rule SQL tables.
 * @type {{ section: string, domain: string, label: string }[]}
 */
const DOMAINS = [
  { section: 'appearance', domain: 'appearance-behaviour', label: 'Appearance and behaviour' },
  { section: 'speech',     domain: 'speech',               label: 'Speech' },
  { section: 'emotion',    domain: 'emotion',              label: 'Emotion (mood and affect)' },
  { section: 'perception', domain: 'perception',           label: 'Perception' },
  { section: 'thought',    domain: 'thought',              label: 'Thought (form and content)' },
  { section: 'insight',    domain: 'insight',              label: 'Insight and judgement' },
  { section: 'cognition',  domain: 'cognition',            label: 'Cognition' }
];

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';    // green — nothing outstanding
    case 'partial': return 'risk-moderate'; // amber — domains outstanding
    default: return '';
  }
}

/** Risk-level label for display. */
function riskLevelLabel(level) {
  switch (level) {
    case 'none': return 'No risk flags';
    case 'low': return 'Low';
    case 'moderate': return 'Moderate';
    case 'high': return 'High';
    default: return '';
  }
}

/** CSS class hint for the risk-level badge (shared risk palette). */
function riskLevelClass(level) {
  switch (level) {
    case 'none': return 'risk-none';
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'psychiatrist': return 'Psychiatrist';
    case 'mental-health-nurse': return 'Mental-health nurse';
    case 'gp': return 'General practitioner';
    case 'liaison': return 'Liaison-psychiatry clinician';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'outpatient': return 'Outpatient clinic';
    case 'inpatient': return 'Inpatient ward';
    case 'liaison': return 'Liaison psychiatry';
    case 'crisis': return 'Crisis / home treatment';
    case 'primary-care': return 'Primary care';
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

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'under-18': return 'Under 18';
    case '18-25': return '18-25';
    case '26-39': return '26-39';
    case '40-64': return '40-64';
    case '65-plus': return '65 and over';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'moderate': return 'MODERATE';
    case 'low': return 'LOW';
    default: return '';
  }
}

Object.assign(window.MentalStateExamination, {
  emptyAssessment,
  DOMAINS,
  statusLabel,
  statusClass,
  riskLevelLabel,
  riskLevelClass,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  ageBandLabel,
  priorityLabel
});
})();
