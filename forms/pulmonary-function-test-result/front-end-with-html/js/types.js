// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Pulmonary Function Test Result
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_pulmonary_function_test_result.sql` and
// `sql/05_create_table_pulmonary_function_test_result_grade.sql`. This file
// builds and exports the canonical empty PulmonaryFunctionResult shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports the
// display helpers (labels + Lily badge-class mappers) shared by the form and
// the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed lung-function test type.
 * @typedef {'spirometry' | 'spirometry-with-reversibility' | 'full-lung-function' |
 *           'gas-transfer-dlco' | 'peak-flow' | 'feno' | 'other' | ''} TestType
 */

/**
 * ATS/ERS acceptability and repeatability grade for the manoeuvres.
 * @typedef {'acceptable' | 'sub-optimal' | 'unacceptable' | ''} TestQuality
 */

/**
 * Overall ventilatory pattern.
 * @typedef {'normal' | 'obstructive' | 'restrictive' | 'mixed' | ''} VentilatoryPattern
 */

/**
 * Severity of the lung-function impairment.
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | 'very-severe' | ''} Severity
 */

/**
 * Bronchodilator reversibility result.
 * @typedef {'positive' | 'negative' | 'not-tested' | ''} BronchodilatorReversibility
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
 * @typedef {'no-action' | 'routine-follow-up' | 'further-testing' |
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
 * The pulmonary function test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors
 * `PulmonaryFunctionResult` in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} PulmonaryFunctionResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {TestType} testType
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {TestQuality} testQuality
 * @property {string} clinicalHistory
 * @property {number | null} fev1Litres
 * @property {number | null} fev1PercentPredicted
 * @property {number | null} fvcLitres
 * @property {number | null} fvcPercentPredicted
 * @property {number | null} fev1FvcRatio
 * @property {number | null} peakExpiratoryFlow
 * @property {number | null} dlcoPercentPredicted
 * @property {VentilatoryPattern} ventilatoryPattern
 * @property {Severity} severity
 * @property {BronchodilatorReversibility} bronchodilatorReversibility
 * @property {boolean} airflowObstruction
 * @property {boolean} restriction
 * @property {boolean} reducedGasTransfer
 * @property {boolean} significantReversibility
 * @property {boolean} normalSpirometry
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
 * `sql/05_create_table_pulmonary_function_test_result_grade.sql`.
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
 * Build a fresh, fully-blank pulmonary function test result.
 * Strings default to `''`; numerics default to `null`; structured-findings
 * booleans default to `false`.
 * @returns {PulmonaryFunctionResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    testType: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Test quality and clinical context
    testQuality: '',
    clinicalHistory: '',

    // Measured values
    fev1Litres: null,
    fev1PercentPredicted: null,
    fvcLitres: null,
    fvcPercentPredicted: null,
    fev1FvcRatio: null,
    peakExpiratoryFlow: null,
    dlcoPercentPredicted: null,

    // Interpretation summary
    ventilatoryPattern: '',
    severity: '',
    bronchodilatorReversibility: '',

    // Structured findings
    airflowObstruction: false,
    restriction: false,
    reducedGasTransfer: false,
    significantReversibility: false,
    normalSpirometry: false,

    // Narrative and conclusion
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

/** Human-readable test-type label. */
function testTypeLabel(value) {
  switch (value) {
    case 'spirometry': return 'Spirometry';
    case 'spirometry-with-reversibility': return 'Spirometry with reversibility';
    case 'full-lung-function': return 'Full lung function';
    case 'gas-transfer-dlco': return 'Gas transfer (DLCO)';
    case 'peak-flow': return 'Peak flow';
    case 'feno': return 'FeNO';
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

/** Human-readable ventilatory-pattern label. */
function ventilatoryPatternLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'obstructive': return 'Obstructive';
    case 'restrictive': return 'Restrictive';
    case 'mixed': return 'Mixed';
    default: return 'Unspecified';
  }
}

/** Human-readable severity label. */
function severityLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'very-severe': return 'Very severe';
    default: return 'Unspecified';
  }
}

/** Human-readable bronchodilator-reversibility label. */
function bronchodilatorReversibilityLabel(value) {
  switch (value) {
    case 'positive': return 'Positive';
    case 'negative': return 'Negative';
    case 'not-tested': return 'Not tested';
    default: return 'Unspecified';
  }
}

/** Overall recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-testing': return 'Further testing';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, testTypeLabel, reportStatusLabel, ventilatoryPatternLabel, severityLabel, bronchodilatorReversibilityLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
