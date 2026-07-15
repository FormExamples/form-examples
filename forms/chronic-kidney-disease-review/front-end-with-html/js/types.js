// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Chronic Kidney Disease Annual
// Review form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_chronic_kidney_disease_review.sql`. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers.
//
// This is NOT a numeric-score form. The engine classifies the patient on the
// KDIGO GFR x albuminuria risk heat-map: it derives the G-stage (G1-G5) from the
// current eGFR, the albuminuria stage (A1-A3) from the urine ACR, indexes the
// pair into the KDIGO risk zone (low / moderate / high / very-high), grades
// REVIEW completeness (complete / partial / incomplete), and — independently —
// raises flags mapped to NICE NG203 referral and safety criteria. It is a
// documentation and classification tool, not a diagnostic or prescribing
// instrument (NICE NG203, KDIGO 2012/2024).

/**
 * @typedef {'gp' | 'nurse' | 'pharmacist' | 'nephrology' | 'other' | ''} ClinicianRole
 * @typedef {'general-practice' | 'long-term-conditions-clinic' | 'community-nephrology' | 'other' | ''} CareSetting
 * @typedef {'annual' | 'interval' | 'post-referral' | ''} ReviewType
 * @typedef {'18-39' | '40-59' | '60-79' | '>=80' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'none' | 'type1' | 'type2' | ''} DiabetesStatus
 * @typedef {'diabetic' | 'hypertensive' | 'glomerular' | 'polycystic' | 'obstructive' | 'unknown' | 'other' | ''} PrimaryCause
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'contraindicated' | ''} AceiArb
 * @typedef {'yes' | 'no' | 'not-indicated' | ''} Sglt2i
 * @typedef {'yes' | 'no' | 'declined' | ''} Statin
 * @typedef {'yes' | 'no' | 'not-applicable' | ''} DoseAdjusted
 * @typedef {'none' | 'monitor' | 'refer-nephrology' | 'already-under-nephrology' | ''} ReferralDecision
 * @typedef {'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null} GfrCategory
 * @typedef {'A1' | 'A2' | 'A3' | null} AlbuminuriaCategory
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | null} KdigoRiskZone
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — review context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} reviewedAt      - ISO date string; '' when unset
 * @property {CareSetting} careSetting
 * @property {ReviewType} reviewType
 */

/**
 * Step 2 — patient and diagnosis.
 * @typedef {Object} Patient
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {DiabetesStatus} diabetesStatus
 * @property {PrimaryCause} primaryCause
 * @property {number | null} monthsSinceDiagnosis
 */

/**
 * Step 3 — renal function (eGFR) and the prior value for the decline check.
 * @typedef {Object} Renal
 * @property {number | null} egfr              - current eGFR (mL/min/1.73 m^2)
 * @property {string} egfrSampleDate           - ISO date string; '' when unset
 * @property {number | null} previousEgfr
 * @property {string} previousEgfrDate         - ISO date string; '' when unset
 */

/**
 * Step 4 — albuminuria (urine ACR).
 * @typedef {Object} Albuminuria
 * @property {number | null} acr               - urine ACR (mg/mmol)
 * @property {string} acrSampleDate            - ISO date string; '' when unset
 * @property {YesNo} acrMeasured               - whether ACR measured this review
 */

/**
 * Step 5 — blood pressure.
 * @typedef {Object} BloodPressure
 * @property {number | null} systolicBloodPressure
 * @property {number | null} diastolicBloodPressure
 */

/**
 * Step 6 — medication review.
 * @typedef {Object} Medication
 * @property {AceiArb} aceiOrArbPrescribed
 * @property {Sglt2i} sglt2iPrescribed
 * @property {Statin} statinPrescribed
 * @property {YesNo} nephrotoxicDrugPresent
 * @property {DoseAdjusted} nephrotoxicDoseAdjusted
 * @property {YesNo} medicationReviewCompleted
 */

/**
 * Step 7 — metabolic bloods.
 * @typedef {Object} Bloods
 * @property {number | null} hba1c             - mmol/mol
 * @property {number | null} potassium         - mmol/L
 * @property {number | null} bicarbonate       - mmol/L
 * @property {number | null} calcium           - mmol/L
 * @property {number | null} phosphate         - mmol/L
 * @property {number | null} pth               - pmol/L
 * @property {number | null} haemoglobin       - g/L
 */

/**
 * Step 8 — referral and summary.
 * @typedef {Object} Summary
 * @property {ReferralDecision} referralDecision
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Patient} patient
 * @property {Renal} renal
 * @property {Albuminuria} albuminuria
 * @property {BloodPressure} bloodPressure
 * @property {Medication} medication
 * @property {Bloods} bloods
 * @property {Summary} summary
 */

/**
 * A blood-pressure target pair (systolic/diastolic mmHg).
 * @typedef {Object} BpTarget
 * @property {number} systolic
 * @property {number} diastolic
 */

/**
 * Per-component completeness status row (review completeness table).
 * @typedef {Object} ComponentStatus
 * @property {string} component    - stable component key
 * @property {string} label        - human-readable component name
 * @property {boolean} documented  - true when the component is recorded
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id
 * @property {string} section       - gfr-stage | albuminuria-stage | risk-zone | bp-target | completeness
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - very-high-risk-referral | egfr-referral | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {GfrCategory} gfrCategory
 * @property {AlbuminuriaCategory} albuminuriaCategory
 * @property {KdigoRiskZone} kdigoRiskZone
 * @property {BpTarget | null} bloodPressureTarget
 * @property {boolean | null} bloodPressureAtTarget
 * @property {ReviewStatus} reviewStatus
 * @property {number} completenessScore
 * @property {ComponentStatus[]} componentStatuses
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ChronicKidneyDiseaseReview`.

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
      careSetting: '',
      reviewType: ''
    },
    patient: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      diabetesStatus: '',
      primaryCause: '',
      monthsSinceDiagnosis: null
    },
    renal: {
      egfr: null,
      egfrSampleDate: '',
      previousEgfr: null,
      previousEgfrDate: ''
    },
    albuminuria: {
      acr: null,
      acrSampleDate: '',
      acrMeasured: ''
    },
    bloodPressure: {
      systolicBloodPressure: null,
      diastolicBloodPressure: null
    },
    medication: {
      aceiOrArbPrescribed: '',
      sglt2iPrescribed: '',
      statinPrescribed: '',
      nephrotoxicDrugPresent: '',
      nephrotoxicDoseAdjusted: '',
      medicationReviewCompleted: ''
    },
    bloods: {
      hba1c: null,
      potassium: null,
      bicarbonate: null,
      calcium: null,
      phosphate: null,
      pth: null,
      haemoglobin: null
    },
    summary: {
      referralDecision: '',
      clinicalNote: ''
    }
  };
}

/** G-stage label for display. */
function gfrCategoryLabel(g) {
  switch (g) {
    case 'G1': return 'G1 (normal or high)';
    case 'G2': return 'G2 (mildly decreased)';
    case 'G3a': return 'G3a (mild–moderate)';
    case 'G3b': return 'G3b (moderate–severe)';
    case 'G4': return 'G4 (severely decreased)';
    case 'G5': return 'G5 (kidney failure)';
    default: return 'Not staged';
  }
}

/** CSS class hint for the G-stage badge (shared risk palette). */
function gfrCategoryClass(g) {
  switch (g) {
    case 'G1': return 'risk-low';
    case 'G2': return 'risk-low';
    case 'G3a': return 'risk-moderate';
    case 'G3b': return 'risk-high';
    case 'G4': return 'risk-critical';
    case 'G5': return 'risk-critical';
    default: return '';
  }
}

/** Albuminuria-stage label for display. */
function albuminuriaCategoryLabel(a) {
  switch (a) {
    case 'A1': return 'A1 (normal–mild)';
    case 'A2': return 'A2 (moderate)';
    case 'A3': return 'A3 (severe)';
    default: return 'Not staged';
  }
}

/** CSS class hint for the albuminuria-stage badge (shared risk palette). */
function albuminuriaCategoryClass(a) {
  switch (a) {
    case 'A1': return 'risk-low';
    case 'A2': return 'risk-moderate';
    case 'A3': return 'risk-high';
    default: return '';
  }
}

/** KDIGO risk-zone label for display. */
function kdigoRiskZoneLabel(zone) {
  switch (zone) {
    case 'low': return 'Low risk';
    case 'moderate': return 'Moderate risk';
    case 'high': return 'High risk';
    case 'very-high': return 'Very high risk';
    default: return 'Not classified';
  }
}

/** CSS class hint for the KDIGO risk-zone badge (shared risk palette). */
function kdigoRiskZoneClass(zone) {
  switch (zone) {
    case 'low': return 'risk-low';           // green
    case 'moderate': return 'risk-moderate'; // amber
    case 'high': return 'risk-high';         // red
    case 'very-high': return 'risk-critical'; // dark red
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

/** Reviewing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'nurse': return 'Practice / advanced nurse';
    case 'pharmacist': return 'Clinical pharmacist';
    case 'nephrology': return 'Nephrology team';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Referral-decision label. */
function referralDecisionLabel(decision) {
  switch (decision) {
    case 'none': return 'No referral';
    case 'monitor': return 'Continue monitoring';
    case 'refer-nephrology': return 'Refer to nephrology';
    case 'already-under-nephrology': return 'Already under nephrology';
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

export { emptyAssessment, gfrCategoryLabel, gfrCategoryClass, albuminuriaCategoryLabel, albuminuriaCategoryClass, kdigoRiskZoneLabel, kdigoRiskZoneClass, reviewStatusLabel, reviewStatusClass, clinicianRoleLabel, referralDecisionLabel, priorityLabel, priorityClass };
