// Plain-JavaScript / JSDoc type definitions for the Dietetic Assessment form.
//
// Builds the canonical empty `DieticAssessment` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention; the section names mirror the 16 wizard steps in ../../index.md.
//
// Convention, per the monorepo: unanswered text and enum fields are `''`;
// unanswered numeric, date, and time fields are `null`; yes/no fields are the
// strings `'yes'` / `'no'` / `''` so they round-trip to the SQL CHECK
// constraints without a boolean-to-enum translation layer.

/**
 * Build a fresh, fully-blank dietetic assessment.
 */
function emptyAssessment() {
  return {
    // Step 1 — dietitian identification
    dietitian: {
      dietitianName: '',
      role: '',
      specialty: '',
      registrationBody: '',
      registrationNumber: '',
      assessmentDate: '',
      assessmentTime: '',
      siteName: '',
      serviceName: '',
      setting: '',
      appointmentType: '',
      plannedDurationMinutes: null,
      interpreterRequired: '',
      interpreterLanguage: ''
    },
    // Step 2 — patient identification and referral
    patient: {
      firstName: '',
      lastName: '',
      birthDate: '',
      sex: '',
      nhsNumber: '',
      preferredLanguage: '',
      referralSource: '',
      referralDate: '',
      referralReason: '',
      primaryCondition: '',
      consentToRecord: '',
      accompaniedBy: ''
    },
    // Step 3 — medical history review
    history: {
      conditionDiabetes: '',
      conditionCoeliac: '',
      conditionInflammatoryBowelDisease: '',
      conditionChronicKidneyDisease: '',
      conditionLiverDisease: '',
      conditionCancer: '',
      conditionCardiovascularDisease: '',
      conditionRespiratoryDisease: '',
      conditionStroke: '',
      conditionDementia: '',
      conditionEatingDisorder: '',
      conditionOther: '',
      recentSurgery: '',
      recentSurgeryType: '',
      recentSurgeryDate: '',
      gastrointestinalSurgery: '',
      currentSymptoms: '',
      familyHistory: '',
      pregnancyStatus: ''
    },
    // Step 4 — medication and supplement check
    medication: {
      takesPrescriptionMedicines: '',
      takesOverTheCounterMedicines: '',
      takesVitaminSupplements: '',
      takesMineralSupplements: '',
      takesHerbalProducts: '',
      takesOralNutritionalSupplements: '',
      oralNutritionalSupplementDetail: '',
      enteralNutrition: '',
      enteralRoute: '',
      enteralTubeProblem: '',
      parenteralNutrition: '',
      drugNutrientInteraction: '',
      drugNutrientInteractionDetail: '',
      medicationAdherence: '',
      medicationNotes: ''
    },
    // Step 5 — anthropometry and physical measurements
    anthropometry: {
      measurementMethod: '',
      heightAsCm: null,
      weightAsKg: null,
      midUpperArmCircumferenceAsCm: null,
      calfCircumferenceAsCm: null,
      waistAsCm: null,
      usualWeightAsKg: null,
      weight3MonthsAgoAsKg: null,
      weight6MonthsAgoAsKg: null,
      weightLossIsIntentional: '',
      weightTrend: '',
      clothesOrJewelleryLooser: '',
      oedemaPresent: '',
      oedemaAdjustmentKg: null,
      ascitesPresent: '',
      amputationPresent: '',
      amputationAdjustmentPercent: null,
      anthropometryNotes: ''
    },
    // Step 6 — biochemistry and clinical monitoring
    biochemistry: {
      bloodsSampleDate: '',
      albuminGPerL: null,
      cReactiveProteinMgPerL: null,
      haemoglobinGPerL: null,
      ferritinUgPerL: null,
      vitaminB12NgPerL: null,
      folateUgPerL: null,
      vitaminDNmolPerL: null,
      hba1cMmolPerMol: null,
      sodiumMmolPerL: null,
      potassiumMmolPerL: null,
      magnesiumMmolPerL: null,
      phosphateMmolPerL: null,
      correctedCalciumMmolPerL: null,
      ureaMmolPerL: null,
      creatinineUmolPerL: null,
      egfrMlPerMin: null,
      alanineAminotransferaseUPerL: null,
      bilirubinUmolPerL: null,
      totalCholesterolMmolPerL: null,
      triglyceridesMmolPerL: null,
      biochemistryNotes: ''
    },
    // Step 7 — nutrition-focused physical examination
    physicalExam: {
      subcutaneousFatLoss: '',
      muscleWastingTemples: '',
      muscleWastingClavicles: '',
      muscleWastingQuadriceps: '',
      muscleWastingSeverity: '',
      peripheralOedemaSeverity: '',
      oralHealth: '',
      dentition: '',
      chewingAbility: '',
      tongueAndMucosa: '',
      skinCondition: '',
      hairCondition: '',
      nailCondition: '',
      pressureUlcerPresent: '',
      pressureUlcerCategory: '',
      handGripStrengthKg: null,
      physicalExamNotes: ''
    },
    // Step 8 — dietary recall
    dietaryRecall: {
      mealsPerDay: null,
      snacksPerDay: null,
      recallBreakfast: '',
      recallMidMorning: '',
      recallLunch: '',
      recallAfternoon: '',
      recallDinner: '',
      recallEvening: '',
      portionSize: '',
      appetite: '',
      appetiteScore0To10: null,
      proportionOfUsualIntakePercent: null,
      mealsOutPerWeek: null,
      takeawaysPerWeek: null,
      foodDiaryCompleted: '',
      estimatedEnergyIntakeKcal: null,
      estimatedProteinIntakeG: null,
      eatsAlone: '',
      dietaryRecallNotes: ''
    },
    // Step 9 — fluid intake and hydration
    hydration: {
      fluidIntakeMlPerDay: null,
      fluidTypes: '',
      caffeinatedDrinksPerDay: null,
      alcoholUnitsPerWeek: null,
      thickenedFluids: '',
      thickenedFluidsIddsiLevel: '',
      hydrationSigns: '',
      fluidRestriction: '',
      fluidRestrictionMlPerDay: null,
      hydrationNotes: ''
    },
    // Step 10 — preferences, allergies, and cultural requirements
    preferences: {
      hasFoodAllergy: '',
      foodAllergyDetail: '',
      allergySeverity: '',
      hasFoodIntolerance: '',
      foodsAvoided: '',
      avoidanceReason: '',
      dislikes: '',
      therapeuticDiet: '',
      dietaryPattern: '',
      religiousOrCulturalRequirement: '',
      fastingPractice: '',
      textureModifiedDiet: '',
      textureModifiedIddsiLevel: '',
      preferencesNotes: ''
    },
    // Step 11 — gastrointestinal and swallowing
    gastrointestinal: {
      appetiteChange: '',
      earlySatiety: '',
      nausea: '',
      vomiting: '',
      dysphagia: '',
      dysphagiaScreenOutcome: '',
      speechAndLanguageTherapy: '',
      reflux: '',
      abdominalPain: '',
      bloating: '',
      bowelFrequencyPerWeek: null,
      bristolStoolType: '',
      constipation: '',
      diarrhoea: '',
      stomaPresent: '',
      stomaOutputMlPerDay: null,
      malabsorptionSigns: '',
      gastrointestinalNotes: ''
    },
    // Step 12 — lifestyle and environment
    environment: {
      livingSituation: '',
      whoShops: '',
      whoCooks: '',
      cookingSkills: '',
      cookingConfidence0To10: null,
      hasCooker: '',
      hasFridge: '',
      hasFreezer: '',
      hasMicrowave: '',
      foodBudgetPerWeek: null,
      worriedFoodWouldRunOut: '',
      skippedMealsForMoney: '',
      usesFoodBank: '',
      accessToShops: '',
      hasTransport: '',
      workPattern: '',
      mealSupport: '',
      socialSupport: '',
      environmentNotes: ''
    },
    // Step 13 — physical activity and function
    activity: {
      activityLevel: '',
      exerciseType: '',
      exerciseMinutesPerWeek: null,
      sedentaryHoursPerDay: null,
      mobility: '',
      fallsInLast12Months: null,
      sarcfStrength: null,
      sarcfWalking: null,
      sarcfRisingFromChair: null,
      sarcfClimbingStairs: null,
      sarcfFalls: null,
      eatsIndependently: '',
      feedingAssistanceRequired: '',
      functionNotes: ''
    },
    // Step 14 — behavioural, psychological, and readiness to change
    behavioural: {
      motivation0To10: null,
      stageOfChange: '',
      selfEfficacy0To10: null,
      previousAttempts: '',
      barriers: '',
      scoffMakeYourselfSick: '',
      scoffLostControl: '',
      scoffLostOneStone: '',
      scoffBelieveYourselfFat: '',
      scoffFoodDominates: '',
      mood: '',
      anxiety: '',
      cognitiveImpairment: '',
      capacityConcern: '',
      safeguardingConcern: '',
      healthLiteracy: '',
      preferredLearningStyle: '',
      patientGoalInOwnWords: ''
    },
    // Step 15 — screening inputs and nutrition diagnosis
    screening: {
      acutelyIll: '',
      noNutritionalIntakeOver5Days: '',
      daysOfNegligibleIntake: null,
      nrs2002Score: null,
      energyRequirementKcal: null,
      proteinRequirementG: null,
      fluidRequirementMl: null,
      requirementEquation: '',
      pesProblem: '',
      pesEtiology: '',
      pesSignsSymptoms: ''
    },
    // Step 16 — nutrition care plan, monitoring, and sign-off
    plan: {
      interventionType: '',
      prescribedSupplement: '',
      prescribedSupplementDose: '',
      textureModificationPlan: '',
      goal1: '',
      goal2: '',
      goal3: '',
      educationProvided: '',
      resourcesGiven: '',
      monitoringIndicators: '',
      reviewIntervalWeeks: null,
      reviewDate: '',
      onwardReferral: '',
      overrideCompositeRisk: '',
      overrideReason: '',
      additionalNotes: '',
      signedByName: ''
    }
  };
}

/** Human-readable labels for the composite nutrition risk bands. */
const COMPOSITE_RISK_LABELS = {
  'low': 'Low risk',
  'moderate': 'Moderate risk',
  'high': 'High risk',
  'critical': 'Critical risk'
};

/** Human-readable labels for the MUST risk categories. */
const MUST_RISK_LABELS = {
  'low': 'Low risk (MUST 0)',
  'medium': 'Medium risk (MUST 1)',
  'high': 'High risk (MUST 2 or more)'
};

/** Human-readable labels for the GLIM malnutrition diagnosis. */
const GLIM_DIAGNOSIS_LABELS = {
  'none': 'No GLIM malnutrition diagnosis',
  'moderate': 'Moderate malnutrition (GLIM)',
  'severe': 'Severe malnutrition (GLIM)'
};

/** Human-readable labels for the overall recommendation. */
const RECOMMENDATION_LABELS = {
  'routine-care': 'Routine clinical care',
  'observe-and-rescreen': 'Observe, document intake, and rescreen',
  'dietetic-treatment-plan': 'Treat — dietetic care plan',
  'urgent-referral': 'Urgent nutrition-support referral',
  'discharge': 'Discharge from the dietetic service'
};

/** Look up a label, falling back to the raw value. */
function labelFor(table, value) {
  return table[value] || value || '';
}

export {
  emptyAssessment,
  labelFor,
  COMPOSITE_RISK_LABELS,
  MUST_RISK_LABELS,
  GLIM_DIAGNOSIS_LABELS,
  RECOMMENDATION_LABELS
};
