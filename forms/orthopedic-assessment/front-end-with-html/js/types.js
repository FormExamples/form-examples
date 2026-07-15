// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Orthopedic Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'left' | 'right' | 'bilateral' | ''} Side
 * @typedef {'left' | 'right' | 'ambidextrous' | ''} DominantHand
 * @typedef {'acute' | 'gradual' | 'traumatic' | 'overuse' | ''} OnsetType
 * @typedef {'sharp' | 'dull' | 'aching' | 'burning' | 'throbbing' |
 *           'stabbing' | 'radiating' | ''} PainCharacter
 * @typedef {'constant' | 'intermittent' | 'activity-related' |
 *           'night-only' | 'morning-stiffness' | ''} PainFrequency
 * @typedef {1 | 2 | 3 | 4 | 5 | null} DASHScore
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} occupation
 * @property {DominantHand} dominantHand
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primaryConcern
 * @property {string} affectedJoint
 * @property {Side} side
 * @property {string} duration
 * @property {OnsetType} onsetType
 * @property {string[]} aggravatingFactors
 */

/**
 * @typedef {Object} PainAssessment
 * @property {number | null} currentPainLevel
 * @property {number | null} worstPain
 * @property {number | null} bestPain
 * @property {PainCharacter} painCharacter
 * @property {PainFrequency} painFrequency
 * @property {YesNo} nightPain
 * @property {YesNo} painWithWeightBearing
 */

/**
 * @typedef {Object} DASHQuestionnaire
 * @property {DASHScore} q1
 * @property {DASHScore} q2
 * @property {DASHScore} q3
 * @property {DASHScore} q4
 * @property {DASHScore} q5
 * @property {DASHScore} q6
 * @property {DASHScore} q7
 * @property {DASHScore} q8
 * @property {DASHScore} q9
 * @property {DASHScore} q10
 * @property {DASHScore} q11
 * @property {DASHScore} q12
 * @property {DASHScore} q13
 * @property {DASHScore} q14
 * @property {DASHScore} q15
 * @property {DASHScore} q16
 * @property {DASHScore} q17
 * @property {DASHScore} q18
 * @property {DASHScore} q19
 * @property {DASHScore} q20
 * @property {DASHScore} q21
 * @property {DASHScore} q22
 * @property {DASHScore} q23
 * @property {DASHScore} q24
 * @property {DASHScore} q25
 * @property {DASHScore} q26
 * @property {DASHScore} q27
 * @property {DASHScore} q28
 * @property {DASHScore} q29
 * @property {DASHScore} q30
 */

/**
 * @typedef {Object} RangeOfMotion
 * @property {string} joint
 * @property {number | null} flexion
 * @property {number | null} extension
 * @property {number | null} abduction
 * @property {number | null} adduction
 * @property {number | null} internalRotation
 * @property {number | null} externalRotation
 * @property {string} notes
 */

/**
 * @typedef {Object} StrengthTesting
 * @property {number | null} gripStrengthLeft
 * @property {number | null} gripStrengthRight
 * @property {string} manualMuscleGrade
 * @property {string} specificWeaknesses
 */

/**
 * @typedef {Object} FunctionalLimitations
 * @property {string[]} difficultyWithADLs
 * @property {string[]} mobilityAids
 * @property {string} workRestrictions
 * @property {string} sportRestrictions
 */

/**
 * @typedef {Object} ImagingStudy
 * @property {YesNo} performed
 * @property {string} date
 * @property {string} findings
 */

/**
 * @typedef {Object} ImagingHistory
 * @property {ImagingStudy} xRay
 * @property {ImagingStudy} mri
 * @property {ImagingStudy} ctScan
 * @property {ImagingStudy} ultrasound
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
 * @typedef {Object} CurrentTreatment
 * @property {Medication[]} medications
 * @property {YesNo} physicalTherapy
 * @property {string} physicalTherapyDetails
 * @property {YesNo} injections
 * @property {string} injectionDetails
 * @property {YesNo} braceOrSplint
 * @property {string} braceDetails
 * @property {string} otherTreatments
 * @property {Allergy[]} allergies
 */

/**
 * @typedef {Object} PreviousSurgery
 * @property {string} procedure
 * @property {string} date
 * @property {string} outcome
 */

/**
 * @typedef {Object} SurgicalHistory
 * @property {YesNo} previousOrthopedicSurgery
 * @property {PreviousSurgery[]} surgeries
 * @property {YesNo} anesthesiaComplications
 * @property {string} anesthesiaDetails
 * @property {'yes' | 'no' | 'undecided' | ''} willingToConsiderSurgery
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {PainAssessment} painAssessment
 * @property {DASHQuestionnaire} dashQuestionnaire
 * @property {RangeOfMotion} rangeOfMotion
 * @property {StrengthTesting} strengthTesting
 * @property {FunctionalLimitations} functionalLimitations
 * @property {ImagingHistory} imagingHistory
 * @property {CurrentTreatment} currentTreatment
 * @property {SurgicalHistory} surgicalHistory
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
 * @property {number | null} dashScore
 * @property {string} dashCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.OrthopedicAssessment`.

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
      sex: '',
      occupation: '',
      dominantHand: ''
    },
    chiefComplaint: {
      primaryConcern: '',
      affectedJoint: '',
      side: '',
      duration: '',
      onsetType: '',
      aggravatingFactors: []
    },
    painAssessment: {
      currentPainLevel: null,
      worstPain: null,
      bestPain: null,
      painCharacter: '',
      painFrequency: '',
      nightPain: '',
      painWithWeightBearing: ''
    },
    dashQuestionnaire: {
      q1: null, q2: null, q3: null, q4: null, q5: null,
      q6: null, q7: null, q8: null, q9: null, q10: null,
      q11: null, q12: null, q13: null, q14: null, q15: null,
      q16: null, q17: null, q18: null, q19: null, q20: null,
      q21: null, q22: null, q23: null, q24: null, q25: null,
      q26: null, q27: null, q28: null, q29: null, q30: null
    },
    rangeOfMotion: {
      joint: '',
      flexion: null,
      extension: null,
      abduction: null,
      adduction: null,
      internalRotation: null,
      externalRotation: null,
      notes: ''
    },
    strengthTesting: {
      gripStrengthLeft: null,
      gripStrengthRight: null,
      manualMuscleGrade: '',
      specificWeaknesses: ''
    },
    functionalLimitations: {
      difficultyWithADLs: [],
      mobilityAids: [],
      workRestrictions: '',
      sportRestrictions: ''
    },
    imagingHistory: {
      xRay: { performed: '', date: '', findings: '' },
      mri: { performed: '', date: '', findings: '' },
      ctScan: { performed: '', date: '', findings: '' },
      ultrasound: { performed: '', date: '', findings: '' }
    },
    currentTreatment: {
      medications: [],
      physicalTherapy: '',
      physicalTherapyDetails: '',
      injections: '',
      injectionDetails: '',
      braceOrSplint: '',
      braceDetails: '',
      otherTreatments: '',
      allergies: []
    },
    surgicalHistory: {
      previousOrthopedicSurgery: '',
      surgeries: [],
      anesthesiaComplications: '',
      anesthesiaDetails: '',
      willingToConsiderSurgery: ''
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
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * DASH score category label.
 *   0-20   = No disability
 *   21-40  = Mild disability
 *   41-60  = Moderate disability
 *   61-80  = Severe disability
 *   81-100 = Very severe disability
 */
function dashCategory(score) {
  if (score === null || score === undefined) return '';
  if (score <= 20) return 'No disability';
  if (score <= 40) return 'Mild disability';
  if (score <= 60) return 'Moderate disability';
  if (score <= 80) return 'Severe disability';
  return 'Very severe disability';
}

/** Map a DASH category to a CSS class for the score badge. */
function dashCategoryClass(score) {
  if (score === null || score === undefined) return 'dash-none';
  if (score <= 20) return 'dash-no';
  if (score <= 40) return 'dash-mild';
  if (score <= 60) return 'dash-moderate';
  if (score <= 80) return 'dash-severe';
  return 'dash-very-severe';
}

export { emptyAssessment, calculateAge, dashCategory, dashCategoryClass };
