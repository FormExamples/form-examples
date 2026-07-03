// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Blood Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_blood_test_result.sql` and
// `sql/05_create_table_blood_test_result_grade.sql`. This file builds
// and exports the canonical empty BloodTestResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Specimen type analysed.
 * @typedef {'serum' | 'plasma' | 'whole-blood' | ''} SpecimenType
 */

/**
 * Specimen condition / quality.
 * @typedef {'satisfactory' | 'haemolysed' | 'lipaemic' | 'clotted' |
 *           'insufficient' | ''} SpecimenCondition
 */

/**
 * Overall result status summarised by the reporter.
 * @typedef {'normal' | 'abnormal' | 'critical' | ''} OverallResultStatus
 */

/**
 * Axis A — overall result classification.
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 */

/**
 * Axis B — abnormality severity.
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 */

/**
 * Axis D — follow-up urgency.
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 */

/**
 * Overall recommendation.
 * @typedef {'no-action' | 'routine-follow-up' | 'repeat-test' |
 *           'specialist-referral' | 'urgent-review' | ''} Recommendation
 */

/**
 * A scoring axis, used in the fired-rule audit trail.
 * @typedef {'classification' | 'severity' | 'completeness' | 'follow-up'} Axis
 */

/**
 * Flag category (mirrors the sql/07 CHECK constraint).
 * @typedef {'critical-result-alert' | 'incidental-finding' |
 *           'discrepancy-with-request' | 'abnormal-requiring-action' |
 *           'urgent-referral' | 'inadequate-specimen' | 'unexpected-finding' |
 *           'missing-impression' | 'missing-result-value' | 'other'} FlagCategory
 */

/**
 * Flag priority.
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 */

/**
 * The blood / pathology test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors `BloodTestResult`
 * in `front-end-with-svelte/src/lib/engine/types.ts`. Analyte values are
 * nullable numbers (null when the analyte was not measured).
 *
 * @typedef {Object} BloodTestResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {SpecimenType} specimenType
 * @property {SpecimenCondition} specimenCondition
 * @property {string} clinicalHistory
 * @property {number | null} haemoglobinGL
 * @property {number | null} whiteCellCount
 * @property {number | null} platelets
 * @property {number | null} neutrophils
 * @property {number | null} sodiumMmolL
 * @property {number | null} potassiumMmolL
 * @property {number | null} ureaMmolL
 * @property {number | null} creatinineUmolL
 * @property {number | null} egfr
 * @property {number | null} altUL
 * @property {number | null} alkalinePhosphatase
 * @property {number | null} bilirubinUmolL
 * @property {number | null} albuminGL
 * @property {number | null} cReactiveProtein
 * @property {number | null} hba1cMmolMol
 * @property {number | null} glucoseMmolL
 * @property {number | null} tsh
 * @property {number | null} ferritin
 * @property {number | null} inr
 * @property {OverallResultStatus} overallResultStatus
 * @property {boolean} abnormalResultsPresent
 * @property {boolean} criticalValuePresent
 * @property {string} criticalValueDetail
 * @property {string} findingsNarrative
 * @property {string} comparisonWithPrevious
 * @property {string} impression
 * @property {string} reportingCategory
 * @property {string} recommendedFollowUp
 * @property {boolean} criticalResultCommunicated
 * @property {string} reportedTo
 * @property {string} clinicianNotes
 * @property {boolean} signed
 */

/**
 * A single rule that fired during grading (audit trail).
 * @typedef {Object} FiredRule
 * @property {string} ruleId
 * @property {Axis} axis
 * @property {string} category
 * @property {string} description
 */

/**
 * A safety-critical flag, independent of the four axes.
 * @typedef {Object} Flag
 * @property {string} flagId
 * @property {FlagCategory} category
 * @property {FlagPriority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * The computed four-axis interpretation grade. Mirrors
 * `sql/05_create_table_blood_test_result_grade.sql`.
 *
 * @typedef {Object} GradingResult
 * @property {ResultClassification} resultClassification  - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity    - Axis B
 * @property {string} reportingCategory                    - Axis B structured label
 * @property {number} reportCompletenessPercent           - Axis C (0-100)
 * @property {FollowUpUrgency} followUpUrgency            - Axis D
 * @property {string} targetTimeframe                      - Axis D
 * @property {string} recommendedAction                    - Axis D
 * @property {Recommendation} recommendation               - overall
 * @property {FiredRule[]} firedRules
 * @property {Flag[]} flags
 * @property {string} gradedAt                             - ISO timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BloodTestResult`.
(function () {
'use strict';
window.BloodTestResult = window.BloodTestResult || {};

/**
 * Build a fresh, fully-blank blood test result.
 * Strings default to `''`; booleans to `false`; analyte values to `null`
 * (not measured).
 * @returns {BloodTestResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Specimen
    specimenType: '',
    specimenCondition: '',

    // Clinical context
    clinicalHistory: '',

    // Result values — full blood count (FBC)
    haemoglobinGL: null,
    whiteCellCount: null,
    platelets: null,
    neutrophils: null,

    // Result values — urea and electrolytes (U&E) / renal
    sodiumMmolL: null,
    potassiumMmolL: null,
    ureaMmolL: null,
    creatinineUmolL: null,
    egfr: null,

    // Result values — liver function tests (LFT)
    altUL: null,
    alkalinePhosphatase: null,
    bilirubinUmolL: null,
    albuminGL: null,

    // Result values — inflammation, glycaemic, endocrine, haematinics, coagulation
    cReactiveProtein: null,
    hba1cMmolMol: null,
    glucoseMmolL: null,
    tsh: null,
    ferritin: null,
    inr: null,

    // Overall interpretation summary
    overallResultStatus: '',
    abnormalResultsPresent: false,
    criticalValuePresent: false,
    criticalValueDetail: '',
    findingsNarrative: '',
    comparisonWithPrevious: '',
    impression: '',
    reportingCategory: '',
    recommendedFollowUp: '',

    // Critical-result communication and sign-off
    criticalResultCommunicated: false,
    reportedTo: '',
    clinicianNotes: '',
    signed: false
  };
}

// ----------------------------------------------------------------------
// Display labels (mirror `src/lib/engine/utils.ts`)
// ----------------------------------------------------------------------

/** Axis A result-classification display label. */
function resultClassificationLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'abnormal': return 'Abnormal';
    case 'critical': return 'Critical';
    case 'inconclusive': return 'Inconclusive';
    default: return 'Not graded';
  }
}

/** Axis B abnormality-severity display label. */
function abnormalitySeverityLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'minor': return 'Minor';
    case 'moderate': return 'Moderate';
    case 'major': return 'Major';
    default: return 'Not graded';
  }
}

/** Axis D follow-up-urgency display label. */
function followUpUrgencyLabel(value) {
  switch (value) {
    case 'routine': return 'Routine';
    case 'recommended': return 'Recommended';
    case 'urgent': return 'Urgent';
    case 'critical-alert': return 'Critical alert';
    default: return 'Not graded';
  }
}

/** Human-readable overall-result-status label. */
function overallResultStatusLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'abnormal': return 'Abnormal';
    case 'critical': return 'Critical';
    default: return 'Unspecified';
  }
}

/** Human-readable report-status label. */
function reportStatusLabel(value) {
  switch (value) {
    case 'preliminary': return 'Preliminary';
    case 'final': return 'Final';
    case 'amended': return 'Amended';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

/** Human-readable specimen-type label. */
function specimenTypeLabel(value) {
  switch (value) {
    case 'serum': return 'Serum';
    case 'plasma': return 'Plasma';
    case 'whole-blood': return 'Whole blood';
    default: return 'Unspecified';
  }
}

/** Human-readable specimen-condition label. */
function specimenConditionLabel(value) {
  switch (value) {
    case 'satisfactory': return 'Satisfactory';
    case 'haemolysed': return 'Haemolysed';
    case 'lipaemic': return 'Lipaemic';
    case 'clotted': return 'Clotted';
    case 'insufficient': return 'Insufficient';
    default: return 'Unspecified';
  }
}

/** Overall recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'repeat-test': return 'Repeat test';
    case 'specialist-referral': return 'Specialist referral';
    case 'urgent-review': return 'Urgent review';
    default: return 'Not graded';
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

// ----------------------------------------------------------------------
// Lily badge-class mappers (shared risk palette in css/style.css and
// css/dashboard.css; replaces the Tailwind colour helpers in utils.ts)
// ----------------------------------------------------------------------

/** Axis A result-classification badge class. */
function resultClassificationClass(value) {
  switch (value) {
    case 'normal': return 'risk-low';
    case 'abnormal': return 'risk-moderate';
    case 'critical': return 'risk-critical';
    case 'inconclusive': return '';
    default: return '';
  }
}

/** Axis B abnormality-severity badge class. */
function abnormalitySeverityClass(value) {
  switch (value) {
    case 'none': return 'risk-low';
    case 'minor': return 'risk-moderate';
    case 'moderate': return 'risk-high';
    case 'major': return 'risk-critical';
    default: return '';
  }
}

/** Axis D follow-up-urgency badge class. */
function followUpUrgencyClass(value) {
  switch (value) {
    case 'routine': return 'risk-low';
    case 'recommended': return 'risk-moderate';
    case 'urgent': return 'risk-high';
    case 'critical-alert': return 'risk-critical';
    default: return '';
  }
}

/** Overall-result-status badge class. */
function overallResultStatusClass(value) {
  switch (value) {
    case 'normal': return 'risk-low';
    case 'abnormal': return 'risk-moderate';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

Object.assign(window.BloodTestResult, {
  emptyResult,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  overallResultStatusLabel,
  reportStatusLabel,
  specimenTypeLabel,
  specimenConditionLabel,
  recommendationLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass,
  overallResultStatusClass
});
})();
