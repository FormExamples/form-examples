// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Stroke Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'sudden' | 'gradual' | 'fluctuating' | 'improving' | ''} SymptomProgression
 * @typedef {'ambulance' | 'private-vehicle' | 'walk-in' | 'transfer' | ''} ModeOfArrival
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} SymptomOnset
 * @property {string} onsetTime
 * @property {string} lastKnownWell
 * @property {SymptomProgression} symptomProgression
 * @property {ModeOfArrival} modeOfArrival
 */

/**
 * @typedef {Object} LevelOfConsciousness
 * @property {0 | 1 | 2 | 3 | null} loc
 * @property {0 | 1 | 2 | null} locQuestions
 * @property {0 | 1 | 2 | null} locCommands
 */

/**
 * @typedef {Object} BestGazeVisual
 * @property {0 | 1 | 2 | null} bestGaze
 * @property {0 | 1 | 2 | 3 | null} visual
 */

/**
 * @typedef {Object} FacialPalsy
 * @property {0 | 1 | 2 | 3 | null} facialPalsy
 * @property {0 | 1 | 2 | 3 | 4 | null} leftArm
 * @property {0 | 1 | 2 | 3 | 4 | null} rightArm
 * @property {0 | 1 | 2 | 3 | 4 | null} leftLeg
 * @property {0 | 1 | 2 | 3 | 4 | null} rightLeg
 */

/**
 * @typedef {Object} LimbAtaxiaSensory
 * @property {0 | 1 | 2 | null} limbAtaxia
 * @property {0 | 1 | 2 | null} sensory
 */

/**
 * @typedef {Object} LanguageDysarthria
 * @property {0 | 1 | 2 | 3 | null} bestLanguage
 * @property {0 | 1 | 2 | null} dysarthria
 */

/**
 * @typedef {Object} ExtinctionInattention
 * @property {0 | 1 | 2 | null} extinctionInattention
 */

/**
 * @typedef {Object} RiskFactors
 * @property {YesNo} hypertension
 * @property {YesNo} diabetes
 * @property {YesNo} atrialFibrillation
 * @property {YesNo} previousStroke
 * @property {YesNo} smoking
 * @property {YesNo} hyperlipidemia
 * @property {YesNo} familyHistory
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} Allergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} medications
 * @property {Allergy[]} allergies
 * @property {YesNo} anticoagulants
 * @property {string} anticoagulantDetails
 * @property {YesNo} antiplatelets
 * @property {string} antiplateletDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {SymptomOnset} symptomOnset
 * @property {LevelOfConsciousness} levelOfConsciousness
 * @property {BestGazeVisual} bestGazeVisual
 * @property {FacialPalsy} facialPalsy
 * @property {LimbAtaxiaSensory} limbAtaxiaSensory
 * @property {LanguageDysarthria} languageDysarthria
 * @property {ExtinctionInattention} extinctionInattention
 * @property {RiskFactors} riskFactors
 * @property {CurrentMedications} currentMedications
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
 * @property {number} nihssScore
 * @property {string} nihssCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.StrokeAssessment`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric NIHSS items default to `null`; lists default to `[]`.
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
    symptomOnset: {
      onsetTime: '',
      lastKnownWell: '',
      symptomProgression: '',
      modeOfArrival: ''
    },
    levelOfConsciousness: {
      loc: null,
      locQuestions: null,
      locCommands: null
    },
    bestGazeVisual: {
      bestGaze: null,
      visual: null
    },
    facialPalsy: {
      facialPalsy: null,
      leftArm: null,
      rightArm: null,
      leftLeg: null,
      rightLeg: null
    },
    limbAtaxiaSensory: {
      limbAtaxia: null,
      sensory: null
    },
    languageDysarthria: {
      bestLanguage: null,
      dysarthria: null
    },
    extinctionInattention: {
      extinctionInattention: null
    },
    riskFactors: {
      hypertension: '',
      diabetes: '',
      atrialFibrillation: '',
      previousStroke: '',
      smoking: '',
      hyperlipidemia: '',
      familyHistory: ''
    },
    currentMedications: {
      medications: [],
      allergies: [],
      anticoagulants: '',
      anticoagulantDetails: '',
      antiplatelets: '',
      antiplateletDetails: ''
    }
  };
}

/** Calculate age from date of birth string. Returns null on bad input. */
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

/**
 * NIHSS score category label.
 *   0     = No stroke symptoms
 *   1-4   = Minor stroke
 *   5-15  = Moderate stroke
 *   16-20 = Moderate to severe stroke
 *   21-42 = Severe stroke
 */
function nihssCategory(score) {
  if (score === 0) return 'No stroke symptoms';
  if (score <= 4) return 'Minor stroke';
  if (score <= 15) return 'Moderate stroke';
  if (score <= 20) return 'Moderate to severe stroke';
  return 'Severe stroke';
}

/** CSS class hint for the NIHSS score badge. */
function nihssCategoryClass(score) {
  if (score === 0) return 'nihss-none';
  if (score <= 4) return 'nihss-minor';
  if (score <= 15) return 'nihss-moderate';
  if (score <= 20) return 'nihss-moderate-severe';
  return 'nihss-severe';
}

/** Calculate hours elapsed from onset time string. Returns null if invalid. */
function hoursFromOnset(onsetTime) {
  if (!onsetTime) return null;
  const onset = new Date(onsetTime);
  if (isNaN(onset.getTime())) return null;
  const now = new Date();
  const diffMs = now.getTime() - onset.getTime();
  if (diffMs < 0) return null;
  return diffMs / (1000 * 60 * 60);
}

export { emptyAssessment, calculateAge, nihssCategory, nihssCategoryClass, hoursFromOnset };
