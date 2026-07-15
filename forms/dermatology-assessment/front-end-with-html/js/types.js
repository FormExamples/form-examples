// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Dermatology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | ''} FitzpatrickType
 * @typedef {0 | 1 | 2 | 3 | null} DLQIScore
 * @typedef {'macule' | 'papule' | 'patch' | 'plaque' | 'nodule' | 'vesicle' | 'bulla' | 'pustule' | 'wheal' | 'erosion' | 'ulcer' | 'other' | ''} LesionType
 * @typedef {'erythematous' | 'hyperpigmented' | 'hypopigmented' | 'violaceous' | 'flesh-colored' | 'other' | ''} LesionColor
 * @typedef {'well-defined' | 'poorly-defined' | 'irregular' | 'raised' | ''} LesionBorder
 * @typedef {'localized' | 'generalized' | 'symmetrical' | 'asymmetrical' | 'dermatomal' | 'sun-exposed' | ''} LesionDistribution
 * @typedef {'smooth' | 'rough' | 'scaly' | 'crusted' | 'verrucous' | 'ulcerated' | ''} LesionSurface
 * @typedef {'minimal' | 'moderate' | 'frequent' | 'excessive' | ''} SunExposure
 * @typedef {'never' | 'occasional' | 'regular-outdoor' | 'tanning-bed' | ''} TanningHistory
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {FitzpatrickType} skinType
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primaryConcern
 * @property {string} duration
 * @property {string} location
 * @property {'stable' | 'improving' | 'worsening' | 'fluctuating' | ''} progression
 * @property {string} previousTreatments
 */

/**
 * @typedef {Object} DLQIQuestionnaire
 * @property {DLQIScore} q1
 * @property {DLQIScore} q2
 * @property {DLQIScore} q3
 * @property {DLQIScore} q4
 * @property {DLQIScore} q5
 * @property {DLQIScore} q6
 * @property {DLQIScore} q7
 * @property {DLQIScore} q8
 * @property {DLQIScore} q9
 * @property {DLQIScore} q10
 */

/**
 * @typedef {Object} LesionCharacteristics
 * @property {LesionType} type
 * @property {LesionColor} color
 * @property {LesionBorder} border
 * @property {number | null} sizeMillimeters
 * @property {LesionDistribution} distribution
 * @property {'single' | 'few' | 'multiple' | 'numerous' | ''} number
 * @property {LesionSurface} surface
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string} previousSkinConditions
 * @property {YesNo} autoimmuneDiseases
 * @property {string} autoimmuneDiseaseDetails
 * @property {YesNo} immunosuppression
 * @property {string} immunosuppressionDetails
 * @property {YesNo} cancerHistory
 * @property {string} cancerHistoryDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} topicals
 * @property {Medication[]} systemics
 * @property {Medication[]} biologics
 * @property {string} otcProducts
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} Allergies
 * @property {Allergy[]} drugAllergies
 * @property {string} contactAllergies
 * @property {YesNo} latexAllergy
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} psoriasis
 * @property {YesNo} eczema
 * @property {YesNo} melanoma
 * @property {YesNo} skinCancer
 * @property {YesNo} autoimmune
 * @property {string} otherDetails
 */

/**
 * @typedef {Object} SocialHistory
 * @property {SunExposure} sunExposure
 * @property {TanningHistory} tanningHistory
 * @property {string} occupation
 * @property {string} cosmeticsUse
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {DLQIQuestionnaire} dlqiQuestionnaire
 * @property {LesionCharacteristics} lesionCharacteristics
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentMedications} currentMedications
 * @property {Allergies} allergies
 * @property {FamilyHistory} familyHistory
 * @property {SocialHistory} socialHistory
 */

/**
 * @typedef {Object} DLQIRuleDefinition
 * @property {string} id
 * @property {number} questionNumber
 * @property {string} domain
 * @property {string} text
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
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
 * @property {number} dlqiScore
 * @property {string} dlqiCategoryLabel
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * DLQI question scores default to `null` (unanswered).
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      skinType: ''
    },
    chiefComplaint: {
      primaryConcern: '',
      duration: '',
      location: '',
      progression: '',
      previousTreatments: ''
    },
    dlqiQuestionnaire: {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
      q7: null,
      q8: null,
      q9: null,
      q10: null
    },
    lesionCharacteristics: {
      type: '',
      color: '',
      border: '',
      sizeMillimeters: null,
      distribution: '',
      number: '',
      surface: ''
    },
    medicalHistory: {
      previousSkinConditions: '',
      autoimmuneDiseases: '',
      autoimmuneDiseaseDetails: '',
      immunosuppression: '',
      immunosuppressionDetails: '',
      cancerHistory: '',
      cancerHistoryDetails: ''
    },
    currentMedications: {
      topicals: [],
      systemics: [],
      biologics: [],
      otcProducts: ''
    },
    allergies: {
      drugAllergies: [],
      contactAllergies: '',
      latexAllergy: ''
    },
    familyHistory: {
      psoriasis: '',
      eczema: '',
      melanoma: '',
      skinCancer: '',
      autoimmune: '',
      otherDetails: ''
    },
    socialHistory: {
      sunExposure: '',
      tanningHistory: '',
      occupation: '',
      cosmeticsUse: ''
    }
  };
}

/** Calculate age from date of birth string. */
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

/** Fitzpatrick skin type label. */
function fitzpatrickLabel(type) {
  switch (type) {
    case 'I':  return 'Type I - Very fair, always burns, never tans';
    case 'II': return 'Type II - Fair, usually burns, tans minimally';
    case 'III':return 'Type III - Medium, sometimes burns, tans uniformly';
    case 'IV': return 'Type IV - Olive, rarely burns, always tans well';
    case 'V':  return 'Type V - Brown, very rarely burns, tans very easily';
    case 'VI': return 'Type VI - Dark brown/black, never burns, always tans';
    default: return '';
  }
}

/** Get Fitzpatrick UV risk level. */
function fitzpatrickUVRisk(type) {
  switch (type) {
    case 'I':
    case 'II':
      return 'High';
    case 'III':
    case 'IV':
      return 'Moderate';
    case 'V':
    case 'VI':
      return 'Low';
    default: return '';
  }
}

export { emptyAssessment, calculateAge, fitzpatrickLabel, fitzpatrickUVRisk };
