// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Tumor Marker Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_tumor_marker_test_result.sql` and
// `sql/05_create_table_tumor_marker_test_result_grade.sql`. This file builds
// and exports the canonical empty TumorMarkerResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels + Lily badge-class mappers) shared by the form and the report, plus
// the measured-marker metadata table.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Specimen condition affecting assay validity.
 * @typedef {'satisfactory' | 'haemolysed' | 'lipaemic' | 'insufficient' | ''} SpecimenCondition
 */

/**
 * Trend of the principal marker versus the previous value.
 * @typedef {'rising' | 'stable' | 'falling' | 'not-applicable' | ''} Trend
 */

/**
 * Overall result status recorded by the reporting clinician.
 * @typedef {'normal' | 'abnormal' | 'critical' | ''} OverallResultStatus
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
 * @typedef {'no-action' | 'routine-follow-up' | 'repeat-marker' |
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
 * The tumour-marker result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `TumorMarkerResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`. Each measured marker is a
 * NUMERIC value, or `null` when not measured.
 *
 * @typedef {Object} TumorMarkerResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {SpecimenCondition} specimenCondition
 * @property {string} clinicalHistory
 * @property {string} knownCancerSite
 * @property {number|null} psa
 * @property {number|null} ca125
 * @property {number|null} ca19_9
 * @property {number|null} carcinoembryonicAntigenCea
 * @property {number|null} alphaFetoproteinAfp
 * @property {number|null} betaHcg
 * @property {number|null} ca15_3
 * @property {number|null} lactateDehydrogenaseLdh
 * @property {number|null} calcitonin
 * @property {number|null} chromograninA
 * @property {number|null} previousValue
 * @property {Trend} trend
 * @property {string} comparisonWithPrevious
 * @property {OverallResultStatus} overallResultStatus
 * @property {boolean} markedlyElevated
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
 * `sql/05_create_table_tumor_marker_test_result_grade.sql`.
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
 * The ten measured serum tumour markers, with display metadata. Mirrors the
 * `MARKERS` table in `src/lib/engine/utils.ts`.
 * @type {ReadonlyArray<{ key: string, label: string, unit: string }>}
 */
const MARKERS = [
  { key: 'psa', label: 'PSA', unit: 'ng/mL' },
  { key: 'ca125', label: 'CA125', unit: 'IU/mL' },
  { key: 'ca19_9', label: 'CA19-9', unit: 'U/mL' },
  { key: 'carcinoembryonicAntigenCea', label: 'CEA', unit: 'ng/mL' },
  { key: 'alphaFetoproteinAfp', label: 'AFP', unit: 'ng/mL' },
  { key: 'betaHcg', label: 'beta-hCG', unit: 'IU/L' },
  { key: 'ca15_3', label: 'CA15-3', unit: 'U/mL' },
  { key: 'lactateDehydrogenaseLdh', label: 'LDH', unit: 'U/L' },
  { key: 'calcitonin', label: 'Calcitonin', unit: 'ng/L' },
  { key: 'chromograninA', label: 'Chromogranin A', unit: 'nmol/L' }
];

/**
 * Germ-cell-tumour critical thresholds. A measured AFP or beta-hCG at or above
 * these "very high" levels suggests a germ-cell tumour and is treated as a
 * critical result (ASCO / ACB germ-cell tumour-marker guidance).
 */
const AFP_CRITICAL = 1000; // ng/mL
const BETA_HCG_CRITICAL = 5000; // IU/L

/**
 * Build a fresh, fully-blank tumour-marker result.
 * Strings and enums default to `''`; measured markers, previous value, and
 * boolean fields default to `null` / `false`.
 * @returns {TumorMarkerResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Specimen and clinical context
    specimenCondition: '',
    clinicalHistory: '',
    knownCancerSite: '',

    // Measured serum tumour-marker result values (null when not measured)
    psa: null,
    ca125: null,
    ca19_9: null,
    carcinoembryonicAntigenCea: null,
    alphaFetoproteinAfp: null,
    betaHcg: null,
    ca15_3: null,
    lactateDehydrogenaseLdh: null,
    calcitonin: null,
    chromograninA: null,

    // Trend / comparison with previous
    previousValue: null,
    trend: '',
    comparisonWithPrevious: '',

    // Overall result status and interpretation
    overallResultStatus: '',
    markedlyElevated: false,
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

/** Human-readable trend label. */
function trendLabel(value) {
  switch (value) {
    case 'rising': return 'Rising';
    case 'stable': return 'Stable';
    case 'falling': return 'Falling';
    case 'not-applicable': return 'Not applicable';
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
    case 'repeat-marker': return 'Repeat marker';
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

export { MARKERS, AFP_CRITICAL, BETA_HCG_CRITICAL, emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, trendLabel, reportStatusLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
