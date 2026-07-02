// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Ward Round Note form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ward_round_note.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (statusLabel, statusClass,
// priorityLabel, and enum label maps for the header / component fields).
//
// Unlike a numeric-score form, the engine here grades DOCUMENTATION COMPLETENESS
// across the eight required review components (header, problems, examination,
// investigations, VTE, medication, plan, escalation) plus two recommended
// components (overnight events, estimated discharge). It classifies the entry as
// Complete / Partial / Incomplete, reports a `completenessPercent`, and —
// independently — raises safety flags with a priority. It is NOT a numeric
// clinical severity score.

/**
 * @typedef {'fy1' | 'fy2' | 'core-trainee' | 'specialty-registrar' | 'acp' | 'physician-associate' | 'consultant' | ''} ClinicianGrade
 * @typedef {'improving' | 'stable' | 'deteriorating' | ''} ObservationTrend
 * @typedef {'assessed' | 'not-required' | 'not-done' | ''} VteStatus
 * @typedef {'for-full-escalation' | 'ward-level-ceiling' | 'dnacpr' | 'not-recorded' | ''} EscalationStatus
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — review header.
 * @typedef {Object} Header
 * @property {string} clinicianName
 * @property {ClinicianGrade} clinicianGrade
 * @property {string} reviewedAt   - ISO-ish datetime-local string; '' when unset
 * @property {string} ward
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {string} admissionDate      - yyyy-mm-dd; '' when unset
 * @property {string} primaryDiagnosis
 */

/**
 * Step 3 — overnight events (recommended component).
 * @typedef {Object} Overnight
 * @property {string} overnightEvents
 * @property {YesNo} noOvernightEvents   - explicit "no events overnight" flag
 */

/**
 * Step 4 — current issues and progress (required component: problems).
 * @typedef {Object} Problems
 * @property {string} problemList
 */

/**
 * Step 5 — examination and latest observations (required component: examination).
 * @typedef {Object} Examination
 * @property {string} examinationSummary
 * @property {number | null} news2Total          - latest NEWS2 total (0..20+); null when unrecorded
 * @property {YesNo} news2SingleParamThree        - any single parameter scoring 3
 * @property {ObservationTrend} observationTrend  - improving | stable | deteriorating
 */

/**
 * Step 6 — investigations reviewed (required component: investigations).
 * @typedef {Object} Investigations
 * @property {string} investigationsReviewed
 * @property {YesNo} noInvestigationsOutstanding  - explicit "none outstanding" flag
 * @property {YesNo} abnormalResultFlagged        - abnormal / critical result present
 * @property {YesNo} abnormalResultActioned       - action recorded for the abnormal result
 */

/**
 * Step 7 — VTE assessment (required component: vte).
 * @typedef {Object} Vte
 * @property {VteStatus} vteStatus
 * @property {YesNo} vteProphylaxisInPlace
 */

/**
 * Step 8 — medication changes (required component: medication).
 * @typedef {Object} Medication
 * @property {string} medicationChanges
 * @property {YesNo} noMedicationChanges          - explicit "no changes" flag
 */

/**
 * Step 9 — plan and jobs for the day (required component: plan).
 * @typedef {Object} Plan
 * @property {string} planAndJobs
 */

/**
 * Step 10 — escalation and discharge (required component: escalation;
 * recommended component: estimated discharge).
 * @typedef {Object} Escalation
 * @property {EscalationStatus} escalationStatus
 * @property {YesNo} seniorReviewPresent          - a consultant / senior grade named on the entry
 * @property {string} estimatedDischargeDate      - yyyy-mm-dd; '' when unset
 * @property {YesNo} dischargeNotEstimable        - explicit "not yet estimable" flag
 */

/**
 * Step 11 — summary.
 * @typedef {Object} Summary
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Header} header
 * @property {Identification} identification
 * @property {Overnight} overnight
 * @property {Problems} problems
 * @property {Examination} examination
 * @property {Investigations} investigations
 * @property {Vte} vte
 * @property {Medication} medication
 * @property {Plan} plan
 * @property {Escalation} escalation
 * @property {Summary} summary
 */

/**
 * Per-component presence row.
 * @typedef {Object} ComponentStatus
 * @property {string} component   - header | problems | examination | ... | estimated-discharge
 * @property {string} label       - human-readable component name
 * @property {boolean} required    - whether the component is a required component
 * @property {boolean} present     - whether the component is documented
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-PLAN-DOCUMENTED-01
 * @property {string} component    - header | problems | ... | completeness
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - deteriorating-news2-escalation | vte-not-done | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessStatus} status
 * @property {number} completenessPercent      - 0..100 over the required components
 * @property {ComponentStatus[]} componentStatuses
 * @property {string[]} documentedComponents
 * @property {number} documentedRequired
 * @property {number} totalRequired
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WardRoundNote`.
(function () {
'use strict';
window.WardRoundNote = window.WardRoundNote || {};

/**
 * Build a fresh, fully-blank note. Text / enum fields default to `''`; the one
 * numeric field (NEWS2 total) defaults to `null`; date and datetime fields
 * default to `''`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    header: {
      clinicianName: '',
      clinicianGrade: '',
      reviewedAt: '',
      ward: ''
    },
    identification: {
      patientIdentifier: '',
      admissionDate: '',
      primaryDiagnosis: ''
    },
    overnight: {
      overnightEvents: '',
      noOvernightEvents: ''
    },
    problems: {
      problemList: ''
    },
    examination: {
      examinationSummary: '',
      news2Total: null,
      news2SingleParamThree: '',
      observationTrend: ''
    },
    investigations: {
      investigationsReviewed: '',
      noInvestigationsOutstanding: '',
      abnormalResultFlagged: '',
      abnormalResultActioned: ''
    },
    vte: {
      vteStatus: '',
      vteProphylaxisInPlace: ''
    },
    medication: {
      medicationChanges: '',
      noMedicationChanges: ''
    },
    plan: {
      planAndJobs: ''
    },
    escalation: {
      escalationStatus: '',
      seniorReviewPresent: '',
      estimatedDischargeDate: '',
      dischargeNotEstimable: ''
    },
    summary: {
      clinicalNote: ''
    }
  };
}

/** The ten review components, in order, with their required/recommended class. */
const COMPONENTS = [
  { component: 'header',              label: 'Review header',        required: true },
  { component: 'problems',            label: 'Problems and progress', required: true },
  { component: 'examination',         label: 'Examination and NEWS2', required: true },
  { component: 'investigations',      label: 'Investigations reviewed', required: true },
  { component: 'vte',                 label: 'VTE assessment',       required: true },
  { component: 'medication',          label: 'Medication changes',   required: true },
  { component: 'plan',                label: 'Plan and jobs',        required: true },
  { component: 'escalation',          label: 'Escalation status',    required: true },
  { component: 'overnight-events',    label: 'Overnight events',     required: false },
  { component: 'estimated-discharge', label: 'Estimated discharge',  required: false }
];

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';       // green — entry stands alone
    case 'partial': return 'risk-moderate';   // amber — documentation gaps
    case 'incomplete': return 'risk-high';    // red — a required component absent
    default: return '';
  }
}

/** Clinician-grade label. */
function clinicianGradeLabel(grade) {
  switch (grade) {
    case 'fy1': return 'Foundation Year 1 (FY1)';
    case 'fy2': return 'Foundation Year 2 (FY2)';
    case 'core-trainee': return 'Core trainee';
    case 'specialty-registrar': return 'Specialty registrar';
    case 'acp': return 'Advanced clinical practitioner (ACP)';
    case 'physician-associate': return 'Physician associate';
    case 'consultant': return 'Consultant';
    default: return '';
  }
}

/** Observation-trend label. */
function observationTrendLabel(trend) {
  switch (trend) {
    case 'improving': return 'Improving';
    case 'stable': return 'Stable';
    case 'deteriorating': return 'Deteriorating';
    default: return '';
  }
}

/** VTE-status label. */
function vteStatusLabel(status) {
  switch (status) {
    case 'assessed': return 'Assessed';
    case 'not-required': return 'Not required';
    case 'not-done': return 'Not done';
    default: return '';
  }
}

/** Escalation / ceiling-of-care status label. */
function escalationStatusLabel(status) {
  switch (status) {
    case 'for-full-escalation': return 'For full escalation';
    case 'ward-level-ceiling': return 'Ward-level ceiling of care';
    case 'dnacpr': return 'DNACPR in place';
    case 'not-recorded': return 'Not recorded';
    default: return '';
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

Object.assign(window.WardRoundNote, {
  emptyAssessment,
  COMPONENTS,
  statusLabel,
  statusClass,
  clinicianGradeLabel,
  observationTrendLabel,
  vteStatusLabel,
  escalationStatusLabel,
  priorityLabel
});
})();
