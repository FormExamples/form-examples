// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Angiography Test Result form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_angiography_test_result.sql` and
// `sql/05_create_table_angiography_test_result_grade.sql`. This file builds
// and exports the canonical empty AngiographyResult shape used by the wizard,
// so that newly-added fields automatically default correctly when older saved
// state is rehydrated from localStorage. It also exports the display helpers
// (labels and badge-class hints) shared by the wizard and the dashboard.

/**
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 * @typedef {'ct-angiography' | 'mr-angiography' | 'catheter-dsa' | 'coronary-angiography' | 'peripheral-angiography' | 'cerebral-angiography' | 'other' | ''} AngiographyType
 * @typedef {'coronary' | 'cerebral' | 'carotid' | 'aorta' | 'renal' | 'peripheral-lower-limb' | 'pulmonary' | 'mesenteric' | 'other' | ''} BodyRegion
 * @typedef {'iodinated' | 'gadolinium' | 'none' | ''} ContrastUsed
 * @typedef {'adequate' | 'limited' | 'non-diagnostic' | ''} ExaminationAdequacy
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 * @typedef {'no-action' | 'routine-follow-up' | 'further-imaging' | 'specialist-referral' | 'urgent-review' | ''} Recommendation
 * @typedef {'classification' | 'severity' | 'completeness' | 'follow-up'} Axis
 * @typedef {'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * The angiography result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from. Mirrors `AngiographyResult` in
 * `front-end-with-svelte/src/lib/engine/types.ts`.
 *
 * @typedef {Object} AngiographyResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate               - yyyy-mm-dd; '' when unset
 * @property {string} reportedDate                - yyyy-mm-dd; '' when unset
 * @property {AngiographyType} angiographyType
 * @property {BodyRegion} bodyRegion
 * @property {ContrastUsed} contrastUsed
 * @property {ExaminationAdequacy} examinationAdequacy
 * @property {string} clinicalHistory
 * @property {string} comparisonWithPrevious
 * @property {string} findingsNarrative
 * @property {boolean} significantStenosis
 * @property {boolean} occlusion
 * @property {boolean} aneurysm
 * @property {boolean} dissection
 * @property {boolean} activeExtravasation
 * @property {boolean} thrombus
 * @property {boolean} normalVessels
 * @property {boolean} incidentalFinding
 * @property {number | null} maxStenosisPercent   - 0-100; null when unset
 * @property {boolean} interventionPerformed
 * @property {string} impression
 * @property {string} reportingCategory
 * @property {string} recommendedFollowUp
 * @property {boolean} criticalResultCommunicated
 * @property {string} reportedTo
 * @property {string} clinicianNotes
 * @property {boolean} signed
 */

/**
 * A single rule that fired during grading (audit trail). Mirrors
 * `sql/06_create_table_angiography_test_result_grade_rule.sql`.
 *
 * @typedef {Object} FiredRule
 * @property {string} ruleId
 * @property {Axis} axis
 * @property {string} category
 * @property {string} description
 */

/**
 * A safety-critical flag, independent of the four axes. Mirrors
 * `sql/07_create_table_angiography_test_result_grade_flag.sql`.
 *
 * @typedef {Object} Flag
 * @property {string} flagId
 * @property {string} category
 * @property {FlagPriority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * The computed four-axis interpretation grade. Mirrors
 * `sql/05_create_table_angiography_test_result_grade.sql`.
 *
 * @typedef {Object} GradingResult
 * @property {ResultClassification} resultClassification  - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity    - Axis B
 * @property {string} reportingCategory                   - Axis B (structured)
 * @property {number} reportCompletenessPercent           - Axis C (0-100)
 * @property {FollowUpUrgency} followUpUrgency            - Axis D
 * @property {string} targetTimeframe                     - Axis D
 * @property {string} recommendedAction                   - Axis D
 * @property {Recommendation} recommendation              - overall
 * @property {FiredRule[]} firedRules
 * @property {Flag[]} flags
 * @property {string} gradedAt                            - ISO timestamp
 */

/**
 * Build a fresh, fully-blank angiography result.
 * Strings default to `''`; the numeric field defaults to `null`;
 * structured-finding and sign-off booleans default to `false`.
 * @returns {AngiographyResult}
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
    angiographyType: '',
    bodyRegion: '',
    contrastUsed: '',
    examinationAdequacy: '',

    // Clinical context
    clinicalHistory: '',
    comparisonWithPrevious: '',

    // Findings
    findingsNarrative: '',
    significantStenosis: false,
    occlusion: false,
    aneurysm: false,
    dissection: false,
    activeExtravasation: false,
    thrombus: false,
    normalVessels: false,
    incidentalFinding: false,

    // Measurements
    maxStenosisPercent: null,
    interventionPerformed: false,

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

/** Overall-recommendation display label. */
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

/** Human-readable angiography-type label. */
function angiographyTypeLabel(value) {
  switch (value) {
    case 'ct-angiography': return 'CT angiography (CTA)';
    case 'mr-angiography': return 'MR angiography (MRA)';
    case 'catheter-dsa': return 'Catheter / DSA';
    case 'coronary-angiography': return 'Coronary angiography';
    case 'peripheral-angiography': return 'Peripheral angiography';
    case 'cerebral-angiography': return 'Cerebral angiography';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Human-readable body-region label. */
function bodyRegionLabel(value) {
  switch (value) {
    case 'coronary': return 'Coronary';
    case 'cerebral': return 'Cerebral';
    case 'carotid': return 'Carotid';
    case 'aorta': return 'Aorta';
    case 'renal': return 'Renal';
    case 'peripheral-lower-limb': return 'Peripheral lower limb';
    case 'pulmonary': return 'Pulmonary';
    case 'mesenteric': return 'Mesenteric';
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
    case 'iodinated': return 'Iodinated';
    case 'gadolinium': return 'Gadolinium';
    case 'none': return 'None';
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
// Badge-class hints (reuse the shared risk palette in css/)
// ----------------------------------------------------------------------

/** CSS class hint for the Axis A classification badge. */
function resultClassificationClass(value) {
  switch (value) {
    case 'normal': return 'risk-low';
    case 'abnormal': return 'risk-moderate';
    case 'critical': return 'risk-critical';
    case 'inconclusive': return '';
    default: return '';
  }
}

/** CSS class hint for the Axis B severity badge. */
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

export { emptyResult, resultClassificationLabel, abnormalitySeverityLabel, followUpUrgencyLabel, recommendationLabel, angiographyTypeLabel, bodyRegionLabel, reportStatusLabel, contrastUsedLabel, examinationAdequacyLabel, priorityLabel, resultClassificationClass, abnormalitySeverityClass, followUpUrgencyClass };
