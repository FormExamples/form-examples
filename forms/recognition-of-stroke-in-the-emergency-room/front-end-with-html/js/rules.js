// Declarative ROSIER grading rules.
//
// The ROSIER instrument has exactly seven scored criteria: two mimic-exclusion
// criteria worth -1 point each (loss of consciousness / syncope, seizure
// activity) and five acute-onset neurological signs worth +1 point each
// (asymmetric facial / arm / leg weakness, speech disturbance, visual field
// defect). Each rule below evaluates the patient data and returns true when its
// criterion is positive (answered `yes`); the grader (`grader.js`) sums the
// signed points into the total ROSIER score (-2..+5) and derives the band. Rows
// here mirror the
// `recognition_of_stroke_in_the_emergency_room_grade_rule` SQL table
// (rule_id, criterion, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} RosierRule
 * @property {string} id
 * @property {string} criterion   - loss-of-consciousness | seizure-activity | facial-weakness | arm-weakness | leg-weakness | speech-disturbance | visual-field-defect
 * @property {number} points      - signed point contributed when the rule fires (-1 for a mimic, +1 for a sign)
 * @property {string} category    - rosier-mimic | rosier-sign
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/** @type {RosierRule[]} */
const rosierRules = [
  // ─── MIMIC 1: LOSS OF CONSCIOUSNESS / SYNCOPE (-1) ────────────
  {
    id: 'R-LOSS-OF-CONSCIOUSNESS-01',
    criterion: 'loss-of-consciousness',
    points: -1,
    category: 'rosier-mimic',
    description: 'Loss of consciousness or syncope (mimic) — subtracts 1 point',
    evaluate: (d) => d.mimics.lossOfConsciousness === 'yes'
  },

  // ─── MIMIC 2: SEIZURE ACTIVITY (-1) ───────────────────────────
  {
    id: 'R-SEIZURE-ACTIVITY-01',
    criterion: 'seizure-activity',
    points: -1,
    category: 'rosier-mimic',
    description: 'Seizure activity (mimic) — subtracts 1 point',
    evaluate: (d) => d.mimics.seizureActivity === 'yes'
  },

  // ─── SIGN 1: ASYMMETRIC FACIAL WEAKNESS (+1) ──────────────────
  {
    id: 'R-FACIAL-WEAKNESS-01',
    criterion: 'facial-weakness',
    points: 1,
    category: 'rosier-sign',
    description: 'New acute onset of asymmetric facial weakness — adds 1 point',
    evaluate: (d) => d.signs.facialWeakness === 'yes'
  },

  // ─── SIGN 2: ASYMMETRIC ARM WEAKNESS (+1) ─────────────────────
  {
    id: 'R-ARM-WEAKNESS-01',
    criterion: 'arm-weakness',
    points: 1,
    category: 'rosier-sign',
    description: 'New acute onset of asymmetric arm weakness — adds 1 point',
    evaluate: (d) => d.signs.armWeakness === 'yes'
  },

  // ─── SIGN 3: ASYMMETRIC LEG WEAKNESS (+1) ─────────────────────
  {
    id: 'R-LEG-WEAKNESS-01',
    criterion: 'leg-weakness',
    points: 1,
    category: 'rosier-sign',
    description: 'New acute onset of asymmetric leg weakness — adds 1 point',
    evaluate: (d) => d.signs.legWeakness === 'yes'
  },

  // ─── SIGN 4: SPEECH DISTURBANCE (+1) ──────────────────────────
  {
    id: 'R-SPEECH-DISTURBANCE-01',
    criterion: 'speech-disturbance',
    points: 1,
    category: 'rosier-sign',
    description: 'New acute onset of speech disturbance — adds 1 point',
    evaluate: (d) => d.signs.speechDisturbance === 'yes'
  },

  // ─── SIGN 5: VISUAL FIELD DEFECT (+1) ─────────────────────────
  {
    id: 'R-VISUAL-FIELD-DEFECT-01',
    criterion: 'visual-field-defect',
    points: 1,
    category: 'rosier-sign',
    description: 'New acute onset of visual field defect — adds 1 point',
    evaluate: (d) => d.signs.visualFieldDefect === 'yes'
  }
];

export { rosierRules };
