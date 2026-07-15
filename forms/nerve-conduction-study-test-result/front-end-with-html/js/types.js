// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Nerve Conduction Study Test
// Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_nerve_conduction_study_test_result.sql` and
// `sql/05_create_table_nerve_conduction_study_test_result_grade.sql`. This
// file builds and exports the canonical empty NerveConductionStudyResult
// shape used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage. It also
// exports the display helpers (labels + Lily badge-class mappers) shared by
// the form and the report.

/**
 * Report lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 */

/**
 * Performed electrodiagnostic study type.
 * @typedef {'nerve-conduction' | 'emg' | 'nerve-conduction-and-emg' |
 *           'repetitive-stimulation' | 'other' | ''} StudyType
 */

/**
 * Anatomical region studied.
 * @typedef {'upper-limb' | 'lower-limb' | 'all-limbs' | 'cranial' |
 *           'generalised' | 'other' | ''} Region
 */

/**
 * Laterality studied.
 * @typedef {'left' | 'right' | 'bilateral' | 'not-applicable' | ''} Laterality
 */

/**
 * Diagnostic adequacy of the study.
 * @typedef {'adequate' | 'limited' | 'non-diagnostic' | ''} StudyAdequacy
 */

/**
 * Overall severity of the electrodiagnostic abnormality.
 * @typedef {'mild' | 'moderate' | 'severe' | 'not-applicable' | ''} Severity
 */

/**
 * Predominant pathophysiological pattern.
 * @typedef {'demyelinating' | 'axonal' | 'mixed' | 'not-applicable' | ''} Pattern
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
 * The nerve conduction study / EMG result (report) — the source-of-truth
 * record the four-axis interpretation grade is computed from. Mirrors
 * `NerveConductionStudyResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} NerveConductionStudyResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date (yyyy-mm-dd); '' when unset
 * @property {string} reportedDate             - ISO date (yyyy-mm-dd); '' when unset
 * @property {StudyType} studyType
 * @property {Region} region
 * @property {Laterality} laterality
 * @property {StudyAdequacy} studyAdequacy
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {string} nerveConductionFindings
 * @property {string} emgFindings
 * @property {boolean} carpalTunnelSyndrome
 * @property {boolean} peripheralNeuropathy
 * @property {boolean} radiculopathy
 * @property {boolean} motorNeuroneDiseaseFeatures
 * @property {boolean} myopathy
 * @property {boolean} neuromuscularJunctionDisorder
 * @property {boolean} normalStudy
 * @property {Severity} severity
 * @property {Pattern} pattern
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
 * `sql/05_create_table_nerve_conduction_study_test_result_grade.sql`.
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
 * Build a fresh, fully-blank nerve conduction study / EMG result.
 * Strings default to `''`; structured-findings booleans default to `false`.
 * @returns {NerveConductionStudyResult}
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
    studyType: '',
    region: '',
    laterality: '',
    studyAdequacy: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Findings
    nerveConductionFindings: '',
    emgFindings: '',
    carpalTunnelSyndrome: false,
    peripheralNeuropathy: false,
    radiculopathy: false,
    motorNeuroneDiseaseFeatures: false,
    myopathy: false,
    neuromuscularJunctionDisorder: false,
    normalStudy: false,

    // Characterisation
    severity: '',
    pattern: '',

    // Impression and follow-up
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

/** Human-readable study-type label. */
function studyTypeLabel(value) {
  switch (value) {
    case 'nerve-conduction': return 'Nerve conduction';
    case 'emg': return 'Needle EMG';
    case 'nerve-conduction-and-emg': return 'Nerve conduction and EMG';
    case 'repetitive-stimulation': return 'Repetitive stimulation';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable region label. */
function regionLabel(value) {
  switch (value) {
    case 'upper-limb': return 'Upper limb';
    case 'lower-limb': return 'Lower limb';
    case 'all-limbs': return 'All limbs';
    case 'cranial': return 'Cranial';
    case 'generalised': return 'Generalised';
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
    case 'not-applicable': return 'Not applicable';
    default: return 'Unspecified';
  }
}

/** Human-readable study-adequacy label. */
function studyAdequacyLabel(value) {
  switch (value) {
    case 'adequate': return 'Adequate';
    case 'limited': return 'Limited';
    case 'non-diagnostic': return 'Non-diagnostic';
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, studyTypeLabel, regionLabel, lateralityLabel, studyAdequacyLabel, reportStatusLabel, recommendationLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
