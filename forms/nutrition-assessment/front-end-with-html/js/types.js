// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Nutrition Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} ethnicity
 * @property {string} primaryLanguage
 */

/**
 * @typedef {Object} AnthropometricMeasurements
 * @property {number | null} weightKg          - Current weight in kg
 * @property {number | null} heightCm          - Height in cm
 * @property {number | null} bmi               - Auto-calculated BMI
 * @property {number | null} usualWeightKg     - Usual stable weight
 * @property {number | null} weightLossKg      - Unplanned weight loss in kg over 3-6 months
 * @property {number | null} weightLossPercent - Auto-calculated % loss vs usual weight
 * @property {number | null} midUpperArmCircumferenceCm
 * @property {number | null} tricepsSkinfoldMm
 * @property {string} measurementDate
 */

/**
 * @typedef {Object} DietaryHistory
 * @property {string} typicalDiet              - General description of usual diet
 * @property {string} dietPattern              - 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'other' | ''
 * @property {string} dietPatternOther
 * @property {number | null} mealsPerDay
 * @property {number | null} snacksPerDay
 * @property {YesNo} appetiteDecreased
 * @property {string} appetiteChangeNotes
 * @property {YesNo} foodIntakeReduced
 * @property {number | null} reducedIntakeDays
 * @property {YesNo} fluidIntakeAdequate
 * @property {number | null} fluidIntakeMlPerDay
 * @property {YesNo} alcoholUse
 * @property {number | null} alcoholUnitsPerWeek
 * @property {YesNo} culturalReligiousRestrictions
 * @property {string} culturalReligiousDetails
 */

/**
 * @typedef {Object} NutritionalScreening
 * @property {'>=20' | '18.5-20' | '<18.5' | ''} bmiCategory       - MUST step 1 selection
 * @property {'<5' | '5-10' | '>10' | ''} weightLossCategory       - MUST step 2 selection
 * @property {'none' | 'acutely-ill-no-intake-5d' | ''} acuteDisease - MUST step 3 selection
 * @property {YesNo} unintentionalWeightLoss
 * @property {YesNo} reducedAppetite7Days
 * @property {string} additionalScreeningNotes
 */

/**
 * @typedef {Object} SwallowingOralHealth
 * @property {YesNo} swallowingDifficulty
 * @property {YesNo} coughingWhileEating
 * @property {YesNo} chokingEpisodes
 * @property {YesNo} dentureUse
 * @property {YesNo} denturesFitWell
 * @property {YesNo} dentalPain
 * @property {YesNo} mouthSores
 * @property {YesNo} dryMouth
 * @property {YesNo} tasteChanges
 * @property {string} swallowingNotes
 */

/**
 * @typedef {Object} GastrointestinalFunction
 * @property {YesNo} nausea
 * @property {YesNo} vomiting
 * @property {YesNo} diarrhea
 * @property {YesNo} constipation
 * @property {YesNo} abdominalPain
 * @property {YesNo} bloating
 * @property {YesNo} reflux
 * @property {YesNo} earlysatiety
 * @property {string} bowelHabitNotes
 */

/**
 * @typedef {Object} FoodAllergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} FoodAllergiesIntolerances
 * @property {FoodAllergy[]} foodAllergies
 * @property {string[]} foodIntolerances
 * @property {YesNo} lactoseIntolerance
 * @property {YesNo} glutenIntolerance
 * @property {YesNo} allergyTestingDone
 * @property {string} allergyTestResults
 */

/**
 * @typedef {Object} NutritionalRequirements
 * @property {number | null} estimatedEnergyKcal
 * @property {number | null} estimatedProteinG
 * @property {number | null} estimatedFluidMl
 * @property {string} requirementsBasis
 * @property {YesNo} increasedRequirements
 * @property {string} increasedRequirementsReason
 */

/**
 * @typedef {Object} Supplement
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentNutritionalSupport
 * @property {YesNo} oralSupplements
 * @property {Supplement[]} oralSupplementList
 * @property {YesNo} enteralFeeding
 * @property {string} enteralRoute
 * @property {string} enteralFormula
 * @property {YesNo} parenteralNutrition
 * @property {string} parenteralDetails
 * @property {YesNo} vitaminMineralSupplements
 * @property {Supplement[]} vitaminMineralList
 * @property {YesNo} dieticianInvolvement
 * @property {string} lastDieticianReviewDate
 */

/**
 * @typedef {Object} CarePlanMonitoring
 * @property {string} nutritionGoals
 * @property {string} interventionsPlanned
 * @property {YesNo} weightMonitoringPlanned
 * @property {string} weightMonitoringFrequency
 * @property {YesNo} foodIntakeMonitoringPlanned
 * @property {YesNo} referralRequired
 * @property {string} referralDetails
 * @property {string} followUpDate
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {AnthropometricMeasurements} anthropometricMeasurements
 * @property {DietaryHistory} dietaryHistory
 * @property {NutritionalScreening} nutritionalScreening
 * @property {SwallowingOralHealth} swallowingOralHealth
 * @property {GastrointestinalFunction} gastrointestinalFunction
 * @property {FoodAllergiesIntolerances} foodAllergiesIntolerances
 * @property {NutritionalRequirements} nutritionalRequirements
 * @property {CurrentNutritionalSupport} currentNutritionalSupport
 * @property {CarePlanMonitoring} carePlanMonitoring
 */

/**
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} SeverityLevel
 * @typedef {'low' | 'medium' | 'high'} MUSTRisk
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} score
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
 * @property {number} mustScore
 * @property {MUSTRisk} mustRisk
 * @property {SeverityLevel} severity
 * @property {number} answeredCount
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
      ethnicity: '',
      primaryLanguage: ''
    },
    anthropometricMeasurements: {
      weightKg: null,
      heightCm: null,
      bmi: null,
      usualWeightKg: null,
      weightLossKg: null,
      weightLossPercent: null,
      midUpperArmCircumferenceCm: null,
      tricepsSkinfoldMm: null,
      measurementDate: ''
    },
    dietaryHistory: {
      typicalDiet: '',
      dietPattern: '',
      dietPatternOther: '',
      mealsPerDay: null,
      snacksPerDay: null,
      appetiteDecreased: '',
      appetiteChangeNotes: '',
      foodIntakeReduced: '',
      reducedIntakeDays: null,
      fluidIntakeAdequate: '',
      fluidIntakeMlPerDay: null,
      alcoholUse: '',
      alcoholUnitsPerWeek: null,
      culturalReligiousRestrictions: '',
      culturalReligiousDetails: ''
    },
    nutritionalScreening: {
      bmiCategory: '',
      weightLossCategory: '',
      acuteDisease: '',
      unintentionalWeightLoss: '',
      reducedAppetite7Days: '',
      additionalScreeningNotes: ''
    },
    swallowingOralHealth: {
      swallowingDifficulty: '',
      coughingWhileEating: '',
      chokingEpisodes: '',
      dentureUse: '',
      denturesFitWell: '',
      dentalPain: '',
      mouthSores: '',
      dryMouth: '',
      tasteChanges: '',
      swallowingNotes: ''
    },
    gastrointestinalFunction: {
      nausea: '',
      vomiting: '',
      diarrhea: '',
      constipation: '',
      abdominalPain: '',
      bloating: '',
      reflux: '',
      earlysatiety: '',
      bowelHabitNotes: ''
    },
    foodAllergiesIntolerances: {
      foodAllergies: [],
      foodIntolerances: [],
      lactoseIntolerance: '',
      glutenIntolerance: '',
      allergyTestingDone: '',
      allergyTestResults: ''
    },
    nutritionalRequirements: {
      estimatedEnergyKcal: null,
      estimatedProteinG: null,
      estimatedFluidMl: null,
      requirementsBasis: '',
      increasedRequirements: '',
      increasedRequirementsReason: ''
    },
    currentNutritionalSupport: {
      oralSupplements: '',
      oralSupplementList: [],
      enteralFeeding: '',
      enteralRoute: '',
      enteralFormula: '',
      parenteralNutrition: '',
      parenteralDetails: '',
      vitaminMineralSupplements: '',
      vitaminMineralList: [],
      dieticianInvolvement: '',
      lastDieticianReviewDate: ''
    },
    carePlanMonitoring: {
      nutritionGoals: '',
      interventionsPlanned: '',
      weightMonitoringPlanned: '',
      weightMonitoringFrequency: '',
      foodIntakeMonitoringPlanned: '',
      referralRequired: '',
      referralDetails: '',
      followUpDate: '',
      additionalNotes: ''
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

/**
 * Calculate unplanned weight loss as a percentage of usual weight.
 * Returns null if either value is missing or invalid. Rounded to 1 decimal.
 */
function calculateWeightLossPercent(weightLossKg, usualWeightKg) {
  if (
    weightLossKg === null || weightLossKg === undefined ||
    usualWeightKg === null || usualWeightKg === undefined ||
    usualWeightKg <= 0
  ) return null;
  return Math.round((weightLossKg / usualWeightKg) * 1000) / 10;
}

/** Suggest a MUST BMI category from a numeric BMI. */
function suggestBmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi > 20) return '>=20';
  if (bmi >= 18.5) return '18.5-20';
  return '<18.5';
}

/** Suggest a MUST weight-loss category from a percentage. */
function suggestWeightLossCategory(pct) {
  if (pct === null || pct === undefined) return '';
  if (pct < 5) return '<5';
  if (pct <= 10) return '5-10';
  return '>10';
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateWeightLossPercent, suggestBmiCategory, suggestWeightLossCategory };
