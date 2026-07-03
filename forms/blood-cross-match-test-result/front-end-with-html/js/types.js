// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Blood Cross-Match Test Result
// form, plus the display-label helpers from `src/lib/engine/utils.ts`.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_blood_cross_match_test_result.sql` and
// `sql/05_create_table_blood_cross_match_test_result_grade.sql`. This file
// builds and exports the canonical empty BloodCrossMatchResult shape used by
// the wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (labels + badge-class hints for the shared risk palette).

/**
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled' | ''} ReportStatus
 * @typedef {'group-and-save' | 'crossmatch' | 'antibody-screen' | 'emergency-issue' | ''} RequestType
 * @typedef {'a' | 'b' | 'o' | 'ab' | ''} AboGroup
 * @typedef {'positive' | 'negative' | ''} RhdGroup
 * @typedef {'negative' | 'positive' | ''} AntibodyScreenResult
 * @typedef {'compatible' | 'incompatible' | 'electronic-issue' | 'not-performed' | ''} CrossmatchResult
 * @typedef {'red-cells' | 'platelets' | 'fresh-frozen-plasma' | 'cryoprecipitate' | 'none' | ''} Component
 * @typedef {'normal' | 'abnormal' | 'critical' | ''} OverallResultStatus
 * @typedef {'normal' | 'abnormal' | 'critical' | 'inconclusive' | ''} ResultClassification
 * @typedef {'none' | 'minor' | 'moderate' | 'major' | ''} AbnormalitySeverity
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert' | ''} FollowUpUrgency
 * @typedef {'no-action' | 'routine-follow-up' | 'further-testing' | 'specialist-referral' | 'urgent-review' | ''} Recommendation
 * @typedef {'classification' | 'severity' | 'completeness' | 'follow-up'} Axis
 * @typedef {'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * The blood cross-match / transfusion compatibility result (report) — the
 * source-of-truth record the four-axis interpretation grade is computed from.
 *
 * @typedef {Object} BloodCrossMatchResult
 * @property {string} reportingClinician
 * @property {string} originatingRequestReference
 * @property {ReportStatus} reportStatus
 * @property {string} performedDate            - ISO date string; '' when unset
 * @property {string} reportedDate             - ISO date string; '' when unset
 * @property {RequestType} requestType
 * @property {string} clinicalHistory
 * @property {AboGroup} aboGroup
 * @property {RhdGroup} rhdGroup
 * @property {boolean} historicalGroupConcordant
 * @property {AntibodyScreenResult} antibodyScreenResult
 * @property {string} antibodiesIdentified
 * @property {CrossmatchResult} crossmatchResult
 * @property {Component} component
 * @property {number | null} unitsCrossmatched
 * @property {number | null} unitsAvailable
 * @property {string} specialRequirements
 * @property {boolean} twoSampleRuleMet
 * @property {OverallResultStatus} overallResultStatus
 * @property {string} findingsNarrative
 * @property {string} impression
 * @property {string} recommendedFollowUp
 * @property {boolean} criticalResultCommunicated
 * @property {string} reportedTo
 * @property {string} clinicianNotes
 * @property {boolean} signed
 */

/**
 * A single rule that fired during grading (audit trail).
 *
 * @typedef {Object} FiredRule
 * @property {string} ruleId       - stable rule id, e.g. R-CLASS-CRITICAL-01
 * @property {Axis} axis
 * @property {string} category
 * @property {string} description
 */

/**
 * A safety-critical flag, independent of the four axes. Categories mirror
 * `sql/07_create_table_blood_cross_match_test_result_grade_flag.sql`.
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
 * `sql/05_create_table_blood_cross_match_test_result_grade.sql`.
 *
 * @typedef {Object} GradingResult
 * @property {ResultClassification} resultClassification  - Axis A
 * @property {AbnormalitySeverity} abnormalitySeverity    - Axis B
 * @property {string} reportingCategory                   - Axis B structured label
 * @property {number} reportCompletenessPercent           - Axis C (0-100)
 * @property {FollowUpUrgency} followUpUrgency            - Axis D
 * @property {string} targetTimeframe                     - Axis D
 * @property {string} recommendedAction                   - Axis D
 * @property {Recommendation} recommendation
 * @property {FiredRule[]} firedRules
 * @property {Flag[]} flags
 * @property {string} gradedAt                            - ISO timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BloodCrossMatchTestResult`.
(function () {
'use strict';
window.BloodCrossMatchTestResult = window.BloodCrossMatchTestResult || {};

/**
 * Build a fresh, fully-blank result record.
 * Strings default to `''`; numeric fields default to `null`; booleans to `false`.
 * Mirrors `createDefaultResult()` in the SvelteKit store.
 * @returns {BloodCrossMatchResult}
 */
function emptyResult() {
  return {
    // Report identification
    reportingClinician: '',
    originatingRequestReference: '',
    reportStatus: '',
    performedDate: '',
    reportedDate: '',
    // Test requested / context
    requestType: '',
    clinicalHistory: '',
    // ABO / Rh grouping
    aboGroup: '',
    rhdGroup: '',
    historicalGroupConcordant: false,
    // Antibody screen / identification
    antibodyScreenResult: '',
    antibodiesIdentified: '',
    // Crossmatch / compatibility
    crossmatchResult: '',
    component: '',
    unitsCrossmatched: null,
    unitsAvailable: null,
    specialRequirements: '',
    // Identity / sample safety
    twoSampleRuleMet: false,
    // Overall result and interpretation
    overallResultStatus: '',
    findingsNarrative: '',
    impression: '',
    recommendedFollowUp: '',
    // Critical-result communication and sign-off
    criticalResultCommunicated: false,
    reportedTo: '',
    clinicianNotes: '',
    signed: false
  };
}

// ──────────────────────────────────────────────
// Display labels (port of src/lib/engine/utils.ts)
// ──────────────────────────────────────────────

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
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-testing': return 'Further testing';
    case 'specialist-referral': return 'Specialist referral';
    case 'urgent-review': return 'Urgent review';
    default: return 'Not graded';
  }
}

/** Human-readable request-type label. */
function requestTypeLabel(value) {
  switch (value) {
    case 'group-and-save': return 'Group and save';
    case 'crossmatch': return 'Crossmatch';
    case 'antibody-screen': return 'Antibody screen';
    case 'emergency-issue': return 'Emergency issue';
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

/** Human-readable ABO/RhD group label. */
function bloodGroupLabel(abo, rhd) {
  if (abo === '') return 'Not determined';
  const aboText = String(abo).toUpperCase();
  const rhdText =
    rhd === 'positive' ? ' RhD positive'
    : rhd === 'negative' ? ' RhD negative'
    : '';
  return aboText + rhdText;
}

/** Human-readable component label. */
function componentLabel(value) {
  switch (value) {
    case 'red-cells': return 'Red cells';
    case 'platelets': return 'Platelets';
    case 'fresh-frozen-plasma': return 'Fresh frozen plasma';
    case 'cryoprecipitate': return 'Cryoprecipitate';
    case 'none': return 'None';
    default: return 'Unspecified';
  }
}

/** Human-readable crossmatch-result label. */
function crossmatchResultLabel(value) {
  switch (value) {
    case 'compatible': return 'Compatible';
    case 'incompatible': return 'Incompatible';
    case 'electronic-issue': return 'Electronic issue';
    case 'not-performed': return 'Not performed';
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

// ──────────────────────────────────────────────
// Badge-class hints (shared risk palette in css/, NOT Tailwind utilities)
// ──────────────────────────────────────────────

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

/** Flag-priority list-item class. */
function priorityClass(priority) {
  switch (priority) {
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

Object.assign(window.BloodCrossMatchTestResult, {
  emptyResult,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  recommendationLabel,
  requestTypeLabel,
  reportStatusLabel,
  bloodGroupLabel,
  componentLabel,
  crossmatchResultLabel,
  priorityLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass,
  priorityClass
});
})();
