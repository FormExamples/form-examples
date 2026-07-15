// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Lumbar Puncture Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_lumbar_puncture_test_result.sql` and
// `sql/05_create_table_lumbar_puncture_test_result_grade.sql`. This file builds
// and exports the canonical empty LumbarPunctureResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Macroscopic CSF appearance.
 * @typedef {'clear' | 'cloudy' | 'turbid' | 'blood-stained' | 'xanthochromic' | ''} CsfAppearance
 */

/**
 * Specialist test tri-state result.
 * @typedef {'positive' | 'negative' | 'not-tested' | ''} TestResult
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
 * The lumbar puncture / CSF analysis result (report) — the source-of-truth
 * record the four-axis interpretation grade is computed from. Mirrors
 * `LumbarPunctureResult` in `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} LumbarPunctureResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} clinicalHistory
 * @property {number | null} openingPressureCmh2o
 * @property {CsfAppearance} csfAppearance
 * @property {number | null} csfWhiteCellCount
 * @property {number | null} csfRedCellCount
 * @property {number | null} csfProteinGL
 * @property {number | null} csfGlucoseMmolL
 * @property {number | null} csfSerumGlucoseRatio
 * @property {number | null} csfLactateMmolL
 * @property {string} gramStainResult
 * @property {string} cultureResult
 * @property {string} pcrResult
 * @property {TestResult} oligoclonalBands
 * @property {TestResult} xanthochromia
 * @property {boolean} raisedProtein
 * @property {boolean} pleocytosis
 * @property {boolean} lowGlucose
 * @property {boolean} bacterialMeningitisPattern
 * @property {boolean} viralPattern
 * @property {boolean} subarachnoidHaemorrhageSuggested
 * @property {boolean} normalCsf
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
 * `sql/05_create_table_lumbar_puncture_test_result_grade.sql`.
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
 * Build a fresh, fully-blank lumbar puncture test result.
 * Strings default to `''`; numeric fields default to `null`;
 * structured-findings booleans default to `false`.
 * @returns {LumbarPunctureResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Clinical context
    clinicalHistory: '',

    // Manometry and appearance
    openingPressureCmh2o: null,
    csfAppearance: '',

    // Cell counts and biochemistry
    csfWhiteCellCount: null,
    csfRedCellCount: null,
    csfProteinGL: null,
    csfGlucoseMmolL: null,
    csfSerumGlucoseRatio: null,
    csfLactateMmolL: null,

    // Microbiology and specialist tests
    gramStainResult: '',
    cultureResult: '',
    pcrResult: '',
    oligoclonalBands: '',
    xanthochromia: '',

    // Structured interpretive findings
    raisedProtein: false,
    pleocytosis: false,
    lowGlucose: false,
    bacterialMeningitisPattern: false,
    viralPattern: false,
    subarachnoidHaemorrhageSuggested: false,
    normalCsf: false,

    // Findings, impression and reporting category
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

/** Human-readable CSF-appearance label. */
function csfAppearanceLabel(value) {
  switch (value) {
    case 'clear': return 'Clear';
    case 'cloudy': return 'Cloudy';
    case 'turbid': return 'Turbid';
    case 'blood-stained': return 'Blood-stained';
    case 'xanthochromic': return 'Xanthochromic';
    default: return 'Unspecified';
  }
}

/** Human-readable specialist-test (tri-state) label. */
function testResultLabel(value) {
  switch (value) {
    case 'positive': return 'Positive';
    case 'negative': return 'Negative';
    case 'not-tested': return 'Not tested';
    default: return 'Unspecified';
  }
}

/** Human-readable reporting-category label (structured CSF pattern). */
function reportingCategoryLabel(value) {
  switch (value) {
    case 'bacterial-pattern': return 'Bacterial pattern';
    case 'viral-pattern': return 'Viral / aseptic pattern';
    case 'SAH-pattern': return 'SAH pattern';
    case 'inflammatory-demyelinating': return 'Inflammatory / demyelinating';
    case 'raised-protein': return 'Raised protein';
    case 'pleocytosis': return 'Pleocytosis';
    case 'normal': return 'Normal';
    case 'indeterminate': return 'Indeterminate';
    case '': return 'Unspecified';
    default: return value;
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, csfAppearanceLabel, testResultLabel, reportingCategoryLabel, reportStatusLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
