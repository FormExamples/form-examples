// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Structured Medication Review
// (SMR) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_structured_medication_review.sql` (parent review) and
// `sql/05_create_table_structured_medication_review_medicine.sql` (the
// one-to-many child medicine list). This file builds and exports the canonical
// empty ReviewData shape used by the wizard, so that newly-added fields default
// correctly when older saved state is rehydrated from localStorage. It also
// exports the empty-medicine factory and display helpers.

/**
 * @typedef {'clinical-pharmacist' | 'gp' | 'pharmacy-technician' | 'other' | ''} ClinicianRole
 * @typedef {'gp-practice' | 'pcn' | 'care-home' | 'community-pharmacy' | 'patient-home' | ''} CareSetting
 * @typedef {'face-to-face' | 'telephone' | 'video' | 'home-visit' | ''} ConsultationMode
 * @typedef {'18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'fit' | 'mild' | 'moderate' | 'severe' | ''} FrailtyStatus
 * @typedef {'anticoagulant' | 'insulin' | 'opioid' | 'dmard' | 'lithium' | 'methotrexate' | 'other' | ''} HighRiskClass
 * @typedef {'good' | 'partial' | 'poor' | 'unknown' | ''} Adherence
 * @typedef {'yes' | 'no' | 'na' | ''} YesNoNa
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'none' | 'polypharmacy' | 'hyperpolypharmacy'} PolypharmacyBand
 * @typedef {'low' | 'significant'} AnticholinergicBand
 * @typedef {'low' | 'moderate' | 'high'} BurdenBand
 * @typedef {'complete' | 'incomplete'} ReviewStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * One reviewed medicine — mirrors the child table
 * `structured_medication_review_medicine`.
 *
 * @typedef {Object} Medicine
 * @property {string} drugName
 * @property {string} formStrength
 * @property {string} doseRegimen
 * @property {string} indication
 * @property {YesNo} indicationRecorded
 * @property {YesNo} isRegular                 - counts toward polypharmacy
 * @property {YesNo} isHighRisk
 * @property {HighRiskClass} highRiskClass
 * @property {Adherence} adherence
 * @property {number | null} anticholinergicBurdenPoints - 0-3 on the ACB scale
 * @property {YesNo} monitoringRequired
 * @property {YesNoNa} monitoringUpToDate
 * @property {YesNo} deprescribingCandidate
 * @property {string} stoppCriterion           - STOPP code / description, or ''
 * @property {string} startCriterion           - START code / description, or ''
 */

/**
 * Step 1 — review context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} reviewedAt               - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {ConsultationMode} consultationMode
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {FrailtyStatus} frailtyStatus
 * @property {YesNo} livesInCareHome
 * @property {string} longTermConditions
 */

/**
 * Step 3 — problems and patient concerns.
 * @typedef {Object} Problems
 * @property {string} presentingProblems
 * @property {string} patientReportedIssues
 * @property {string} whatMattersToPatient
 */

/**
 * Step 5 — monitoring.
 * @typedef {Object} Monitoring
 * @property {string} monitoringDue
 * @property {number | null} overdueMonitoringCount
 */

/**
 * Step 6 — patient goals and shared decisions.
 * @typedef {Object} Goals
 * @property {string} sharedDecisions
 */

/**
 * Step 7 — agreed actions and plan.
 * @typedef {Object} Plan
 * @property {string} followUpPlan
 * @property {string} followUpDate
 * @property {YesNo} reviewCompleted
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} ReviewData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Problems} problems
 * @property {Medicine[]} medicines
 * @property {Monitoring} monitoring
 * @property {Goals} goals
 * @property {Plan} plan
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} MedicineFlag
 * @property {string} drugName
 * @property {string} criterion
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
 * @property {number} medicineCount
 * @property {number} regularMedicineCount
 * @property {number} anticholinergicBurdenScore
 * @property {PolypharmacyBand} polypharmacyBand
 * @property {AnticholinergicBand} anticholinergicBand
 * @property {BurdenBand} burdenBand
 * @property {ReviewStatus} reviewStatus
 * @property {MedicineFlag[]} stopFlags
 * @property {MedicineFlag[]} startFlags
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.StructuredMedicationReview`.
(function () {
'use strict';
window.StructuredMedicationReview = window.StructuredMedicationReview || {};

/**
 * Build a fresh, fully-blank medicine row.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {Medicine}
 */
function emptyMedicine() {
  return {
    drugName: '',
    formStrength: '',
    doseRegimen: '',
    indication: '',
    indicationRecorded: '',
    isRegular: '',
    isHighRisk: '',
    highRiskClass: '',
    adherence: '',
    anticholinergicBurdenPoints: null,
    monitoringRequired: '',
    monitoringUpToDate: '',
    deprescribingCandidate: '',
    stoppCriterion: '',
    startCriterion: ''
  };
}

/**
 * Build a fresh, fully-blank review.
 * Strings default to `''`; numeric fields default to `null`; the medicine list
 * defaults to `[]`.
 * @returns {ReviewData}
 */
function emptyReview() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      reviewedAt: '',
      careSetting: '',
      consultationMode: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      frailtyStatus: '',
      livesInCareHome: '',
      longTermConditions: ''
    },
    problems: {
      presentingProblems: '',
      patientReportedIssues: '',
      whatMattersToPatient: ''
    },
    medicines: [],
    monitoring: {
      monitoringDue: '',
      overdueMonitoringCount: null
    },
    goals: {
      sharedDecisions: ''
    },
    plan: {
      followUpPlan: '',
      followUpDate: '',
      reviewCompleted: ''
    },
    note: {
      clinicalNote: ''
    }
  };
}

/** Review-status label for display. */
function reviewStatusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the review-status badge. */
function reviewStatusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    default: return '';
  }
}

/** Composite burden-band label. */
function burdenBandLabel(band) {
  switch (band) {
    case 'low': return 'Low burden';
    case 'moderate': return 'Moderate burden';
    case 'high': return 'High burden';
    default: return '';
  }
}

/** CSS class hint for the burden-band badge (reuses the shared risk palette). */
function burdenBandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Polypharmacy-band label. */
function polypharmacyBandLabel(band) {
  switch (band) {
    case 'none': return 'No polypharmacy (< 5 regular)';
    case 'polypharmacy': return 'Polypharmacy (5-9 regular)';
    case 'hyperpolypharmacy': return 'Hyperpolypharmacy (>= 10 regular)';
    default: return '';
  }
}

/** Anticholinergic-burden band label. */
function anticholinergicBandLabel(band) {
  switch (band) {
    case 'low': return 'Low (ACB 0-2)';
    case 'significant': return 'Significant (ACB >= 3)';
    default: return '';
  }
}

/** Reviewing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'clinical-pharmacist': return 'Clinical pharmacist';
    case 'gp': return 'GP';
    case 'pharmacy-technician': return 'Pharmacy technician';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'gp-practice': return 'GP practice';
    case 'pcn': return 'Primary Care Network';
    case 'care-home': return 'Care home';
    case 'community-pharmacy': return 'Community pharmacy';
    case 'patient-home': return "Patient's home";
    default: return '';
  }
}

/** Consultation-mode label. */
function consultationModeLabel(mode) {
  switch (mode) {
    case 'face-to-face': return 'Face to face';
    case 'telephone': return 'Telephone';
    case 'video': return 'Video';
    case 'home-visit': return 'Home visit';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Adult age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case '18-39': return '18-39';
    case '40-64': return '40-64';
    case '65-74': return '65-74';
    case '75-84': return '75-84';
    case '85-plus': return '85 and over';
    default: return '';
  }
}

/** Frailty-status label. */
function frailtyLabel(frailty) {
  switch (frailty) {
    case 'fit': return 'Fit';
    case 'mild': return 'Mild frailty';
    case 'moderate': return 'Moderate frailty';
    case 'severe': return 'Severe frailty';
    default: return '';
  }
}

/** Adherence label. */
function adherenceLabel(adherence) {
  switch (adherence) {
    case 'good': return 'Good';
    case 'partial': return 'Partial';
    case 'poor': return 'Poor';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** High-risk-class label. */
function highRiskClassLabel(cls) {
  switch (cls) {
    case 'anticoagulant': return 'Anticoagulant';
    case 'insulin': return 'Insulin';
    case 'opioid': return 'Opioid';
    case 'dmard': return 'DMARD';
    case 'lithium': return 'Lithium';
    case 'methotrexate': return 'Methotrexate';
    case 'other': return 'Other';
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

Object.assign(window.StructuredMedicationReview, {
  emptyMedicine,
  emptyReview,
  reviewStatusLabel,
  reviewStatusClass,
  burdenBandLabel,
  burdenBandClass,
  polypharmacyBandLabel,
  anticholinergicBandLabel,
  clinicianRoleLabel,
  careSettingLabel,
  consultationModeLabel,
  sexLabel,
  ageBandLabel,
  frailtyLabel,
  adherenceLabel,
  highRiskClassLabel,
  priorityLabel
});
})();
