// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Cognitive Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'right' | 'left' | 'ambidextrous' | ''} Handedness
 * @typedef {'none' | 'primary' | 'secondary' | 'university' | 'postgraduate' | ''} EducationLevel
 * @typedef {'gp' | 'neurologist' | 'psychiatrist' | 'geriatrician' | 'self' | 'family' | 'other' | ''} ReferralSource
 * @typedef {'memory-concern' | 'confusion' | 'behavioural-change' | 'functional-decline' | 'screening' | 'follow-up' | 'other' | ''} ReferralReason
 * @typedef {'routine' | 'urgent' | 'emergency' | ''} Urgency
 * @typedef {'alone' | 'with-spouse' | 'with-family' | 'care-home' | 'assisted-living' | ''} LivingArrangement
 * @typedef {'independent' | 'needs-some-help' | 'needs-significant-help' | 'fully-dependent' | ''} ADLIndependence
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {EducationLevel} educationLevel
 * @property {string} primaryLanguage
 * @property {Handedness} handedness
 */

/**
 * @typedef {Object} ReferralInformation
 * @property {ReferralSource} referralSource
 * @property {ReferralReason} referralReason
 * @property {string} referringClinician
 * @property {string} referralDate
 * @property {Urgency} urgency
 * @property {YesNo} previousCognitiveAssessment
 * @property {string} previousAssessmentDetails
 */

/**
 * MMSE score for an item is 0 (incorrect), 1 (correct), or null (unanswered).
 * @typedef {0 | 1 | null} ItemScore
 */

/**
 * @typedef {Object} OrientationScores
 * @property {ItemScore} year
 * @property {ItemScore} season
 * @property {ItemScore} date
 * @property {ItemScore} day
 * @property {ItemScore} month
 * @property {ItemScore} country
 * @property {ItemScore} county
 * @property {ItemScore} town
 * @property {ItemScore} hospital
 * @property {ItemScore} floor
 */

/**
 * @typedef {Object} RegistrationScores
 * @property {ItemScore} object1
 * @property {ItemScore} object2
 * @property {ItemScore} object3
 */

/**
 * @typedef {Object} AttentionScores
 * @property {ItemScore} serial1
 * @property {ItemScore} serial2
 * @property {ItemScore} serial3
 * @property {ItemScore} serial4
 * @property {ItemScore} serial5
 */

/**
 * @typedef {Object} RecallScores
 * @property {ItemScore} object1
 * @property {ItemScore} object2
 * @property {ItemScore} object3
 */

/**
 * @typedef {Object} LanguageScores
 * @property {ItemScore} naming1
 * @property {ItemScore} naming2
 * @property {ItemScore} repetition
 * @property {ItemScore} command1
 * @property {ItemScore} command2
 * @property {ItemScore} command3
 * @property {ItemScore} reading
 * @property {ItemScore} writing
 */

/**
 * @typedef {Object} VisuospatialScores
 * @property {ItemScore} copying
 */

/**
 * @typedef {Object} FunctionalHistory
 * @property {LivingArrangement} livingArrangement
 * @property {ADLIndependence} adlBathing
 * @property {ADLIndependence} adlDressing
 * @property {ADLIndependence} adlMeals
 * @property {ADLIndependence} adlMedications
 * @property {ADLIndependence} adlFinances
 * @property {ADLIndependence} adlTransport
 * @property {string} recentChanges
 * @property {string} safetyConerns
 * @property {YesNo} carersAvailable
 * @property {string} carerDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ReferralInformation} referralInformation
 * @property {OrientationScores} orientationScores
 * @property {RegistrationScores} registrationScores
 * @property {AttentionScores} attentionScores
 * @property {RecallScores} recallScores
 * @property {LanguageScores} languageScores
 * @property {LanguageScores} repetitionCommands
 * @property {VisuospatialScores} visuospatialScores
 * @property {FunctionalHistory} functionalHistory
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
 * @property {number} mmseScore
 * @property {string} mmseCategoryLabel
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric MMSE item scores default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      educationLevel: '',
      primaryLanguage: '',
      handedness: ''
    },
    referralInformation: {
      referralSource: '',
      referralReason: '',
      referringClinician: '',
      referralDate: '',
      urgency: '',
      previousCognitiveAssessment: '',
      previousAssessmentDetails: ''
    },
    orientationScores: {
      year: null,
      season: null,
      date: null,
      day: null,
      month: null,
      country: null,
      county: null,
      town: null,
      hospital: null,
      floor: null
    },
    registrationScores: {
      object1: null,
      object2: null,
      object3: null
    },
    attentionScores: {
      serial1: null,
      serial2: null,
      serial3: null,
      serial4: null,
      serial5: null
    },
    recallScores: {
      object1: null,
      object2: null,
      object3: null
    },
    languageScores: {
      naming1: null,
      naming2: null,
      repetition: null,
      command1: null,
      command2: null,
      command3: null,
      reading: null,
      writing: null
    },
    repetitionCommands: {
      naming1: null,
      naming2: null,
      repetition: null,
      command1: null,
      command2: null,
      command3: null,
      reading: null,
      writing: null
    },
    visuospatialScores: {
      copying: null
    },
    functionalHistory: {
      livingArrangement: '',
      adlBathing: '',
      adlDressing: '',
      adlMeals: '',
      adlMedications: '',
      adlFinances: '',
      adlTransport: '',
      recentChanges: '',
      safetyConerns: '',
      carersAvailable: '',
      carerDetails: ''
    }
  };
}

/**
 * Calculate age from ISO date-of-birth string. Returns null if invalid.
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
 * MMSE score category label.
 *   24-30 = Normal cognition
 *   18-23 = Mild cognitive impairment
 *   10-17 = Moderate cognitive impairment
 *    0-9  = Severe cognitive impairment
 * @param {number} score
 */
function mmseCategory(score) {
  if (score >= 24) return 'Normal cognition';
  if (score >= 18) return 'Mild cognitive impairment';
  if (score >= 10) return 'Moderate cognitive impairment';
  return 'Severe cognitive impairment';
}

/**
 * CSS modifier class for the MMSE total badge.
 * @param {number} score
 */
function mmseCategoryClass(score) {
  if (score >= 24) return 'cat-normal';
  if (score >= 18) return 'cat-mild';
  if (score >= 10) return 'cat-moderate';
  return 'cat-severe';
}

export { emptyAssessment, calculateAge, mmseCategory, mmseCategoryClass };
