// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Sleep Study Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_sleep_study_test_result.sql` and
// `sql/05_create_table_sleep_study_test_result_grade.sql`. This file builds
// and exports the canonical empty SleepStudyResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed sleep-study type.
 * @typedef {'home-sleep-apnoea-test' | 'polysomnography' | 'overnight-oximetry' |
 *           'multiple-sleep-latency-test' | 'actigraphy' | 'other' | ''} StudyType
 */

/**
 * Diagnostic adequacy of the study.
 * @typedef {'adequate' | 'limited' | 'failed' | ''} StudyAdequacy
 */

/**
 * OSA severity band derived from AHI (AASM).
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} OsaSeverity
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
 * @typedef {'no-action' | 'routine-follow-up' | 'further-imaging' |
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
 *           'urgent-referral' | 'inadequate-technique' | 'unexpected-finding' |
 *           'missing-impression' | 'missing-measurement' | 'other'} FlagCategory
 */

/**
 * Flag priority.
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 */

/**
 * The sleep study result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `SleepStudyResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} SleepStudyResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {StudyType} studyType
 * @property {StudyAdequacy} studyAdequacy
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {number | null} totalRecordingTimeHours
 * @property {number | null} totalSleepTimeHours
 * @property {number | null} apnoeaHypopnoeaIndex
 * @property {number | null} oxygenDesaturationIndex
 * @property {number | null} minimumSpo2Percent
 * @property {number | null} timeBelow90PercentSpo2
 * @property {number | null} meanHeartRateBpm
 * @property {OsaSeverity} osaSeverity
 * @property {boolean} obstructiveSleepApnoea
 * @property {boolean} centralSleepApnoea
 * @property {boolean} periodicLimbMovements
 * @property {boolean} nocturnalHypoventilation
 * @property {boolean} significantDesaturation
 * @property {boolean} normalStudy
 * @property {string} findingsNarrative
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
 * `sql/05_create_table_sleep_study_test_result_grade.sql`.
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
// namespace, `window.SleepStudyTestResult`.
(function () {
'use strict';
window.SleepStudyTestResult = window.SleepStudyTestResult || {};

/**
 * Build a fresh, fully-blank sleep study test result.
 * Strings default to `''`; quantitative metrics default to `null`;
 * structured-findings booleans default to `false`.
 * @returns {SleepStudyResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Study
    studyType: '',
    studyAdequacy: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Quantitative metrics
    totalRecordingTimeHours: null,
    totalSleepTimeHours: null,
    apnoeaHypopnoeaIndex: null,
    oxygenDesaturationIndex: null,
    minimumSpo2Percent: null,
    timeBelow90PercentSpo2: null,
    meanHeartRateBpm: null,

    // Interpretation
    osaSeverity: '',

    // Structured findings
    obstructiveSleepApnoea: false,
    centralSleepApnoea: false,
    periodicLimbMovements: false,
    nocturnalHypoventilation: false,
    significantDesaturation: false,
    normalStudy: false,

    // Findings and impression
    findingsNarrative: '',
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

/**
 * The quantitative-metric fields whose unanswered value is `null` (not `''`).
 * Used by the wizard's number inputs and the null-safe localStorage
 * rehydration.
 * @type {string[]}
 */
const NUMERIC_FIELDS = [
  'totalRecordingTimeHours',
  'totalSleepTimeHours',
  'apnoeaHypopnoeaIndex',
  'oxygenDesaturationIndex',
  'minimumSpo2Percent',
  'timeBelow90PercentSpo2',
  'meanHeartRateBpm'
];

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

/** Human-readable study-type label. */
function studyTypeLabel(value) {
  switch (value) {
    case 'home-sleep-apnoea-test': return 'Home sleep apnoea test';
    case 'polysomnography': return 'Polysomnography';
    case 'overnight-oximetry': return 'Overnight oximetry';
    case 'multiple-sleep-latency-test': return 'Multiple sleep latency test';
    case 'actigraphy': return 'Actigraphy';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable study-adequacy label. */
function studyAdequacyLabel(value) {
  switch (value) {
    case 'adequate': return 'Adequate';
    case 'limited': return 'Limited';
    case 'failed': return 'Failed';
    default: return 'Unspecified';
  }
}

/** Human-readable OSA-severity label. */
function osaSeverityLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
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

/** Overall recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-imaging': return 'Further imaging / repeat study';
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

Object.assign(window.SleepStudyTestResult, {
  emptyResult,
  NUMERIC_FIELDS,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  studyTypeLabel,
  studyAdequacyLabel,
  osaSeverityLabel,
  reportStatusLabel,
  recommendationLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass
});
})();
