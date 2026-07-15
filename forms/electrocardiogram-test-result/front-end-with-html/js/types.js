// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Electrocardiogram Test Result
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_electrocardiogram_test_result.sql` and
// `sql/05_create_table_electrocardiogram_test_result_grade.sql`. This file
// builds and exports the canonical empty ElectrocardiogramResult shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports the
// display helpers (labels + Lily badge-class mappers) shared by the form and
// the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Recorded ECG type.
 * @typedef {'resting-12-lead' | 'exercise-stress' | 'ambulatory-holter-24h' |
 *           'ambulatory-48h' | 'event-recorder' | 'other' | ''} EcgType
 */

/**
 * Technical recording quality of the trace.
 * @typedef {'good' | 'adequate' | 'poor' | ''} RecordingQuality
 */

/**
 * Dominant rhythm.
 * @typedef {'sinus' | 'atrial-fibrillation' | 'atrial-flutter' | 'svt' |
 *           'ventricular-tachycardia' | 'heart-block' | 'paced' | 'other' | ''} Rhythm
 */

/**
 * Frontal-plane cardiac axis.
 * @typedef {'normal' | 'left-deviation' | 'right-deviation' | ''} CardiacAxis
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
 * The ECG (electrocardiogram) test result (report) — the source-of-truth
 * record the four-axis interpretation grade is computed from. Mirrors
 * `ElectrocardiogramResult` in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} ElectrocardiogramResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {EcgType} ecgType
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {RecordingQuality} recordingQuality
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {number | null} ventricularRateBpm - beats per minute; null when unmeasured
 * @property {Rhythm} rhythm
 * @property {number | null} prIntervalMs       - milliseconds; null when unmeasured
 * @property {number | null} qrsDurationMs      - milliseconds; null when unmeasured
 * @property {number | null} qtIntervalMs       - milliseconds; null when unmeasured
 * @property {number | null} qtcMs              - milliseconds; null when unmeasured
 * @property {CardiacAxis} cardiacAxis
 * @property {boolean} stElevation
 * @property {boolean} stDepression
 * @property {boolean} tWaveInversion
 * @property {boolean} pathologicalQWaves
 * @property {boolean} leftVentricularHypertrophy
 * @property {boolean} bundleBranchBlock
 * @property {boolean} ischaemia
 * @property {boolean} normalEcg
 * @property {string} interpretation
 * @property {string} reportingCategory
 * @property {string} impression
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
 * `sql/05_create_table_electrocardiogram_test_result_grade.sql`.
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

/**
 * Build a fresh, fully-blank electrocardiogram test result.
 * Strings default to `''`; measurements default to `null` (unmeasured);
 * structured-findings booleans default to `false`.
 * @returns {ElectrocardiogramResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    ecgType: '',
    performedDate: '',
    reportedDate: '',
    recordingQuality: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Rate, rhythm, and intervals
    ventricularRateBpm: null,
    rhythm: '',
    prIntervalMs: null,
    qrsDurationMs: null,
    qtIntervalMs: null,
    qtcMs: null,
    cardiacAxis: '',

    // Structured findings
    stElevation: false,
    stDepression: false,
    tWaveInversion: false,
    pathologicalQWaves: false,
    leftVentricularHypertrophy: false,
    bundleBranchBlock: false,
    ischaemia: false,
    normalEcg: false,

    // Interpretation and conclusion
    interpretation: '',
    reportingCategory: '',
    impression: '',
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

/** Human-readable ECG-type label. */
function ecgTypeLabel(value) {
  switch (value) {
    case 'resting-12-lead': return 'Resting 12-lead';
    case 'exercise-stress': return 'Exercise / stress';
    case 'ambulatory-holter-24h': return 'Ambulatory Holter 24h';
    case 'ambulatory-48h': return 'Ambulatory 48h';
    case 'event-recorder': return 'Event recorder';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable rhythm label. */
function rhythmLabel(value) {
  switch (value) {
    case 'sinus': return 'Sinus';
    case 'atrial-fibrillation': return 'Atrial fibrillation';
    case 'atrial-flutter': return 'Atrial flutter';
    case 'svt': return 'SVT';
    case 'ventricular-tachycardia': return 'Ventricular tachycardia';
    case 'heart-block': return 'Heart block';
    case 'paced': return 'Paced';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable cardiac-axis label. */
function cardiacAxisLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'left-deviation': return 'Left deviation';
    case 'right-deviation': return 'Right deviation';
    default: return 'Unspecified';
  }
}

/** Human-readable recording-quality label. */
function recordingQualityLabel(value) {
  switch (value) {
    case 'good': return 'Good';
    case 'adequate': return 'Adequate';
    case 'poor': return 'Poor';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, ecgTypeLabel, rhythmLabel, cardiacAxisLabel, recordingQualityLabel, reportStatusLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
