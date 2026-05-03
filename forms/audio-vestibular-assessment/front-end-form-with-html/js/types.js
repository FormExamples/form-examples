// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Audio-Vestibular Assessment.
//
// Sections (9):
//   1. demographics
//   2. presentingSymptoms
//   3. otoscopicExamination
//   4. pureToneAudiometry  (per-ear air & bone conduction at 0.5/1/2/4 kHz)
//   5. speechAudiometry
//   6. tympanometryAcousticReflexes
//   7. vestibularScreening (HIT, Dix-Hallpike, Romberg, etc.)
//   8. dizzinessHandicapInventory (DHI: 25 items)
//   9. clinicalImpressionReferral
//
// Conventions:
//   - Empty string '' for unanswered text/option fields.
//   - null for unanswered numeric fields.
//   - DHI items take values 'yes' (4 pts), 'sometimes' (2 pts), 'no' (0 pts), or ''.
//   - Lateralized fields use {right, left} sub-objects.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'right' | 'left' | 'both' | ''} Side
 * @typedef {'yes' | 'sometimes' | 'no' | ''} DhiAnswer
 */

/**
 * @typedef {Object} EarThresholds
 * @property {number | null} hz500
 * @property {number | null} hz1000
 * @property {number | null} hz2000
 * @property {number | null} hz4000
 */

/**
 * @typedef {Object} PtaEar
 * @property {EarThresholds} airConduction
 * @property {EarThresholds} boneConduction
 * @property {number | null} pureToneAverage   // auto-calculated 4-freq PTA
 */

/**
 * @typedef {'normal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe' | 'profound' | 'unknown'} HearingLossGrade
 * @typedef {'no-handicap' | 'mild' | 'moderate' | 'severe'} DhiHandicapLevel
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.AudioVestibularAssessment`.
(function () {
'use strict';
window.AudioVestibularAssessment = window.AudioVestibularAssessment || {};

/** Build an empty {hz500, hz1000, hz2000, hz4000} object. */
function emptyEarThresholds() {
  return { hz500: null, hz1000: null, hz2000: null, hz4000: null };
}

/** Build an empty per-ear PTA bundle with air, bone, and PTA-average fields. */
function emptyPtaEar() {
  return {
    airConduction: emptyEarThresholds(),
    boneConduction: emptyEarThresholds(),
    pureToneAverage: null
  };
}

/** Canonical DHI item ordering. 25 items: 7 functional (F), 9 emotional (E),
 * 9 physical (P). Numbering matches the Jacobson & Newman 1990 instrument. */
const DHI_ITEMS = [
  { num: 1,  subscale: 'P', text: 'Does looking up increase your problem?' },
  { num: 2,  subscale: 'E', text: 'Because of your problem, do you feel frustrated?' },
  { num: 3,  subscale: 'F', text: 'Because of your problem, do you restrict your travel for business or recreation?' },
  { num: 4,  subscale: 'P', text: 'Does walking down the aisle of a supermarket increase your problem?' },
  { num: 5,  subscale: 'F', text: 'Because of your problem, do you have difficulty getting into or out of bed?' },
  { num: 6,  subscale: 'F', text: 'Does your problem significantly restrict your participation in social activities such as going out to dinner, going to the movies, dancing, or to parties?' },
  { num: 7,  subscale: 'F', text: 'Because of your problem, do you have difficulty reading?' },
  { num: 8,  subscale: 'P', text: 'Does performing more ambitious activities like sports, dancing, household chores such as sweeping or putting dishes away increase your problem?' },
  { num: 9,  subscale: 'E', text: 'Because of your problem, are you afraid to leave your home without having someone accompany you?' },
  { num: 10, subscale: 'E', text: 'Because of your problem, have you been embarrassed in front of others?' },
  { num: 11, subscale: 'P', text: 'Do quick movements of your head increase your problem?' },
  { num: 12, subscale: 'F', text: 'Because of your problem, do you avoid heights?' },
  { num: 13, subscale: 'P', text: 'Does turning over in bed increase your problem?' },
  { num: 14, subscale: 'F', text: 'Because of your problem, is it difficult for you to do strenuous housework or yardwork?' },
  { num: 15, subscale: 'E', text: 'Because of your problem, are you afraid people may think you are intoxicated?' },
  { num: 16, subscale: 'F', text: 'Because of your problem, is it difficult for you to go for a walk by yourself?' },
  { num: 17, subscale: 'P', text: 'Does walking down a sidewalk increase your problem?' },
  { num: 18, subscale: 'E', text: 'Because of your problem, is it difficult for you to concentrate?' },
  { num: 19, subscale: 'F', text: 'Because of your problem, is it difficult for you to walk around your house in the dark?' },
  { num: 20, subscale: 'E', text: 'Because of your problem, are you afraid to stay home alone?' },
  { num: 21, subscale: 'E', text: 'Because of your problem, do you feel handicapped?' },
  { num: 22, subscale: 'E', text: 'Has the problem placed stress on your relationships with family or friends?' },
  { num: 23, subscale: 'E', text: 'Because of your problem, are you depressed?' },
  { num: 24, subscale: 'F', text: 'Does your problem interfere with your job or household responsibilities?' },
  { num: 25, subscale: 'P', text: 'Does bending over increase your problem?' }
];

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; DHI answers
 * default to `''` (interpreted as not answered, contributing 0 points).
 */
function emptyAssessment() {
  /** @type {Record<string, ''>} */
  const dhiAnswers = {};
  for (const item of DHI_ITEMS) {
    dhiAnswers['q' + item.num] = '';
  }

  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      assessmentDate: ''
    },
    presentingSymptoms: {
      hearingLoss: '',
      hearingLossSide: '',
      hearingLossOnset: '',          // sudden | gradual | fluctuating | ''
      hearingLossDurationMonths: null,
      tinnitus: '',
      tinnitusSide: '',
      otalgia: '',                   // ear pain
      otorrhea: '',                  // ear discharge
      auralFullness: '',
      vertigo: '',
      vertigoCharacter: '',          // spinning | rocking | lightheaded | imbalance | ''
      vertigoEpisodeDurationSeconds: null,
      vertigoFrequencyPerWeek: null,
      imbalance: '',
      falls: '',
      fallsLastYearCount: null,
      headacheMigraine: '',
      neurologicalSymptoms: '',      // weakness, diplopia, dysarthria, etc.
      otherSymptoms: ''
    },
    otoscopicExamination: {
      rightEar: {
        canalStatus: '',     // clear | wax | debris | edema | otorrhea | ''
        tympanicMembrane: '' // intact | retracted | bulging | perforation | effusion | tube | scarred | ''
      },
      leftEar: {
        canalStatus: '',
        tympanicMembrane: ''
      },
      notes: ''
    },
    pureToneAudiometry: {
      rightEar: emptyPtaEar(),
      leftEar: emptyPtaEar(),
      betterEarPureToneAverage: null,        // auto
      asymmetryDb: null,                     // auto |right - left|
      audiometryNotes: ''
    },
    speechAudiometry: {
      rightSrtDb: null,
      leftSrtDb: null,
      rightWordRecognitionPercent: null,
      leftWordRecognitionPercent: null,
      speechAudiometryNotes: ''
    },
    tympanometryAcousticReflexes: {
      rightTympanogram: '',   // A | As | Ad | B | C | ''
      leftTympanogram: '',
      rightAcousticReflexes: '', // present | absent | partial | ''
      leftAcousticReflexes: '',
      notes: ''
    },
    vestibularScreening: {
      headImpulseTest: '',           // normal | abnormal-right | abnormal-left | not-done | ''
      dixHallpike: '',               // negative | positive-right | positive-left | bilateral | not-done | ''
      rombergTest: '',               // normal | abnormal | unable | ''
      tandemGait: '',                // normal | abnormal | unable | ''
      nystagmus: '',                 // none | spontaneous | gaze-evoked | positional | ''
      fukudaSteppingTest: '',        // normal | rotation-right | rotation-left | not-done | ''
      notes: ''
    },
    dizzinessHandicapInventory: dhiAnswers,
    clinicalImpressionReferral: {
      provisionalDiagnosis: '',
      hearingAidCandidate: '',          // yes | no | already-fitted | ''
      vestibularRehabIndicated: '',
      ent_referral: '',
      neurologyReferral: '',
      imagingRequested: '',             // mri | ct | none | ''
      followUpWeeks: null,
      additionalNotes: ''
    }
  };
}

Object.assign(window.AudioVestibularAssessment, {
  emptyAssessment,
  emptyEarThresholds,
  emptyPtaEar,
  DHI_ITEMS
});
})();
