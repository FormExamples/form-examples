// DASS-21 (Depression Anxiety Stress Scales — 21 item) rules.
//
// Each rule maps one questionnaire item to a 0-3 Likert response, or null
// when the patient has not yet answered. The grader sums each subscale and
// doubles the raw total so the score aligns with the DASS-42 normative
// cutoffs (Lovibond & Lovibond, 1995).
//
// Item assignments (canonical DASS-21):
//   Depression - 3, 5, 10, 13, 16, 17, 21
//   Anxiety    - 2, 4, 7, 9, 15, 19, 20
//   Stress     - 1, 6, 8, 11, 12, 14, 18

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DassItem} DassItem
 */

/**
 * @typedef {Object} DassRule
 * @property {string} id
 * @property {'depression' | 'anxiety' | 'stress'} subscale
 * @property {number} itemNumber
 * @property {string} description
 * @property {(d: AssessmentData) => DassItem} evaluate
 */

// Wrapped in an IIFE; published via window.PsychologyAssessment.
(function () {
'use strict';
window.PsychologyAssessment = window.PsychologyAssessment || {};

/** @type {DassRule[]} */
const dass21Rules = [
  // --- Depression ----------------------------------------------------
  {
    id: 'DASS-D-03',
    subscale: 'depression',
    itemNumber: 3,
    description: "I couldn't seem to experience any positive feeling at all.",
    evaluate: (d) => d.dassDepression.item3CouldNotExperiencePositive
  },
  {
    id: 'DASS-D-05',
    subscale: 'depression',
    itemNumber: 5,
    description: 'I found it difficult to work up the initiative to do things.',
    evaluate: (d) => d.dassDepression.item5DifficultInitiating
  },
  {
    id: 'DASS-D-10',
    subscale: 'depression',
    itemNumber: 10,
    description: 'I felt that I had nothing to look forward to.',
    evaluate: (d) => d.dassDepression.item10NothingToLookForwardTo
  },
  {
    id: 'DASS-D-13',
    subscale: 'depression',
    itemNumber: 13,
    description: 'I felt down-hearted and blue.',
    evaluate: (d) => d.dassDepression.item13DownheartedBlue
  },
  {
    id: 'DASS-D-16',
    subscale: 'depression',
    itemNumber: 16,
    description: 'I was unable to become enthusiastic about anything.',
    evaluate: (d) => d.dassDepression.item16UnableToBecomeEnthusiastic
  },
  {
    id: 'DASS-D-17',
    subscale: 'depression',
    itemNumber: 17,
    description: "I felt I wasn't worth much as a person.",
    evaluate: (d) => d.dassDepression.item17NotWorthMuch
  },
  {
    id: 'DASS-D-21',
    subscale: 'depression',
    itemNumber: 21,
    description: 'I felt that life was meaningless.',
    evaluate: (d) => d.dassDepression.item21LifeMeaningless
  },

  // --- Anxiety -------------------------------------------------------
  {
    id: 'DASS-A-02',
    subscale: 'anxiety',
    itemNumber: 2,
    description: 'I was aware of dryness of my mouth.',
    evaluate: (d) => d.dassAnxiety.item2DrynessOfMouth
  },
  {
    id: 'DASS-A-04',
    subscale: 'anxiety',
    itemNumber: 4,
    description:
      'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion).',
    evaluate: (d) => d.dassAnxiety.item4BreathingDifficulty
  },
  {
    id: 'DASS-A-07',
    subscale: 'anxiety',
    itemNumber: 7,
    description: 'I experienced trembling (e.g. in the hands).',
    evaluate: (d) => d.dassAnxiety.item7Trembling
  },
  {
    id: 'DASS-A-09',
    subscale: 'anxiety',
    itemNumber: 9,
    description:
      'I was worried about situations in which I might panic and make a fool of myself.',
    evaluate: (d) => d.dassAnxiety.item9PanicWorry
  },
  {
    id: 'DASS-A-15',
    subscale: 'anxiety',
    itemNumber: 15,
    description: 'I felt I was close to panic.',
    evaluate: (d) => d.dassAnxiety.item15ClosedToPanic
  },
  {
    id: 'DASS-A-19',
    subscale: 'anxiety',
    itemNumber: 19,
    description:
      'I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat).',
    evaluate: (d) => d.dassAnxiety.item19HeartActionAware
  },
  {
    id: 'DASS-A-20',
    subscale: 'anxiety',
    itemNumber: 20,
    description: 'I felt scared without any good reason.',
    evaluate: (d) => d.dassAnxiety.item20ScaredWithoutReason
  },

  // --- Stress --------------------------------------------------------
  {
    id: 'DASS-S-01',
    subscale: 'stress',
    itemNumber: 1,
    description: 'I found it hard to wind down.',
    evaluate: (d) => d.dassStress.item1HardToWindDown
  },
  {
    id: 'DASS-S-06',
    subscale: 'stress',
    itemNumber: 6,
    description: 'I tended to over-react to situations.',
    evaluate: (d) => d.dassStress.item6OverReact
  },
  {
    id: 'DASS-S-08',
    subscale: 'stress',
    itemNumber: 8,
    description: 'I felt that I was using a lot of nervous energy.',
    evaluate: (d) => d.dassStress.item8NervousEnergy
  },
  {
    id: 'DASS-S-11',
    subscale: 'stress',
    itemNumber: 11,
    description: 'I found myself getting agitated.',
    evaluate: (d) => d.dassStress.item11AgitatedEasily
  },
  {
    id: 'DASS-S-12',
    subscale: 'stress',
    itemNumber: 12,
    description: 'I found it difficult to relax.',
    evaluate: (d) => d.dassStress.item12DifficultToRelax
  },
  {
    id: 'DASS-S-14',
    subscale: 'stress',
    itemNumber: 14,
    description:
      'I was intolerant of anything that kept me from getting on with what I was doing.',
    evaluate: (d) => d.dassStress.item14Intolerant
  },
  {
    id: 'DASS-S-18',
    subscale: 'stress',
    itemNumber: 18,
    description: 'I felt that I was rather touchy.',
    evaluate: (d) => d.dassStress.item18TouchyEasily
  }
];

window.PsychologyAssessment.dass21Rules = dass21Rules;
})();
