// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Cardiac Stress Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_cardiac_stress_test_result.sql` and
// `sql/05_create_table_cardiac_stress_test_result_grade.sql`. This file builds
// and exports the canonical empty CardiacStressResult shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports the
// display helpers (labels + Lily badge-class mappers) shared by the form and
// the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed stress-test modality.
 * @typedef {'exercise-treadmill-ecg' | 'stress-echo' | 'dobutamine-stress-echo' |
 *           'myocardial-perfusion-spect' | 'stress-cardiac-mri' | 'other' | ''} TestType
 */

/**
 * Blood-pressure response to exercise.
 * @typedef {'normal' | 'hypertensive' | 'hypotensive' | 'flat' | ''} BloodPressureResponse
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
 * The cardiac stress test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors
 * `CardiacStressResult` in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} CardiacStressResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate                 - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate                  - ISO date (yyyy-mm-dd); '' when unset
 * @property {TestType} testType
 * @property {string} protocol
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {number | null} maximumHeartRateBpm
 * @property {number | null} percentPredictedHeartRate
 * @property {number | null} exerciseDurationMinutes
 * @property {number | null} metsAchieved
 * @property {string} peakBloodPressure
 * @property {BloodPressureResponse} bloodPressureResponse
 * @property {boolean} ischaemicStChanges
 * @property {boolean} chestPainInduced
 * @property {boolean} arrhythmiaInduced
 * @property {boolean} terminatedEarly
 * @property {boolean} testPositive
 * @property {boolean} testNegative
 * @property {boolean} testInconclusive
 * @property {string} reasonForTermination
 * @property {number | null} dukeTreadmillScore
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
 * `sql/05_create_table_cardiac_stress_test_result_grade.sql`.
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
// namespace, `window.CardiacStressTestResult`.
(function () {
'use strict';
window.CardiacStressTestResult = window.CardiacStressTestResult || {};

/**
 * Build a fresh, fully-blank cardiac stress test result.
 * Strings default to `''`; numeric measurements default to `null`;
 * structured-findings booleans default to `false`.
 * @returns {CardiacStressResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Examination
    testType: '',
    protocol: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Haemodynamic and exercise response
    maximumHeartRateBpm: null,
    percentPredictedHeartRate: null,
    exerciseDurationMinutes: null,
    metsAchieved: null,
    peakBloodPressure: '',
    bloodPressureResponse: '',

    // Structured findings
    ischaemicStChanges: false,
    chestPainInduced: false,
    arrhythmiaInduced: false,
    terminatedEarly: false,
    testPositive: false,
    testNegative: false,
    testInconclusive: false,
    reasonForTermination: '',

    // Prognostic score
    dukeTreadmillScore: null,

    // Impression and follow-up
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

/** Human-readable test-type label. */
function testTypeLabel(value) {
  switch (value) {
    case 'exercise-treadmill-ecg': return 'Exercise treadmill ECG';
    case 'stress-echo': return 'Stress echocardiography';
    case 'dobutamine-stress-echo': return 'Dobutamine stress echo';
    case 'myocardial-perfusion-spect': return 'Myocardial perfusion SPECT';
    case 'stress-cardiac-mri': return 'Stress cardiac MRI';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable blood-pressure-response label. */
function bloodPressureResponseLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'hypertensive': return 'Hypertensive';
    case 'hypotensive': return 'Hypotensive (exertional)';
    case 'flat': return 'Flat';
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
    case 'further-imaging': return 'Further imaging';
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

Object.assign(window.CardiacStressTestResult, {
  emptyResult,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  testTypeLabel,
  bloodPressureResponseLabel,
  reportStatusLabel,
  recommendationLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass
});
})();
