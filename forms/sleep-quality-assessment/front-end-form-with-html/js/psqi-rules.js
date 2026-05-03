// PSQI (Pittsburgh Sleep Quality Index) component definitions and the
// frequency-to-score mapping shared by the grader and flagged-issues
// detector. Mirrors the SvelteKit reference engine in
// `src/lib/engine/psqi-rules.ts`.
//
// PSQI has 7 components, each scored 0–3:
//   0 = No difficulty
//   1 = Slight difficulty
//   2 = Moderate difficulty
//   3 = Severe difficulty
// Total range: 0–21.

// Wrapped in an IIFE; published via window.SleepQualityAssessment.
(function () {
'use strict';
window.SleepQualityAssessment = window.SleepQualityAssessment || {};

/**
 * @typedef {Object} PSQIComponentDefinition
 * @property {string} id
 * @property {number} componentNumber
 * @property {string} name
 * @property {string} description
 */

/** @type {PSQIComponentDefinition[]} */
const psqiComponents = [
  {
    id: 'PSQI-C1',
    componentNumber: 1,
    name: 'Subjective sleep quality',
    description: 'Overall rating of sleep quality during the past month'
  },
  {
    id: 'PSQI-C2',
    componentNumber: 2,
    name: 'Sleep latency',
    description: 'Time taken to fall asleep and frequency of difficulty falling asleep'
  },
  {
    id: 'PSQI-C3',
    componentNumber: 3,
    name: 'Sleep duration',
    description: 'Actual hours of sleep obtained per night'
  },
  {
    id: 'PSQI-C4',
    componentNumber: 4,
    name: 'Sleep efficiency',
    description: 'Percentage of time in bed actually spent sleeping'
  },
  {
    id: 'PSQI-C5',
    componentNumber: 5,
    name: 'Sleep disturbances',
    description: 'Frequency of various sleep-disrupting events'
  },
  {
    id: 'PSQI-C6',
    componentNumber: 6,
    name: 'Sleep medication use',
    description: 'Frequency of using medication to aid sleep'
  },
  {
    id: 'PSQI-C7',
    componentNumber: 7,
    name: 'Daytime dysfunction',
    description: 'Difficulty staying awake and maintaining enthusiasm during the day'
  }
];

/** Frequency response options used throughout the PSQI. */
const frequencyResponseOptions = [
  { value: 'not-during-past-month', label: 'Not during the past month' },
  { value: 'less-than-once-week', label: 'Less than once a week' },
  { value: 'once-or-twice-week', label: 'Once or twice a week' },
  { value: 'three-or-more-week', label: 'Three or more times a week' }
];

/**
 * Convert a frequency option string to a numeric 0–3 score.
 * @param {string} freq
 * @returns {number}
 */
function frequencyToScore(freq) {
  switch (freq) {
    case 'not-during-past-month': return 0;
    case 'less-than-once-week': return 1;
    case 'once-or-twice-week': return 2;
    case 'three-or-more-week': return 3;
    default: return 0;
  }
}

Object.assign(window.SleepQualityAssessment, {
  psqiComponents,
  frequencyResponseOptions,
  frequencyToScore
});
})();
