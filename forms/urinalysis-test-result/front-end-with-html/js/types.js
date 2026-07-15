// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Urinalysis Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_urinalysis_test_result.sql` and
// `sql/05_create_table_urinalysis_test_result_grade.sql`. This file builds
// and exports the canonical empty UrinalysisResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Specimen type.
 * @typedef {'midstream' | 'catheter' | 'clean-catch' | '24h' | 'random' | ''} SpecimenType
 */

/**
 * Specimen condition on receipt / analysis.
 * @typedef {'satisfactory' | 'contaminated' | 'insufficient' | 'delayed' | ''} SpecimenCondition
 */

/**
 * Dipstick semi-quantitative reagent grade
 * (leucocytes / protein / blood / glucose / ketones / bilirubin).
 * @typedef {'negative' | 'trace' | 'plus-one' | 'plus-two' | 'plus-three' | ''} DipstickGrade
 */

/**
 * Dipstick nitrite result.
 * @typedef {'negative' | 'positive' | ''} NitriteResult
 */

/**
 * Culture outcome.
 * @typedef {'no-growth' | 'mixed-growth-likely-contaminant' |
 *           'significant-growth' | ''} CultureResult
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
 * Overall result status recorded by the reporting clinician (sql/04).
 * @typedef {'normal' | 'abnormal' | 'critical' | ''} OverallResultStatus
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
 * The urinalysis result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `UrinalysisResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} UrinalysisResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {SpecimenType} specimenType
 * @property {SpecimenCondition} specimenCondition
 * @property {string} clinicalHistory
 * @property {boolean} pregnant
 * @property {DipstickGrade} leucocytes
 * @property {NitriteResult} nitrites
 * @property {DipstickGrade} protein
 * @property {DipstickGrade} blood
 * @property {DipstickGrade} glucose
 * @property {DipstickGrade} ketones
 * @property {DipstickGrade} bilirubin
 * @property {number | null} ph                - urine pH; null when unanswered
 * @property {number | null} specificGravity   - urine specific gravity; null when unanswered
 * @property {string} redCellCount
 * @property {string} whiteCellCount
 * @property {string} epithelialCells
 * @property {string} casts
 * @property {boolean} organismsSeen
 * @property {string} crystals
 * @property {CultureResult} cultureResult
 * @property {string} organismIsolated
 * @property {string} colonyCountCfuMl
 * @property {string} antibioticSensitivities
 * @property {OverallResultStatus} overallResultStatus
 * @property {string} findingsNarrative
 * @property {string} impression
 * @property {string} reportingCategory
 * @property {string} recommendedFollowUp
 * @property {boolean} visibleHaematuria
 * @property {boolean} suspectedUrosepsis
 * @property {boolean} criticalOrganism
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
 * `sql/05_create_table_urinalysis_test_result_grade.sql`.
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
// namespace, `window.UrinalysisTestResult`.

/**
 * Build a fresh, fully-blank urinalysis test result.
 * Strings default to `''`; numeric fields default to `null`;
 * structured-findings booleans default to `false`.
 * @returns {UrinalysisResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Specimen
    specimenType: '',
    specimenCondition: '',

    // Clinical context
    clinicalHistory: '',
    pregnant: false,

    // Dipstick (reagent strip) results
    leucocytes: '',
    nitrites: '',
    protein: '',
    blood: '',
    glucose: '',
    ketones: '',
    bilirubin: '',
    ph: null,
    specificGravity: null,

    // Microscopy
    redCellCount: '',
    whiteCellCount: '',
    epithelialCells: '',
    casts: '',
    organismsSeen: false,
    crystals: '',

    // Culture
    cultureResult: '',
    organismIsolated: '',
    colonyCountCfuMl: '',
    antibioticSensitivities: '',

    // Interpretation
    overallResultStatus: '',
    findingsNarrative: '',
    impression: '',
    reportingCategory: '',
    recommendedFollowUp: '',

    // Structured critical-finding flags (drive auto-escalation)
    visibleHaematuria: false,
    suspectedUrosepsis: false,
    criticalOrganism: false,

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

/** Human-readable specimen-type label. */
function specimenTypeLabel(value) {
  switch (value) {
    case 'midstream': return 'Midstream (MSU)';
    case 'catheter': return 'Catheter (CSU)';
    case 'clean-catch': return 'Clean catch';
    case '24h': return '24-hour collection';
    case 'random': return 'Random';
    default: return 'Unspecified';
  }
}

/** Human-readable culture-result label. */
function cultureResultLabel(value) {
  switch (value) {
    case 'no-growth': return 'No growth';
    case 'mixed-growth-likely-contaminant': return 'Mixed growth (likely contaminant)';
    case 'significant-growth': return 'Significant growth';
    default: return 'Not reported';
  }
}

/** Human-readable dipstick-grade label. */
function dipstickGradeLabel(value) {
  switch (value) {
    case 'negative': return 'Negative';
    case 'trace': return 'Trace';
    case 'plus-one': return '1+';
    case 'plus-two': return '2+';
    case 'plus-three': return '3+';
    case 'positive': return 'Positive';
    default: return 'Not reported';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, specimenTypeLabel, cultureResultLabel, dipstickGradeLabel, reportStatusLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
