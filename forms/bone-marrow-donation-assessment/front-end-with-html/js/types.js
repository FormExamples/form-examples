// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Bone Marrow Donation
// Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholFrequency
 * @typedef {'negative' | 'positive' | 'pending' | ''} ScreenResult
 * @typedef {'suitable' | 'conditionally-suitable' | 'unsuitable'} Eligibility
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
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
    donorRegistrationHlaTyping: {
      donorRegistry: '',
      donorRegistryId: '',
      registrationDate: '',
      donationType: '',
      recipientRelationship: '',
      hlaA: '',
      hlaB: '',
      hlaC: '',
      hlaDrb1: '',
      hlaDqb1: '',
      hlaDpb1: '',
      hlaMatchLevel: '',
      crossmatchResult: '',
      previousDonation: '',
      previousDonationDetails: ''
    },
    medicalHistory: {
      hasAutoimmuneDisease: '',
      autoimmuneDetails: '',
      hasMalignancy: '',
      malignancyDetails: '',
      hasCardiovascularDisease: '',
      cardiovascularDetails: '',
      hasRespiratoryDisease: '',
      respiratoryDetails: '',
      hasRenalDisease: '',
      renalDetails: '',
      hasHepaticDisease: '',
      hepaticDetails: '',
      hasBleedingDisorder: '',
      bleedingDisorderDetails: '',
      hasNeurologicalCondition: '',
      neurologicalDetails: '',
      currentMedications: '',
      drugAllergies: '',
      previousSurgery: '',
      surgeryDetails: ''
    },
    physicalExamination: {
      bpSystolic: null,
      bpDiastolic: null,
      heartRate: null,
      temperature: null,
      respiratoryRate: null,
      oxygenSaturation: null,
      generalAppearance: '',
      cardiovascularExamination: '',
      cardiovascularFindings: '',
      respiratoryExamination: '',
      respiratoryFindings: '',
      abdominalExamination: '',
      abdominalFindings: '',
      venousAccessAssessment: '',
      posteriorIliacCrestAssessment: ''
    },
    haematologicalAssessment: {
      haemoglobin: null,
      whiteCellCount: null,
      plateletCount: null,
      neutrophilCount: null,
      lymphocyteCount: null,
      haematocrit: null,
      mcv: null,
      bloodGroup: '',
      coagulationScreen: '',
      coagulationDetails: '',
      ferritin: null,
      creatinine: null,
      liverFunction: '',
      liverFunctionDetails: ''
    },
    infectiousDiseaseScreening: {
      hivStatus: '',
      hepatitisBSurfaceAntigen: '',
      hepatitisBCoreAntibody: '',
      hepatitisCAbntibody: '',
      htlvStatus: '',
      syphilisScreen: '',
      cmvStatus: '',
      ebvStatus: '',
      toxoplasmaStatus: '',
      tuberculosisScreen: '',
      recentTravel: '',
      travelDetails: '',
      recentInfection: '',
      infectionDetails: '',
      vaccinationUpToDate: ''
    },
    anaestheticAssessment: {
      asaGrade: '',
      previousAnaesthetic: '',
      anaestheticComplications: '',
      complicationDetails: '',
      familyAnaestheticProblems: '',
      familyProblemDetails: '',
      mallampatiScore: '',
      airwayConcerns: '',
      airwayDetails: '',
      nilByMouthConfirmed: '',
      smokingStatus: '',
      alcoholUse: '',
      anaestheticPlan: ''
    },
    collectionMethodAssessment: {
      preferredMethod: '',
      recipientPreference: '',
      finalCollectionMethod: '',
      gcsfEligible: '',
      gcsfContraindications: '',
      venousAccessSuitableForApheresis: '',
      centralLineRequired: '',
      estimatedDonorWeightKg: null,
      targetCd34Dose: null,
      estimatedCollectionDays: null,
      boneMarrowHarvestVolumeMl: null,
      autologousBloodDonation: ''
    },
    psychologicalReadiness: {
      understandsProcedure: '',
      understandsRisks: '',
      voluntaryDecision: '',
      coercionConcerns: '',
      coercionDetails: '',
      anxietyAboutProcedure: '',
      previousPsychologicalIssues: '',
      psychologicalIssueDetails: '',
      supportNetwork: '',
      timeOffWorkArranged: '',
      donorAdvocateConsulted: '',
      willingToProceed: ''
    },
    consentEligibility: {
      informedConsentGiven: '',
      consentFormSigned: '',
      consentDate: '',
      witnessName: '',
      witnessRole: '',
      informationLeafletProvided: '',
      questionsAnswered: '',
      eligibilityDecision: '',
      eligibilityConditions: '',
      deferralReason: '',
      deferralDuration: '',
      assessorName: '',
      assessorRole: '',
      assessmentDate: ''
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

/** Calculate age (years) from a date-of-birth ISO string. */
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

/** HLA match level human-readable label. */
function hlaMatchLabel(level) {
  switch (level) {
    case '10-of-10': return '10/10 (Full Match)';
    case '9-of-10': return '9/10 (Single Antigen Mismatch)';
    case '8-of-10': return '8/10 (Two Antigen Mismatch)';
    case '7-of-10': return '7/10 (Three Antigen Mismatch)';
    case 'haploidentical': return 'Haploidentical';
    default: return 'Not classified';
  }
}

/** Eligibility human-readable label. */
function eligibilityLabel(eligibility) {
  switch (eligibility) {
    case 'suitable': return 'Suitable';
    case 'conditionally-suitable': return 'Conditionally Suitable';
    case 'unsuitable': return 'Unsuitable';
    default: return '';
  }
}

/** CSS class hint for the eligibility badge. */
function eligibilityClass(eligibility) {
  switch (eligibility) {
    case 'suitable': return 'eligibility-suitable';
    case 'conditionally-suitable': return 'eligibility-conditional';
    case 'unsuitable': return 'eligibility-unsuitable';
    default: return '';
  }
}

/** Risk level human-readable label. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** CSS class hint for the risk badge. */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** Collection method human-readable label. */
function collectionMethodLabel(method) {
  switch (method) {
    case 'pbsc': return 'Peripheral Blood Stem Cells (PBSC)';
    case 'bone-marrow': return 'Bone Marrow Harvest';
    case 'either': return 'Either method';
    default: return 'Not determined';
  }
}

/** Grade label / colour helpers (used by the report rule audit table). */
function gradeLabel(grade) {
  switch (grade) {
    case 1: return 'Grade 1 - Minimal';
    case 2: return 'Grade 2 - Mild';
    case 3: return 'Grade 3 - Moderate';
    case 4: return 'Grade 4 - Severe';
    default: return `Grade ${grade}`;
  }
}

function gradeClass(grade) {
  switch (grade) {
    case 1: return 'grade-1';
    case 2: return 'grade-2';
    case 3: return 'grade-3';
    case 4: return 'grade-4';
    default: return '';
  }
}

export { emptyAssessment, calculateBMI, bmiCategory, calculateAge, hlaMatchLabel, eligibilityLabel, eligibilityClass, riskLevelLabel, riskLevelClass, collectionMethodLabel, gradeLabel, gradeClass };
