// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Attention Deficit Assessment.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'mild' | 'moderate' | 'anaphylaxis' | ''} AllergySeverity
 * @typedef {0 | 1 | 2 | 3 | 4 | null} ASRSScore
 * @typedef {'unlikely' | 'possible' | 'likely' | 'highly-likely'} ADHDClassification
 * @typedef {'inattentive' | 'hyperactive-impulsive' | 'combined' | 'unspecified'} ADHDSubtype
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AttentionDeficitAssessment`.
(function () {
'use strict';
window.AttentionDeficitAssessment = window.AttentionDeficitAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric ASRS scores default to `null`; lists default to `[]`.
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      occupation: '',
      educationLevel: ''
    },
    asrsPartA: {
      focusDifficulty: null,
      organizationDifficulty: null,
      rememberingDifficulty: null,
      avoidingTasks: null,
      fidgeting: null,
      overlyActive: null
    },
    asrsPartB: {
      carelessMistakes: null,
      attentionDifficulty: null,
      concentrationDifficulty: null,
      misplacingThings: null,
      distractedByNoise: null,
      leavingSeat: null,
      restlessness: null,
      difficultyRelaxing: null,
      talkingTooMuch: null,
      finishingSentences: null,
      difficultyWaiting: null,
      interruptingOthers: null
    },
    childhoodHistory: {
      childhoodSymptoms: '',
      childhoodSymptomsDetails: '',
      schoolPerformance: '',
      behaviouralReports: '',
      behaviouralReportsDetails: '',
      onsetBeforeAge12: ''
    },
    functionalImpact: {
      workAcademicImpact: '',
      relationshipImpact: '',
      dailyLivingImpact: '',
      financialManagementImpact: '',
      timeManagementImpact: ''
    },
    comorbidConditions: {
      anxiety: '',
      anxietyDetails: '',
      depression: '',
      depressionDetails: '',
      substanceUse: '',
      substanceUseDetails: '',
      sleepDisorders: '',
      sleepDisordersDetails: '',
      learningDisabilities: '',
      learningDisabilitiesDetails: '',
      autismSpectrum: '',
      autismSpectrumDetails: ''
    },
    medications: [],
    allergies: [],
    medicalHistory: {
      cardiovascularIssues: '',
      cardiovascularDetails: '',
      seizureHistory: '',
      seizureDetails: '',
      ticDisorder: '',
      ticDetails: '',
      thyroidDisease: '',
      thyroidDetails: '',
      headInjuries: '',
      headInjuryDetails: ''
    },
    socialSupport: {
      familyHistoryADHD: '',
      familyHistoryDetails: '',
      supportSystems: '',
      copingStrategies: '',
      previousAssessments: '',
      previousAssessmentDetails: '',
      previousDiagnosis: '',
      previousDiagnosisDetails: ''
    }
  };
}

// ─── Pure helpers (mirror src/lib/engine/utils.ts) ───────────────

/** Sum an array of ASRS scores, treating null as 0. */
function sumScores(scores) {
  let total = 0;
  for (const s of scores) total += (s == null ? 0 : Number(s));
  return total;
}

/**
 * Count Part A items in the "shaded" (clinically significant) range:
 *  - Items 1-3 (inattentive): score >= 2 is shaded
 *  - Items 4-6 (hyperactive): score >= 3 is shaded
 */
function countPartAShadedItems(focus, org, remember, avoid, fidget, motor) {
  let count = 0;
  if ((focus ?? 0) >= 2) count++;
  if ((org ?? 0) >= 2) count++;
  if ((remember ?? 0) >= 2) count++;
  if ((avoid ?? 0) >= 3) count++;
  if ((fidget ?? 0) >= 3) count++;
  if ((motor ?? 0) >= 3) count++;
  return count;
}

/** Determine ADHD classification from ASRS total + Part A screener result. */
function classifyFromTotal(total, partAScreenerPositive) {
  if (partAScreenerPositive && total >= 46) return 'highly-likely';
  if (partAScreenerPositive && total >= 28) return 'likely';
  if (partAScreenerPositive || total >= 24) return 'possible';
  return 'unlikely';
}

/** Determine ADHD subtype based on the inattentive vs hyperactive subscores. */
function determineSubtype(inattentiveSubscore, hyperactiveSubscore, classification) {
  if (classification === 'unlikely') return 'unspecified';
  const threshold = 14;
  const inElevated = inattentiveSubscore >= threshold;
  const hyperElevated = hyperactiveSubscore >= threshold;
  if (inElevated && hyperElevated) return 'combined';
  if (inElevated) return 'inattentive';
  if (hyperElevated) return 'hyperactive-impulsive';
  return 'unspecified';
}

/** Friendly frequency label for an ASRS response. */
function asrsFrequencyLabel(score) {
  switch (score) {
    case 0: return 'Never';
    case 1: return 'Rarely';
    case 2: return 'Sometimes';
    case 3: return 'Often';
    case 4: return 'Very Often';
    default: return 'Not answered';
  }
}

/** Friendly label for an ADHD classification. */
function asrsClassificationLabel(classification) {
  switch (classification) {
    case 'unlikely': return 'Unlikely ADHD';
    case 'possible': return 'Possible ADHD';
    case 'likely': return 'Likely ADHD';
    case 'highly-likely': return 'Highly Likely ADHD';
    default: return classification;
  }
}

/** CSS-class hint for the classification badge. */
function asrsClassificationClass(classification) {
  switch (classification) {
    case 'unlikely': return 'control-well';
    case 'possible': return 'control-well-could-be-better';
    case 'likely': return 'control-not-well';
    case 'highly-likely': return 'control-very-poor';
    default: return '';
  }
}

/** Friendly label for an ADHD subtype. */
function adhdSubtypeLabel(subtype) {
  switch (subtype) {
    case 'inattentive': return 'Predominantly Inattentive';
    case 'hyperactive-impulsive': return 'Predominantly Hyperactive-Impulsive';
    case 'combined': return 'Combined Presentation';
    case 'unspecified': return 'Unspecified';
    default: return subtype;
  }
}

Object.assign(window.AttentionDeficitAssessment, {
  emptyAssessment,
  sumScores,
  countPartAShadedItems,
  classifyFromTotal,
  determineSubtype,
  asrsFrequencyLabel,
  asrsClassificationLabel,
  asrsClassificationClass,
  adhdSubtypeLabel
});
})();
