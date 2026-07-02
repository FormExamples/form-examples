// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Cervical Screening record.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_cervical_screening.sql`. This file builds and exports
// the canonical empty ScreeningData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers
// (resultClassLabel, resultClassClass, managementActionLabel,
// sampleTakerRoleLabel, careSettingLabel, recallIntervalLabel, hpvResultLabel,
// cytologyGradeLabel, sampleAdequacyLabel, statusLabel, priorityLabel).

/**
 * @typedef {'practice-nurse' | 'gp' | 'smear-taker' | 'other' | ''} SampleTakerRole
 * @typedef {'general-practice' | 'sexual-health' | 'other' | ''} CareSetting
 * @typedef {'three-yearly' | 'five-yearly' | 'not-applicable' | ''} RecallInterval
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'adequate' | 'inadequate' | ''} SampleAdequacy
 * @typedef {'insufficient-cells' | 'obscuring-blood' | 'inflammation' | 'labelling' | 'other' | ''} InadequateReason
 * @typedef {'negative' | 'positive' | 'not-tested' | ''} HpvResult
 * @typedef {'negative' | 'borderline' | 'low-grade' | 'high-grade' | 'not-performed' | ''} CytologyGrade
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {'inadequate' | 'hpv-negative' | 'hpv-positive-cytology-normal'
 *   | 'hpv-positive-cytology-abnormal-low' | 'hpv-positive-cytology-abnormal-high'
 *   | 'hpv-positive-cytology-pending' | 'cease-not-eligible' | 'pending' | ''} ResultClass
 * @typedef {'routine-recall' | 'early-repeat-12-months' | 'colposcopy-referral'
 *   | 'urgent-colposcopy-referral' | 'repeat-sample-3-months' | 'cease-screening'
 *   | 'awaiting-cytology' | 'awaiting-result' | ''} ManagementAction
 * @typedef {'complete' | 'incomplete'} Status
 */

/**
 * Step 1 — encounter context.
 * @typedef {Object} Context
 * @property {string} sampleTakerName
 * @property {SampleTakerRole} sampleTakerRole
 * @property {CareSetting} careSetting
 * @property {string} sampleTakenAt   - ISO-ish datetime-local string; '' when unset
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {string} nhsNumber
 * @property {number | null} age
 * @property {string} dateOfBirth
 */

/**
 * Step 3 — eligibility.
 * @typedef {Object} Eligibility
 * @property {RecallInterval} recallInterval
 * @property {string} screenDueDate   - date string; '' when unset
 * @property {string} lastScreenDate  - date string; '' when unset
 * @property {YesNo} overdue
 * @property {YesNo} previouslyCeased
 */

/**
 * Step 4 — consent.
 * @typedef {Object} Consent
 * @property {YesNo} consentGiven
 */

/**
 * Step 5 — symptoms.
 * @typedef {Object} Symptoms
 * @property {YesNo} symptomatic
 * @property {string} symptomDetail
 */

/**
 * Step 6 — sample adequacy.
 * @typedef {Object} Adequacy
 * @property {SampleAdequacy} sampleAdequacy
 * @property {InadequateReason} inadequateReason
 */

/**
 * Step 7 — primary hrHPV result.
 * @typedef {Object} Hpv
 * @property {HpvResult} hpvResult
 */

/**
 * Step 8 — reflex cytology (only when hpvResult == 'positive').
 * @typedef {Object} Cytology
 * @property {CytologyGrade} cytologyGrade
 */

/**
 * Step 9 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalContext
 */

/**
 * @typedef {Object} ScreeningData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Eligibility} eligibility
 * @property {Consent} consent
 * @property {Symptoms} symptoms
 * @property {Adequacy} adequacy
 * @property {Hpv} hpv
 * @property {Cytology} cytology
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-HPV-POSITIVE-HIGH-01
 * @property {string} category
 * @property {ResultClass} resultClass
 * @property {ManagementAction} managementAction
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {ResultClass} resultClass
 * @property {ManagementAction} managementAction
 * @property {Status} status
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.CervicalScreening`.
(function () {
'use strict';
window.CervicalScreening = window.CervicalScreening || {};

/**
 * Build a fresh, fully-blank screening record.
 * Strings default to `''`; numeric/date fields default to `null`/`''`.
 * @returns {ScreeningData}
 */
function emptyScreening() {
  return {
    context: {
      sampleTakerName: '',
      sampleTakerRole: '',
      careSetting: '',
      sampleTakenAt: ''
    },
    identification: {
      patientIdentifier: '',
      nhsNumber: '',
      age: null,
      dateOfBirth: ''
    },
    eligibility: {
      recallInterval: '',
      screenDueDate: '',
      lastScreenDate: '',
      overdue: '',
      previouslyCeased: ''
    },
    consent: {
      consentGiven: ''
    },
    symptoms: {
      symptomatic: '',
      symptomDetail: ''
    },
    adequacy: {
      sampleAdequacy: '',
      inadequateReason: ''
    },
    hpv: {
      hpvResult: ''
    },
    cytology: {
      cytologyGrade: ''
    },
    note: {
      clinicalContext: ''
    }
  };
}

/** Result-classification label for display. */
function resultClassLabel(resultClass) {
  switch (resultClass) {
    case 'inadequate': return 'Inadequate sample';
    case 'hpv-negative': return 'HPV negative';
    case 'hpv-positive-cytology-normal': return 'HPV positive, cytology normal';
    case 'hpv-positive-cytology-abnormal-low': return 'HPV positive, cytology abnormal (low grade)';
    case 'hpv-positive-cytology-abnormal-high': return 'HPV positive, cytology abnormal (high grade)';
    case 'hpv-positive-cytology-pending': return 'HPV positive, cytology outstanding';
    case 'cease-not-eligible': return 'Cease / not eligible';
    case 'pending': return 'Pending';
    default: return '';
  }
}

/** CSS class hint for the result-class badge (reuses the shared risk palette). */
function resultClassClass(resultClass) {
  switch (resultClass) {
    case 'hpv-negative': return 'risk-low';
    case 'cease-not-eligible': return 'risk-moderate';
    case 'inadequate': return 'risk-moderate';
    case 'hpv-positive-cytology-normal': return 'risk-moderate';
    case 'hpv-positive-cytology-pending': return 'risk-moderate';
    case 'pending': return 'risk-moderate';
    case 'hpv-positive-cytology-abnormal-low': return 'risk-high';
    case 'hpv-positive-cytology-abnormal-high': return 'risk-critical';
    default: return '';
  }
}

/** Recommended management-action label for display. */
function managementActionLabel(action) {
  switch (action) {
    case 'routine-recall': return 'Routine recall';
    case 'early-repeat-12-months': return 'Early repeat HPV test at 12 months';
    case 'colposcopy-referral': return 'Colposcopy referral (routine)';
    case 'urgent-colposcopy-referral': return 'Urgent colposcopy referral';
    case 'repeat-sample-3-months': return 'Repeat sample in ~3 months';
    case 'cease-screening': return 'Cease screening; no recall';
    case 'awaiting-cytology': return 'Awaiting reflex cytology';
    case 'awaiting-result': return 'Awaiting result';
    default: return '';
  }
}

/** Sample-taker role label. */
function sampleTakerRoleLabel(role) {
  switch (role) {
    case 'practice-nurse': return 'Practice nurse';
    case 'gp': return 'GP';
    case 'smear-taker': return 'Trained smear-taker';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'sexual-health': return 'Sexual & reproductive health';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Recall-interval label. */
function recallIntervalLabel(interval) {
  switch (interval) {
    case 'three-yearly': return '3-yearly (ages 25-49)';
    case 'five-yearly': return '5-yearly (ages 50-64)';
    case 'not-applicable': return 'Not applicable';
    default: return '';
  }
}

/** Primary hrHPV result label. */
function hpvResultLabel(result) {
  switch (result) {
    case 'negative': return 'Negative (not detected)';
    case 'positive': return 'Positive (detected)';
    case 'not-tested': return 'Not tested';
    default: return '';
  }
}

/** Reflex cytology grade label. */
function cytologyGradeLabel(grade) {
  switch (grade) {
    case 'negative': return 'Negative (normal)';
    case 'borderline': return 'Borderline changes';
    case 'low-grade': return 'Low-grade dyskaryosis';
    case 'high-grade': return 'High-grade dyskaryosis / ?glandular / ?invasive';
    case 'not-performed': return 'Not performed';
    default: return '';
  }
}

/** Sample-adequacy label. */
function sampleAdequacyLabel(adequacy) {
  switch (adequacy) {
    case 'adequate': return 'Adequate';
    case 'inadequate': return 'Inadequate / unsatisfactory';
    default: return '';
  }
}

/** Completeness-status label. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
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

Object.assign(window.CervicalScreening, {
  emptyScreening,
  resultClassLabel,
  resultClassClass,
  managementActionLabel,
  sampleTakerRoleLabel,
  careSettingLabel,
  recallIntervalLabel,
  hpvResultLabel,
  cytologyGradeLabel,
  sampleAdequacyLabel,
  statusLabel,
  priorityLabel
});
})();
