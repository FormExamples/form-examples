// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Eye Vision Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_eye_vision_test_result.sql` and
// `sql/05_create_table_eye_vision_test_result_grade.sql`. This file builds
// and exports the canonical empty EyeVisionResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed eye examination type.
 * @typedef {'visual-acuity' | 'visual-fields' | 'refraction' |
 *           'fundus-examination' | 'optical-coherence-tomography' |
 *           'fluorescein-angiography' | 'tonometry' | 'slit-lamp' |
 *           'orthoptic-assessment' | 'other' | ''} TestType
 */

/**
 * Visual-field result.
 * @typedef {'full' | 'defect-right' | 'defect-left' | 'bilateral-defect' | ''} VisualFieldResult
 */

/**
 * Diabetic-retinopathy grade.
 * @typedef {'none' | 'background' | 'pre-proliferative' | 'proliferative' |
 *           'maculopathy' | 'not-applicable' | ''} RetinopathyGrade
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
 * The eye vision test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors `EyeVisionResult`
 * in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} EyeVisionResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {TestType} testType
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} clinicalHistory
 * @property {string} visualAcuityRight
 * @property {string} visualAcuityLeft
 * @property {number | null} intraocularPressureRightMmhg
 * @property {number | null} intraocularPressureLeftMmhg
 * @property {VisualFieldResult} visualFieldResult
 * @property {boolean} reducedVisualAcuity
 * @property {boolean} visualFieldDefect
 * @property {boolean} raisedIntraocularPressure
 * @property {boolean} diabeticRetinopathy
 * @property {boolean} opticDiscAbnormality
 * @property {boolean} macularAbnormality
 * @property {boolean} normalExamination
 * @property {RetinopathyGrade} retinopathyGrade
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
 * `sql/05_create_table_eye_vision_test_result_grade.sql`.
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
// namespace, `window.EyeVisionTestResult`.

/**
 * Build a fresh, fully-blank eye vision test result.
 * Strings default to `''`; structured-findings booleans default to `false`;
 * the numeric intraocular-pressure measurements default to `null`
 * (not measured).
 * @returns {EyeVisionResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    testType: '',
    performedDate: '',
    reportedDate: '',

    // Clinical context
    clinicalHistory: '',

    // Measurements
    visualAcuityRight: '',
    visualAcuityLeft: '',
    intraocularPressureRightMmhg: null,
    intraocularPressureLeftMmhg: null,
    visualFieldResult: '',

    // Structured findings
    reducedVisualAcuity: false,
    visualFieldDefect: false,
    raisedIntraocularPressure: false,
    diabeticRetinopathy: false,
    opticDiscAbnormality: false,
    macularAbnormality: false,
    normalExamination: false,
    retinopathyGrade: '',

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
    case 'visual-acuity': return 'Visual acuity';
    case 'visual-fields': return 'Visual fields';
    case 'refraction': return 'Refraction';
    case 'fundus-examination': return 'Fundus examination';
    case 'optical-coherence-tomography': return 'Optical coherence tomography';
    case 'fluorescein-angiography': return 'Fluorescein angiography';
    case 'tonometry': return 'Tonometry';
    case 'slit-lamp': return 'Slit-lamp examination';
    case 'orthoptic-assessment': return 'Orthoptic assessment';
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

/** Human-readable visual-field-result label. */
function visualFieldResultLabel(value) {
  switch (value) {
    case 'full': return 'Full fields';
    case 'defect-right': return 'Defect — right';
    case 'defect-left': return 'Defect — left';
    case 'bilateral-defect': return 'Bilateral defect';
    default: return 'Not recorded';
  }
}

/** Human-readable diabetic-retinopathy-grade label. */
function retinopathyGradeLabel(value) {
  switch (value) {
    case 'none': return 'None (R0)';
    case 'background': return 'Background (R1)';
    case 'pre-proliferative': return 'Pre-proliferative (R2)';
    case 'proliferative': return 'Proliferative (R3)';
    case 'maculopathy': return 'Maculopathy (M1)';
    case 'not-applicable': return 'Not applicable';
    default: return 'Not recorded';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, testTypeLabel, reportStatusLabel, visualFieldResultLabel, retinopathyGradeLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
