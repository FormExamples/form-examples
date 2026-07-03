// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Mammography Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_mammography_test_result.sql` and
// `sql/05_create_table_mammography_test_result_grade.sql`. This file builds
// and exports the canonical empty MammographyResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Type of mammography performed.
 * @typedef {'screening' | 'diagnostic' | 'symptomatic' | 'surveillance' |
 *           'other' | ''} ExamType
 */

/**
 * Examined side.
 * @typedef {'left' | 'right' | 'bilateral' | ''} Laterality
 */

/**
 * Diagnostic adequacy of the examination.
 * @typedef {'adequate' | 'limited' | 'non-diagnostic' | ''} ExaminationAdequacy
 */

/**
 * ACR BI-RADS breast composition / density.
 * a = almost entirely fatty, b = scattered fibroglandular,
 * c = heterogeneously dense, d = extremely dense.
 * @typedef {'a' | 'b' | 'c' | 'd' | ''} BreastDensity
 */

/**
 * ACR BI-RADS final assessment category (the key structured score):
 * 0 = incomplete; 1 = negative; 2 = benign; 3 = probably benign;
 * 4a/4b/4c = suspicious (low / intermediate / moderate);
 * 5 = highly suggestive of malignancy; 6 = known biopsy-proven malignancy.
 * @typedef {'0' | '1' | '2' | '3' | '4a' | '4b' | '4c' | '5' | '6' | ''} BiRadsCategory
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
 * The mammography result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `MammographyResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} MammographyResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {ExamType} examType
 * @property {Laterality} laterality
 * @property {ExaminationAdequacy} examinationAdequacy
 * @property {BreastDensity} breastDensity
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {string} findingsNarrative
 * @property {boolean} mass
 * @property {boolean} calcifications
 * @property {boolean} architecturalDistortion
 * @property {boolean} asymmetry
 * @property {boolean} skinOrNippleChange
 * @property {boolean} lymphadenopathy
 * @property {boolean} incidentalFinding
 * @property {number | null} largestLesionSizeMm - millimetres; null when unset
 * @property {string} impression
 * @property {BiRadsCategory} biRadsCategory
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
 * `sql/05_create_table_mammography_test_result_grade.sql`.
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
// namespace, `window.MammographyTestResult`.
(function () {
'use strict';
window.MammographyTestResult = window.MammographyTestResult || {};

/**
 * Build a fresh, fully-blank mammography test result.
 * Strings default to `''`; structured-findings booleans default to `false`;
 * the numeric measurement defaults to `null`.
 * @returns {MammographyResult}
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
    examType: '',
    laterality: '',
    examinationAdequacy: '',
    breastDensity: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Findings
    findingsNarrative: '',
    mass: false,
    calcifications: false,
    architecturalDistortion: false,
    asymmetry: false,
    skinOrNippleChange: false,
    lymphadenopathy: false,
    incidentalFinding: false,

    // Measurements
    largestLesionSizeMm: null,

    // Impression and structured score
    impression: '',
    biRadsCategory: '',
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

/** Human-readable exam-type label. */
function examTypeLabel(value) {
  switch (value) {
    case 'screening': return 'Screening';
    case 'diagnostic': return 'Diagnostic';
    case 'symptomatic': return 'Symptomatic';
    case 'surveillance': return 'Surveillance';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable laterality label. */
function lateralityLabel(value) {
  switch (value) {
    case 'left': return 'Left';
    case 'right': return 'Right';
    case 'bilateral': return 'Bilateral';
    default: return 'Unspecified';
  }
}

/** Human-readable ACR breast-density label. */
function breastDensityLabel(value) {
  switch (value) {
    case 'a': return 'a — almost entirely fatty';
    case 'b': return 'b — scattered fibroglandular';
    case 'c': return 'c — heterogeneously dense';
    case 'd': return 'd — extremely dense';
    default: return 'Unspecified';
  }
}

/** Human-readable BI-RADS final-assessment label. */
function biRadsLabel(value) {
  switch (value) {
    case '0': return 'BI-RADS 0 — incomplete';
    case '1': return 'BI-RADS 1 — negative';
    case '2': return 'BI-RADS 2 — benign';
    case '3': return 'BI-RADS 3 — probably benign';
    case '4a': return 'BI-RADS 4a — suspicious (low)';
    case '4b': return 'BI-RADS 4b — suspicious (intermediate)';
    case '4c': return 'BI-RADS 4c — suspicious (moderate)';
    case '5': return 'BI-RADS 5 — highly suggestive of malignancy';
    case '6': return 'BI-RADS 6 — known biopsy-proven malignancy';
    default: return 'Not assigned';
  }
}

/** Short BI-RADS label (for compact dashboard columns and badges). */
function biRadsShortLabel(value) {
  return value === '' || value === undefined ? '—' : 'BI-RADS ' + value;
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

/**
 * BI-RADS final-assessment badge class (by malignancy band). Mirrors the
 * Tailwind `biRadsColor` helper: 1/2 green → risk-low; 3 yellow →
 * risk-moderate; 4a/4b orange → risk-high; 4c/5 red → risk-critical;
 * 6 (purple — known malignancy under management) → risk-high; 0 / unset → ''.
 */
function biRadsClass(value) {
  switch (value) {
    case '1':
    case '2': return 'risk-low';
    case '3': return 'risk-moderate';
    case '4a':
    case '4b': return 'risk-high';
    case '4c':
    case '5': return 'risk-critical';
    case '6': return 'risk-high';
    case '0': return '';
    default: return '';
  }
}

Object.assign(window.MammographyTestResult, {
  emptyResult,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  examTypeLabel,
  lateralityLabel,
  breastDensityLabel,
  biRadsLabel,
  biRadsShortLabel,
  reportStatusLabel,
  recommendationLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass,
  biRadsClass
});
})();
