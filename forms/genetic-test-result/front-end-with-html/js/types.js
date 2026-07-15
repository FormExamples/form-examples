// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Genetic Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_genetic_test_result.sql` and
// `sql/05_create_table_genetic_test_result_grade.sql`. This file builds and
// exports the canonical empty GeneticResult shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports the display helpers (labels +
// Lily badge-class mappers) shared by the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Type of genomic test performed.
 * @typedef {'diagnostic-single-gene' | 'gene-panel' | 'whole-exome' |
 *           'whole-genome' | 'chromosomal-microarray' | 'karyotype' |
 *           'predictive-presymptomatic' | 'carrier-testing' | 'pharmacogenomic' |
 *           'prenatal' | 'other' | ''} TestType
 */

/**
 * Sample type analysed.
 * @typedef {'blood' | 'saliva' | 'tissue' | 'prenatal' | ''} SampleType
 */

/**
 * ACMG/AMP (ACGS) five-tier variant classification (+ no-variant-detected).
 * @typedef {'pathogenic' | 'likely-pathogenic' | 'variant-uncertain-significance' |
 *           'likely-benign' | 'benign' | 'no-variant-detected' | ''} VariantClassification
 */

/**
 * Zygosity of the reported variant.
 * @typedef {'heterozygous' | 'homozygous' | 'hemizygous' | 'not-applicable' | ''} Zygosity
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
 * @typedef {'critical-result-alert' | 'pathogenic-variant-found' |
 *           'secondary-finding' | 'variant-uncertain-significance' |
 *           'cascade-testing-recommended' | 'discrepancy-with-request' |
 *           'abnormal-requiring-action' | 'urgent-referral' | 'missing-impression' |
 *           'missing-classification' | 'other'} FlagCategory
 */

/**
 * Flag priority.
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 */

/**
 * The genetic / genomic test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors `GeneticResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} GeneticResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {TestType} testType
 * @property {string} genesTested
 * @property {SampleType} sampleType
 * @property {string} clinicalHistory
 * @property {string} inheritancePattern
 * @property {string} variantsDetected
 * @property {VariantClassification} variantClassification
 * @property {Zygosity} zygosity
 * @property {boolean} pathogenicVariantFound
 * @property {boolean} vusFound
 * @property {boolean} carrierStatusPositive
 * @property {boolean} secondaryFinding
 * @property {boolean} noClinicallySignificantVariant
 * @property {string} interpretation
 * @property {string} impression
 * @property {string} reportingCategory
 * @property {boolean} recommendedCascadeTesting
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
 * `sql/05_create_table_genetic_test_result_grade.sql`.
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
// namespace, `window.GeneticTestResult`.

/**
 * Build a fresh, fully-blank genetic test result.
 * Strings default to `''`; structured-findings booleans default to `false`.
 * @returns {GeneticResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',

    // Test details
    testType: '',
    genesTested: '',
    sampleType: '',

    // Clinical context
    clinicalHistory: '',
    inheritancePattern: '',

    // Findings
    variantsDetected: '',
    variantClassification: '',
    zygosity: '',
    pathogenicVariantFound: false,
    vusFound: false,
    carrierStatusPositive: false,
    secondaryFinding: false,
    noClinicallySignificantVariant: false,

    // Interpretation
    interpretation: '',
    impression: '',
    reportingCategory: '',

    // Follow-up
    recommendedCascadeTesting: false,
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
    case 'diagnostic-single-gene': return 'Diagnostic single-gene';
    case 'gene-panel': return 'Gene panel';
    case 'whole-exome': return 'Whole exome';
    case 'whole-genome': return 'Whole genome';
    case 'chromosomal-microarray': return 'Chromosomal microarray';
    case 'karyotype': return 'Karyotype';
    case 'predictive-presymptomatic': return 'Predictive / presymptomatic';
    case 'carrier-testing': return 'Carrier testing';
    case 'pharmacogenomic': return 'Pharmacogenomic';
    case 'prenatal': return 'Prenatal';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable variant-classification label. */
function variantClassificationLabel(value) {
  switch (value) {
    case 'pathogenic': return 'Pathogenic';
    case 'likely-pathogenic': return 'Likely pathogenic';
    case 'variant-uncertain-significance': return 'Variant of uncertain significance';
    case 'likely-benign': return 'Likely benign';
    case 'benign': return 'Benign';
    case 'no-variant-detected': return 'No variant detected';
    default: return 'Unspecified';
  }
}

/** Human-readable sample-type label. */
function sampleTypeLabel(value) {
  switch (value) {
    case 'blood': return 'Blood';
    case 'saliva': return 'Saliva';
    case 'tissue': return 'Tissue';
    case 'prenatal': return 'Prenatal';
    default: return 'Unspecified';
  }
}

/** Human-readable zygosity label. */
function zygosityLabel(value) {
  switch (value) {
    case 'heterozygous': return 'Heterozygous';
    case 'homozygous': return 'Homozygous';
    case 'hemizygous': return 'Hemizygous';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, testTypeLabel, variantClassificationLabel, sampleTypeLabel, zygosityLabel, reportStatusLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
