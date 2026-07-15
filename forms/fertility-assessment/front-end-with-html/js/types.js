// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Fertility Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape
// used by the wizard, so newly-added fields default correctly when older
// saved state is rehydrated from localStorage.

/**
 * @typedef {'female' | 'male' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'regular' | 'irregular' | 'absent' | ''} CycleRegularity
 * @typedef {'low' | 'moderate' | 'high' | ''} ConcernLevel
 * @typedef {'never' | 'former' | 'current' | ''} TobaccoStatus
 * @typedef {'none' | 'low' | 'moderate' | 'heavy' | ''} AlcoholLevel
 * @typedef {'low' | 'moderate' | 'high' | ''} CaffeineLevel
 * @typedef {'continue-attempts' | 'lifestyle-optimisation' | 'targeted-treatment' | 'specialist-referral' | 'art-referral' | ''} Recommendation
 */

// Publishes to window.FertilityAssessment.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 */
function emptyAssessment() {
  return {
    demographics: {
      patientFirstName: '',
      patientLastName: '',
      patientDateOfBirth: '',
      patientSex: '',
      partnerFirstName: '',
      partnerLastName: '',
      partnerDateOfBirth: '',
      partnerSex: '',
      relationshipDuration: null,
      ethnicity: ''
    },
    reproductiveHistory: {
      durationTryingMonths: null,
      priorPregnancies: null,
      priorLiveBirths: null,
      priorMiscarriages: null,
      priorEctopic: null,
      priorTerminations: null,
      priorFertilityTreatment: '',
      priorTreatmentDetails: '',
      contraceptionStopped: '',
      contraceptionStoppedDate: ''
    },
    menstrualCycle: {
      menarcheAge: null,
      cycleLengthDays: null,
      cycleRegularity: '',
      periodDurationDays: null,
      heavyBleeding: '',
      dysmenorrhoea: '',
      intermenstrualBleeding: '',
      lastMenstrualPeriod: '',
      cycleNotes: ''
    },
    medicalSurgicalHistory: {
      pelvicInflammatoryDisease: '',
      endometriosis: '',
      polycysticOvarySyndrome: '',
      fibroids: '',
      thyroidDisorder: '',
      diabetes: '',
      cancerHistory: '',
      cancerTreatmentDetails: '',
      pelvicSurgery: '',
      pelvicSurgeryDetails: '',
      sexuallyTransmittedInfections: '',
      stiDetails: '',
      otherConditions: ''
    },
    lifestyleFactors: {
      weight: null,
      height: null,
      bmi: null,
      tobaccoStatus: '',
      cigarettesPerDay: null,
      alcoholLevel: '',
      alcoholUnitsPerWeek: null,
      caffeineLevel: '',
      recreationalDrugs: '',
      recreationalDrugDetails: '',
      exerciseFrequency: '',
      occupationalHazards: '',
      occupationalHazardDetails: ''
    },
    medicationsSupplements: {
      currentMedications: [],
      folicAcid: '',
      folicAcidDoseMcg: null,
      vitaminD: '',
      otherSupplements: ''
    },
    partnerSemen: {
      partnerAgeYears: null,
      partnerSmoking: '',
      partnerAlcohol: '',
      partnerOccupationalHazards: '',
      partnerMedicalHistory: '',
      semenAnalysisDone: '',
      semenAnalysisDate: '',
      semenVolumeMl: null,
      semenConcentrationMillionPerMl: null,
      semenTotalMotilityPercent: null,
      semenProgressiveMotilityPercent: null,
      semenNormalMorphologyPercent: null,
      semenNotes: ''
    },
    hormoneProfile: {
      fsh: null,
      lh: null,
      amh: null,
      oestradiol: null,
      tsh: null,
      prolactin: null,
      testosterone: null,
      progesteroneDay21: null,
      hormoneTestDate: '',
      hormoneNotes: ''
    },
    investigations: {
      transvaginalUltrasound: '',
      antralFollicleCount: null,
      hysterosalpingogramDone: '',
      hysterosalpingogramResult: '',
      hysteroscopyDone: '',
      hysteroscopyResult: '',
      laparoscopyDone: '',
      laparoscopyResult: '',
      otherInvestigations: ''
    },
    clinicalRecommendation: {
      clinicianName: '',
      assessmentDate: '',
      recommendation: '',
      referralUrgency: '',
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

/** BMI category. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Age in whole years from a YYYY-MM-DD date-of-birth string. */
function ageInYears(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

/** Concern level label. */
function concernLevelLabel(level) {
  switch (level) {
    case 'low': return 'Low concern';
    case 'moderate': return 'Moderate concern';
    case 'high': return 'High concern';
    default: return '';
  }
}

/** CSS class hint for the concern level badge. */
function concernLevelClass(level) {
  switch (level) {
    case 'low': return 'concern-low';
    case 'moderate': return 'concern-moderate';
    case 'high': return 'concern-high';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, ageInYears, concernLevelLabel, concernLevelClass };
