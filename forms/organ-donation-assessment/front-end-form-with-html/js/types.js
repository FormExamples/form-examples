// Plain-JavaScript / JSDoc type definitions for the Organ Donation
// Assessment form's data model.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'living' | 'deceased' | ''} DonorType
 * @typedef {'negative' | 'positive' | 'pending' | ''} ScreenResult
 * @typedef {'compatible' | 'incompatible' | 'pending' | ''} CompatibilityResult
 * @typedef {'normal' | 'abnormal' | 'pending' | ''} NormalAbnormal
 * @typedef {'suitable' | 'conditionally-suitable' | 'unsuitable'} Eligibility
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
 * @property {string} ethnicity
 */

/**
 * @typedef {Object} DonorTypeRegistration
 * @property {DonorType} donorType
 * @property {YesNo} registeredOnDonorRegister
 * @property {string} registryName
 * @property {string} registrationDate
 * @property {string} recipientRelationship  // e.g. spouse, sibling, parent, child, friend, altruistic, unrelated, n/a
 * @property {string} recipientName
 * @property {YesNo} previousDonation
 * @property {string} previousDonationDetails
 * @property {string} intendedOrgans  // free text or comma-separated
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {YesNo} hasMalignancy
 * @property {string} malignancyDetails
 * @property {YesNo} hasCnsMalignancy
 * @property {YesNo} hasAutoimmuneDisease
 * @property {string} autoimmuneDetails
 * @property {YesNo} hasDiabetes
 * @property {string} diabetesDetails
 * @property {YesNo} hasHypertension
 * @property {string} hypertensionDetails
 * @property {YesNo} hasCardiovascularDisease
 * @property {string} cardiovascularDetails
 * @property {YesNo} hasActiveInfection
 * @property {string} activeInfectionDetails
 * @property {YesNo} hasUncontrolledSepsis
 * @property {YesNo} hasCjdRisk
 * @property {string} cjdDetails
 * @property {YesNo} ivDrugUseHistory
 * @property {string} currentMedications
 * @property {YesNo} previousSurgery
 * @property {string} surgeryDetails
 */

/**
 * @typedef {Object} OrganFunction
 * @property {number | null} creatinine
 * @property {number | null} egfr
 * @property {NormalAbnormal} kidneyImaging
 * @property {string} kidneyNotes
 * @property {number | null} alt
 * @property {number | null} ast
 * @property {number | null} bilirubin
 * @property {NormalAbnormal} liverImaging
 * @property {string} liverNotes
 * @property {number | null} ejectionFraction
 * @property {NormalAbnormal} echocardiogram
 * @property {string} cardiacNotes
 * @property {number | null} pao2Fio2Ratio
 * @property {NormalAbnormal} chestImaging
 * @property {string} pulmonaryNotes
 * @property {number | null} fastingGlucose
 * @property {number | null} hba1c
 * @property {string} pancreaticNotes
 * @property {YesNo} severeOrganFailure
 * @property {string} severeOrganFailureDetails
 */

/**
 * @typedef {Object} InfectiousDiseaseScreening
 * @property {ScreenResult} hivStatus
 * @property {ScreenResult} hbsAg
 * @property {ScreenResult} hbcAb
 * @property {ScreenResult} hcvAb
 * @property {ScreenResult} htlvStatus
 * @property {ScreenResult} cmvStatus
 * @property {ScreenResult} ebvStatus
 * @property {ScreenResult} syphilisScreen
 * @property {ScreenResult} toxoplasmaStatus
 * @property {ScreenResult} tuberculosisScreen
 * @property {YesNo} recentTravel
 * @property {string} travelDetails
 * @property {YesNo} recentInfection
 * @property {string} infectionDetails
 */

/**
 * @typedef {Object} ImmunologicalAssessment
 * @property {string} donorBloodGroup        // A+, A-, etc.
 * @property {string} recipientBloodGroup
 * @property {CompatibilityResult} aboCompatibility
 * @property {string} hlaA
 * @property {string} hlaB
 * @property {string} hlaC
 * @property {string} hlaDr
 * @property {string} hlaDq
 * @property {string} hlaDp
 * @property {string} hlaMatchLevel  // e.g. 6/6, 5/6, etc., or 'haploidentical'
 * @property {CompatibilityResult} crossmatchResult
 * @property {number | null} pra            // panel reactive antibodies %
 * @property {YesNo} donorSpecificAntibodies
 * @property {string} dsaDetails
 */

/**
 * @typedef {Object} SurgicalAssessment
 * @property {'I' | 'II' | 'III' | 'IV' | 'V' | ''} asaGrade
 * @property {YesNo} previousAnaesthetic
 * @property {YesNo} anaestheticComplications
 * @property {string} complicationDetails
 * @property {'I' | 'II' | 'III' | 'IV' | ''} mallampatiScore
 * @property {YesNo} airwayConcerns
 * @property {string} airwayDetails
 * @property {NormalAbnormal} surgicalFitness
 * @property {string} surgicalFitnessNotes
 * @property {string} plannedProcedure
 * @property {string} smokingStatus      // current, ex, never
 * @property {string} alcoholUse         // none, occasional, moderate, heavy
 */

/**
 * @typedef {Object} PsychologicalAssessment
 * @property {YesNo} mentalCapacityConfirmed
 * @property {YesNo} understandsProcedure
 * @property {YesNo} understandsRisks
 * @property {YesNo} voluntaryDecision
 * @property {YesNo} coercionConcerns
 * @property {string} coercionDetails
 * @property {YesNo} ambivalence
 * @property {string} ambivalenceDetails
 * @property {'none' | 'mild' | 'moderate' | 'severe' | ''} anxietyAboutProcedure
 * @property {YesNo} previousPsychologicalIssues
 * @property {string} psychologicalIssueDetails
 * @property {YesNo} supportNetwork
 * @property {YesNo} willingToProceed
 */

/**
 * @typedef {Object} EthicalLegalRequirements
 * @property {YesNo} htaAct2004Compliant
 * @property {YesNo} independentAssessorReview
 * @property {string} independentAssessorName
 * @property {string} independentAssessorDate
 * @property {YesNo} informedConsentGiven
 * @property {YesNo} consentFormSigned
 * @property {string} consentDate
 * @property {string} witnessName
 * @property {string} witnessRole
 * @property {YesNo} informationLeafletProvided
 * @property {YesNo} questionsAnswered
 * @property {YesNo} financialRewardCheck    // confirmation of no inducement
 * @property {YesNo} ethicsCommitteeApproval
 * @property {string} ethicsApprovalReference
 */

/**
 * @typedef {Object} EligibilityAllocation
 * @property {Eligibility | ''} eligibilityDecision
 * @property {string} eligibilityConditions
 * @property {string} deferralReason
 * @property {'temporary' | 'permanent' | ''} deferralDuration
 * @property {string} allocatedOrgans
 * @property {string} intendedRecipientCentre
 * @property {string} assessorName
 * @property {string} assessorRole
 * @property {string} assessmentDate
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {DonorTypeRegistration} donorTypeRegistration
 * @property {MedicalHistory} medicalHistory
 * @property {OrganFunction} organFunction
 * @property {InfectiousDiseaseScreening} infectiousDiseaseScreening
 * @property {ImmunologicalAssessment} immunologicalAssessment
 * @property {SurgicalAssessment} surgicalAssessment
 * @property {PsychologicalAssessment} psychologicalAssessment
 * @property {EthicalLegalRequirements} ethicalLegalRequirements
 * @property {EligibilityAllocation} eligibilityAllocation
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} grade
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {Eligibility} eligibility
 * @property {RiskLevel} riskLevel
 * @property {Eligibility} suggestedEligibility
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.OrganDonationAssessment`.
(function () {
'use strict';
window.OrganDonationAssessment = window.OrganDonationAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
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
      ethnicity: ''
    },
    donorTypeRegistration: {
      donorType: '',
      registeredOnDonorRegister: '',
      registryName: '',
      registrationDate: '',
      recipientRelationship: '',
      recipientName: '',
      previousDonation: '',
      previousDonationDetails: '',
      intendedOrgans: ''
    },
    medicalHistory: {
      hasMalignancy: '',
      malignancyDetails: '',
      hasCnsMalignancy: '',
      hasAutoimmuneDisease: '',
      autoimmuneDetails: '',
      hasDiabetes: '',
      diabetesDetails: '',
      hasHypertension: '',
      hypertensionDetails: '',
      hasCardiovascularDisease: '',
      cardiovascularDetails: '',
      hasActiveInfection: '',
      activeInfectionDetails: '',
      hasUncontrolledSepsis: '',
      hasCjdRisk: '',
      cjdDetails: '',
      ivDrugUseHistory: '',
      currentMedications: '',
      previousSurgery: '',
      surgeryDetails: ''
    },
    organFunction: {
      creatinine: null,
      egfr: null,
      kidneyImaging: '',
      kidneyNotes: '',
      alt: null,
      ast: null,
      bilirubin: null,
      liverImaging: '',
      liverNotes: '',
      ejectionFraction: null,
      echocardiogram: '',
      cardiacNotes: '',
      pao2Fio2Ratio: null,
      chestImaging: '',
      pulmonaryNotes: '',
      fastingGlucose: null,
      hba1c: null,
      pancreaticNotes: '',
      severeOrganFailure: '',
      severeOrganFailureDetails: ''
    },
    infectiousDiseaseScreening: {
      hivStatus: '',
      hbsAg: '',
      hbcAb: '',
      hcvAb: '',
      htlvStatus: '',
      cmvStatus: '',
      ebvStatus: '',
      syphilisScreen: '',
      toxoplasmaStatus: '',
      tuberculosisScreen: '',
      recentTravel: '',
      travelDetails: '',
      recentInfection: '',
      infectionDetails: ''
    },
    immunologicalAssessment: {
      donorBloodGroup: '',
      recipientBloodGroup: '',
      aboCompatibility: '',
      hlaA: '',
      hlaB: '',
      hlaC: '',
      hlaDr: '',
      hlaDq: '',
      hlaDp: '',
      hlaMatchLevel: '',
      crossmatchResult: '',
      pra: null,
      donorSpecificAntibodies: '',
      dsaDetails: ''
    },
    surgicalAssessment: {
      asaGrade: '',
      previousAnaesthetic: '',
      anaestheticComplications: '',
      complicationDetails: '',
      mallampatiScore: '',
      airwayConcerns: '',
      airwayDetails: '',
      surgicalFitness: '',
      surgicalFitnessNotes: '',
      plannedProcedure: '',
      smokingStatus: '',
      alcoholUse: ''
    },
    psychologicalAssessment: {
      mentalCapacityConfirmed: '',
      understandsProcedure: '',
      understandsRisks: '',
      voluntaryDecision: '',
      coercionConcerns: '',
      coercionDetails: '',
      ambivalence: '',
      ambivalenceDetails: '',
      anxietyAboutProcedure: '',
      previousPsychologicalIssues: '',
      psychologicalIssueDetails: '',
      supportNetwork: '',
      willingToProceed: ''
    },
    ethicalLegalRequirements: {
      htaAct2004Compliant: '',
      independentAssessorReview: '',
      independentAssessorName: '',
      independentAssessorDate: '',
      informedConsentGiven: '',
      consentFormSigned: '',
      consentDate: '',
      witnessName: '',
      witnessRole: '',
      informationLeafletProvided: '',
      questionsAnswered: '',
      financialRewardCheck: '',
      ethicsCommitteeApproval: '',
      ethicsApprovalReference: ''
    },
    eligibilityAllocation: {
      eligibilityDecision: '',
      eligibilityConditions: '',
      deferralReason: '',
      deferralDuration: '',
      allocatedOrgans: '',
      intendedRecipientCentre: '',
      assessorName: '',
      assessorRole: '',
      assessmentDate: '',
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

/** Donor type human-readable label. */
function donorTypeLabel(donorType) {
  switch (donorType) {
    case 'living': return 'Living donor';
    case 'deceased': return 'Deceased donor';
    default: return 'Not specified';
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

Object.assign(window.OrganDonationAssessment, {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  calculateAge,
  eligibilityLabel,
  eligibilityClass,
  riskLevelLabel,
  riskLevelClass,
  donorTypeLabel,
  gradeLabel,
  gradeClass
});
})();
