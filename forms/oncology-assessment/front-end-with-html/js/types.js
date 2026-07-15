// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Oncology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so that newly-added fields automatically default
// correctly when older saved state is rehydrated from localStorage.
//
// It also exports a handful of pure helpers (BMI, BMI category,
// Karnofsky -> ECOG mapping, ECOG label / colour class) used by the
// renderer and report.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'0' | '1' | '2' | '3' | '4' | ''} CTCAEGrade
 * @typedef {'0' | '1' | '2' | '3' | '4' | ''} ECOGString
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
 * @property {ECOGString} ecogPerformanceStatus
 */

/**
 * @typedef {Object} CancerDiagnosis
 * @property {string} cancerType
 * @property {string} cancerTypeOther
 * @property {string} primarySite
 * @property {string} histology
 * @property {string} histologyOther
 * @property {string} stageT
 * @property {string} stageN
 * @property {string} stageM
 * @property {string} overallStage
 * @property {string} grade
 * @property {string} dateOfDiagnosis
 */

/**
 * @typedef {Object} TreatmentHistory
 * @property {YesNo} previousSurgery
 * @property {string} surgeryDetails
 * @property {YesNo} previousChemotherapy
 * @property {string} chemotherapyRegimens
 * @property {YesNo} previousRadiation
 * @property {string} radiationDetails
 * @property {YesNo} previousImmunotherapy
 * @property {string} immunotherapyDetails
 * @property {YesNo} previousTargetedTherapy
 * @property {string} targetedTherapyDetails
 * @property {YesNo} clinicalTrialParticipation
 * @property {string} clinicalTrialDetails
 */

/**
 * @typedef {'complete-response' | 'partial-response' | 'stable-disease' |
 *           'progressive-disease' | 'not-yet-assessed' | ''} ResponseAssessment
 *
 * @typedef {Object} CurrentTreatment
 * @property {string} activeRegimen
 * @property {number | null} cycleNumber
 * @property {string} lastTreatmentDate
 * @property {ResponseAssessment} responseAssessment
 */

/**
 * @typedef {Object} SymptomAssessment
 * @property {number | null} painNRS
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} fatigue
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} nausea
 * @property {'normal' | 'decreased' | 'severely-decreased' | ''} appetite
 * @property {'stable' | 'gaining' | 'losing-less-5' | 'losing-5-10' | 'losing-more-10' | ''} weightChange
 * @property {number | null} esasScore
 */

/**
 * @typedef {Object} SideEffects
 * @property {CTCAEGrade} neuropathy
 * @property {string} neuropathyDetails
 * @property {CTCAEGrade} mucositis
 * @property {CTCAEGrade} skinReactions
 * @property {string} skinReactionDetails
 * @property {YesNo} myelosuppression
 * @property {YesNo} neutropenia
 * @property {YesNo} thrombocytopenia
 * @property {YesNo} anaemia
 * @property {CTCAEGrade} organToxicityGrade
 * @property {string} organToxicityDetails
 */

/**
 * @typedef {Object} LaboratoryResults
 * @property {number | null} wbc
 * @property {number | null} haemoglobin
 * @property {number | null} platelets
 * @property {number | null} neutrophils
 * @property {number | null} creatinine
 * @property {number | null} alt
 * @property {number | null} ast
 * @property {number | null} bilirubin
 * @property {number | null} albumin
 * @property {number | null} calcium
 * @property {number | null} ldh
 * @property {string} tumourMarker
 * @property {string} tumourMarkerValue
 * @property {number | null} inr
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} chemotherapyAgents
 * @property {Medication[]} antiemetics
 * @property {Medication[]} painMedications
 * @property {Medication[]} growthFactors
 * @property {Medication[]} supportiveCare
 */

/**
 * @typedef {Object} Psychosocial
 * @property {number | null} distressThermometer
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} anxiety
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} depression
 * @property {'coping-well' | 'some-difficulty' | 'significant-difficulty' | ''} copingAbility
 * @property {'strong' | 'moderate' | 'limited' | 'none' | ''} supportSystem
 * @property {YesNo} advanceCarePlanning
 * @property {string} advanceCareDetails
 */

/**
 * @typedef {Object} FunctionalNutritional
 * @property {ECOGString} ecogDetailed
 * @property {number | null} karnofskyScore
 * @property {'well-nourished' | 'at-risk' | 'malnourished' | ''} nutritionalStatus
 * @property {'stable' | 'increasing' | 'decreasing-slowly' | 'decreasing-rapidly' | ''} weightTrajectory
 * @property {'normal' | 'reduced-mildly' | 'reduced-significantly' | 'minimal' | ''} dietaryIntake
 * @property {YesNo} nutritionalSupportRequired
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {CancerDiagnosis} cancerDiagnosis
 * @property {TreatmentHistory} treatmentHistory
 * @property {CurrentTreatment} currentTreatment
 * @property {SymptomAssessment} symptomAssessment
 * @property {SideEffects} sideEffects
 * @property {LaboratoryResults} laboratoryResults
 * @property {CurrentMedications} currentMedications
 * @property {Psychosocial} psychosocial
 * @property {FunctionalNutritional} functionalNutritional
 */

/**
 * @typedef {0 | 1 | 2 | 3 | 4} ECOGGrade
 *
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {ECOGGrade} grade
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {ECOGGrade} ecogGrade
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists to `[]`.
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
      ecogPerformanceStatus: ''
    },
    cancerDiagnosis: {
      cancerType: '',
      cancerTypeOther: '',
      primarySite: '',
      histology: '',
      histologyOther: '',
      stageT: '',
      stageN: '',
      stageM: '',
      overallStage: '',
      grade: '',
      dateOfDiagnosis: ''
    },
    treatmentHistory: {
      previousSurgery: '',
      surgeryDetails: '',
      previousChemotherapy: '',
      chemotherapyRegimens: '',
      previousRadiation: '',
      radiationDetails: '',
      previousImmunotherapy: '',
      immunotherapyDetails: '',
      previousTargetedTherapy: '',
      targetedTherapyDetails: '',
      clinicalTrialParticipation: '',
      clinicalTrialDetails: ''
    },
    currentTreatment: {
      activeRegimen: '',
      cycleNumber: null,
      lastTreatmentDate: '',
      responseAssessment: ''
    },
    symptomAssessment: {
      painNRS: null,
      fatigue: '',
      nausea: '',
      appetite: '',
      weightChange: '',
      esasScore: null
    },
    sideEffects: {
      neuropathy: '',
      neuropathyDetails: '',
      mucositis: '',
      skinReactions: '',
      skinReactionDetails: '',
      myelosuppression: '',
      neutropenia: '',
      thrombocytopenia: '',
      anaemia: '',
      organToxicityGrade: '',
      organToxicityDetails: ''
    },
    laboratoryResults: {
      wbc: null,
      haemoglobin: null,
      platelets: null,
      neutrophils: null,
      creatinine: null,
      alt: null,
      ast: null,
      bilirubin: null,
      albumin: null,
      calcium: null,
      ldh: null,
      tumourMarker: '',
      tumourMarkerValue: '',
      inr: null
    },
    currentMedications: {
      chemotherapyAgents: [],
      antiemetics: [],
      painMedications: [],
      growthFactors: [],
      supportiveCare: []
    },
    psychosocial: {
      distressThermometer: null,
      anxiety: '',
      depression: '',
      copingAbility: '',
      supportSystem: '',
      advanceCarePlanning: '',
      advanceCareDetails: ''
    },
    functionalNutritional: {
      ecogDetailed: '',
      karnofskyScore: null,
      nutritionalStatus: '',
      weightTrajectory: '',
      dietaryIntake: '',
      nutritionalSupportRequired: ''
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

/** ECOG grade label. */
function ecogGradeLabel(grade) {
  switch (grade) {
    case 0: return 'ECOG 0 - Fully Active';
    case 1: return 'ECOG 1 - Restricted Strenuous Activity';
    case 2: return 'ECOG 2 - Ambulatory, Self-Care';
    case 3: return 'ECOG 3 - Limited Self-Care';
    case 4: return 'ECOG 4 - Completely Disabled';
    default: return `ECOG ${grade}`;
  }
}

/** CSS class hint for the ECOG grade badge. */
function ecogGradeClass(grade) {
  switch (grade) {
    case 0: return 'ecog-0';
    case 1: return 'ecog-1';
    case 2: return 'ecog-2';
    case 3: return 'ecog-3';
    case 4: return 'ecog-4';
    default: return '';
  }
}

/** Karnofsky score to approximate ECOG mapping. */
function karnofskyToECOG(kps) {
  if (kps === null || kps === undefined) return null;
  if (kps >= 90) return 0;
  if (kps >= 70) return 1;
  if (kps >= 50) return 2;
  if (kps >= 30) return 3;
  return 4;
}

export { emptyAssessment, calculateBMI, bmiCategory, ecogGradeLabel, ecogGradeClass, karnofskyToECOG };
