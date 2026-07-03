// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Biopsy Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_biopsy_test_result.sql` and
// `sql/05_create_table_biopsy_test_result_grade.sql`. This file builds and
// exports the canonical empty BiopsyResult shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state
// is rehydrated from localStorage. It also exports display helpers (labels
// for every enumeration plus the risk-badge class mappers).

/**
 * ─── Enumerations (mirror the SQL CHECK constraints) ───
 *
 * @typedef {'preliminary' | 'final' | 'amended' | 'supplementary' | 'cancelled' | ''} ReportStatus
 * @typedef {'skin' | 'breast' | 'lymph-node' | 'liver' | 'kidney' | 'prostate' | 'lung' | 'bone-marrow' | 'gi-tract' | 'thyroid' | 'soft-tissue' | 'other' | ''} BiopsySite
 * @typedef {'punch' | 'excision' | 'incision' | 'core-needle' | 'fine-needle-aspiration' | 'image-guided' | 'endoscopic' | 'other' | ''} BiopsyMethod
 * @typedef {'adequate' | 'suboptimal' | 'inadequate' | ''} SpecimenAdequacy
 * @typedef {'well-differentiated' | 'moderately-differentiated' | 'poorly-differentiated' | 'undifferentiated' | 'not-applicable' | ''} HistologicalGrade
 * @typedef {'clear' | 'involved' | 'close' | 'not-applicable' | ''} ResectionMargins
 */

/**
 * ─── Axis enumerations (grade) ───
 *
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 * @typedef {'no-action' | 'routine-follow-up' | 'further-testing' | 'specialist-referral' | 'urgent-mdt' | ''} Recommendation
 */

/**
 * The biopsy histopathology result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Mirrors `BiopsyResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts` (sql/04).
 *
 * @typedef {Object} BiopsyResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date; '' when unset
 * @property {string} reportedDate             - ISO date; '' when unset
 * @property {BiopsySite} biopsySite
 * @property {BiopsyMethod} biopsyMethod
 * @property {SpecimenAdequacy} specimenAdequacy
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {string} macroscopicDescription
 * @property {string} microscopicDescription
 * @property {string} diagnosis
 * @property {boolean} malignancyPresent
 * @property {string} tumourType
 * @property {HistologicalGrade} histologicalGrade
 * @property {ResectionMargins} resectionMargins
 * @property {boolean} lymphovascularInvasion
 * @property {string} immunohistochemistry
 * @property {string} molecularResults
 * @property {string} snomedCode
 * @property {string} impression
 * @property {string} reportingCategory
 * @property {string} recommendedFollowUp
 * @property {boolean} criticalResultCommunicated
 * @property {string} reportedTo
 * @property {string} clinicianNotes
 * @property {boolean} signed
 */

/**
 * A scoring axis, used in the fired-rule audit trail.
 * @typedef {'classification' | 'severity' | 'completeness' | 'follow-up'} Axis
 */

/**
 * A single rule that fired during grading (audit trail; sql/06).
 * @typedef {Object} FiredRule
 * @property {string} ruleId
 * @property {Axis} axis
 * @property {string} category
 * @property {string} description
 */

/**
 * A safety-critical flag, independent of the four axes (sql/07).
 * @typedef {Object} Flag
 * @property {string} flagId
 * @property {string} category
 * @property {'low' | 'medium' | 'high'} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * The computed four-axis interpretation grade (sql/05).
 * @typedef {Object} GradingResult
 * @property {ResultClassification} resultClassification    - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity      - Axis B
 * @property {string} reportingCategory                     - Axis B label
 * @property {number} reportCompletenessPercent             - Axis C (0-100)
 * @property {FollowUpUrgency} followUpUrgency              - Axis D
 * @property {string} targetTimeframe                       - Axis D
 * @property {string} recommendedAction                     - Axis D
 * @property {Recommendation} recommendation
 * @property {FiredRule[]} firedRules
 * @property {Flag[]} flags
 * @property {string} gradedAt
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BiopsyTestResult`.
(function () {
'use strict';
window.BiopsyTestResult = window.BiopsyTestResult || {};

/**
 * Build a fresh, fully-blank biopsy result.
 * Strings default to `''`; booleans default to `false`.
 * Mirrors `createDefaultResult()` in the SvelteKit store.
 * @returns {BiopsyResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',
    // Specimen / procedure
    biopsySite: '',
    biopsyMethod: '',
    specimenAdequacy: '',
    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',
    // Macroscopic and microscopic description
    macroscopicDescription: '',
    microscopicDescription: '',
    // Diagnosis and grading
    diagnosis: '',
    malignancyPresent: false,
    tumourType: '',
    histologicalGrade: '',
    resectionMargins: '',
    lymphovascularInvasion: false,
    // Ancillary tests
    immunohistochemistry: '',
    molecularResults: '',
    snomedCode: '',
    // Conclusion and follow-up
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
    case 'no-action': return 'No action required';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-testing': return 'Further testing';
    case 'specialist-referral': return 'Specialist referral';
    case 'urgent-mdt': return 'Urgent MDT referral';
    default: return 'Not graded';
  }
}

/** Human-readable biopsy-site label. */
function biopsySiteLabel(value) {
  switch (value) {
    case 'skin': return 'Skin';
    case 'breast': return 'Breast';
    case 'lymph-node': return 'Lymph node';
    case 'liver': return 'Liver';
    case 'kidney': return 'Kidney';
    case 'prostate': return 'Prostate';
    case 'lung': return 'Lung';
    case 'bone-marrow': return 'Bone marrow';
    case 'gi-tract': return 'GI tract';
    case 'thyroid': return 'Thyroid';
    case 'soft-tissue': return 'Soft tissue';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable biopsy-method label. */
function biopsyMethodLabel(value) {
  switch (value) {
    case 'punch': return 'Punch';
    case 'excision': return 'Excision';
    case 'incision': return 'Incision';
    case 'core-needle': return 'Core needle';
    case 'fine-needle-aspiration': return 'Fine-needle aspiration';
    case 'image-guided': return 'Image-guided';
    case 'endoscopic': return 'Endoscopic';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable specimen-adequacy label. */
function specimenAdequacyLabel(value) {
  switch (value) {
    case 'adequate': return 'Adequate';
    case 'suboptimal': return 'Suboptimal';
    case 'inadequate': return 'Inadequate';
    default: return 'Unspecified';
  }
}

/** Human-readable histological-grade label. */
function histologicalGradeLabel(value) {
  switch (value) {
    case 'well-differentiated': return 'Well differentiated (G1)';
    case 'moderately-differentiated': return 'Moderately differentiated (G2)';
    case 'poorly-differentiated': return 'Poorly differentiated (G3)';
    case 'undifferentiated': return 'Undifferentiated (G4)';
    case 'not-applicable': return 'Not applicable';
    default: return 'Unspecified';
  }
}

/** Human-readable resection-margin label. */
function resectionMarginsLabel(value) {
  switch (value) {
    case 'clear': return 'Clear';
    case 'involved': return 'Involved';
    case 'close': return 'Close';
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
    case 'supplementary': return 'Supplementary';
    case 'cancelled': return 'Cancelled';
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

// ─── Badge class mappers (shared risk palette in css/style.css) ───

/** CSS class hint for the Axis A result-classification badge. */
function resultClassificationClass(value) {
  switch (value) {
    case 'normal': return 'risk-low';
    case 'abnormal': return 'risk-moderate';
    case 'critical': return 'risk-critical';
    case 'inconclusive': return '';
    default: return '';
  }
}

/** CSS class hint for the Axis B abnormality-severity badge. */
function abnormalitySeverityClass(value) {
  switch (value) {
    case 'none': return 'risk-low';
    case 'minor': return 'risk-moderate';
    case 'moderate': return 'risk-high';
    case 'major': return 'risk-critical';
    default: return '';
  }
}

/** CSS class hint for the Axis D follow-up-urgency badge. */
function followUpUrgencyClass(value) {
  switch (value) {
    case 'routine': return 'risk-low';
    case 'recommended': return 'risk-moderate';
    case 'urgent': return 'risk-high';
    case 'critical-alert': return 'risk-critical';
    default: return '';
  }
}

Object.assign(window.BiopsyTestResult, {
  emptyResult,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  recommendationLabel,
  biopsySiteLabel,
  biopsyMethodLabel,
  specimenAdequacyLabel,
  histologicalGradeLabel,
  resectionMarginsLabel,
  reportStatusLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass
});
})();
