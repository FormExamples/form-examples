// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Hearing Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_hearing_test_result.sql` and
// `sql/05_create_table_hearing_test_result_grade.sql`. This file builds
// and exports the canonical empty HearingResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed audiology test type.
 * @typedef {'pure-tone-audiometry' | 'tympanometry' | 'speech-audiometry' |
 *           'otoacoustic-emissions' | 'auditory-brainstem-response' |
 *           'newborn-hearing-screen' | 'other' | ''} TestType
 */

/**
 * Reliability / validity of the test result.
 * @typedef {'good' | 'fair' | 'poor' | ''} TestReliability
 */

/**
 * Per-ear hearing-loss type.
 * @typedef {'none' | 'conductive' | 'sensorineural' | 'mixed' | ''} HearingLossType
 */

/**
 * Per-ear hearing-loss severity (BSA audiometric descriptors).
 * @typedef {'normal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe' |
 *           'profound' | ''} HearingLossSeverity
 */

/**
 * Per-ear tympanogram type (Jerger classification).
 * @typedef {'A' | 'As' | 'Ad' | 'B' | 'C' | ''} TympanometryType
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
 * @typedef {'critical-result-alert' | 'sudden-sensorineural-loss' |
 *           'asymmetric-loss-retrocochlear' | 'discrepancy-with-request' |
 *           'abnormal-requiring-action' | 'urgent-referral' | 'unreliable-test' |
 *           'unexpected-finding' | 'missing-impression' | 'missing-measurement' |
 *           'other'} FlagCategory
 */

/**
 * Flag priority.
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 */

/**
 * The hearing test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors `HearingResult`
 * in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} HearingResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate              - ISO date (yyyy-mm-dd); '' when unset
 * @property {TestType} testType
 * @property {TestReliability} testReliability
 * @property {string} clinicalHistory
 * @property {number | null} pureToneAverageRightDb - dB HL; null when unset
 * @property {number | null} pureToneAverageLeftDb  - dB HL; null when unset
 * @property {HearingLossType} hearingLossTypeRight
 * @property {HearingLossType} hearingLossTypeLeft
 * @property {HearingLossSeverity} hearingLossSeverityRight
 * @property {HearingLossSeverity} hearingLossSeverityLeft
 * @property {TympanometryType} tympanometryTypeRight
 * @property {TympanometryType} tympanometryTypeLeft
 * @property {string} findingsNarrative
 * @property {boolean} hearingLossPresent
 * @property {boolean} asymmetricLoss
 * @property {boolean} suddenSensorineuralLoss
 * @property {boolean} conductiveComponent
 * @property {boolean} normalHearing
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
 * `sql/05_create_table_hearing_test_result_grade.sql`.
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
 * Build a fresh, fully-blank hearing test result.
 * Strings default to `''`; numeric measurements default to `null`;
 * structured-findings booleans default to `false`.
 * @returns {HearingResult}
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
    testReliability: '',

    // Clinical context
    clinicalHistory: '',

    // Audiometry & interpretation
    pureToneAverageRightDb: null,
    pureToneAverageLeftDb: null,
    hearingLossTypeRight: '',
    hearingLossTypeLeft: '',
    hearingLossSeverityRight: '',
    hearingLossSeverityLeft: '',
    tympanometryTypeRight: '',
    tympanometryTypeLeft: '',

    // Findings
    findingsNarrative: '',
    hearingLossPresent: false,
    asymmetricLoss: false,
    suddenSensorineuralLoss: false,
    conductiveComponent: false,
    normalHearing: false,

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
    case 'pure-tone-audiometry': return 'Pure-tone audiometry';
    case 'tympanometry': return 'Tympanometry';
    case 'speech-audiometry': return 'Speech audiometry';
    case 'otoacoustic-emissions': return 'Otoacoustic emissions';
    case 'auditory-brainstem-response': return 'Auditory brainstem response';
    case 'newborn-hearing-screen': return 'Newborn hearing screen';
    case 'other': return 'Other';
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

/** Human-readable test-reliability label. */
function testReliabilityLabel(value) {
  switch (value) {
    case 'good': return 'Good';
    case 'fair': return 'Fair';
    case 'poor': return 'Poor';
    default: return 'Unspecified';
  }
}

/** Human-readable hearing-loss-type label. */
function hearingLossTypeLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'conductive': return 'Conductive';
    case 'sensorineural': return 'Sensorineural';
    case 'mixed': return 'Mixed';
    default: return 'Unspecified';
  }
}

/** Human-readable hearing-loss-severity label (BSA descriptors). */
function hearingLossSeverityLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'moderately-severe': return 'Moderately severe';
    case 'severe': return 'Severe';
    case 'profound': return 'Profound';
    default: return 'Unspecified';
  }
}

/** Overall recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-imaging': return 'Further imaging / testing';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, testTypeLabel, reportStatusLabel, testReliabilityLabel, hearingLossTypeLabel, hearingLossSeverityLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
