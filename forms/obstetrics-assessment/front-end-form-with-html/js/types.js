// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Obstetrics Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.
//
// The instrument modelled here is the NICE NG201 Antenatal Risk
// Assessment, stratifying pregnancies into Low / Moderate / High risk to
// allocate the appropriate care pathway.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'low' | 'moderate' | 'high'} RiskLevel
 */

/**
 * @typedef {Object} MaternalDemographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {number | null} ageAtBooking
 * @property {string} ethnicity
 * @property {number | null} weight
 * @property {number | null} height
 * @property {number | null} bmi
 * @property {string} occupation
 * @property {string} partnerStatus
 */

/**
 * @typedef {Object} ObstetricHistory
 * @property {number | null} gravidity
 * @property {number | null} parity
 * @property {number | null} previousMiscarriages
 * @property {number | null} previousTerminations
 * @property {number | null} previousStillbirths
 * @property {number | null} previousNeonatalDeaths
 * @property {YesNo} previousPretermBirth
 * @property {YesNo} previousPreEclampsia
 * @property {YesNo} previousGestationalDiabetes
 * @property {YesNo} previousCaesarean
 * @property {number | null} previousCaesareanCount
 * @property {YesNo} previousShoulderDystocia
 * @property {YesNo} previousPostpartumHaemorrhage
 * @property {YesNo} previousLargeBaby
 * @property {YesNo} previousSmallBaby
 * @property {YesNo} previousCongenitalAnomaly
 * @property {string} obstetricNotes
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} chronicHypertension
 * @property {YesNo} cardiacDisease
 * @property {YesNo} preExistingDiabetes
 * @property {YesNo} thyroidDisease
 * @property {YesNo} renalDisease
 * @property {YesNo} epilepsy
 * @property {YesNo} asthma
 * @property {YesNo} autoimmuneDisease
 * @property {YesNo} hivPositive
 * @property {YesNo} hepatitis
 * @property {YesNo} previousVte
 * @property {YesNo} thrombophilia
 * @property {YesNo} mentalHealthHistory
 * @property {YesNo} bariatricSurgery
 * @property {string} otherMedicalConditions
 * @property {string} currentMedications
 */

/**
 * @typedef {Object} CurrentPregnancy
 * @property {string} lastMenstrualPeriod
 * @property {string} estimatedDueDate
 * @property {string} datingScanDate
 * @property {number | null} gestationWeeks
 * @property {number | null} gestationDays
 * @property {YesNo} multiplePregnancy
 * @property {string} chorionicity
 * @property {YesNo} ivfConception
 * @property {YesNo} folicAcidPreconception
 * @property {YesNo} firstAntenatalContact
 * @property {string} bookingDate
 */

/**
 * @typedef {Object} LifestyleSocialFactors
 * @property {string} smokingStatus
 * @property {number | null} cigarettesPerDay
 * @property {string} alcoholUse
 * @property {string} substanceUse
 * @property {YesNo} domesticAbuse
 * @property {YesNo} safeguardingConcerns
 * @property {YesNo} housingInsecurity
 * @property {YesNo} financialDifficulty
 * @property {YesNo} requiresInterpreter
 * @property {string} interpreterLanguage
 * @property {YesNo} asylumOrRefugee
 * @property {YesNo} femaleGenitalMutilation
 * @property {string} socialNotes
 */

/**
 * @typedef {Object} ScreeningResults
 * @property {string} combinedTestResult
 * @property {string} combinedTestRisk
 * @property {YesNo} anomalyScanCompleted
 * @property {string} anomalyScanFindings
 * @property {string} gttResult
 * @property {number | null} gttFasting
 * @property {number | null} gttTwoHour
 * @property {string} bloodGroup
 * @property {string} rhesusStatus
 * @property {YesNo} antibodyScreenPositive
 * @property {YesNo} infectionScreenAbnormal
 * @property {string} infectionScreenDetails
 * @property {string} haemoglobin
 * @property {string} screeningNotes
 */

/**
 * @typedef {Object} MentalHealthAssessment
 * @property {YesNo} whooley1
 * @property {YesNo} whooley2
 * @property {string} gad2Q1
 * @property {string} gad2Q2
 * @property {YesNo} previousPostnatalDepression
 * @property {YesNo} previousSevereMentalIllness
 * @property {YesNo} currentlyOnPsychotropicMeds
 * @property {YesNo} selfHarmIdeation
 * @property {string} mentalHealthNotes
 */

/**
 * @typedef {Object} FetalAssessment
 * @property {number | null} fundalHeight
 * @property {string} fetalLie
 * @property {string} fetalPresentation
 * @property {YesNo} engaged
 * @property {string} fetalMovementsReported
 * @property {number | null} fetalHeartRate
 * @property {YesNo} reducedFetalMovements
 * @property {YesNo} growthConcern
 * @property {string} growthConcernDetails
 * @property {string} fetalNotes
 */

/**
 * @typedef {Object} BirthPreferences
 * @property {string} preferredBirthSetting
 * @property {string} preferredAnalgesia
 * @property {YesNo} birthPartnerPlanned
 * @property {YesNo} birthPlanCompleted
 * @property {YesNo} feedingChoiceBreast
 * @property {YesNo} feedingChoiceFormula
 * @property {YesNo} vbacRequested
 * @property {string} birthPreferenceNotes
 */

/**
 * @typedef {Object} CarePlanFollowup
 * @property {string} recommendedCarePathway
 * @property {YesNo} consultantReferralRequired
 * @property {YesNo} mentalHealthReferralRequired
 * @property {YesNo} safeguardingReferralRequired
 * @property {YesNo} aspirinProphylaxisIndicated
 * @property {YesNo} vteProphylaxisIndicated
 * @property {string} nextAppointmentDate
 * @property {string} carePlanNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {MaternalDemographics} maternalDemographics
 * @property {ObstetricHistory} obstetricHistory
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentPregnancy} currentPregnancy
 * @property {LifestyleSocialFactors} lifestyleSocialFactors
 * @property {ScreeningResults} screeningResults
 * @property {MentalHealthAssessment} mentalHealthAssessment
 * @property {FetalAssessment} fetalAssessment
 * @property {BirthPreferences} birthPreferences
 * @property {CarePlanFollowup} carePlanFollowup
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {RiskLevel} risk
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
 * @property {RiskLevel} riskLevel
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ObstetricsAssessment`.
(function () {
'use strict';
window.ObstetricsAssessment = window.ObstetricsAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    maternalDemographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      ageAtBooking: null,
      ethnicity: '',
      weight: null,
      height: null,
      bmi: null,
      occupation: '',
      partnerStatus: ''
    },
    obstetricHistory: {
      gravidity: null,
      parity: null,
      previousMiscarriages: null,
      previousTerminations: null,
      previousStillbirths: null,
      previousNeonatalDeaths: null,
      previousPretermBirth: '',
      previousPreEclampsia: '',
      previousGestationalDiabetes: '',
      previousCaesarean: '',
      previousCaesareanCount: null,
      previousShoulderDystocia: '',
      previousPostpartumHaemorrhage: '',
      previousLargeBaby: '',
      previousSmallBaby: '',
      previousCongenitalAnomaly: '',
      obstetricNotes: ''
    },
    medicalHistory: {
      chronicHypertension: '',
      cardiacDisease: '',
      preExistingDiabetes: '',
      thyroidDisease: '',
      renalDisease: '',
      epilepsy: '',
      asthma: '',
      autoimmuneDisease: '',
      hivPositive: '',
      hepatitis: '',
      previousVte: '',
      thrombophilia: '',
      mentalHealthHistory: '',
      bariatricSurgery: '',
      otherMedicalConditions: '',
      currentMedications: ''
    },
    currentPregnancy: {
      lastMenstrualPeriod: '',
      estimatedDueDate: '',
      datingScanDate: '',
      gestationWeeks: null,
      gestationDays: null,
      multiplePregnancy: '',
      chorionicity: '',
      ivfConception: '',
      folicAcidPreconception: '',
      firstAntenatalContact: '',
      bookingDate: ''
    },
    lifestyleSocialFactors: {
      smokingStatus: '',
      cigarettesPerDay: null,
      alcoholUse: '',
      substanceUse: '',
      domesticAbuse: '',
      safeguardingConcerns: '',
      housingInsecurity: '',
      financialDifficulty: '',
      requiresInterpreter: '',
      interpreterLanguage: '',
      asylumOrRefugee: '',
      femaleGenitalMutilation: '',
      socialNotes: ''
    },
    screeningResults: {
      combinedTestResult: '',
      combinedTestRisk: '',
      anomalyScanCompleted: '',
      anomalyScanFindings: '',
      gttResult: '',
      gttFasting: null,
      gttTwoHour: null,
      bloodGroup: '',
      rhesusStatus: '',
      antibodyScreenPositive: '',
      infectionScreenAbnormal: '',
      infectionScreenDetails: '',
      haemoglobin: '',
      screeningNotes: ''
    },
    mentalHealthAssessment: {
      whooley1: '',
      whooley2: '',
      gad2Q1: '',
      gad2Q2: '',
      previousPostnatalDepression: '',
      previousSevereMentalIllness: '',
      currentlyOnPsychotropicMeds: '',
      selfHarmIdeation: '',
      mentalHealthNotes: ''
    },
    fetalAssessment: {
      fundalHeight: null,
      fetalLie: '',
      fetalPresentation: '',
      engaged: '',
      fetalMovementsReported: '',
      fetalHeartRate: null,
      reducedFetalMovements: '',
      growthConcern: '',
      growthConcernDetails: '',
      fetalNotes: ''
    },
    birthPreferences: {
      preferredBirthSetting: '',
      preferredAnalgesia: '',
      birthPartnerPlanned: '',
      birthPlanCompleted: '',
      feedingChoiceBreast: '',
      feedingChoiceFormula: '',
      vbacRequested: '',
      birthPreferenceNotes: ''
    },
    carePlanFollowup: {
      recommendedCarePathway: '',
      consultantReferralRequired: '',
      mentalHealthReferralRequired: '',
      safeguardingReferralRequired: '',
      aspirinProphylaxisIndicated: '',
      vteProphylaxisIndicated: '',
      nextAppointmentDate: '',
      carePlanNotes: ''
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

/** Calculate age from date of birth (yyyy-mm-dd). Returns null if invalid. */
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 && age < 130 ? age : null;
}

/** Estimate EDD from LMP (Naegele's rule: LMP + 280 days). */
function calculateEdd(lmp) {
  if (!lmp) return '';
  const d = new Date(lmp);
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + 280);
  return d.toISOString().slice(0, 10);
}

Object.assign(window.ObstetricsAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculateAge,
  calculateEdd
});
})();
