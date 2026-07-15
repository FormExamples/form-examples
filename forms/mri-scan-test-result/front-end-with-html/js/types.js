// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the MRI Scan Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_mri_scan_test_result.sql` and
// `sql/05_create_table_mri_scan_test_result_grade.sql`. This file builds
// and exports the canonical empty MriScanResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Examined MRI body region.
 * @typedef {'brain' | 'spine-cervical' | 'spine-thoracic' | 'spine-lumbar' |
 *           'head-neck' | 'chest' | 'abdomen' | 'pelvis' | 'cardiac' |
 *           'mr-angiogram' | 'breast' | 'musculoskeletal-joint' |
 *           'whole-body' | 'other' | ''} BodyRegion
 */

/**
 * Contrast actually administered.
 * @typedef {'none' | 'iv-gadolinium' | ''} ContrastUsed
 */

/**
 * Diagnostic adequacy of the examination.
 * @typedef {'adequate' | 'limited' | 'non-diagnostic' | ''} ExaminationAdequacy
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
 * The MRI scan result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `MriScanResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} MriScanResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {BodyRegion} bodyRegion
 * @property {ContrastUsed} contrastUsed
 * @property {string} sequencesPerformed
 * @property {ExaminationAdequacy} examinationAdequacy
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {string} findingsNarrative
 * @property {boolean} massOrLesion
 * @property {boolean} haemorrhage
 * @property {boolean} infarct
 * @property {boolean} demyelination
 * @property {boolean} discHerniation
 * @property {boolean} cordCompression
 * @property {boolean} infectionInflammation
 * @property {boolean} incidentalFinding
 * @property {number | null} largestLesionSizeMm  - millimetres; null when unset
 * @property {string} impression
 * @property {string} reportingCategory        - e.g. PI-RADS 4, BI-RADS 4, Likert 3
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
 * `sql/05_create_table_mri_scan_test_result_grade.sql`.
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
// namespace, `window.MriScanTestResult`.

/**
 * The numeric report fields, which default to `null` (not `''`) and must be
 * rehydrated null-safely from localStorage.
 * @type {string[]}
 */
const NUMERIC_FIELDS = ['largestLesionSizeMm'];

/**
 * Build a fresh, fully-blank MRI scan test result.
 * Strings default to `''`; structured-findings booleans default to `false`;
 * numeric measurements default to `null`.
 * @returns {MriScanResult}
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
    bodyRegion: '',
    contrastUsed: '',
    sequencesPerformed: '',
    examinationAdequacy: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Findings
    findingsNarrative: '',
    massOrLesion: false,
    haemorrhage: false,
    infarct: false,
    demyelination: false,
    discHerniation: false,
    cordCompression: false,
    infectionInflammation: false,
    incidentalFinding: false,

    // Measurements
    largestLesionSizeMm: null,

    // Impression and structured reporting
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

/** Human-readable body-region label. */
function bodyRegionLabel(value) {
  switch (value) {
    case 'brain': return 'Brain';
    case 'spine-cervical': return 'Spine — cervical';
    case 'spine-thoracic': return 'Spine — thoracic';
    case 'spine-lumbar': return 'Spine — lumbar';
    case 'head-neck': return 'Head / neck';
    case 'chest': return 'Chest';
    case 'abdomen': return 'Abdomen';
    case 'pelvis': return 'Pelvis';
    case 'cardiac': return 'Cardiac';
    case 'mr-angiogram': return 'MR angiogram';
    case 'breast': return 'Breast';
    case 'musculoskeletal-joint': return 'Musculoskeletal joint';
    case 'whole-body': return 'Whole body';
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

/** Human-readable contrast-used label. */
function contrastUsedLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'iv-gadolinium': return 'IV gadolinium';
    default: return 'Unspecified';
  }
}

/** Human-readable examination-adequacy label. */
function examinationAdequacyLabel(value) {
  switch (value) {
    case 'adequate': return 'Adequate';
    case 'limited': return 'Limited';
    case 'non-diagnostic': return 'Non-diagnostic';
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

export { NUMERIC_FIELDS, emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, bodyRegionLabel, reportStatusLabel, contrastUsedLabel, examinationAdequacyLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
