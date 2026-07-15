// Menopause Rating Scale (MRS) scoring rules.
//
// Each rule maps a single 5-option response (0-4) to a subscale. The MRS
// total is the sum of all 11 items (range 0-44). Unanswered items return
// `null` and are excluded from the total by the grader.
//
// Subscale assignments:
//   Somatic       - items 1-3 + 4 (hot flushes, heart discomfort,
//                                    sleep problems, joint/muscular pain)
//   Psychological - items 5-8 (depressive mood, irritability,
//                              anxiety, fatigue)
//   Urogenital    - items 9-11 (sexual problems, bladder problems,
//                                vaginal dryness)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').MRSItemScore} MRSItemScore
 *
 * @typedef {Object} MRSRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {'somatic' | 'psychological' | 'urogenital'} subscale
 * @property {(d: AssessmentData) => MRSItemScore} getScore
 */

// Wrapped in an IIFE; published via window.HormoneReplacementTherapyAssessment.

/** @type {MRSRule[]} */
const mrsRules = [
  // ─── SOMATIC SUBSCALE ────────────────────────────────────
  {
    id: 'MRS-01',
    system: 'Somatic',
    description: 'Hot flushes, sweating',
    subscale: 'somatic',
    getScore: (d) => d.mrsSymptomScale.hotFlushes
  },
  {
    id: 'MRS-02',
    system: 'Somatic',
    description: 'Heart discomfort (palpitations, tightness)',
    subscale: 'somatic',
    getScore: (d) => d.mrsSymptomScale.heartDiscomfort
  },
  {
    id: 'MRS-03',
    system: 'Somatic',
    description: 'Sleep problems (difficulty falling asleep, waking early)',
    subscale: 'somatic',
    getScore: (d) => d.mrsSymptomScale.sleepProblems
  },
  {
    id: 'MRS-04',
    system: 'Somatic',
    description: 'Joint and muscular discomfort',
    subscale: 'somatic',
    getScore: (d) => d.mrsSymptomScale.jointPain
  },

  // ─── PSYCHOLOGICAL SUBSCALE ──────────────────────────────
  {
    id: 'MRS-05',
    system: 'Psychological',
    description: 'Depressive mood (feeling down, sad, tearful)',
    subscale: 'psychological',
    getScore: (d) => d.mrsSymptomScale.depressiveMood
  },
  {
    id: 'MRS-06',
    system: 'Psychological',
    description: 'Irritability (nervousness, aggression)',
    subscale: 'psychological',
    getScore: (d) => d.mrsSymptomScale.irritability
  },
  {
    id: 'MRS-07',
    system: 'Psychological',
    description: 'Anxiety (inner restlessness, panic)',
    subscale: 'psychological',
    getScore: (d) => d.mrsSymptomScale.anxiety
  },
  {
    id: 'MRS-08',
    system: 'Psychological',
    description: 'Physical and mental exhaustion (fatigue)',
    subscale: 'psychological',
    getScore: (d) => d.mrsSymptomScale.fatigue
  },

  // ─── UROGENITAL SUBSCALE ─────────────────────────────────
  {
    id: 'MRS-09',
    system: 'Urogenital',
    description: 'Sexual problems (change in desire, activity, satisfaction)',
    subscale: 'urogenital',
    getScore: (d) => d.mrsSymptomScale.sexualProblems
  },
  {
    id: 'MRS-10',
    system: 'Urogenital',
    description: 'Bladder problems (difficulty urinating, increased need, incontinence)',
    subscale: 'urogenital',
    getScore: (d) => d.mrsSymptomScale.bladderProblems
  },
  {
    id: 'MRS-11',
    system: 'Urogenital',
    description: 'Dryness of vagina (sensation of dryness, burning, difficulty with intercourse)',
    subscale: 'urogenital',
    getScore: (d) => d.mrsSymptomScale.vaginalDryness
  }
];

export { mrsRules };
