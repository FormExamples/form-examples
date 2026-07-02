// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Diabetic Eye Screening record.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_diabetic_eye_screening.sql`. This file builds and
// exports the canonical empty ScreeningData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers
// (retinopathyLabel, maculopathyLabel, outcomeLabel, outcomeClass,
// referralLabel, recallIntervalLabel, graderRoleLabel, imagingMediaLabel,
// ageBandLabel, diabetesTypeLabel, previousScreenResultLabel, ungradableLabel,
// photocoagulationLabel, statusLabel, priorityLabel).

/**
 * @typedef {'screener' | 'primary-grader' | 'secondary-grader' | 'ophthalmologist' | 'other' | ''} GraderRole
 * @typedef {'digital-fundus' | 'mydriatic' | 'non-mydriatic' | 'oct' | 'other' | ''} ImagingMedia
 * @typedef {'under-12' | '12-17' | '18-64' | '65-plus' | ''} AgeBand
 * @typedef {'type-1' | 'type-2' | 'other' | 'unknown' | ''} DiabetesType
 * @typedef {'r0m0' | 'background' | 'referable' | 'none' | 'unknown' | ''} PreviousScreenResult
 * @typedef {'R0' | 'R1' | 'R2' | 'R3A' | 'R3S' | ''} RetinopathyGrade
 * @typedef {'M0' | 'M1' | ''} MaculopathyGrade
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {'refer-hes-urgent' | 'refer-hes' | 'refer-slit-lamp'
 *   | 'surveillance-6-month' | 'routine-12-month' | 'routine-24-month' | ''} Outcome
 * @typedef {'none' | 'hes-routine' | 'hes-urgent' | 'slit-lamp' | ''} Referral
 * @typedef {'complete' | 'incomplete'} Status
 */

/**
 * Step 1 — grading context.
 * @typedef {Object} Context
 * @property {string} graderName
 * @property {GraderRole} graderRole
 * @property {string} gradedAt          - date string; '' when unset
 * @property {string} imageCapturedAt   - date string; '' when unset
 * @property {ImagingMedia} imagingMedia
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {DiabetesType} diabetesType
 * @property {number | null} yearsSinceDiagnosis
 * @property {string} previousScreenDate     - date string; '' when unset
 * @property {PreviousScreenResult} previousScreenResult
 */

/**
 * Step 3 / 4 — per-eye grading block (right eye and left eye).
 * @typedef {Object} EyeGrade
 * @property {RetinopathyGrade} retinopathy   - marker R
 * @property {MaculopathyGrade} maculopathy   - marker M
 * @property {YesNo} photocoagulation         - marker P
 * @property {YesNo} ungradable               - marker U
 * @property {string} visualAcuity
 */

/**
 * Step 5 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalContext
 */

/**
 * @typedef {Object} ScreeningData
 * @property {Context} context
 * @property {Identification} identification
 * @property {EyeGrade} rightEye
 * @property {EyeGrade} leftEye
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-RECALL-R3A-01
 * @property {string} stage
 * @property {string} category
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
 * @property {EyeGrade} rightEyeGrade
 * @property {EyeGrade} leftEyeGrade
 * @property {'R0' | 'R1' | 'R2' | 'R3S' | 'R3A'} worstRetinopathy
 * @property {'M0' | 'M1'} worstMaculopathy
 * @property {boolean} anyUngradable
 * @property {Outcome} recallPathway
 * @property {6 | 12 | 24 | null} recallIntervalMonths
 * @property {Referral} referral
 * @property {Status} status
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.DiabeticEyeScreening`.
(function () {
'use strict';
window.DiabeticEyeScreening = window.DiabeticEyeScreening || {};

/**
 * Build a fresh, fully-blank screening record.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {ScreeningData}
 */
function emptyScreening() {
  return {
    context: {
      graderName: '',
      graderRole: '',
      gradedAt: '',
      imageCapturedAt: '',
      imagingMedia: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      diabetesType: '',
      yearsSinceDiagnosis: null,
      previousScreenDate: '',
      previousScreenResult: ''
    },
    rightEye: {
      retinopathy: '',
      maculopathy: '',
      photocoagulation: '',
      ungradable: '',
      visualAcuity: ''
    },
    leftEye: {
      retinopathy: '',
      maculopathy: '',
      photocoagulation: '',
      ungradable: '',
      visualAcuity: ''
    },
    note: {
      clinicalContext: ''
    }
  };
}

/** Retinopathy (R) grade label for display. */
function retinopathyLabel(grade) {
  switch (grade) {
    case 'R0': return 'R0 — No diabetic retinopathy';
    case 'R1': return 'R1 — Background retinopathy';
    case 'R2': return 'R2 — Pre-proliferative retinopathy';
    case 'R3A': return 'R3A — Proliferative retinopathy (active)';
    case 'R3S': return 'R3S — Proliferative retinopathy (stable / treated)';
    default: return '';
  }
}

/** Maculopathy (M) grade label for display. */
function maculopathyLabel(grade) {
  switch (grade) {
    case 'M0': return 'M0 — No diabetic maculopathy';
    case 'M1': return 'M1 — Diabetic maculopathy present';
    default: return '';
  }
}

/** Recall / referral outcome label for display. */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'refer-hes-urgent': return 'Urgent referral to ophthalmology (HES)';
    case 'refer-hes': return 'Routine referral to hospital eye service (HES)';
    case 'refer-slit-lamp': return 'Re-screen / slit-lamp biomicroscopy';
    case 'surveillance-6-month': return '6-monthly digital surveillance';
    case 'routine-12-month': return 'Routine 12-monthly digital screening';
    case 'routine-24-month': return 'Routine 24-monthly (extended, low-risk) screening';
    default: return '';
  }
}

/** CSS class hint for the outcome badge (reuses the shared risk palette). */
function outcomeClass(outcome) {
  switch (outcome) {
    case 'routine-24-month': return 'risk-low';
    case 'routine-12-month': return 'risk-low';
    case 'surveillance-6-month': return 'risk-moderate';
    case 'refer-slit-lamp': return 'risk-moderate';
    case 'refer-hes': return 'risk-high';
    case 'refer-hes-urgent': return 'risk-critical';
    default: return '';
  }
}

/** Referral destination label. */
function referralLabel(referral) {
  switch (referral) {
    case 'none': return 'No referral';
    case 'hes-routine': return 'Hospital eye service (routine)';
    case 'hes-urgent': return 'Ophthalmology (urgent / fast-track)';
    case 'slit-lamp': return 'Slit-lamp biomicroscopy';
    default: return '';
  }
}

/** Recall-interval label. */
function recallIntervalLabel(months) {
  if (months === 6) return '6 months';
  if (months === 12) return '12 months';
  if (months === 24) return '24 months';
  return 'No routine recall (referral pathway)';
}

/** Grader-role label. */
function graderRoleLabel(role) {
  switch (role) {
    case 'screener': return 'Retinal screener';
    case 'primary-grader': return 'Primary grader';
    case 'secondary-grader': return 'Secondary grader';
    case 'ophthalmologist': return 'Ophthalmologist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Imaging-media label. */
function imagingMediaLabel(media) {
  switch (media) {
    case 'digital-fundus': return 'Digital fundus photography';
    case 'mydriatic': return 'Mydriatic (dilated)';
    case 'non-mydriatic': return 'Non-mydriatic';
    case 'oct': return 'Optical coherence tomography (OCT)';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'under-12': return 'Under 12 (outside programme)';
    case '12-17': return '12-17';
    case '18-64': return '18-64';
    case '65-plus': return '65 or over';
    default: return '';
  }
}

/** Diabetes-type label. */
function diabetesTypeLabel(type) {
  switch (type) {
    case 'type-1': return 'Type 1';
    case 'type-2': return 'Type 2';
    case 'other': return 'Other';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Previous-screen-result label. */
function previousScreenResultLabel(result) {
  switch (result) {
    case 'r0m0': return 'R0/M0 (no retinopathy)';
    case 'background': return 'Background (R1)';
    case 'referable': return 'Referable disease';
    case 'none': return 'No previous screen';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Ungradable (U) marker label. */
function ungradableLabel(value) {
  switch (value) {
    case 'yes': return 'Ungradable';
    case 'no': return 'Gradable';
    default: return '';
  }
}

/** Photocoagulation (P) marker label. */
function photocoagulationLabel(value) {
  switch (value) {
    case 'yes': return 'Photocoagulation present';
    case 'no': return 'No photocoagulation';
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

Object.assign(window.DiabeticEyeScreening, {
  emptyScreening,
  retinopathyLabel,
  maculopathyLabel,
  outcomeLabel,
  outcomeClass,
  referralLabel,
  recallIntervalLabel,
  graderRoleLabel,
  imagingMediaLabel,
  ageBandLabel,
  diabetesTypeLabel,
  previousScreenResultLabel,
  ungradableLabel,
  photocoagulationLabel,
  statusLabel,
  priorityLabel
});
})();
