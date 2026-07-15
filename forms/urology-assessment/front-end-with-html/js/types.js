// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Urology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'routine' | 'urgent' | 'emergency' | ''} Urgency
 * @typedef {'normal' | 'weak' | 'intermittent' | ''} Stream
 * @typedef {'none' | 'stress' | 'urge' | 'overflow' | 'mixed' | ''} Incontinence
 * @typedef {0 | 1 | 2 | 3 | 4 | 5} IPSSScore
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6} QoLScore
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primaryConcern
 * @property {string} duration
 * @property {Urgency} urgency
 */

/**
 * @typedef {Object} IPSSQuestionnaire
 * @property {IPSSScore | null} q1
 * @property {IPSSScore | null} q2
 * @property {IPSSScore | null} q3
 * @property {IPSSScore | null} q4
 * @property {IPSSScore | null} q5
 * @property {IPSSScore | null} q6
 * @property {IPSSScore | null} q7
 */

/**
 * @typedef {Object} QualityOfLife
 * @property {QoLScore | null} qolScore
 * @property {string} qolImpact
 */

/**
 * @typedef {Object} UrinarySymptoms
 * @property {YesNo} frequency
 * @property {YesNo} urgency
 * @property {YesNo} nocturia
 * @property {YesNo} hesitancy
 * @property {Stream} stream
 * @property {YesNo} straining
 * @property {YesNo} hematuria
 * @property {YesNo} dysuria
 * @property {Incontinence} incontinence
 */

/**
 * @typedef {Object} RenalFunction
 * @property {number | null} creatinine
 * @property {number | null} eGFR
 * @property {string} urinalysis
 * @property {number | null} psa
 * @property {string} psaDate
 */

/**
 * @typedef {Object} SexualHealth
 * @property {YesNo} erectileDysfunction
 * @property {YesNo} libidoChanges
 * @property {YesNo} ejaculatoryProblems
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string} previousUrologicConditions
 * @property {string} surgicalHistory
 * @property {YesNo} diabetes
 * @property {YesNo} hypertension
 * @property {YesNo} neurologicConditions
 * @property {string} neurologicConditionDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} alphaBlockers
 * @property {Medication[]} fiveAlphaReductaseInhibitors
 * @property {Medication[]} anticholinergics
 * @property {Medication[]} otherMedications
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} prostateCancer
 * @property {YesNo} bladderCancer
 * @property {YesNo} kidneyDisease
 * @property {string} otherDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {IPSSQuestionnaire} ipssQuestionnaire
 * @property {QualityOfLife} qualityOfLife
 * @property {UrinarySymptoms} urinarySymptoms
 * @property {RenalFunction} renalFunction
 * @property {SexualHealth} sexualHealth
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentMedications} currentMedications
 * @property {FamilyHistory} familyHistory
 */

/**
 * @typedef {'mild' | 'moderate' | 'severe'} IPSSCategoryKey
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
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} ipssScore
 * @property {string} ipssCategoryLabel
 * @property {IPSSCategoryKey} ipssCategoryKey
 * @property {number | null} qolScore
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
      sex: ''
    },
    chiefComplaint: {
      primaryConcern: '',
      duration: '',
      urgency: ''
    },
    ipssQuestionnaire: {
      q1: null, q2: null, q3: null, q4: null, q5: null,
      q6: null, q7: null
    },
    qualityOfLife: {
      qolScore: null,
      qolImpact: ''
    },
    urinarySymptoms: {
      frequency: '',
      urgency: '',
      nocturia: '',
      hesitancy: '',
      stream: '',
      straining: '',
      hematuria: '',
      dysuria: '',
      incontinence: ''
    },
    renalFunction: {
      creatinine: null,
      eGFR: null,
      urinalysis: '',
      psa: null,
      psaDate: ''
    },
    sexualHealth: {
      erectileDysfunction: '',
      libidoChanges: '',
      ejaculatoryProblems: ''
    },
    medicalHistory: {
      previousUrologicConditions: '',
      surgicalHistory: '',
      diabetes: '',
      hypertension: '',
      neurologicConditions: '',
      neurologicConditionDetails: ''
    },
    currentMedications: {
      alphaBlockers: [],
      fiveAlphaReductaseInhibitors: [],
      anticholinergics: [],
      otherMedications: []
    },
    familyHistory: {
      prostateCancer: '',
      bladderCancer: '',
      kidneyDisease: '',
      otherDetails: ''
    }
  };
}

/**
 * Calculate age from date of birth string. Returns null if invalid.
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
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * IPSS score category label.
 *   0-7   = Mild symptoms
 *   8-19  = Moderate symptoms
 *   20-35 = Severe symptoms
 * @param {number} score
 * @returns {string}
 */
function ipssCategory(score) {
  if (score <= 7) return 'Mild';
  if (score <= 19) return 'Moderate';
  return 'Severe';
}

/**
 * IPSS category CSS class hint for the score badge.
 * @param {number} score
 * @returns {string}
 */
function ipssCategoryClass(score) {
  if (score <= 7) return 'category-mild';
  if (score <= 19) return 'category-moderate';
  return 'category-severe';
}

/**
 * IPSS category key (machine-friendly).
 * @param {number} score
 * @returns {IPSSCategoryKey}
 */
function ipssCategoryKey(score) {
  if (score <= 7) return 'mild';
  if (score <= 19) return 'moderate';
  return 'severe';
}

/**
 * Quality of Life label.
 * @param {number | null} score
 * @returns {string}
 */
function qolLabel(score) {
  switch (score) {
    case 0: return 'Delighted';
    case 1: return 'Pleased';
    case 2: return 'Mostly satisfied';
    case 3: return 'Mixed';
    case 4: return 'Mostly dissatisfied';
    case 5: return 'Unhappy';
    case 6: return 'Terrible';
    default: return '';
  }
}

export { emptyAssessment, calculateAge, ipssCategory, ipssCategoryClass, ipssCategoryKey, qolLabel };
