// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Ambulatory Blood Pressure
// (ABPM) test result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ambulatory_blood_pressure_test_result.sql` and
// `sql/05_create_table_ambulatory_blood_pressure_test_result_grade.sql`.
// This file builds and exports the canonical empty result shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports the
// display-label helpers and the Lily badge-class helpers shared by the form
// report and the dashboard.

/**
 * @typedef {'24-hour-abpm' | 'home-blood-pressure-monitoring' | 'other' | ''} MonitoringType
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 * @typedef {'dipper' | 'non-dipper' | 'reverse-dipper' | 'extreme-dipper' | ''} DipperStatus
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 * @typedef {'no-action' | 'routine-follow-up' | 'further-imaging' | 'specialist-referral' | 'urgent-review' | ''} Recommendation
 * @typedef {'classification' | 'severity' | 'completeness' | 'follow-up'} Axis
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 */

/**
 * Flag category (mirrors the CHECK constraint in
 * sql/07_create_table_ambulatory_blood_pressure_test_result_grade_flag.sql).
 *
 * @typedef {'critical-result-alert' | 'incidental-finding' |
 *   'discrepancy-with-request' | 'abnormal-requiring-action' |
 *   'urgent-referral' | 'inadequate-technique' | 'unexpected-finding' |
 *   'missing-impression' | 'missing-measurement' | 'other'} FlagCategory
 */

/**
 * The ABPM result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `AmbulatoryBloodPressureResult`
 * in the SvelteKit `src/lib/engine/types.ts`.
 *
 * @typedef {Object} AmbulatoryBloodPressureResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {MonitoringType} monitoringType
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate                       - ISO date; '' when unset
 * @property {string} reportedDate                        - ISO date; '' when unset
 * @property {number | null} validReadingsPercent
 * @property {boolean} recordingAdequate
 * @property {string} clinicalHistory
 * @property {number | null} daytimeAverageSystolic       - mmHg
 * @property {number | null} daytimeAverageDiastolic      - mmHg
 * @property {number | null} nighttimeAverageSystolic     - mmHg
 * @property {number | null} nighttimeAverageDiastolic    - mmHg
 * @property {number | null} twentyFourHourAverageSystolic  - mmHg
 * @property {number | null} twentyFourHourAverageDiastolic - mmHg
 * @property {number | null} nocturnalDipPercent
 * @property {DipperStatus} dipperStatus
 * @property {boolean} hypertensionConfirmed
 * @property {boolean} whiteCoatEffect
 * @property {boolean} maskedHypertension
 * @property {boolean} severeHypertension
 * @property {boolean} nocturnalHypertension
 * @property {boolean} normalStudy
 * @property {string} findingsNarrative
 * @property {string} comparisonWithPrevious
 * @property {string} impression
 * @property {string} recommendedFollowUp
 * @property {boolean} criticalResultCommunicated
 * @property {string} reportedTo
 * @property {string} clinicianNotes
 * @property {boolean} signed
 */

/**
 * A single rule that fired during grading (audit trail).
 *
 * @typedef {Object} FiredRule
 * @property {string} ruleId
 * @property {Axis} axis
 * @property {string} category
 * @property {string} description
 */

/**
 * A safety-critical flag, independent of the four axes.
 *
 * @typedef {Object} Flag
 * @property {string} flagId
 * @property {FlagCategory} category
 * @property {FlagPriority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * The computed four-axis interpretation grade. Mirrors
 * sql/05_create_table_ambulatory_blood_pressure_test_result_grade.sql.
 *
 * @typedef {Object} GradingResult
 * @property {ResultClassification} resultClassification  - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity    - Axis B
 * @property {string} reportingCategory                   - Axis B stage label
 * @property {number} reportCompletenessPercent           - Axis C (0-100)
 * @property {FollowUpUrgency} followUpUrgency            - Axis D
 * @property {string} targetTimeframe                     - Axis D
 * @property {string} recommendedAction                   - Axis D
 * @property {Recommendation} recommendation
 * @property {FiredRule[]} firedRules
 * @property {Flag[]} flags
 * @property {string} gradedAt                            - ISO timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AmbulatoryBloodPressureTestResult`.

/**
 * Build a fresh, fully-blank ABPM result.
 * Strings default to `''`; numeric fields default to `null`; the structured
 * interpretation and sign-off booleans default to `false`.
 * @returns {AmbulatoryBloodPressureResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    monitoringType: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Recording adequacy
    validReadingsPercent: null,
    recordingAdequate: false,

    // Clinical context
    clinicalHistory: '',

    // Averaged measurements (mmHg)
    daytimeAverageSystolic: null,
    daytimeAverageDiastolic: null,
    nighttimeAverageSystolic: null,
    nighttimeAverageDiastolic: null,
    twentyFourHourAverageSystolic: null,
    twentyFourHourAverageDiastolic: null,

    // Nocturnal dipping
    nocturnalDipPercent: null,
    dipperStatus: '',

    // Structured interpretation booleans
    hypertensionConfirmed: false,
    whiteCoatEffect: false,
    maskedHypertension: false,
    severeHypertension: false,
    nocturnalHypertension: false,
    normalStudy: false,

    // Findings and conclusion
    findingsNarrative: '',
    comparisonWithPrevious: '',
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
// Display labels (mirror the SvelteKit engine `utils.ts` label helpers)
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

/** Overall recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-imaging': return 'Further investigation';
    case 'specialist-referral': return 'Specialist referral';
    case 'urgent-review': return 'Urgent review';
    default: return 'Not graded';
  }
}

/** Human-readable monitoring-type label. */
function monitoringTypeLabel(value) {
  switch (value) {
    case '24-hour-abpm': return '24-hour ABPM';
    case 'home-blood-pressure-monitoring': return 'Home BP monitoring';
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

/** Human-readable dipper-status label. */
function dipperStatusLabel(value) {
  switch (value) {
    case 'dipper': return 'Dipper';
    case 'non-dipper': return 'Non-dipper';
    case 'reverse-dipper': return 'Reverse-dipper';
    case 'extreme-dipper': return 'Extreme-dipper';
    default: return 'Unspecified';
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
// Badge-class helpers (Lily headless: hooks into the shared risk palette
// defined in css/style.css + css/dashboard.css — no utility palettes here)
// ----------------------------------------------------------------------

/** Axis A result-classification badge class. */
function resultClassificationClass(value) {
  switch (value) {
    case 'normal': return 'risk-low';
    case 'abnormal': return 'risk-medium';
    case 'critical': return 'risk-critical';
    case 'inconclusive': return '';
    default: return '';
  }
}

/** Axis B abnormality-severity badge class. */
function abnormalitySeverityClass(value) {
  switch (value) {
    case 'none': return 'risk-low';
    case 'minor': return 'risk-medium';
    case 'moderate': return 'risk-high';
    case 'major': return 'risk-critical';
    default: return '';
  }
}

/** Axis D follow-up-urgency badge class. */
function followUpUrgencyClass(value) {
  switch (value) {
    case 'routine': return 'risk-low';
    case 'recommended': return 'risk-medium';
    case 'urgent': return 'risk-high';
    case 'critical-alert': return 'risk-critical';
    default: return '';
  }
}

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, recommendationLabel, monitoringTypeLabel, reportStatusLabel, dipperStatusLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
