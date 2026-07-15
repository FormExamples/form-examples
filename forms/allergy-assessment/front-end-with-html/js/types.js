// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Allergy Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'severe' | 'anaphylaxis' | ''} AllergyReactionSeverity
 * @typedef {'mild' | 'moderate' | 'severe' | ''} SeverityLevel
 * @typedef {'perennial' | 'spring' | 'summer' | 'autumn' | 'winter' | 'multiple' | ''} SeasonalPattern
 * @typedef {'IgE-mediated' | 'non-IgE-mediated' | 'mixed' | 'unknown' | ''} IgEType
 * @typedef {'in-place' | 'not-in-place' | 'needs-update' | ''} ActionPlanStatus
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {string} nhsNumber
 * @property {Sex} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 */

/**
 * @typedef {Object} AllergyHistory
 * @property {number | null} ageOfOnset
 * @property {string} knownAllergens
 * @property {YesNo} familyHistoryOfAtopy
 * @property {string} familyAtopyDetails
 * @property {YesNo} familyHistoryOfAllergy
 * @property {string} familyAllergyDetails
 */

/**
 * @typedef {Object} AllergyItem
 * @property {string} allergen
 * @property {string} reactionType
 * @property {AllergyReactionSeverity} severity
 * @property {string} timing
 * @property {string} alternativesTolerated
 */

/**
 * @typedef {Object} DrugAllergies
 * @property {YesNo} hasDrugAllergies
 * @property {AllergyItem[]} drugAllergies
 * @property {string} crossReactivityConcerns
 */

/**
 * @typedef {Object} FoodAllergies
 * @property {YesNo} hasFoodAllergies
 * @property {AllergyItem[]} foodAllergies
 * @property {IgEType} igeType
 * @property {YesNo} oralAllergySyndrome
 * @property {string} dietaryRestrictions
 */

/**
 * @typedef {Object} EnvironmentalAllergies
 * @property {YesNo} pollenAllergy
 * @property {YesNo} dustMiteAllergy
 * @property {YesNo} mouldAllergy
 * @property {YesNo} animalDanderAllergy
 * @property {YesNo} latexAllergy
 * @property {YesNo} insectStingAllergy
 * @property {AllergyReactionSeverity} insectStingSeverity
 * @property {SeasonalPattern} seasonalPattern
 * @property {string} otherEnvironmentalAllergens
 */

/**
 * @typedef {Object} AnaphylaxisEpisode
 * @property {string} trigger
 * @property {string} symptoms
 * @property {string} treatmentRequired
 */

/**
 * @typedef {Object} AnaphylaxisHistory
 * @property {YesNo} hasAnaphylaxisHistory
 * @property {number | null} numberOfEpisodes
 * @property {AnaphylaxisEpisode[]} episodes
 * @property {YesNo} adrenalineAutoInjectorPrescribed
 * @property {YesNo} actionPlanInPlace
 */

/**
 * @typedef {Object} TestResult
 * @property {string} testType
 * @property {string} allergen
 * @property {string} result
 */

/**
 * @typedef {Object} TestingResults
 * @property {YesNo} skinPrickTestsDone
 * @property {YesNo} specificIgEDone
 * @property {YesNo} componentResolvedDiagnosticsDone
 * @property {YesNo} challengeTestsDone
 * @property {YesNo} patchTestsDone
 * @property {TestResult[]} testResults
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentManagement
 * @property {YesNo} antihistamines
 * @property {string} antihistamineDetails
 * @property {YesNo} nasalSteroids
 * @property {YesNo} adrenalineAutoInjector
 * @property {YesNo} immunotherapy
 * @property {string} immunotherapyDetails
 * @property {YesNo} biologics
 * @property {string} biologicDetails
 * @property {string} allergenAvoidanceStrategies
 * @property {Medication[]} otherMedications
 */

/**
 * @typedef {Object} Comorbidities
 * @property {YesNo} asthma
 * @property {SeverityLevel} asthmaSeverity
 * @property {YesNo} eczema
 * @property {SeverityLevel} eczemaSeverity
 * @property {YesNo} rhinitis
 * @property {SeverityLevel} rhinitisSeverity
 * @property {YesNo} eosinophilicOesophagitis
 * @property {YesNo} mastCellDisorders
 * @property {string} mastCellDetails
 * @property {YesNo} mentalHealthImpact
 * @property {string} mentalHealthDetails
 */

/**
 * @typedef {Object} ImpactActionPlan
 * @property {number | null} qualityOfLifeScore
 * @property {YesNo} schoolWorkImpact
 * @property {string} schoolWorkImpactDetails
 * @property {ActionPlanStatus} emergencyActionPlanStatus
 * @property {YesNo} trainingProvided
 * @property {string} trainingDetails
 * @property {string} followUpSchedule
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {AllergyHistory} allergyHistory
 * @property {DrugAllergies} drugAllergies
 * @property {FoodAllergies} foodAllergies
 * @property {EnvironmentalAllergies} environmentalAllergies
 * @property {AnaphylaxisHistory} anaphylaxisHistory
 * @property {TestingResults} testingResults
 * @property {CurrentManagement} currentManagement
 * @property {Comorbidities} comorbidities
 * @property {ImpactActionPlan} impactActionPlan
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {SeverityLevel} severityLevel
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
 * @property {SeverityLevel} severityLevel
 * @property {number} allergyBurdenScore
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
      nhsNumber: '',
      sex: '',
      weight: null,
      height: null,
      bmi: null
    },
    allergyHistory: {
      ageOfOnset: null,
      knownAllergens: '',
      familyHistoryOfAtopy: '',
      familyAtopyDetails: '',
      familyHistoryOfAllergy: '',
      familyAllergyDetails: ''
    },
    drugAllergies: {
      hasDrugAllergies: '',
      drugAllergies: [],
      crossReactivityConcerns: ''
    },
    foodAllergies: {
      hasFoodAllergies: '',
      foodAllergies: [],
      igeType: '',
      oralAllergySyndrome: '',
      dietaryRestrictions: ''
    },
    environmentalAllergies: {
      pollenAllergy: '',
      dustMiteAllergy: '',
      mouldAllergy: '',
      animalDanderAllergy: '',
      latexAllergy: '',
      insectStingAllergy: '',
      insectStingSeverity: '',
      seasonalPattern: '',
      otherEnvironmentalAllergens: ''
    },
    anaphylaxisHistory: {
      hasAnaphylaxisHistory: '',
      numberOfEpisodes: null,
      episodes: [],
      adrenalineAutoInjectorPrescribed: '',
      actionPlanInPlace: ''
    },
    testingResults: {
      skinPrickTestsDone: '',
      specificIgEDone: '',
      componentResolvedDiagnosticsDone: '',
      challengeTestsDone: '',
      patchTestsDone: '',
      testResults: []
    },
    currentManagement: {
      antihistamines: '',
      antihistamineDetails: '',
      nasalSteroids: '',
      adrenalineAutoInjector: '',
      immunotherapy: '',
      immunotherapyDetails: '',
      biologics: '',
      biologicDetails: '',
      allergenAvoidanceStrategies: '',
      otherMedications: []
    },
    comorbidities: {
      asthma: '',
      asthmaSeverity: '',
      eczema: '',
      eczemaSeverity: '',
      rhinitis: '',
      rhinitisSeverity: '',
      eosinophilicOesophagitis: '',
      mastCellDisorders: '',
      mastCellDetails: '',
      mentalHealthImpact: '',
      mentalHealthDetails: ''
    },
    impactActionPlan: {
      qualityOfLifeScore: null,
      schoolWorkImpact: '',
      schoolWorkImpactDetails: '',
      emergencyActionPlanStatus: '',
      trainingProvided: '',
      trainingDetails: '',
      followUpSchedule: ''
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

/** Numeric weight for an allergy reaction severity. */
function severityWeight(severity) {
  switch (severity) {
    case 'mild': return 1;
    case 'moderate': return 2;
    case 'severe': return 3;
    case 'anaphylaxis': return 4;
    default: return 0;
  }
}

/** Calculate Allergy Burden Score: count of confirmed allergies weighted by severity. */
function calculateAllergyBurdenScore(data) {
  let score = 0;

  for (const item of data.drugAllergies.drugAllergies) {
    if (item.allergen) {
      score += severityWeight(item.severity) || 1;
    }
  }

  for (const item of data.foodAllergies.foodAllergies) {
    if (item.allergen) {
      score += severityWeight(item.severity) || 1;
    }
  }

  const env = data.environmentalAllergies;
  if (env.pollenAllergy === 'yes') score += 1;
  if (env.dustMiteAllergy === 'yes') score += 1;
  if (env.mouldAllergy === 'yes') score += 1;
  if (env.animalDanderAllergy === 'yes') score += 1;
  if (env.latexAllergy === 'yes') score += 2;
  if (env.insectStingAllergy === 'yes') {
    score += severityWeight(env.insectStingSeverity) || 1;
  }

  return score;
}

/** Count total confirmed allergens across all categories. */
function countAllergens(data) {
  let count = 0;
  count += data.drugAllergies.drugAllergies.filter((a) => a.allergen).length;
  count += data.foodAllergies.foodAllergies.filter((a) => a.allergen).length;
  const env = data.environmentalAllergies;
  if (env.pollenAllergy === 'yes') count++;
  if (env.dustMiteAllergy === 'yes') count++;
  if (env.mouldAllergy === 'yes') count++;
  if (env.animalDanderAllergy === 'yes') count++;
  if (env.latexAllergy === 'yes') count++;
  if (env.insectStingAllergy === 'yes') count++;
  return count;
}

/** Severity level human label. */
function severityLabel(level) {
  switch (level) {
    case 'mild': return 'Mild — Localised reactions only';
    case 'moderate': return 'Moderate — Systemic, non-life-threatening';
    case 'severe': return 'Severe — Anaphylaxis risk';
    default: return '';
  }
}

/** Severity level CSS class hint. */
function severityClass(level) {
  switch (level) {
    case 'mild': return 'severity-mild';
    case 'moderate': return 'severity-moderate';
    case 'severe': return 'severity-severe';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, severityWeight, calculateAllergyBurdenScore, countAllergens, severityLabel, severityClass };
