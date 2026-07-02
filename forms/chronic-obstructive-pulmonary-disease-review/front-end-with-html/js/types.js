// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Chronic Obstructive Pulmonary
// Disease Review (COPD annual review) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_chronic_obstructive_pulmonary_disease_review.sql`. This
// file builds and exports the canonical empty ReviewData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (goldGradeLabel/Class, abeGroupLabel/Class, reviewStatusLabel/Class, axis
// labels, and enum labels).

/**
 * @typedef {'gp' | 'practice-nurse' | 'respiratory-nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'routine-annual' | 'post-exacerbation' | 'opportunistic' | ''} ReviewType
 * @typedef {'18-39' | '40-59' | '60-79' | '>=80' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'good' | 'partial' | 'poor' | ''} Adherence
 * @typedef {'up-to-date' | 'due' | 'declined' | ''} VaccineStatus
 * @typedef {'completed' | 'referred' | 'eligible-not-referred' | 'not-indicated' | ''} PulmonaryRehabStatus
 * @typedef {'none' | 'long-term' | 'ambulatory' | ''} OxygenUse
 * @typedef {1 | 2 | 3 | 4 | null} GoldGrade
 * @typedef {'low' | 'high'} Axis
 * @typedef {'A' | 'B' | 'E' | null} AbeGroup
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — review context and identification.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} reviewedAt          - ISO date string; '' when unset
 * @property {ReviewType} reviewType
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 2 — diagnosis and history.
 * @typedef {Object} Diagnosis
 * @property {number | null} diagnosisYear
 * @property {YesNo} spirometryConfirmed
 * @property {string} exposureNotes
 */

/**
 * Step 3 — post-bronchodilator spirometry.
 * @typedef {Object} Spirometry
 * @property {number | null} fev1Litres
 * @property {number | null} fev1PercentPredicted - drives the GOLD grade
 * @property {number | null} fvcLitres
 * @property {number | null} fev1FvcRatio         - obstruction when < 0.70
 * @property {string} spirometryDate              - ISO date string; '' when unset
 */

/**
 * Step 4 — symptom burden.
 * @typedef {Object} Symptoms
 * @property {number | null} mrcGrade  - MRC dyspnoea 1-5 (pulmonary-rehab trigger)
 * @property {number | null} mmrcGrade - mMRC 0-4 (symptom axis)
 * @property {number | null} catScore  - CAT 0-40 (symptom axis)
 */

/**
 * Step 5 — exacerbations (past 12 months).
 * @typedef {Object} Exacerbations
 * @property {number | null} exacerbationsLast12m
 * @property {number | null} hospitalisationsLast12m
 * @property {string} lastExacerbationDate - ISO date string; '' when unset
 * @property {number | null} rescuePackCourses
 */

/**
 * Step 6 — smoking status and cessation.
 * @typedef {Object} Smoking
 * @property {SmokingStatus} smokingStatus
 * @property {number | null} packYears
 * @property {YesNo} cessationSupportOffered
 */

/**
 * Step 7 — inhaler therapy.
 * @typedef {Object} Inhaler
 * @property {string} inhaledTherapy
 * @property {string} deviceType
 * @property {YesNo} inhalerTechniqueChecked
 * @property {YesNo} inhalerTechniqueAdequate
 * @property {Adherence} adherence
 */

/**
 * Step 8 — vaccinations.
 * @typedef {Object} Vaccinations
 * @property {VaccineStatus} influenzaVaccine
 * @property {VaccineStatus} pneumococcalVaccine
 * @property {VaccineStatus} covidVaccine
 */

/**
 * Step 9 — pulmonary rehabilitation and oxygen.
 * @typedef {Object} Rehab
 * @property {PulmonaryRehabStatus} pulmonaryRehabStatus
 * @property {OxygenUse} oxygenUse
 * @property {number | null} restingSpo2
 */

/**
 * Step 10 — comorbidities and self-management.
 * @typedef {Object} SelfManagement
 * @property {string} comorbidities
 * @property {YesNo} selfManagementPlan
 * @property {YesNo} rescuePackSupplied
 * @property {string} nextReviewInterval
 */

/**
 * Step 11 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicianNote
 */

/**
 * @typedef {Object} ReviewData
 * @property {Context} context
 * @property {Diagnosis} diagnosis
 * @property {Spirometry} spirometry
 * @property {Symptoms} symptoms
 * @property {Exacerbations} exacerbations
 * @property {Smoking} smoking
 * @property {Inhaler} inhaler
 * @property {Vaccinations} vaccinations
 * @property {Rehab} rehab
 * @property {SelfManagement} selfManagement
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-GOLD-GRADE-3-01
 * @property {string} section      - gold | symptom | exacerbation | abe | completeness
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
 * @property {GoldGrade} goldGrade
 * @property {Axis} symptomBurden
 * @property {Axis} exacerbationRisk
 * @property {AbeGroup} abeGroup
 * @property {ReviewStatus} reviewStatus
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.ChronicObstructivePulmonaryDiseaseReview`.
(function () {
'use strict';
window.ChronicObstructivePulmonaryDiseaseReview =
  window.ChronicObstructivePulmonaryDiseaseReview || {};

/**
 * Build a fresh, fully-blank review.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {ReviewData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      reviewedAt: '',
      reviewType: '',
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    diagnosis: {
      diagnosisYear: null,
      spirometryConfirmed: '',
      exposureNotes: ''
    },
    spirometry: {
      fev1Litres: null,
      fev1PercentPredicted: null,
      fvcLitres: null,
      fev1FvcRatio: null,
      spirometryDate: ''
    },
    symptoms: {
      mrcGrade: null,
      mmrcGrade: null,
      catScore: null
    },
    exacerbations: {
      exacerbationsLast12m: null,
      hospitalisationsLast12m: null,
      lastExacerbationDate: '',
      rescuePackCourses: null
    },
    smoking: {
      smokingStatus: '',
      packYears: null,
      cessationSupportOffered: ''
    },
    inhaler: {
      inhaledTherapy: '',
      deviceType: '',
      inhalerTechniqueChecked: '',
      inhalerTechniqueAdequate: '',
      adherence: ''
    },
    vaccinations: {
      influenzaVaccine: '',
      pneumococcalVaccine: '',
      covidVaccine: ''
    },
    rehab: {
      pulmonaryRehabStatus: '',
      oxygenUse: '',
      restingSpo2: null
    },
    selfManagement: {
      comorbidities: '',
      selfManagementPlan: '',
      rescuePackSupplied: '',
      nextReviewInterval: ''
    },
    note: {
      clinicianNote: ''
    }
  };
}

/** GOLD airflow-limitation grade label. */
function goldGradeLabel(grade) {
  switch (grade) {
    case 1: return 'GOLD 1 — mild (FEV₁ % predicted ≥ 80)';
    case 2: return 'GOLD 2 — moderate (FEV₁ % predicted 50–79)';
    case 3: return 'GOLD 3 — severe (FEV₁ % predicted 30–49)';
    case 4: return 'GOLD 4 — very severe (FEV₁ % predicted < 30)';
    default: return 'GOLD grade not assigned';
  }
}

/** Short GOLD grade label for badges / dashboards. */
function goldGradeShort(grade) {
  return (grade === null || grade === undefined) ? 'N/A' : `GOLD ${grade}`;
}

/** CSS class hint for the GOLD-grade badge (reuses the shared risk palette). */
function goldGradeClass(grade) {
  switch (grade) {
    case 1: return 'risk-low';
    case 2: return 'risk-moderate';
    case 3: return 'risk-high';
    case 4: return 'risk-high';
    default: return '';
  }
}

/** Combined ABE assessment-group label. */
function abeGroupLabel(group) {
  switch (group) {
    case 'A': return 'Group A — low symptoms, low exacerbation risk';
    case 'B': return 'Group B — high symptoms, low exacerbation risk';
    case 'E': return 'Group E — high exacerbation risk';
    default: return 'ABE group not assigned';
  }
}

/** Short ABE label for badges / dashboards. */
function abeGroupShort(group) {
  return group ? `Group ${group}` : 'N/A';
}

/** CSS class hint for the ABE-group badge. */
function abeGroupClass(group) {
  switch (group) {
    case 'A': return 'risk-low';
    case 'B': return 'risk-moderate';
    case 'E': return 'risk-high';
    default: return '';
  }
}

/** Review-completeness label. */
function reviewStatusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the review-status badge. */
function reviewStatusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Symptom / exacerbation axis label. */
function axisLabel(axis) {
  switch (axis) {
    case 'high': return 'High';
    case 'low': return 'Low';
    default: return '';
  }
}

/** CSS class hint for an axis badge. */
function axisClass(axis) {
  return axis === 'high' ? 'risk-high' : 'risk-low';
}

/** Reviewing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'GP';
    case 'practice-nurse': return 'Practice nurse';
    case 'respiratory-nurse': return 'Respiratory nurse';
    case 'pharmacist': return 'Clinical pharmacist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Review-type label. */
function reviewTypeLabel(type) {
  switch (type) {
    case 'routine-annual': return 'Routine annual';
    case 'post-exacerbation': return 'Post-exacerbation';
    case 'opportunistic': return 'Opportunistic';
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
    case '40-59': return '40-59';
    case '60-79': return '60-79';
    case '>=80': return '80 and over';
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

Object.assign(window.ChronicObstructivePulmonaryDiseaseReview, {
  emptyAssessment,
  goldGradeLabel,
  goldGradeShort,
  goldGradeClass,
  abeGroupLabel,
  abeGroupShort,
  abeGroupClass,
  reviewStatusLabel,
  reviewStatusClass,
  axisLabel,
  axisClass,
  clinicianRoleLabel,
  reviewTypeLabel,
  sexLabel,
  ageBandLabel,
  priorityLabel
});
})();
