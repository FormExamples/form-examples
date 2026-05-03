// Plain-JavaScript / JSDoc type definitions for the Otolaryngology
// Assessment form. Mirrors the SvelteKit reference data model.
//
// Loaded as a classic <script> (no ES modules) so the page works when
// opened directly via file://. Wrapped in an IIFE to keep locals scoped;
// public symbols are attached to `window.OtolaryngologyAssessment`.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'left' | 'right' | 'both' | ''} Laterality
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} occupation
 */

/**
 * @typedef {Object} PresentingComplaint
 * @property {YesNo} earSymptoms
 * @property {YesNo} noseSymptoms
 * @property {YesNo} throatSymptoms
 * @property {YesNo} neckSymptoms
 * @property {string} chiefComplaint
 */

/**
 * @typedef {Object} HistoryOfPresentIllness
 * @property {string} onsetDate
 * @property {'sudden' | 'gradual' | ''} onsetType
 * @property {'worsening' | 'stable' | 'improving' | 'fluctuating' | ''} progression
 * @property {Laterality} laterality
 * @property {YesNo} previousEpisodes
 * @property {string} aggravatingFactors
 * @property {string} relievingFactors
 * @property {string} associatedSymptoms
 */

/**
 * @typedef {Object} PastENTHistory
 * @property {YesNo} priorEntSurgery
 * @property {string} priorEntSurgeryDetails
 * @property {YesNo} chronicSinusitis
 * @property {YesNo} allergicRhinitis
 * @property {YesNo} hearingLoss
 * @property {YesNo} tinnitus
 * @property {YesNo} vertigo
 * @property {YesNo} hearingAids
 * @property {YesNo} headNeckCancer
 * @property {YesNo} headNeckRadiotherapy
 * @property {YesNo} smoking
 * @property {YesNo} alcohol
 */

/**
 * SNOT-22 sino-nasal symptom scores. Each item rated 0 (no problem) - 5
 * (problem as bad as it can be); blank when unanswered. Total 0 - 110.
 *
 * @typedef {Object} Snot22Questionnaire
 * @property {number | null} needToBlowNose
 * @property {number | null} sneezing
 * @property {number | null} runnyNose
 * @property {number | null} nasalBlockage
 * @property {number | null} lossOfSmellTaste
 * @property {number | null} coughing
 * @property {number | null} postNasalDischarge
 * @property {number | null} thickNasalDischarge
 * @property {number | null} earFullness
 * @property {number | null} dizziness
 * @property {number | null} earPain
 * @property {number | null} facialPainPressure
 * @property {number | null} difficultyFallingAsleep
 * @property {number | null} wakingUpAtNight
 * @property {number | null} lackOfGoodNightsSleep
 * @property {number | null} wakingUpTired
 * @property {number | null} fatigue
 * @property {number | null} reducedProductivity
 * @property {number | null} reducedConcentration
 * @property {number | null} frustratedRestlessIrritable
 * @property {number | null} sad
 * @property {number | null} embarrassed
 */

/**
 * @typedef {Object} ExternalExamination
 * @property {YesNo} facialAsymmetry
 * @property {YesNo} facialSwelling
 * @property {YesNo} skinLesions
 * @property {string} externalEarFindings
 * @property {string} externalNoseFindings
 * @property {string} examinationNotes
 */

/**
 * @typedef {Object} OtoscopySide
 * @property {'normal' | 'erythematous' | 'bulging' | 'retracted' | 'perforated' | 'effusion' | ''} tympanicMembrane
 * @property {'normal' | 'wax' | 'discharge' | 'foreign-body' | 'inflamed' | ''} canal
 * @property {YesNo} mobility
 */

/**
 * @typedef {Object} Otoscopy
 * @property {OtoscopySide} right
 * @property {OtoscopySide} left
 * @property {string} otoscopyNotes
 */

/**
 * @typedef {Object} AnteriorRhinoscopySide
 * @property {'midline' | 'deviated-left' | 'deviated-right' | ''} septum
 * @property {'normal' | 'pale' | 'congested' | 'pale-boggy' | ''} mucosa
 * @property {'none' | 'small' | 'medium' | 'large' | ''} polyps
 * @property {'none' | 'clear' | 'mucoid' | 'purulent' | 'blood' | ''} discharge
 * @property {'normal' | 'mild' | 'moderate' | 'severe' | ''} turbinateHypertrophy
 */

/**
 * @typedef {Object} AnteriorRhinoscopy
 * @property {AnteriorRhinoscopySide} right
 * @property {AnteriorRhinoscopySide} left
 * @property {string} rhinoscopyNotes
 */

/**
 * @typedef {Object} OropharyngealNeckExamination
 * @property {'normal' | 'erythematous' | 'exudate' | 'ulcerated' | ''} oralMucosa
 * @property {'normal' | 'enlarged' | 'absent' | 'asymmetric' | ''} tonsils
 * @property {'normal' | 'erythematous' | 'cobblestone' | 'postNasalDrip' | ''} pharynx
 * @property {'normal' | 'asymmetric' | 'limited' | ''} palateMovement
 * @property {YesNo} cervicalLymphadenopathy
 * @property {string} cervicalLymphadenopathyDetails
 * @property {YesNo} thyroidEnlarged
 * @property {YesNo} neckMass
 * @property {string} neckMassDetails
 * @property {string} examinationNotes
 */

/**
 * @typedef {Object} ClinicalImpressionPlan
 * @property {string} workingDiagnosis
 * @property {string} differentialDiagnosis
 * @property {YesNo} investigationsRequired
 * @property {string} investigationsDetails
 * @property {YesNo} medicationPrescribed
 * @property {string} medicationDetails
 * @property {YesNo} referralRequired
 * @property {string} referralDetails
 * @property {YesNo} surgeryConsidered
 * @property {string} surgeryDetails
 * @property {string} followUpPlan
 * @property {string} patientEducation
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {PresentingComplaint} presentingComplaint
 * @property {HistoryOfPresentIllness} historyOfPresentIllness
 * @property {PastENTHistory} pastEntHistory
 * @property {Snot22Questionnaire} snot22
 * @property {ExternalExamination} externalExamination
 * @property {Otoscopy} otoscopy
 * @property {AnteriorRhinoscopy} anteriorRhinoscopy
 * @property {OropharyngealNeckExamination} oropharyngealNeckExamination
 * @property {ClinicalImpressionPlan} clinicalImpressionPlan
 */

/**
 * @typedef {'mild' | 'moderate' | 'severe'} SeverityLevel
 *
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} score
 *
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 *
 * @typedef {Object} GradingResult
 * @property {number} totalScore
 * @property {SeverityLevel} severityLevel
 * @property {number} answeredCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

(function () {
'use strict';
window.OtolaryngologyAssessment = window.OtolaryngologyAssessment || {};

/**
 * Build a fresh empty assessment. Strings default to `''`; numeric SNOT-22
 * fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      occupation: ''
    },
    presentingComplaint: {
      earSymptoms: '',
      noseSymptoms: '',
      throatSymptoms: '',
      neckSymptoms: '',
      chiefComplaint: ''
    },
    historyOfPresentIllness: {
      onsetDate: '',
      onsetType: '',
      progression: '',
      laterality: '',
      previousEpisodes: '',
      aggravatingFactors: '',
      relievingFactors: '',
      associatedSymptoms: ''
    },
    pastEntHistory: {
      priorEntSurgery: '',
      priorEntSurgeryDetails: '',
      chronicSinusitis: '',
      allergicRhinitis: '',
      hearingLoss: '',
      tinnitus: '',
      vertigo: '',
      hearingAids: '',
      headNeckCancer: '',
      headNeckRadiotherapy: '',
      smoking: '',
      alcohol: ''
    },
    snot22: {
      needToBlowNose: null,
      sneezing: null,
      runnyNose: null,
      nasalBlockage: null,
      lossOfSmellTaste: null,
      coughing: null,
      postNasalDischarge: null,
      thickNasalDischarge: null,
      earFullness: null,
      dizziness: null,
      earPain: null,
      facialPainPressure: null,
      difficultyFallingAsleep: null,
      wakingUpAtNight: null,
      lackOfGoodNightsSleep: null,
      wakingUpTired: null,
      fatigue: null,
      reducedProductivity: null,
      reducedConcentration: null,
      frustratedRestlessIrritable: null,
      sad: null,
      embarrassed: null
    },
    externalExamination: {
      facialAsymmetry: '',
      facialSwelling: '',
      skinLesions: '',
      externalEarFindings: '',
      externalNoseFindings: '',
      examinationNotes: ''
    },
    otoscopy: {
      right: { tympanicMembrane: '', canal: '', mobility: '' },
      left: { tympanicMembrane: '', canal: '', mobility: '' },
      otoscopyNotes: ''
    },
    anteriorRhinoscopy: {
      right: { septum: '', mucosa: '', polyps: '', discharge: '', turbinateHypertrophy: '' },
      left: { septum: '', mucosa: '', polyps: '', discharge: '', turbinateHypertrophy: '' },
      rhinoscopyNotes: ''
    },
    oropharyngealNeckExamination: {
      oralMucosa: '',
      tonsils: '',
      pharynx: '',
      palateMovement: '',
      cervicalLymphadenopathy: '',
      cervicalLymphadenopathyDetails: '',
      thyroidEnlarged: '',
      neckMass: '',
      neckMassDetails: '',
      examinationNotes: ''
    },
    clinicalImpressionPlan: {
      workingDiagnosis: '',
      differentialDiagnosis: '',
      investigationsRequired: '',
      investigationsDetails: '',
      medicationPrescribed: '',
      medicationDetails: '',
      referralRequired: '',
      referralDetails: '',
      surgeryConsidered: '',
      surgeryDetails: '',
      followUpPlan: '',
      patientEducation: ''
    }
  };
}

/** Ordered list of SNOT-22 item keys (used by grader, UI, progress). */
const SNOT22_ITEMS = [
  { key: 'needToBlowNose',           label: 'Need to blow nose' },
  { key: 'sneezing',                 label: 'Sneezing' },
  { key: 'runnyNose',                label: 'Runny nose' },
  { key: 'nasalBlockage',            label: 'Nasal blockage' },
  { key: 'lossOfSmellTaste',         label: 'Loss of smell or taste' },
  { key: 'coughing',                 label: 'Cough' },
  { key: 'postNasalDischarge',       label: 'Post-nasal discharge' },
  { key: 'thickNasalDischarge',      label: 'Thick nasal discharge' },
  { key: 'earFullness',              label: 'Ear fullness' },
  { key: 'dizziness',                label: 'Dizziness' },
  { key: 'earPain',                  label: 'Ear pain' },
  { key: 'facialPainPressure',       label: 'Facial pain or pressure' },
  { key: 'difficultyFallingAsleep',  label: 'Difficulty falling asleep' },
  { key: 'wakingUpAtNight',          label: 'Waking up at night' },
  { key: 'lackOfGoodNightsSleep',    label: 'Lack of a good night\u2019s sleep' },
  { key: 'wakingUpTired',            label: 'Waking up tired' },
  { key: 'fatigue',                  label: 'Fatigue' },
  { key: 'reducedProductivity',      label: 'Reduced productivity' },
  { key: 'reducedConcentration',     label: 'Reduced concentration' },
  { key: 'frustratedRestlessIrritable', label: 'Frustrated, restless, or irritable' },
  { key: 'sad',                      label: 'Sad' },
  { key: 'embarrassed',              label: 'Embarrassed' }
];

const SNOT22_OPTIONS = [
  { value: 0, label: 'No problem' },
  { value: 1, label: 'Very mild' },
  { value: 2, label: 'Mild' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Severe' },
  { value: 5, label: 'As bad as it can be' }
];

Object.assign(window.OtolaryngologyAssessment, {
  emptyAssessment,
  SNOT22_ITEMS,
  SNOT22_OPTIONS
});
})();
