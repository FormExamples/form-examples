// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Mast Cell Activation Syndrome
// (MCAS) Assessment form.
//
// Builds and exports the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {0 | 1 | 2 | 3 | null} SymptomSeverity
 * @typedef {'never' | 'rarely' | 'sometimes' | 'often' | 'daily' | ''} SymptomFrequency
 * @typedef {'none' | 'mild' | 'moderate' | 'severe' | ''} QualityOfLife
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} SymptomOverview
 * @property {string} onsetDate
 * @property {string} symptomDuration
 * @property {SymptomFrequency} symptomFrequency
 * @property {QualityOfLife} qualityOfLife
 */

/**
 * @typedef {Object} SymptomDetail
 * @property {SymptomSeverity} severity
 * @property {SymptomFrequency} frequency
 */

/**
 * @typedef {Object} DermatologicalSymptoms
 * @property {SymptomDetail} flushing
 * @property {SymptomDetail} urticaria
 * @property {SymptomDetail} angioedema
 * @property {SymptomDetail} pruritus
 */

/**
 * @typedef {Object} GastrointestinalSymptoms
 * @property {SymptomDetail} abdominalPain
 * @property {SymptomDetail} nausea
 * @property {SymptomDetail} diarrhea
 * @property {SymptomDetail} bloating
 */

/**
 * @typedef {Object} CardiovascularSymptoms
 * @property {SymptomDetail} tachycardia
 * @property {SymptomDetail} hypotension
 * @property {SymptomDetail} presyncope
 * @property {SymptomDetail} syncope
 */

/**
 * @typedef {Object} RespiratorySymptoms
 * @property {SymptomDetail} wheezing
 * @property {SymptomDetail} dyspnea
 * @property {SymptomDetail} nasalCongestion
 * @property {SymptomDetail} throatTightening
 */

/**
 * @typedef {Object} NeurologicalSymptoms
 * @property {SymptomDetail} headache
 * @property {SymptomDetail} brainFog
 * @property {SymptomDetail} dizziness
 * @property {SymptomDetail} fatigue
 */

/**
 * @typedef {Object} TriggersPatterns
 * @property {string} foodTriggers
 * @property {string} environmentalTriggers
 * @property {YesNo} stressTriggers
 * @property {YesNo} exerciseTrigger
 * @property {YesNo} temperatureTrigger
 * @property {string} medicationTriggers
 */

/**
 * @typedef {Object} LaboratoryResults
 * @property {number | null} serumTryptase
 * @property {number | null} histamine
 * @property {number | null} prostaglandinD2
 * @property {number | null} chromograninA
 */

/**
 * @typedef {Object} CurrentTreatment
 * @property {YesNo} antihistamines
 * @property {YesNo} mastCellStabilizers
 * @property {YesNo} leukotrienInhibitors
 * @property {YesNo} epinephrine
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {SymptomOverview} symptomOverview
 * @property {DermatologicalSymptoms} dermatologicalSymptoms
 * @property {GastrointestinalSymptoms} gastrointestinalSymptoms
 * @property {CardiovascularSymptoms} cardiovascularSymptoms
 * @property {RespiratorySymptoms} respiratorySymptoms
 * @property {NeurologicalSymptoms} neurologicalSymptoms
 * @property {TriggersPatterns} triggersPatterns
 * @property {LaboratoryResults} laboratoryResults
 * @property {CurrentTreatment} currentTreatment
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
 * @property {number} symptomScore
 * @property {string} mcasCategory
 * @property {number} organSystemsAffected
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.MastCellActivationSyndromeAssessment`.

/** @returns {SymptomDetail} */
function emptySymptomDetail() {
  return { severity: null, frequency: '' };
}

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; symptom
 * details default to `{ severity: null, frequency: '' }`.
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
    symptomOverview: {
      onsetDate: '',
      symptomDuration: '',
      symptomFrequency: '',
      qualityOfLife: ''
    },
    dermatologicalSymptoms: {
      flushing: emptySymptomDetail(),
      urticaria: emptySymptomDetail(),
      angioedema: emptySymptomDetail(),
      pruritus: emptySymptomDetail()
    },
    gastrointestinalSymptoms: {
      abdominalPain: emptySymptomDetail(),
      nausea: emptySymptomDetail(),
      diarrhea: emptySymptomDetail(),
      bloating: emptySymptomDetail()
    },
    cardiovascularSymptoms: {
      tachycardia: emptySymptomDetail(),
      hypotension: emptySymptomDetail(),
      presyncope: emptySymptomDetail(),
      syncope: emptySymptomDetail()
    },
    respiratorySymptoms: {
      wheezing: emptySymptomDetail(),
      dyspnea: emptySymptomDetail(),
      nasalCongestion: emptySymptomDetail(),
      throatTightening: emptySymptomDetail()
    },
    neurologicalSymptoms: {
      headache: emptySymptomDetail(),
      brainFog: emptySymptomDetail(),
      dizziness: emptySymptomDetail(),
      fatigue: emptySymptomDetail()
    },
    triggersPatterns: {
      foodTriggers: '',
      environmentalTriggers: '',
      stressTriggers: '',
      exerciseTrigger: '',
      temperatureTrigger: '',
      medicationTriggers: ''
    },
    laboratoryResults: {
      serumTryptase: null,
      histamine: null,
      prostaglandinD2: null,
      chromograninA: null
    },
    currentTreatment: {
      antihistamines: '',
      mastCellStabilizers: '',
      leukotrienInhibitors: '',
      epinephrine: ''
    }
  };
}

/**
 * MCAS Symptom Score category label.
 *   0-10  = Minimal
 *   11-20 = Mild
 *   21-30 = Moderate
 *   31-40 = Severe
 * @param {number} score
 */
function mcasCategory(score) {
  if (score <= 10) return 'Minimal';
  if (score <= 20) return 'Mild';
  if (score <= 30) return 'Moderate';
  return 'Severe';
}

/**
 * CSS class hint for the MCAS score badge.
 * @param {number} score
 */
function mcasCategoryClass(score) {
  if (score <= 10) return 'mcas-minimal';
  if (score <= 20) return 'mcas-mild';
  if (score <= 30) return 'mcas-moderate';
  return 'mcas-severe';
}

export { emptyAssessment, emptySymptomDetail, mcasCategory, mcasCategoryClass };
