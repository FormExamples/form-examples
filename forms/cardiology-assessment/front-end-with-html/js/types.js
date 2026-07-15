// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Cardiology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage. It also exports
// utility helpers (calculateBMI, bmiCategory, calculateAge, estimateMETs,
// ccsClassLabel, nyhaClassLabel, riskLevelLabel, riskLevelClass).

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholFrequency
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
 */

/**
 * @typedef {Object} ChestPainAngina
 * @property {YesNo} chestPain
 * @property {'crushing' | 'pressure' | 'sharp' | 'burning' | 'other' | ''} painCharacter
 * @property {string} painLocation
 * @property {'left-arm' | 'jaw' | 'back' | 'none' | 'other' | ''} painRadiation
 * @property {'1' | '2' | '3' | '4' | ''} ccsClass
 * @property {'daily' | 'weekly' | 'monthly' | 'rarely' | ''} anginaFrequency
 * @property {'less-5-min' | '5-20-min' | 'greater-20-min' | ''} anginaDuration
 * @property {YesNo} unstableAngina
 */

/**
 * @typedef {Object} HeartFailureSymptoms
 * @property {YesNo} dyspnoea
 * @property {YesNo} dyspnoeaOnExertion
 * @property {YesNo} orthopnoea
 * @property {YesNo} pnd
 * @property {YesNo} peripheralOedema
 * @property {'1' | '2' | '3' | '4' | ''} nyhaClass
 */

/**
 * @typedef {Object} CardiacHistory
 * @property {YesNo} previousMI
 * @property {string} miDate
 * @property {YesNo} recentMI
 * @property {number | null} recentMIWeeks
 * @property {YesNo} pci
 * @property {string} pciDetails
 * @property {YesNo} cabg
 * @property {string} cabgDetails
 * @property {YesNo} valvularDisease
 * @property {string} valvularDetails
 * @property {YesNo} cardiomyopathy
 * @property {'dilated' | 'hypertrophic' | 'restrictive' | 'other' | ''} cardiomyopathyType
 * @property {YesNo} pericarditis
 */

/**
 * @typedef {Object} ArrhythmiaConduction
 * @property {YesNo} atrialFibrillation
 * @property {'paroxysmal' | 'persistent' | 'permanent' | ''} afType
 * @property {YesNo} otherArrhythmia
 * @property {string} otherArrhythmiaType
 * @property {YesNo} pacemaker
 * @property {'single-chamber' | 'dual-chamber' | 'biventricular' | 'icd' | ''} pacemakerType
 * @property {YesNo} syncope
 * @property {string} syncopeDetails
 * @property {YesNo} palpitations
 */

/**
 * @typedef {Object} RiskFactors
 * @property {YesNo} hypertension
 * @property {YesNo} hypertensionControlled
 * @property {YesNo} diabetes
 * @property {'type1' | 'type2' | ''} diabetesType
 * @property {YesNo} hyperlipidaemia
 * @property {YesNo} familyHistory
 * @property {string} familyHistoryDetails
 * @property {YesNo} obesity
 */

/**
 * @typedef {Object} DiagnosticResults
 * @property {string} ecgFindings
 * @property {YesNo} ecgNormal
 * @property {YesNo} echoPerformed
 * @property {number | null} echoLVEF
 * @property {string} echoFindings
 * @property {YesNo} stressTestPerformed
 * @property {'normal' | 'abnormal' | 'inconclusive' | ''} stressTestResult
 * @property {string} stressTestDetails
 * @property {YesNo} cathPerformed
 * @property {string} cathFindings
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} antiplatelets
 * @property {string} antiplateletType
 * @property {YesNo} anticoagulants
 * @property {string} anticoagulantType
 * @property {YesNo} betaBlockers
 * @property {string} betaBlockerType
 * @property {YesNo} aceInhibitorsARBs
 * @property {string} aceArbType
 * @property {YesNo} statins
 * @property {string} statinType
 * @property {YesNo} diuretics
 * @property {string} diureticType
 * @property {string} otherCardiacMeds
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} Allergies
 * @property {YesNo} drugAllergies
 * @property {Allergy[]} allergies
 * @property {YesNo} contrastAllergy
 * @property {string} contrastAllergyDetails
 */

/**
 * @typedef {Object} SocialFunctional
 * @property {SmokingStatus} smoking
 * @property {number | null} smokingPackYears
 * @property {AlcoholFrequency} alcohol
 * @property {number | null} alcoholUnitsPerWeek
 * @property {'unable' | 'light-housework' | 'climb-stairs' | 'moderate-exercise' | 'vigorous-exercise' | ''} exerciseTolerance
 * @property {number | null} estimatedMETs
 * @property {string} occupation
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChestPainAngina} chestPainAngina
 * @property {HeartFailureSymptoms} heartFailureSymptoms
 * @property {CardiacHistory} cardiacHistory
 * @property {ArrhythmiaConduction} arrhythmiaConduction
 * @property {RiskFactors} riskFactors
 * @property {DiagnosticResults} diagnosticResults
 * @property {CurrentMedications} currentMedications
 * @property {Allergies} allergies
 * @property {SocialFunctional} socialFunctional
 */

/**
 * @typedef {1 | 2 | 3 | 4} CCSClass
 * @typedef {1 | 2 | 3 | 4} NYHAClass
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {number} grade
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {CCSClass | null} ccsClass
 * @property {NYHAClass | null} nyhaClass
 * @property {RiskLevel} overallRisk
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

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
      bmi: null
    },
    chestPainAngina: {
      chestPain: '',
      painCharacter: '',
      painLocation: '',
      painRadiation: '',
      ccsClass: '',
      anginaFrequency: '',
      anginaDuration: '',
      unstableAngina: ''
    },
    heartFailureSymptoms: {
      dyspnoea: '',
      dyspnoeaOnExertion: '',
      orthopnoea: '',
      pnd: '',
      peripheralOedema: '',
      nyhaClass: ''
    },
    cardiacHistory: {
      previousMI: '',
      miDate: '',
      recentMI: '',
      recentMIWeeks: null,
      pci: '',
      pciDetails: '',
      cabg: '',
      cabgDetails: '',
      valvularDisease: '',
      valvularDetails: '',
      cardiomyopathy: '',
      cardiomyopathyType: '',
      pericarditis: ''
    },
    arrhythmiaConduction: {
      atrialFibrillation: '',
      afType: '',
      otherArrhythmia: '',
      otherArrhythmiaType: '',
      pacemaker: '',
      pacemakerType: '',
      syncope: '',
      syncopeDetails: '',
      palpitations: ''
    },
    riskFactors: {
      hypertension: '',
      hypertensionControlled: '',
      diabetes: '',
      diabetesType: '',
      hyperlipidaemia: '',
      familyHistory: '',
      familyHistoryDetails: '',
      obesity: ''
    },
    diagnosticResults: {
      ecgFindings: '',
      ecgNormal: '',
      echoPerformed: '',
      echoLVEF: null,
      echoFindings: '',
      stressTestPerformed: '',
      stressTestResult: '',
      stressTestDetails: '',
      cathPerformed: '',
      cathFindings: ''
    },
    currentMedications: {
      antiplatelets: '',
      antiplateletType: '',
      anticoagulants: '',
      anticoagulantType: '',
      betaBlockers: '',
      betaBlockerType: '',
      aceInhibitorsARBs: '',
      aceArbType: '',
      statins: '',
      statinType: '',
      diuretics: '',
      diureticType: '',
      otherCardiacMeds: ''
    },
    allergies: {
      drugAllergies: '',
      allergies: [],
      contrastAllergy: '',
      contrastAllergyDetails: ''
    },
    socialFunctional: {
      smoking: '',
      smokingPackYears: null,
      alcohol: '',
      alcoholUnitsPerWeek: null,
      exerciseTolerance: '',
      estimatedMETs: null,
      occupation: ''
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

/** Calculate age from date of birth string. */
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

/** Estimate METs from exercise-tolerance category. */
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

/** CCS Angina Classification label. */
function ccsClassLabel(ccsClass) {
  switch (ccsClass) {
    case 1: return 'CCS I - Angina only with strenuous exertion';
    case 2: return 'CCS II - Slight limitation of ordinary activity';
    case 3: return 'CCS III - Marked limitation of ordinary activity';
    case 4: return 'CCS IV - Angina at rest';
    default: return 'Not classified';
  }
}

/** NYHA Heart Failure Classification label. */
function nyhaClassLabel(nyhaClass) {
  switch (nyhaClass) {
    case 1: return 'NYHA I - No limitation';
    case 2: return 'NYHA II - Slight limitation';
    case 3: return 'NYHA III - Marked limitation';
    case 4: return 'NYHA IV - Symptoms at rest';
    default: return 'Not classified';
  }
}

/** Overall risk level label. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** CSS class hint for the risk-level badge. */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateAge, estimateMETs, ccsClassLabel, nyhaClassLabel, riskLevelLabel, riskLevelClass };
