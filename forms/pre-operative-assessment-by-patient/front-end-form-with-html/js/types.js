// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Pre-Operative Assessment
// (by patient) form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'severe' | ''} Severity
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'type1' | 'type2' | 'gestational' | 'none' | ''} DiabetesType
 * @typedef {'well-controlled' | 'poorly-controlled' | ''} DiabetesControl
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholFrequency
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'elective' | 'urgent' | 'emergency' | ''} ProcedureUrgency
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 * @property {string} plannedProcedure
 * @property {ProcedureUrgency} procedureUrgency
 */

/**
 * @typedef {Object} Cardiovascular
 * @property {YesNo} hypertension
 * @property {YesNo} hypertensionControlled
 * @property {YesNo} ischemicHeartDisease
 * @property {string} ihdDetails
 * @property {YesNo} heartFailure
 * @property {'1' | '2' | '3' | '4' | ''} heartFailureNYHA
 * @property {YesNo} valvularDisease
 * @property {string} valvularDetails
 * @property {YesNo} arrhythmia
 * @property {string} arrhythmiaType
 * @property {YesNo} pacemaker
 * @property {YesNo} recentMI
 * @property {number | null} recentMIWeeks
 */

/**
 * @typedef {Object} Respiratory
 * @property {YesNo} asthma
 * @property {'intermittent' | 'mild-persistent' | 'moderate-persistent' | 'severe-persistent' | ''} asthmaFrequency
 * @property {YesNo} copd
 * @property {Severity} copdSeverity
 * @property {YesNo} osa
 * @property {YesNo} osaCPAP
 * @property {SmokingStatus} smoking
 * @property {number | null} smokingPackYears
 * @property {YesNo} recentURTI
 */

/**
 * @typedef {Object} Renal
 * @property {YesNo} ckd
 * @property {'1' | '2' | '3' | '4' | '5' | ''} ckdStage
 * @property {YesNo} dialysis
 * @property {'haemodialysis' | 'peritoneal' | ''} dialysisType
 */

/**
 * @typedef {Object} Hepatic
 * @property {YesNo} liverDisease
 * @property {YesNo} cirrhosis
 * @property {'A' | 'B' | 'C' | ''} childPughScore
 * @property {YesNo} hepatitis
 * @property {string} hepatitisType
 */

/**
 * @typedef {Object} Endocrine
 * @property {DiabetesType} diabetes
 * @property {DiabetesControl} diabetesControl
 * @property {YesNo} diabetesOnInsulin
 * @property {YesNo} thyroidDisease
 * @property {'hypothyroid' | 'hyperthyroid' | ''} thyroidType
 * @property {YesNo} adrenalInsufficiency
 */

/**
 * @typedef {Object} Neurological
 * @property {YesNo} strokeOrTIA
 * @property {string} strokeDetails
 * @property {YesNo} epilepsy
 * @property {YesNo} epilepsyControlled
 * @property {YesNo} neuromuscularDisease
 * @property {string} neuromuscularDetails
 * @property {YesNo} raisedICP
 */

/**
 * @typedef {Object} Haematological
 * @property {YesNo} bleedingDisorder
 * @property {string} bleedingDetails
 * @property {YesNo} onAnticoagulants
 * @property {string} anticoagulantType
 * @property {YesNo} sickleCellDisease
 * @property {YesNo} sickleCellTrait
 * @property {YesNo} anaemia
 */

/**
 * @typedef {Object} MusculoskeletalAirway
 * @property {YesNo} rheumatoidArthritis
 * @property {YesNo} cervicalSpineIssues
 * @property {YesNo} limitedNeckMovement
 * @property {YesNo} limitedMouthOpening
 * @property {YesNo} dentalIssues
 * @property {string} dentalDetails
 * @property {YesNo} previousDifficultAirway
 * @property {'1' | '2' | '3' | '4' | ''} mallampatiScore
 */

/**
 * @typedef {Object} Gastrointestinal
 * @property {YesNo} gord
 * @property {YesNo} hiatusHernia
 * @property {YesNo} nausea
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} PreviousAnaesthesia
 * @property {YesNo} previousAnaesthesia
 * @property {YesNo} anaesthesiaProblems
 * @property {string} anaesthesiaProblemDetails
 * @property {YesNo} familyMHHistory
 * @property {string} familyMHDetails
 * @property {YesNo} ponv
 */

/**
 * @typedef {Object} SocialHistory
 * @property {AlcoholFrequency} alcohol
 * @property {number | null} alcoholUnitsPerWeek
 * @property {YesNo} recreationalDrugs
 * @property {string} drugDetails
 */

/**
 * @typedef {Object} FunctionalCapacity
 * @property {'unable' | 'light-housework' | 'climb-stairs' | 'moderate-exercise' | 'vigorous-exercise' | ''} exerciseTolerance
 * @property {number | null} estimatedMETs
 * @property {YesNo} mobilityAids
 * @property {YesNo} recentDecline
 */

/**
 * @typedef {Object} Pregnancy
 * @property {YesNo} possiblyPregnant
 * @property {YesNo} pregnancyConfirmed
 * @property {number | null} gestationWeeks
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {Cardiovascular} cardiovascular
 * @property {Respiratory} respiratory
 * @property {Renal} renal
 * @property {Hepatic} hepatic
 * @property {Endocrine} endocrine
 * @property {Neurological} neurological
 * @property {Haematological} haematological
 * @property {MusculoskeletalAirway} musculoskeletalAirway
 * @property {Gastrointestinal} gastrointestinal
 * @property {Medication[]} medications
 * @property {Allergy[]} allergies
 * @property {PreviousAnaesthesia} previousAnaesthesia
 * @property {SocialHistory} socialHistory
 * @property {FunctionalCapacity} functionalCapacity
 * @property {Pregnancy} pregnancy
 */

/**
 * @typedef {1 | 2 | 3 | 4 | 5} ASAGrade
 *
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {ASAGrade} grade
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {ASAGrade} asaGrade
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PreOperativeAssessmentByPatient`.
(function () {
'use strict';
window.PreOperativeAssessmentByPatient = window.PreOperativeAssessmentByPatient || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null,
      plannedProcedure: '',
      procedureUrgency: ''
    },
    cardiovascular: {
      hypertension: '',
      hypertensionControlled: '',
      ischemicHeartDisease: '',
      ihdDetails: '',
      heartFailure: '',
      heartFailureNYHA: '',
      valvularDisease: '',
      valvularDetails: '',
      arrhythmia: '',
      arrhythmiaType: '',
      pacemaker: '',
      recentMI: '',
      recentMIWeeks: null
    },
    respiratory: {
      asthma: '',
      asthmaFrequency: '',
      copd: '',
      copdSeverity: '',
      osa: '',
      osaCPAP: '',
      smoking: '',
      smokingPackYears: null,
      recentURTI: ''
    },
    renal: {
      ckd: '',
      ckdStage: '',
      dialysis: '',
      dialysisType: ''
    },
    hepatic: {
      liverDisease: '',
      cirrhosis: '',
      childPughScore: '',
      hepatitis: '',
      hepatitisType: ''
    },
    endocrine: {
      diabetes: '',
      diabetesControl: '',
      diabetesOnInsulin: '',
      thyroidDisease: '',
      thyroidType: '',
      adrenalInsufficiency: ''
    },
    neurological: {
      strokeOrTIA: '',
      strokeDetails: '',
      epilepsy: '',
      epilepsyControlled: '',
      neuromuscularDisease: '',
      neuromuscularDetails: '',
      raisedICP: ''
    },
    haematological: {
      bleedingDisorder: '',
      bleedingDetails: '',
      onAnticoagulants: '',
      anticoagulantType: '',
      sickleCellDisease: '',
      sickleCellTrait: '',
      anaemia: ''
    },
    musculoskeletalAirway: {
      rheumatoidArthritis: '',
      cervicalSpineIssues: '',
      limitedNeckMovement: '',
      limitedMouthOpening: '',
      dentalIssues: '',
      dentalDetails: '',
      previousDifficultAirway: '',
      mallampatiScore: ''
    },
    gastrointestinal: {
      gord: '',
      hiatusHernia: '',
      nausea: ''
    },
    medications: [],
    allergies: [],
    previousAnaesthesia: {
      previousAnaesthesia: '',
      anaesthesiaProblems: '',
      anaesthesiaProblemDetails: '',
      familyMHHistory: '',
      familyMHDetails: '',
      ponv: ''
    },
    socialHistory: {
      alcohol: '',
      alcoholUnitsPerWeek: null,
      recreationalDrugs: '',
      drugDetails: ''
    },
    functionalCapacity: {
      exerciseTolerance: '',
      estimatedMETs: null,
      mobilityAids: '',
      recentDecline: ''
    },
    pregnancy: {
      possiblyPregnant: '',
      pregnancyConfirmed: '',
      gestationWeeks: null
    }
  };
}

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Estimate METs from exercise tolerance category. */
function estimateMETs(tolerance) {
  switch (tolerance) {
    case 'unable': return 1;
    case 'light-housework': return 2;
    case 'climb-stairs': return 4;
    case 'moderate-exercise': return 7;
    case 'vigorous-exercise': return 10;
    default: return null;
  }
}

/** Calculate age (years) from date-of-birth string. Returns null if invalid. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** ASA grade label. */
function asaGradeLabel(grade) {
  switch (grade) {
    case 1: return 'ASA I - Healthy';
    case 2: return 'ASA II - Mild Systemic Disease';
    case 3: return 'ASA III - Severe Systemic Disease';
    case 4: return 'ASA IV - Life-Threatening Disease';
    case 5: return 'ASA V - Moribund';
    default: return `ASA ${grade}`;
  }
}

/** ASA grade CSS class hint for the badge. */
function asaGradeClass(grade) {
  switch (grade) {
    case 1: return 'grade-1';
    case 2: return 'grade-2';
    case 3: return 'grade-3';
    case 4: return 'grade-4';
    case 5: return 'grade-5';
    default: return '';
  }
}

Object.assign(window.PreOperativeAssessmentByPatient, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  estimateMETs,
  calculateAge,
  asaGradeLabel,
  asaGradeClass
});
})();
