// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Ophthalmology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage. It also exports
// the snellen helpers and grade label/colour helpers used by the grader.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'left' | 'right' | 'both' | ''} AffectedEye
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {'normal' | 'mild' | 'moderate' | 'severe' | 'blindness'} VAGrade
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
 * @property {AffectedEye} affectedEye
 * @property {'sudden' | 'gradual' | ''} onsetType
 * @property {string} durationValue
 * @property {'hours' | 'days' | 'weeks' | 'months' | 'years' | ''} durationUnit
 * @property {YesNo} painPresent
 * @property {string} painSeverity
 */

/**
 * @typedef {Object} VisualAcuity
 * @property {string} distanceVaRightUncorrected
 * @property {string} distanceVaRightCorrected
 * @property {string} distanceVaLeftUncorrected
 * @property {string} distanceVaLeftCorrected
 * @property {string} nearVaRight
 * @property {string} nearVaLeft
 * @property {string} pinholeRight
 * @property {string} pinholeLeft
 * @property {string} refractionRight
 * @property {string} refractionLeft
 */

/**
 * @typedef {Object} OcularHistory
 * @property {YesNo} previousEyeConditions
 * @property {string} previousEyeConditionDetails
 * @property {YesNo} previousEyeSurgery
 * @property {string} previousEyeSurgeryDetails
 * @property {YesNo} laserTreatment
 * @property {string} laserTreatmentDetails
 * @property {YesNo} ocularTrauma
 * @property {string} ocularTraumaDetails
 * @property {YesNo} amblyopia
 * @property {AffectedEye} amblyopiaEye
 */

/**
 * @typedef {Object} AnteriorSegment
 * @property {YesNo} lidsNormal
 * @property {string} lidsDetails
 * @property {YesNo} conjunctivaNormal
 * @property {string} conjunctivaDetails
 * @property {YesNo} corneaNormal
 * @property {string} corneaDetails
 * @property {YesNo} anteriorChamberNormal
 * @property {string} anteriorChamberDetails
 * @property {YesNo} irisNormal
 * @property {string} irisDetails
 * @property {YesNo} lensNormal
 * @property {string} lensDetails
 * @property {number | null} iopRight
 * @property {number | null} iopLeft
 * @property {'goldmann' | 'tonopen' | 'icare' | 'non-contact' | ''} iopMethod
 */

/**
 * @typedef {Object} PosteriorSegment
 * @property {YesNo} fundusNormal
 * @property {string} fundusDetails
 * @property {YesNo} opticDiscNormal
 * @property {string} opticDiscDetails
 * @property {string} cupToDiscRatioRight
 * @property {string} cupToDiscRatioLeft
 * @property {YesNo} maculaNormal
 * @property {string} maculaDetails
 * @property {YesNo} retinalVesselsNormal
 * @property {string} retinalVesselsDetails
 * @property {YesNo} vitreousNormal
 * @property {string} vitreousDetails
 */

/**
 * @typedef {Object} VisualFieldPupils
 * @property {YesNo} visualFieldTestPerformed
 * @property {'confrontation' | 'humphrey' | 'goldmann' | 'octopus' | ''} visualFieldTestType
 * @property {'normal' | 'abnormal' | ''} visualFieldResultRight
 * @property {'normal' | 'abnormal' | ''} visualFieldResultLeft
 * @property {string} visualFieldDetails
 * @property {'normal' | 'sluggish' | 'fixed' | ''} pupilReactionRight
 * @property {'normal' | 'sluggish' | 'fixed' | ''} pupilReactionLeft
 * @property {YesNo} rapdPresent
 * @property {AffectedEye} rapdEye
 * @property {YesNo} colourVisionNormal
 * @property {string} colourVisionDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} OphthalmicAllergy
 * @property {string} allergen
 * @property {string} reaction
 * @property {AllergySeverity} severity
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} eyeDrops
 * @property {Medication[]} oralMedications
 * @property {OphthalmicAllergy[]} ophthalmicDrugAllergies
 */

/**
 * @typedef {Object} SystemicConditions
 * @property {YesNo} diabetes
 * @property {'type1' | 'type2' | ''} diabetesType
 * @property {'well-controlled' | 'poorly-controlled' | ''} diabetesControl
 * @property {YesNo} diabeticRetinopathy
 * @property {'background' | 'pre-proliferative' | 'proliferative' | 'maculopathy' | ''} diabeticRetinopathyStage
 * @property {YesNo} hypertension
 * @property {YesNo} hypertensionControlled
 * @property {YesNo} autoimmune
 * @property {string} autoimmuneDetails
 * @property {YesNo} thyroidEyeDisease
 * @property {string} thyroidEyeDiseaseDetails
 * @property {YesNo} neurological
 * @property {string} neurologicalDetails
 */

/**
 * @typedef {Object} FunctionalImpact
 * @property {'current-driver' | 'ceased-driving' | 'never-driven' | ''} drivingStatus
 * @property {string} drivingConcerns
 * @property {'no-difficulty' | 'mild-difficulty' | 'moderate-difficulty' | 'severe-difficulty' | 'unable' | ''} readingAbility
 * @property {YesNo} adlLimitations
 * @property {string} adlLimitationDetails
 * @property {YesNo} fallsRisk
 * @property {string} fallsDetails
 * @property {YesNo} supportNeeds
 * @property {string} supportDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {VisualAcuity} visualAcuity
 * @property {OcularHistory} ocularHistory
 * @property {AnteriorSegment} anteriorSegment
 * @property {PosteriorSegment} posteriorSegment
 * @property {VisualFieldPupils} visualFieldPupils
 * @property {CurrentMedications} currentMedications
 * @property {SystemicConditions} systemicConditions
 * @property {FunctionalImpact} functionalImpact
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {VAGrade} grade
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
 * @property {VAGrade} vaGrade
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.OphthalmologyAssessment`.

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
      affectedEye: '',
      onsetType: '',
      durationValue: '',
      durationUnit: '',
      painPresent: '',
      painSeverity: ''
    },
    visualAcuity: {
      distanceVaRightUncorrected: '',
      distanceVaRightCorrected: '',
      distanceVaLeftUncorrected: '',
      distanceVaLeftCorrected: '',
      nearVaRight: '',
      nearVaLeft: '',
      pinholeRight: '',
      pinholeLeft: '',
      refractionRight: '',
      refractionLeft: ''
    },
    ocularHistory: {
      previousEyeConditions: '',
      previousEyeConditionDetails: '',
      previousEyeSurgery: '',
      previousEyeSurgeryDetails: '',
      laserTreatment: '',
      laserTreatmentDetails: '',
      ocularTrauma: '',
      ocularTraumaDetails: '',
      amblyopia: '',
      amblyopiaEye: ''
    },
    anteriorSegment: {
      lidsNormal: '',
      lidsDetails: '',
      conjunctivaNormal: '',
      conjunctivaDetails: '',
      corneaNormal: '',
      corneaDetails: '',
      anteriorChamberNormal: '',
      anteriorChamberDetails: '',
      irisNormal: '',
      irisDetails: '',
      lensNormal: '',
      lensDetails: '',
      iopRight: null,
      iopLeft: null,
      iopMethod: ''
    },
    posteriorSegment: {
      fundusNormal: '',
      fundusDetails: '',
      opticDiscNormal: '',
      opticDiscDetails: '',
      cupToDiscRatioRight: '',
      cupToDiscRatioLeft: '',
      maculaNormal: '',
      maculaDetails: '',
      retinalVesselsNormal: '',
      retinalVesselsDetails: '',
      vitreousNormal: '',
      vitreousDetails: ''
    },
    visualFieldPupils: {
      visualFieldTestPerformed: '',
      visualFieldTestType: '',
      visualFieldResultRight: '',
      visualFieldResultLeft: '',
      visualFieldDetails: '',
      pupilReactionRight: '',
      pupilReactionLeft: '',
      rapdPresent: '',
      rapdEye: '',
      colourVisionNormal: '',
      colourVisionDetails: ''
    },
    currentMedications: {
      eyeDrops: [],
      oralMedications: [],
      ophthalmicDrugAllergies: []
    },
    systemicConditions: {
      diabetes: '',
      diabetesType: '',
      diabetesControl: '',
      diabeticRetinopathy: '',
      diabeticRetinopathyStage: '',
      hypertension: '',
      hypertensionControlled: '',
      autoimmune: '',
      autoimmuneDetails: '',
      thyroidEyeDisease: '',
      thyroidEyeDiseaseDetails: '',
      neurological: '',
      neurologicalDetails: ''
    },
    functionalImpact: {
      drivingStatus: '',
      drivingConcerns: '',
      readingAbility: '',
      adlLimitations: '',
      adlLimitationDetails: '',
      fallsRisk: '',
      fallsDetails: '',
      supportNeeds: '',
      supportDetails: ''
    }
  };
}

/**
 * Convert a Snellen fraction string (e.g. '6/6', '6/12', '6/60') to a
 * decimal acuity value. Returns null if the string cannot be parsed.
 * @param {string} snellen
 * @returns {number | null}
 */
function snellenToDecimal(snellen) {
  if (!snellen) return null;
  const cleaned = String(snellen).trim().replace(/\s+/g, '');
  const parts = cleaned.split('/');
  if (parts.length !== 2) return null;
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

/**
 * VA grade label.
 * @param {VAGrade} grade
 */
function vaGradeLabel(grade) {
  switch (grade) {
    case 'normal':    return 'Normal — 6/6 (20/20) or better';
    case 'mild':      return 'Mild Impairment — around 6/12 (20/40)';
    case 'moderate':  return 'Moderate Impairment — 6/18 to 6/60';
    case 'severe':    return 'Severe Impairment — 6/60 to 3/60';
    case 'blindness': return 'Blindness — Worse than 3/60';
    default:          return `VA Grade: ${grade}`;
  }
}

/**
 * VA grade CSS class for badge styling.
 * @param {VAGrade} grade
 */
function vaGradeClass(grade) {
  switch (grade) {
    case 'normal':    return 'grade-normal';
    case 'mild':      return 'grade-mild';
    case 'moderate':  return 'grade-moderate';
    case 'severe':    return 'grade-severe';
    case 'blindness': return 'grade-blindness';
    default:          return '';
  }
}

export { emptyAssessment, snellenToDecimal, vaGradeLabel, vaGradeClass };
