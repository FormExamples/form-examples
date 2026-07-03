// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Electroencephalogram (EEG)
// Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_electroencephalogram_test_result.sql` and
// `sql/05_create_table_electroencephalogram_test_result_grade.sql`. This file
// builds and exports the canonical empty ElectroencephalogramResult shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage. It also exports the
// display helpers (labels + Lily badge-class mappers) shared by the form and
// the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed EEG type.
 * @typedef {'routine-awake' | 'sleep-deprived' | 'ambulatory-24h' |
 *           'video-telemetry' | 'other' | ''} EegType
 */

/**
 * Technical quality / interpretability of the recording.
 * @typedef {'good' | 'adequate' | 'limited' | ''} RecordingQuality
 */

/**
 * Background EEG rhythm assessment.
 * @typedef {'normal' | 'excess-slow' | 'asymmetric' | 'abnormal' | ''} BackgroundRhythm
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
 * The EEG result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `ElectroencephalogramResult`
 * in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} ElectroencephalogramResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate              - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate               - ISO date (yyyy-mm-dd); '' when unset
 * @property {EegType} eegType
 * @property {number | null} recordingDurationMinutes - null when unanswered
 * @property {RecordingQuality} recordingQuality
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {BackgroundRhythm} backgroundRhythm
 * @property {boolean} epileptiformDischarges
 * @property {boolean} focalSlowing
 * @property {boolean} generalisedSlowing
 * @property {boolean} seizureRecorded
 * @property {boolean} statusEpilepticus
 * @property {boolean} photoparoxysmalResponse
 * @property {boolean} normalEeg
 * @property {string} findingsNarrative
 * @property {string} clinicalCorrelation
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
 * `sql/05_create_table_electroencephalogram_test_result_grade.sql`.
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
// namespace, `window.ElectroencephalogramTestResult`.
(function () {
'use strict';
window.ElectroencephalogramTestResult =
  window.ElectroencephalogramTestResult || {};

/**
 * Build a fresh, fully-blank EEG test result.
 * Strings default to `''`; structured-findings booleans default to `false`;
 * the numeric recording duration defaults to `null`.
 * @returns {ElectroencephalogramResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Recording details
    eegType: '',
    recordingDurationMinutes: null,
    recordingQuality: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Background and structured findings
    backgroundRhythm: '',
    epileptiformDischarges: false,
    focalSlowing: false,
    generalisedSlowing: false,
    seizureRecorded: false,
    statusEpilepticus: false,
    photoparoxysmalResponse: false,
    normalEeg: false,

    // Narrative interpretation
    findingsNarrative: '',
    clinicalCorrelation: '',
    impression: '',
    reportingCategory: '',

    // Conclusion and follow-up
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

/** Human-readable EEG-type label. */
function eegTypeLabel(value) {
  switch (value) {
    case 'routine-awake': return 'Routine awake';
    case 'sleep-deprived': return 'Sleep-deprived';
    case 'ambulatory-24h': return 'Ambulatory 24-hour';
    case 'video-telemetry': return 'Video telemetry';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable recording-quality label. */
function recordingQualityLabel(value) {
  switch (value) {
    case 'good': return 'Good';
    case 'adequate': return 'Adequate';
    case 'limited': return 'Limited';
    default: return 'Unspecified';
  }
}

/** Human-readable background-rhythm label. */
function backgroundRhythmLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'excess-slow': return 'Excess slow';
    case 'asymmetric': return 'Asymmetric';
    case 'abnormal': return 'Abnormal';
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

Object.assign(window.ElectroencephalogramTestResult, {
  emptyResult,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  eegTypeLabel,
  recordingQualityLabel,
  backgroundRhythmLabel,
  reportStatusLabel,
  recommendationLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass
});
})();
