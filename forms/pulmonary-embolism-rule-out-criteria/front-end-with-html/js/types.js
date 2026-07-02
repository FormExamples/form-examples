// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Pulmonary Embolism Rule-out
// Criteria (PERC) form.
//
// PERC is a status / classification instrument, not a numeric-score form: the
// engine emits a binary classification (perc-negative / perc-positive) from a
// boolean conjunction of the eight criteria and the pre-test-probability gate —
// it does not sum a total. The camelCase property names here mirror the
// snake_case SQL columns in
// `sql/04_create_table_pulmonary_embolism_rule_out_criteria.sql`
// (age, heart_rate, oxygen_saturation, pretest_probability, and the eight
// criterion inputs). Criteria 1-3 are derived from the objective numeric values
// (age, heart rate, SpO2); criteria 4-8 are yes/no clinical findings, each
// satisfied only in its reassuring 'no' state. This file builds the canonical
// empty AssessmentData shape used by the wizard, so newly-added fields default
// correctly when older saved state is rehydrated from localStorage. It also
// exports display helpers used by the wizard and report.

/**
 * @typedef {'physician' | 'advanced-practitioner' | 'nurse' | 'other' | ''} ClinicianRole
 * @typedef {'emergency-department' | 'acute-ambulatory' | 'other' | ''} CareSetting
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'low' | 'not-low' | ''} PretestProbability
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'perc-negative' | 'perc-positive' | ''} Classification
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt          - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {string} presentingComplaint
 */

/**
 * Step 2 — patient identification. `age` drives criterion 1 (age < 50).
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {number | null} age          - years; objective value behind criterion 1
 * @property {Sex} sex
 */

/**
 * Step 3 — applicability gate. PERC applies only when the gestalt pre-test
 * probability of PE is 'low'.
 * @typedef {Object} Pretest
 * @property {PretestProbability} pretestProbability
 */

/**
 * Step 4 — vital signs. Objective values behind criteria 2 and 3.
 * @typedef {Object} Vitals
 * @property {number | null} heartRate        - beats/min; criterion 2 (< 100)
 * @property {number | null} oxygenSaturation - SpO2 %; criterion 3 (>= 95)
 */

/**
 * Step 5 — clinical criteria 4-8. Each is a yes/no clinical finding, satisfied
 * only when 'no' (the reassuring state is positively documented).
 * @typedef {Object} Criteria
 * @property {YesNo} unilateralLegSwelling      - criterion 4
 * @property {YesNo} haemoptysis                - criterion 5
 * @property {YesNo} recentSurgeryOrTrauma      - criterion 6
 * @property {YesNo} priorVenousThromboembolism - criterion 7
 * @property {YesNo} oestrogenUse               - criterion 8
 */

/**
 * Step 6 — summary and result.
 * @typedef {Object} ResultNotes
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Pretest} pretest
 * @property {Vitals} vitals
 * @property {Criteria} criteria
 * @property {ResultNotes} result
 */

/**
 * @typedef {Object} CriterionResult
 * @property {number} number       - 1..8
 * @property {string} criterion    - kebab-case criterion key mirroring SQL
 * @property {boolean} satisfied   - true when the reassuring state holds
 * @property {string} label        - short human label
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-AGE-UNDER-50-01
 * @property {string} instrument   - criterion | gate | composite
 * @property {(boolean|null)} satisfied - criterion satisfied (null for gate / composite)
 * @property {string} outcome      - satisfied | failed | applicable | not-applicable | perc-negative | perc-positive
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
 * @property {Classification} classification
 * @property {boolean} allCriteriaSatisfied
 * @property {boolean} applicable                 - pretestProbability === 'low'
 * @property {CriterionResult[]} criterionResults - one per criterion
 * @property {number[]} failedCriteria            - subset of [1..8] that failed
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PulmonaryEmbolismRuleOutCriteria`.
(function () {
'use strict';
window.PulmonaryEmbolismRuleOutCriteria = window.PulmonaryEmbolismRuleOutCriteria || {};

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
      presentingComplaint: ''
    },
    identification: {
      patientIdentifier: '',
      age: null,
      sex: ''
    },
    pretest: {
      pretestProbability: ''
    },
    vitals: {
      heartRate: null,
      oxygenSaturation: null
    },
    criteria: {
      unilateralLegSwelling: '',
      haemoptysis: '',
      recentSurgeryOrTrauma: '',
      priorVenousThromboembolism: '',
      oestrogenUse: ''
    },
    result: {
      clinicalNote: ''
    }
  };
}

/** Classification label for display. */
function classificationLabel(classification) {
  switch (classification) {
    case 'perc-negative': return 'PERC-negative';
    case 'perc-positive': return 'PERC-positive';
    default: return '';
  }
}

/** CSS class hint for the classification badge (reuses the shared risk palette). */
function classificationClass(classification) {
  switch (classification) {
    case 'perc-negative': return 'risk-low';
    case 'perc-positive': return 'risk-high';
    default: return '';
  }
}

/** Satisfied / failed label for a single criterion. */
function criterionStatusLabel(satisfied) {
  return satisfied ? 'Satisfied' : 'Failed';
}

/** Clinician-role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'physician': return 'Physician';
    case 'advanced-practitioner': return 'Advanced practitioner';
    case 'nurse': return 'Nurse';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(value) {
  switch (value) {
    case 'emergency-department': return 'Emergency department';
    case 'acute-ambulatory': return 'Acute ambulatory care';
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

/** Pre-test-probability label. */
function pretestProbabilityLabel(value) {
  switch (value) {
    case 'low': return 'Low';
    case 'not-low': return 'Not low (moderate or high)';
    default: return '';
  }
}

/** Yes/No label. */
function yesNoLabel(value) {
  switch (value) {
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

Object.assign(window.PulmonaryEmbolismRuleOutCriteria, {
  emptyAssessment,
  classificationLabel,
  classificationClass,
  criterionStatusLabel,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  pretestProbabilityLabel,
  yesNoLabel,
  priorityLabel
});
})();
