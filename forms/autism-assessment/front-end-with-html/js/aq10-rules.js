// AQ-10 (Autism Spectrum Quotient-10) screening questions and scoring
// directions. Each question scores 0 or 1; total range 0-10.
//
// Scoring direction:
//   - 'agree'    -> score 1 if response is "definitely-agree" or "slightly-agree"
//   - 'disagree' -> score 1 if response is "definitely-disagree" or "slightly-disagree"

// Wrapped in an IIFE; published via window.AutismAssessment.

const aq10Questions = [
  {
    id: 'AQ10-01',
    questionNumber: 1,
    domain: 'Social skills',
    text: 'I often notice small sounds when others do not.'
  },
  {
    id: 'AQ10-02',
    questionNumber: 2,
    domain: 'Attention switching',
    text: 'I usually concentrate more on the whole picture, rather than the small details.'
  },
  {
    id: 'AQ10-03',
    questionNumber: 3,
    domain: 'Attention switching',
    text: 'I find it easy to do more than one thing at once.'
  },
  {
    id: 'AQ10-04',
    questionNumber: 4,
    domain: 'Attention switching',
    text: 'If there is an interruption, I can switch back to what I was doing very quickly.'
  },
  {
    id: 'AQ10-05',
    questionNumber: 5,
    domain: 'Communication',
    text: 'I find it easy to "read between the lines" when someone is talking to me.'
  },
  {
    id: 'AQ10-06',
    questionNumber: 6,
    domain: 'Imagination',
    text: 'I know how to tell if someone listening to me is getting bored.'
  },
  {
    id: 'AQ10-07',
    questionNumber: 7,
    domain: 'Attention to detail',
    text: 'When I am reading a story, I find it difficult to work out the characters\' intentions.'
  },
  {
    id: 'AQ10-08',
    questionNumber: 8,
    domain: 'Social skills',
    text: 'I like to collect information about categories of things (e.g., types of car, bird, train, plant).'
  },
  {
    id: 'AQ10-09',
    questionNumber: 9,
    domain: 'Communication',
    text: 'I find it easy to work out what someone is thinking or feeling just by looking at their face.'
  },
  {
    id: 'AQ10-10',
    questionNumber: 10,
    domain: 'Imagination',
    text: 'I find it difficult to work out people\'s intentions.'
  }
];

const aq10ResponseOptions = [
  { value: 'definitely-agree', label: 'Definitely agree' },
  { value: 'slightly-agree', label: 'Slightly agree' },
  { value: 'slightly-disagree', label: 'Slightly disagree' },
  { value: 'definitely-disagree', label: 'Definitely disagree' }
];

/** Scoring direction for each question (1-indexed). */
const aq10ScoringDirections = {
  1: 'agree',
  2: 'disagree',
  3: 'disagree',
  4: 'disagree',
  5: 'disagree',
  6: 'disagree',
  7: 'agree',
  8: 'agree',
  9: 'disagree',
  10: 'agree'
};

/**
 * Convert a raw response value + question number to a 0/1 AQ-10 score,
 * or null if the response is empty.
 * @param {number} questionNumber
 * @param {string} responseValue
 * @returns {0 | 1 | null}
 */
function aq10ScoreFromResponse(questionNumber, responseValue) {
  if (!responseValue) return null;
  const direction = aq10ScoringDirections[questionNumber];
  const isAgree = responseValue === 'definitely-agree' || responseValue === 'slightly-agree';
  const isDisagree = responseValue === 'definitely-disagree' || responseValue === 'slightly-disagree';
  if (direction === 'agree') return isAgree ? 1 : 0;
  return isDisagree ? 1 : 0;
}

export { aq10Questions, aq10ResponseOptions, aq10ScoringDirections, aq10ScoreFromResponse };
