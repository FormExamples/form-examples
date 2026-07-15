// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Birth Control Assessment form.
//
// Builds and exports the canonical empty AssessmentData shape used by the
// wizard, plus helpers (BMI, age) shared with the grader.

/**
 * @typedef {'female' | 'male' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'current' | 'ex-smoker' | 'never' | ''} SmokingStatus
 * @typedef {'none' | 'within-guidelines' | 'above-guidelines' | ''} AlcoholConsumption
 * @typedef {1 | 2 | 3 | 4} MECCategory
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
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
 * @typedef {Object} MenstrualHistory
 * @property {number | null} menarcheAge
 * @property {'regular' | 'irregular' | 'absent' | ''} cycleRegularity
 * @property {number | null} cycleLengthDays
 * @property {number | null} periodDurationDays
 * @property {'light' | 'moderate' | 'heavy' | ''} flowHeaviness
 * @property {YesNo} intermenstrualBleeding
 * @property {YesNo} postcoitalBleeding
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} dysmenorrhoea
 * @property {string} lastMenstrualPeriod
 * @property {YesNo} amenorrhoea
 * @property {number | null} amenorrhoeaDurationMonths
 */

/**
 * @typedef {Object} ContraceptiveHistory
 * @property {YesNo} previousContraception
 * @property {YesNo} previousCOC
 * @property {string} cocDetails
 * @property {YesNo} previousPOP
 * @property {string} popDetails
 * @property {YesNo} previousImplant
 * @property {string} implantDetails
 * @property {YesNo} previousInjection
 * @property {string} injectionDetails
 * @property {YesNo} previousIUD
 * @property {string} iudDetails
 * @property {YesNo} previousIUS
 * @property {string} iusDetails
 * @property {YesNo} previousPatchRing
 * @property {string} patchRingDetails
 * @property {YesNo} previousBarrier
 * @property {string} reasonForChange
 * @property {string} adverseEffects
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} migraine
 * @property {YesNo} migraineWithAura
 * @property {'rare' | 'monthly' | 'weekly' | ''} migraineFrequency
 * @property {'current' | 'past-5-years' | 'past-over-5-years' | 'no' | ''} breastCancer
 * @property {YesNo} cervicalCancer
 * @property {'active-hepatitis' | 'cirrhosis' | 'liver-tumour' | 'no' | ''} liverDisease
 * @property {YesNo} gallbladderDisease
 * @property {YesNo} inflammatoryBowelDisease
 * @property {YesNo} sle
 * @property {YesNo} sleAntiphospholipid
 * @property {YesNo} epilepsy
 * @property {'type-1' | 'type-2' | 'gestational' | 'no' | ''} diabetes
 * @property {YesNo} diabetesComplications
 * @property {YesNo} sti
 * @property {string} stiDetails
 * @property {YesNo} pid
 */

/**
 * @typedef {Object} CardiovascularRisk
 * @property {YesNo} hypertension
 * @property {number | null} systolicBP
 * @property {number | null} diastolicBP
 * @property {YesNo} bpControlled
 * @property {YesNo} ischaemicHeartDisease
 * @property {YesNo} strokeHistory
 * @property {YesNo} valvularHeartDisease
 * @property {YesNo} valvularComplications
 * @property {YesNo} hyperlipidaemia
 * @property {YesNo} familyHistoryVTE
 * @property {YesNo} familyHistoryCVD
 * @property {string} familyCVDDetails
 */

/**
 * @typedef {Object} ThromboembolismRisk
 * @property {YesNo} previousDVT
 * @property {string} dvtDetails
 * @property {YesNo} previousPE
 * @property {string} peDetails
 * @property {YesNo} knownThrombophilia
 * @property {string} thrombophiliaType
 * @property {YesNo} immobilityRisk
 * @property {string} immobilityDetails
 * @property {YesNo} recentMajorSurgery
 * @property {string} surgeryDetails
 * @property {YesNo} longHaulTravel
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {YesNo} enzymeInducingDrugs
 * @property {string} enzymeInducingDetails
 * @property {YesNo} anticoagulants
 * @property {string} anticoagulantDetails
 * @property {YesNo} antiepileptics
 * @property {string} antiepilepticDetails
 * @property {YesNo} antiretrovirals
 * @property {string} antiretroviralDetails
 * @property {YesNo} antibiotics
 * @property {string} antibioticDetails
 * @property {YesNo} ssriSnri
 * @property {string} ssriSnriDetails
 * @property {YesNo} herbalRemedies
 * @property {string} herbalDetails
 * @property {string} otherMedications
 * @property {YesNo} drugAllergies
 * @property {string} drugAllergyDetails
 */

/**
 * @typedef {Object} LifestyleAssessment
 * @property {SmokingStatus} smoking
 * @property {number | null} cigarettesPerDay
 * @property {YesNo} ageOver35Smoker
 * @property {AlcoholConsumption} alcohol
 * @property {number | null} alcoholUnitsPerWeek
 * @property {YesNo} recreationalDrugUse
 * @property {string} recreationalDrugDetails
 * @property {'none' | 'occasional' | 'regular' | 'daily' | ''} exerciseFrequency
 * @property {YesNo} sexualActivity
 * @property {'one' | 'multiple' | ''} numberOfPartners
 */

/**
 * @typedef {Object} ContraceptivePreferences
 * @property {'coc' | 'pop' | 'implant' | 'injection' | 'iud' | 'ius' | 'patch' | 'ring' | 'barrier' | 'natural' | 'unsure' | ''} preferredMethod
 * @property {YesNo} hormonalAcceptable
 * @property {YesNo} longActingAcceptable
 * @property {YesNo} dailyPillAcceptable
 * @property {YesNo} intrauterineAcceptable
 * @property {'within-1-year' | '1-5-years' | 'no-plans' | 'completed-family' | ''} fertilityPlans
 * @property {YesNo} breastfeeding
 * @property {number | null} postpartumWeeks
 * @property {string} concerns
 */

/**
 * @typedef {Object} ClinicalRecommendation
 * @property {string} clinicalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {MenstrualHistory} menstrualHistory
 * @property {ContraceptiveHistory} contraceptiveHistory
 * @property {MedicalHistory} medicalHistory
 * @property {CardiovascularRisk} cardiovascularRisk
 * @property {ThromboembolismRisk} thromboembolismRisk
 * @property {CurrentMedications} currentMedications
 * @property {LifestyleAssessment} lifestyleAssessment
 * @property {ContraceptivePreferences} contraceptivePreferences
 * @property {ClinicalRecommendation} clinicalRecommendation
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} mecCategory
 * @property {string[]} affectedMethods
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} MethodMEC
 * @property {MECCategory} coc
 * @property {MECCategory} pop
 * @property {MECCategory} implant
 * @property {MECCategory} injection
 * @property {MECCategory} iud
 * @property {MECCategory} ius
 */

/**
 * @typedef {Object} GradingResult
 * @property {MethodMEC} methodMEC
 * @property {RiskLevel} overallRisk
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * Mirrors `createDefaultAssessment` in the SvelteKit store.
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
    menstrualHistory: {
      menarcheAge: null,
      cycleRegularity: '',
      cycleLengthDays: null,
      periodDurationDays: null,
      flowHeaviness: '',
      intermenstrualBleeding: '',
      postcoitalBleeding: '',
      dysmenorrhoea: '',
      lastMenstrualPeriod: '',
      amenorrhoea: '',
      amenorrhoeaDurationMonths: null
    },
    contraceptiveHistory: {
      previousContraception: '',
      previousCOC: '',
      cocDetails: '',
      previousPOP: '',
      popDetails: '',
      previousImplant: '',
      implantDetails: '',
      previousInjection: '',
      injectionDetails: '',
      previousIUD: '',
      iudDetails: '',
      previousIUS: '',
      iusDetails: '',
      previousPatchRing: '',
      patchRingDetails: '',
      previousBarrier: '',
      reasonForChange: '',
      adverseEffects: ''
    },
    medicalHistory: {
      migraine: '',
      migraineWithAura: '',
      migraineFrequency: '',
      breastCancer: 'no',
      cervicalCancer: '',
      liverDisease: 'no',
      gallbladderDisease: '',
      inflammatoryBowelDisease: '',
      sle: '',
      sleAntiphospholipid: '',
      epilepsy: '',
      diabetes: 'no',
      diabetesComplications: '',
      sti: '',
      stiDetails: '',
      pid: ''
    },
    cardiovascularRisk: {
      hypertension: '',
      systolicBP: null,
      diastolicBP: null,
      bpControlled: '',
      ischaemicHeartDisease: '',
      strokeHistory: '',
      valvularHeartDisease: '',
      valvularComplications: '',
      hyperlipidaemia: '',
      familyHistoryVTE: '',
      familyHistoryCVD: '',
      familyCVDDetails: ''
    },
    thromboembolismRisk: {
      previousDVT: '',
      dvtDetails: '',
      previousPE: '',
      peDetails: '',
      knownThrombophilia: '',
      thrombophiliaType: '',
      immobilityRisk: '',
      immobilityDetails: '',
      recentMajorSurgery: '',
      surgeryDetails: '',
      longHaulTravel: ''
    },
    currentMedications: {
      enzymeInducingDrugs: '',
      enzymeInducingDetails: '',
      anticoagulants: '',
      anticoagulantDetails: '',
      antiepileptics: '',
      antiepilepticDetails: '',
      antiretrovirals: '',
      antiretroviralDetails: '',
      antibiotics: '',
      antibioticDetails: '',
      ssriSnri: '',
      ssriSnriDetails: '',
      herbalRemedies: '',
      herbalDetails: '',
      otherMedications: '',
      drugAllergies: '',
      drugAllergyDetails: ''
    },
    lifestyleAssessment: {
      smoking: '',
      cigarettesPerDay: null,
      ageOver35Smoker: '',
      alcohol: '',
      alcoholUnitsPerWeek: null,
      recreationalDrugUse: '',
      recreationalDrugDetails: '',
      exerciseFrequency: '',
      sexualActivity: '',
      numberOfPartners: ''
    },
    contraceptivePreferences: {
      preferredMethod: '',
      hormonalAcceptable: '',
      longActingAcceptable: '',
      dailyPillAcceptable: '',
      intrauterineAcceptable: '',
      fertilityPlans: '',
      breastfeeding: '',
      postpartumWeeks: null,
      concerns: ''
    },
    clinicalRecommendation: {
      clinicalNotes: ''
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

/** Calculate age in whole years from a YYYY-MM-DD date string. */
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

/** UK MEC category long label. */
function mecCategoryLabel(mec) {
  switch (mec) {
    case 1: return 'MEC 1 - No restriction';
    case 2: return 'MEC 2 - Advantages outweigh risks';
    case 3: return 'MEC 3 - Risks outweigh advantages';
    case 4: return 'MEC 4 - Unacceptable health risk';
    default: return 'Not classified';
  }
}

/** UK MEC category short label. */
function mecCategoryShort(mec) {
  switch (mec) {
    case 1: return 'MEC 1';
    case 2: return 'MEC 2';
    case 3: return 'MEC 3';
    case 4: return 'MEC 4';
    default: return `MEC ${mec}`;
  }
}

/** CSS class for a MEC category badge. */
function mecCategoryClass(mec) {
  switch (mec) {
    case 1: return 'mec-1';
    case 2: return 'mec-2';
    case 3: return 'mec-3';
    case 4: return 'mec-4';
    default: return '';
  }
}

/** Risk level label. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** Risk level CSS class. */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** Display name for a contraceptive method key. */
function methodDisplayName(method) {
  const names = {
    coc: 'Combined Oral Contraception (COC)',
    pop: 'Progestogen-Only Pill (POP)',
    implant: 'Contraceptive Implant',
    injection: 'Injectable Contraception',
    iud: 'Copper IUD',
    ius: 'Hormonal IUS (Mirena)'
  };
  return names[method] || method;
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateAge, mecCategoryLabel, mecCategoryShort, mecCategoryClass, riskLevelLabel, riskLevelClass, methodDisplayName };
