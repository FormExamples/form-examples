// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Genetic Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'routine' | 'urgent' | 'emergency' | ''} Urgency
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} ReferralInformation
 * @property {string} referralReason
 * @property {string} referringClinician
 * @property {Urgency} urgency
 */

/**
 * @typedef {Object} PersonalMedicalHistory
 * @property {YesNo} birthDefects
 * @property {string} birthDefectsDetails
 * @property {YesNo} developmentalDelay
 * @property {string} developmentalDelayDetails
 * @property {YesNo} intellectualDisability
 * @property {string} intellectualDisabilityDetails
 * @property {YesNo} multipleAnomalies
 * @property {string} multipleAnomaliesDetails
 * @property {YesNo} chromosomalCondition
 * @property {string} chromosomalConditionDetails
 * @property {YesNo} knownGeneticCondition
 * @property {string} knownGeneticConditionDetails
 */

/**
 * @typedef {Object} CancerHistory
 * @property {YesNo} personalCancerHistory
 * @property {string} cancerType
 * @property {number | null} ageAtDiagnosis
 * @property {YesNo} multiplePrimaryCancers
 */

/**
 * @typedef {Object} FamilyMember
 * @property {string} conditions
 * @property {string} cancers
 * @property {string} ageAtDiagnosis
 * @property {YesNo} deceased
 * @property {string} ageAtDeath
 */

/**
 * @typedef {Object} FamilyPedigree
 * @property {FamilyMember} maternalGrandmother
 * @property {FamilyMember} maternalGrandfather
 * @property {FamilyMember} paternalGrandmother
 * @property {FamilyMember} paternalGrandfather
 * @property {FamilyMember} mother
 * @property {FamilyMember} father
 * @property {string} siblings
 * @property {string} children
 */

/**
 * @typedef {Object} CardiovascularGenetics
 * @property {YesNo} familialHypercholesterolemia
 * @property {YesNo} cardiomyopathy
 * @property {YesNo} aorticAneurysm
 * @property {YesNo} suddenCardiacDeath
 * @property {YesNo} earlyOnsetCVD
 * @property {string} cardiovascularDetails
 */

/**
 * @typedef {Object} Neurogenetics
 * @property {YesNo} huntington
 * @property {YesNo} alzheimersEarly
 * @property {YesNo} parkinson
 * @property {YesNo} muscularDystrophy
 * @property {YesNo} spinocerebellarAtaxia
 * @property {string} neurologicalDetails
 */

/**
 * @typedef {Object} ReproductiveGenetics
 * @property {YesNo} recurrentMiscarriages
 * @property {YesNo} infertility
 * @property {YesNo} previousAffectedChild
 * @property {string} previousAffectedChildDetails
 * @property {YesNo} consanguinity
 * @property {YesNo} carrierStatus
 * @property {string} carrierStatusDetails
 */

/**
 * @typedef {Object} EthnicBackground
 * @property {string} ethnicity
 * @property {YesNo} ashkenaziJewish
 * @property {YesNo} consanguinity
 * @property {string} consanguinityDetails
 */

/**
 * @typedef {Object} GeneticTestingHistory
 * @property {YesNo} previousGeneticTests
 * @property {string} previousGeneticTestsDetails
 * @property {string} testResults
 * @property {YesNo} geneticCounseling
 * @property {YesNo} variantsOfUncertainSignificance
 * @property {string} variantsOfUncertainSignificanceDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ReferralInformation} referralInformation
 * @property {PersonalMedicalHistory} personalMedicalHistory
 * @property {CancerHistory} cancerHistory
 * @property {FamilyPedigree} familyPedigree
 * @property {CardiovascularGenetics} cardiovascularGenetics
 * @property {Neurogenetics} neurogenetics
 * @property {ReproductiveGenetics} reproductiveGenetics
 * @property {EthnicBackground} ethnicBackground
 * @property {GeneticTestingHistory} geneticTestingHistory
 */

/**
 * @typedef {'Low' | 'Moderate' | 'High'} RiskLevel
 */

/**
 * @typedef {Object} RiskRuleDefinition
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} weight
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} weight
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
 * @property {number} riskScore
 * @property {RiskLevel} riskLevel
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/** Build a fresh, empty FamilyMember. @returns {FamilyMember} */
function emptyFamilyMember() {
  return {
    conditions: '',
    cancers: '',
    ageAtDiagnosis: '',
    deceased: '',
    ageAtDeath: ''
  };
}

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
      sex: ''
    },
    referralInformation: {
      referralReason: '',
      referringClinician: '',
      urgency: ''
    },
    personalMedicalHistory: {
      birthDefects: '',
      birthDefectsDetails: '',
      developmentalDelay: '',
      developmentalDelayDetails: '',
      intellectualDisability: '',
      intellectualDisabilityDetails: '',
      multipleAnomalies: '',
      multipleAnomaliesDetails: '',
      chromosomalCondition: '',
      chromosomalConditionDetails: '',
      knownGeneticCondition: '',
      knownGeneticConditionDetails: ''
    },
    cancerHistory: {
      personalCancerHistory: '',
      cancerType: '',
      ageAtDiagnosis: null,
      multiplePrimaryCancers: ''
    },
    familyPedigree: {
      maternalGrandmother: emptyFamilyMember(),
      maternalGrandfather: emptyFamilyMember(),
      paternalGrandmother: emptyFamilyMember(),
      paternalGrandfather: emptyFamilyMember(),
      mother: emptyFamilyMember(),
      father: emptyFamilyMember(),
      siblings: '',
      children: ''
    },
    cardiovascularGenetics: {
      familialHypercholesterolemia: '',
      cardiomyopathy: '',
      aorticAneurysm: '',
      suddenCardiacDeath: '',
      earlyOnsetCVD: '',
      cardiovascularDetails: ''
    },
    neurogenetics: {
      huntington: '',
      alzheimersEarly: '',
      parkinson: '',
      muscularDystrophy: '',
      spinocerebellarAtaxia: '',
      neurologicalDetails: ''
    },
    reproductiveGenetics: {
      recurrentMiscarriages: '',
      infertility: '',
      previousAffectedChild: '',
      previousAffectedChildDetails: '',
      consanguinity: '',
      carrierStatus: '',
      carrierStatusDetails: ''
    },
    ethnicBackground: {
      ethnicity: '',
      ashkenaziJewish: '',
      consanguinity: '',
      consanguinityDetails: ''
    },
    geneticTestingHistory: {
      previousGeneticTests: '',
      previousGeneticTestsDetails: '',
      testResults: '',
      geneticCounseling: '',
      variantsOfUncertainSignificance: '',
      variantsOfUncertainSignificanceDetails: ''
    }
  };
}

/**
 * Risk score category.
 *   0-2  = Low Risk
 *   3-5  = Moderate Risk
 *   6+   = High Risk
 * @param {number} score
 * @returns {RiskLevel}
 */
function riskCategory(score) {
  if (score <= 2) return 'Low';
  if (score <= 5) return 'Moderate';
  return 'High';
}

/**
 * Friendly label for a risk score.
 * @param {number} score
 */
function riskLabel(score) {
  return `Risk Score ${score} - ${riskCategory(score)} Risk`;
}

/**
 * CSS class hint for the risk-level badge.
 * @param {RiskLevel} level
 */
function riskLevelClass(level) {
  switch (level) {
    case 'Low': return 'risk-low';
    case 'Moderate': return 'risk-moderate';
    case 'High': return 'risk-high';
    default: return '';
  }
}

/**
 * Calculate age (whole years) from a date-of-birth ISO string.
 * @param {string} dob
 * @returns {number | null}
 */
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

export { emptyFamilyMember, emptyAssessment, riskCategory, riskLabel, riskLevelClass, calculateAge };
