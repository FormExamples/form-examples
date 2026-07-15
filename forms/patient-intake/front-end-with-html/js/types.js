// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Patient Intake form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'routine' | 'urgent' | 'emergency' | ''} UrgencyLevel
 * @typedef {'current' | 'ex' | 'never' | ''} SmokingStatus
 * @typedef {'none' | 'occasional' | 'moderate' | 'heavy' | ''} AlcoholFrequency
 * @typedef {'none' | 'occasional' | 'regular' | ''} DrugUseFrequency
 * @typedef {'none' | 'occasional' | 'moderate' | 'regular' | ''} ExerciseFrequency
 * @typedef {'poor' | 'average' | 'good' | 'excellent' | ''} DietQuality
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'drug' | 'food' | 'environmental' | 'latex' | 'other' | ''} AllergyType
 * @typedef {'phone' | 'email' | 'text' | 'post' | ''} CommunicationPreference
 * @typedef {'low' | 'medium' | 'high'} RiskLevel
 */

/**
 * @typedef {Object} PersonalInformation
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} city
 * @property {string} postcode
 * @property {string} phone
 * @property {string} email
 * @property {string} emergencyContactName
 * @property {string} emergencyContactPhone
 * @property {string} emergencyContactRelationship
 */

/**
 * @typedef {Object} InsuranceAndId
 * @property {string} insuranceProvider
 * @property {string} policyNumber
 * @property {string} nhsNumber
 * @property {string} gpName
 * @property {string} gpPracticeName
 * @property {string} gpPhone
 */

/**
 * @typedef {Object} ReasonForVisit
 * @property {string} primaryReason
 * @property {UrgencyLevel} urgencyLevel
 * @property {string} referringProvider
 * @property {string} symptomDuration
 * @property {string} additionalDetails
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string[]} chronicConditions
 * @property {string} previousSurgeries
 * @property {string} previousHospitalizations
 * @property {string} ongoingTreatments
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 * @property {string} prescriber
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {AllergyType} allergyType
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} heartDisease
 * @property {string} heartDiseaseDetails
 * @property {YesNo} cancer
 * @property {string} cancerDetails
 * @property {YesNo} diabetes
 * @property {string} diabetesDetails
 * @property {YesNo} stroke
 * @property {string} strokeDetails
 * @property {YesNo} mentalIllness
 * @property {string} mentalIllnessDetails
 * @property {YesNo} geneticConditions
 * @property {string} geneticConditionsDetails
 */

/**
 * @typedef {Object} SocialHistory
 * @property {SmokingStatus} smokingStatus
 * @property {number | null} smokingPackYears
 * @property {AlcoholFrequency} alcoholFrequency
 * @property {number | null} alcoholUnitsPerWeek
 * @property {DrugUseFrequency} drugUse
 * @property {string} drugDetails
 * @property {string} occupation
 * @property {ExerciseFrequency} exerciseFrequency
 * @property {DietQuality} dietQuality
 */

/**
 * @typedef {Object} ReviewOfSystems
 * @property {string} constitutional
 * @property {string} heent
 * @property {string} cardiovascular
 * @property {string} respiratory
 * @property {string} gastrointestinal
 * @property {string} genitourinary
 * @property {string} musculoskeletal
 * @property {string} neurological
 * @property {string} psychiatric
 * @property {string} skin
 */

/**
 * @typedef {Object} ConsentAndPreferences
 * @property {YesNo} consentToTreatment
 * @property {YesNo} privacyAcknowledgement
 * @property {CommunicationPreference} communicationPreference
 * @property {YesNo} advanceDirectives
 * @property {string} advanceDirectiveDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PersonalInformation} personalInformation
 * @property {InsuranceAndId} insuranceAndId
 * @property {ReasonForVisit} reasonForVisit
 * @property {MedicalHistory} medicalHistory
 * @property {Medication[]} medications
 * @property {Allergy[]} allergies
 * @property {FamilyHistory} familyHistory
 * @property {SocialHistory} socialHistory
 * @property {ReviewOfSystems} reviewOfSystems
 * @property {ConsentAndPreferences} consentAndPreferences
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {RiskLevel} riskLevel
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
 * @property {RiskLevel} riskLevel
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
    personalInformation: {
      fullName: '',
      dateOfBirth: '',
      sex: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postcode: '',
      phone: '',
      email: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    },
    insuranceAndId: {
      insuranceProvider: '',
      policyNumber: '',
      nhsNumber: '',
      gpName: '',
      gpPracticeName: '',
      gpPhone: ''
    },
    reasonForVisit: {
      primaryReason: '',
      urgencyLevel: '',
      referringProvider: '',
      symptomDuration: '',
      additionalDetails: ''
    },
    medicalHistory: {
      chronicConditions: [],
      previousSurgeries: '',
      previousHospitalizations: '',
      ongoingTreatments: ''
    },
    medications: [],
    allergies: [],
    familyHistory: {
      heartDisease: '',
      heartDiseaseDetails: '',
      cancer: '',
      cancerDetails: '',
      diabetes: '',
      diabetesDetails: '',
      stroke: '',
      strokeDetails: '',
      mentalIllness: '',
      mentalIllnessDetails: '',
      geneticConditions: '',
      geneticConditionsDetails: ''
    },
    socialHistory: {
      smokingStatus: '',
      smokingPackYears: null,
      alcoholFrequency: '',
      alcoholUnitsPerWeek: null,
      drugUse: '',
      drugDetails: '',
      occupation: '',
      exerciseFrequency: '',
      dietQuality: ''
    },
    reviewOfSystems: {
      constitutional: '',
      heent: '',
      cardiovascular: '',
      respiratory: '',
      gastrointestinal: '',
      genitourinary: '',
      musculoskeletal: '',
      neurological: '',
      psychiatric: '',
      skin: ''
    },
    consentAndPreferences: {
      consentToTreatment: '',
      privacyAcknowledgement: '',
      communicationPreference: '',
      advanceDirectives: '',
      advanceDirectiveDetails: ''
    }
  };
}

/**
 * Friendly label for a RiskLevel.
 * @param {RiskLevel} level
 */
function riskLevelLabel(level) {
  switch (level) {
    case 'low': return 'Low Risk - Healthy, minimal risk factors';
    case 'medium': return 'Medium Risk - Controlled chronic conditions, some risk factors';
    case 'high': return 'High Risk - Uncontrolled conditions, multiple comorbidities';
    default: return `Risk: ${level}`;
  }
}

/**
 * CSS class hint for the risk-level badge.
 * @param {RiskLevel} level
 */
function riskLevelClass(level) {
  switch (level) {
    case 'low': return 'risk-low';
    case 'medium': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Calculate age (years) from an ISO date-of-birth string. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export { emptyAssessment, riskLevelLabel, riskLevelClass, calculateAge };
