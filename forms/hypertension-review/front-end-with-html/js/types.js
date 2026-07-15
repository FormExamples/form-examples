// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Hypertension Annual Review form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_hypertension_review.sql`. This file builds and exports
// the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers.
//
// This is NOT a numeric-score form. The engine classifies blood-pressure
// CONTROL (controlled / uncontrolled / severe-uncontrolled) against an age- and
// comorbidity-specific target, assigns a hypertension STAGE, grades REVIEW
// completeness (complete / partial / incomplete), and — independently — raises
// flags. It is a documentation and control-classification tool, not a diagnostic
// or prescribing instrument (NICE NG136).

/**
 * @typedef {'gp' | 'practice-nurse' | 'pharmacist' | 'other' | ''} ClinicianRole
 * @typedef {'18-39' | '40-59' | '60-79' | '>=80' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'white' | 'black-african-caribbean' | 'south-asian' | 'mixed' | 'other' | ''} Ethnicity
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'clinic-only' | 'hbpm' | 'abpm' | ''} MonitoringMethod
 * @typedef {'good' | 'partial' | 'poor' | ''} Adherence
 * @typedef {'never' | 'ex' | 'current' | ''} SmokingStatus
 * @typedef {'controlled' | 'uncontrolled' | 'severe-uncontrolled'} ControlClass
 * @typedef {'none' | 'stage-1' | 'stage-2' | 'stage-3-severe'} HypertensionStage
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 * @typedef {'home' | 'clinic' | 'none'} PrimarySource
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — review context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} reviewedAt      - ISO date string; '' when unset
 * @property {string} practiceSite
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {Ethnicity} ethnicity
 */

/**
 * Step 3 — diagnosis and comorbidity (blood-pressure target drivers).
 * @typedef {Object} Diagnosis
 * @property {string} diagnosisDate    - ISO date string; '' when unset
 * @property {YesNo} type2Diabetes
 * @property {YesNo} chronicKidneyDisease
 * @property {YesNo} establishedCvd
 * @property {YesNo} atrialFibrillation
 */

/**
 * Step 4 — clinic blood pressure.
 * @typedef {Object} ClinicBp
 * @property {number | null} clinicSystolic
 * @property {number | null} clinicDiastolic
 * @property {YesNo} posturalDrop
 */

/**
 * Step 5 — home / ambulatory blood pressure.
 * @typedef {Object} HomeBp
 * @property {number | null} homeSystolic
 * @property {number | null} homeDiastolic
 * @property {MonitoringMethod} monitoringMethod
 */

/**
 * Step 6 — medication and adherence.
 * @typedef {Object} Medication
 * @property {number | null} antihypertensiveAgents
 * @property {Adherence} adherence
 * @property {YesNo} sideEffects
 */

/**
 * Step 7 — cardiovascular risk.
 * @typedef {Object} CardiovascularRisk
 * @property {number | null} qriskPercent
 * @property {SmokingStatus} smokingStatus
 * @property {YesNo} statinTherapy
 */

/**
 * Step 8 — annual bloods (U&E, HbA1c, lipids).
 * @typedef {Object} Bloods
 * @property {number | null} serumCreatinine
 * @property {number | null} egfr
 * @property {number | null} serumPotassium
 * @property {number | null} hba1c
 * @property {number | null} totalCholesterol
 * @property {number | null} hdlCholesterol
 */

/**
 * Step 9 — urine albumin:creatinine ratio.
 * @typedef {Object} Urine
 * @property {number | null} urineAcr
 */

/**
 * Step 10 — lifestyle.
 * @typedef {Object} Lifestyle
 * @property {number | null} bmi
 * @property {string} lifestyleAdvice
 */

/**
 * Step 11 — complications and target-organ damage.
 * @typedef {Object} Complications
 * @property {string} complications
 */

/**
 * Step 12 — summary and plan.
 * @typedef {Object} Summary
 * @property {string} reviewContext
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Diagnosis} diagnosis
 * @property {ClinicBp} clinicBp
 * @property {HomeBp} homeBp
 * @property {Medication} medication
 * @property {CardiovascularRisk} cardiovascularRisk
 * @property {Bloods} bloods
 * @property {Urine} urine
 * @property {Lifestyle} lifestyle
 * @property {Complications} complications
 * @property {Summary} summary
 */

/**
 * A blood-pressure target pair (systolic/diastolic mmHg).
 * @typedef {Object} BpPair
 * @property {number} systolic
 * @property {number} diastolic
 */

/**
 * Selected blood-pressure target and its driving group.
 * @typedef {Object} BpTarget
 * @property {BpPair} clinic
 * @property {BpPair} home
 * @property {string} group
 */

/**
 * Bundled control status emitted by the engine.
 * @typedef {Object} ControlStatus
 * @property {ControlClass} controlClass
 * @property {BpTarget} bpTarget
 * @property {PrimarySource} primarySource
 * @property {HypertensionStage} hypertensionStage
 */

/**
 * Per-component completeness status row (review completeness table).
 * @typedef {Object} ComponentStatus
 * @property {string} component    - stable component key
 * @property {string} label        - human-readable component name
 * @property {boolean} documented  - true when the component is recorded
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - severe-hypertension | uncontrolled-bp | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {ControlStatus} controlStatus
 * @property {ReviewStatus} reviewStatus
 * @property {ComponentStatus[]} componentStatuses
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank review. Text / enum fields default to `''`;
 * numeric and date fields default to `null` / `''` as per the conventions.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      reviewedAt: '',
      practiceSite: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      ethnicity: ''
    },
    diagnosis: {
      diagnosisDate: '',
      type2Diabetes: '',
      chronicKidneyDisease: '',
      establishedCvd: '',
      atrialFibrillation: ''
    },
    clinicBp: {
      clinicSystolic: null,
      clinicDiastolic: null,
      posturalDrop: ''
    },
    homeBp: {
      homeSystolic: null,
      homeDiastolic: null,
      monitoringMethod: ''
    },
    medication: {
      antihypertensiveAgents: null,
      adherence: '',
      sideEffects: ''
    },
    cardiovascularRisk: {
      qriskPercent: null,
      smokingStatus: '',
      statinTherapy: ''
    },
    bloods: {
      serumCreatinine: null,
      egfr: null,
      serumPotassium: null,
      hba1c: null,
      totalCholesterol: null,
      hdlCholesterol: null
    },
    urine: {
      urineAcr: null
    },
    lifestyle: {
      bmi: null,
      lifestyleAdvice: ''
    },
    complications: {
      complications: ''
    },
    summary: {
      reviewContext: ''
    }
  };
}

/** Control-status label for display. */
function controlStatusLabel(controlClass) {
  switch (controlClass) {
    case 'controlled': return 'Controlled';
    case 'uncontrolled': return 'Uncontrolled';
    case 'severe-uncontrolled': return 'Severe uncontrolled';
    default: return '';
  }
}

/** CSS class hint for the control-status badge (shared risk palette). */
function controlStatusClass(controlClass) {
  switch (controlClass) {
    case 'controlled': return 'risk-low';           // green
    case 'uncontrolled': return 'risk-high';         // red
    case 'severe-uncontrolled': return 'risk-critical'; // dark red
    default: return '';
  }
}

/** Review-completeness label for display. */
function reviewStatusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the review-status badge (shared risk palette). */
function reviewStatusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';      // green
    case 'partial': return 'risk-moderate';  // amber
    case 'incomplete': return 'risk-high';   // red
    default: return '';
  }
}

/** Hypertension-stage label for display. */
function hypertensionStageLabel(stage) {
  switch (stage) {
    case 'none': return 'No stage';
    case 'stage-1': return 'Stage 1';
    case 'stage-2': return 'Stage 2';
    case 'stage-3-severe': return 'Stage 3 (severe)';
    default: return '';
  }
}

/** CSS class hint for the hypertension-stage badge (shared risk palette). */
function hypertensionStageClass(stage) {
  switch (stage) {
    case 'none': return 'risk-low';
    case 'stage-1': return 'risk-moderate';
    case 'stage-2': return 'risk-high';
    case 'stage-3-severe': return 'risk-critical';
    default: return '';
  }
}

/** Primary-source label. */
function primarySourceLabel(source) {
  switch (source) {
    case 'home': return 'Home / ambulatory';
    case 'clinic': return 'Clinic';
    case 'none': return 'No reading';
    default: return '';
  }
}

/** Reviewing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'practice-nurse': return 'Practice nurse';
    case 'pharmacist': return 'Clinical pharmacist';
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

/** CSS class hint for a flag priority (shared flag palette). */
function priorityClass(priority) {
  switch (priority) {
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

export { emptyAssessment, controlStatusLabel, controlStatusClass, reviewStatusLabel, reviewStatusClass, hypertensionStageLabel, hypertensionStageClass, primarySourceLabel, clinicianRoleLabel, priorityLabel, priorityClass };
