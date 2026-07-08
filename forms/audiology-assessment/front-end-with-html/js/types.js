// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Audiology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.
//
// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AudiologyAssessment`.

(function () {
'use strict';
window.AudiologyAssessment = window.AudiologyAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {object}
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
      affectedEar: '',
      onset: '',
      duration: '',
      progression: ''
    },
    hearingHistory: {
      noiseExposure: '',
      occupationalNoise: '',
      occupationalNoiseDetails: '',
      recreationalNoise: '',
      recreationalNoiseDetails: '',
      previousHearingTests: '',
      previousTestDetails: '',
      hearingAidUse: '',
      hearingAidDetails: ''
    },
    audiometricResults: {
      pureToneAverageRight: null,
      pureToneAverageLeft: null,
      airConductionRight: '',
      airConductionLeft: '',
      boneConductionRight: '',
      boneConductionLeft: '',
      airBoneGapRight: null,
      airBoneGapLeft: null,
      speechRecognitionThresholdRight: null,
      speechRecognitionThresholdLeft: null,
      wordRecognitionScoreRight: null,
      wordRecognitionScoreLeft: null,
      hearingLossType: ''
    },
    tinnitusAssessment: {
      presence: '',
      affectedEar: '',
      character: '',
      severity: '',
      duration: '',
      impactOnDailyLife: '',
      tinnitusHandicapInventoryScore: null
    },
    vestibularSymptoms: {
      vertigo: '',
      vertigoDetails: '',
      dizziness: '',
      balanceProblems: '',
      dixHallpike: '',
      nystagmus: '',
      fallsHistory: '',
      fallsFrequency: ''
    },
    otoscopicFindings: {
      earCanalRight: '',
      earCanalLeft: '',
      tympanicMembraneRight: '',
      tympanicMembraneLeft: '',
      middleEarRight: '',
      middleEarLeft: '',
      earWaxRight: '',
      earWaxLeft: '',
      dischargeRight: '',
      dischargeLeft: '',
      previousSurgery: '',
      previousSurgeryDetails: ''
    },
    medicalHistory: {
      ototoxicMedications: '',
      ototoxicMedicationDetails: '',
      autoimmune: '',
      autoimmuneDetails: '',
      menieres: '',
      otosclerosis: '',
      acousticNeuroma: '',
      infections: '',
      infectionDetails: ''
    },
    functionalCommunication: {
      communicationDifficulties: '',
      communicationDetails: '',
      hearingAidCandidacy: '',
      assistiveDeviceNeeds: '',
      assistiveDeviceDetails: '',
      workImpact: '',
      socialImpact: '',
      hhieScore: null
    }
  };
}

// ──────────────────────────────────────────────────
// Hearing-grade utilities (mirrors engine/utils.ts)
// ──────────────────────────────────────────────────

const GRADE_ORDER = {
  normal: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  profound: 4
};

/** Classify dB HL value into WHO hearing loss grade. */
function classifyDbHL(dbHL) {
  if (dbHL === null || dbHL === undefined) return 'normal';
  if (dbHL <= 25) return 'normal';
  if (dbHL <= 40) return 'mild';
  if (dbHL <= 60) return 'moderate';
  if (dbHL <= 80) return 'severe';
  return 'profound';
}

/** Get the worse (higher severity) of two hearing grades. */
function worseGrade(a, b) {
  return GRADE_ORDER[a] >= GRADE_ORDER[b] ? a : b;
}

/** Hearing grade label for display. */
function hearingGradeLabel(grade) {
  switch (grade) {
    case 'normal':   return 'Normal Hearing (\u226425 dB HL)';
    case 'mild':     return 'Mild Hearing Loss (26-40 dB HL)';
    case 'moderate': return 'Moderate Hearing Loss (41-60 dB HL)';
    case 'severe':   return 'Severe Hearing Loss (61-80 dB HL)';
    case 'profound': return 'Profound Hearing Loss (>80 dB HL)';
    default: return String(grade);
  }
}

/** CSS class for a hearing grade badge. */
function hearingGradeClass(grade) {
  return 'grade-' + (grade || 'normal');
}

Object.assign(window.AudiologyAssessment, {
  emptyAssessment,
  classifyDbHL,
  worseGrade,
  hearingGradeLabel,
  hearingGradeClass,
  GRADE_ORDER
});
})();
