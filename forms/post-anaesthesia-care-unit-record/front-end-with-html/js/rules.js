// Declarative Modified Aldrete + PADSS scoring rules.
//
// The Modified Aldrete Score has exactly five parameters (activity,
// respiration, circulation, consciousness, oxygen saturation), each mapping an
// enum answer to a 0/1/2 level; the grader (`grader.js`) sums the five levels
// into the total (0-10) and derives the readiness band. The optional PADSS
// (Post-Anaesthesia Discharge Scoring System) has five criteria, each 0/1/2.
// The score maps below are the single source of truth for both the grader and
// the wizard's per-parameter option lists, and mirror the CHECK constraints in
// `sql/04_create_table_post_anaesthesia_care_unit_record.sql`.

/**
 * @typedef {import('./types.js').PacuRecord} PacuRecord
 */

// Wrapped in an IIFE; published via window.PostAnaesthesiaCareUnitRecord.

// ─── Aldrete parameter enum → 0/1/2 level ─────────────────────────────
const ALDRETE_SCORES = {
  activity:         { 'all-four': 2, 'two': 1, 'none': 0 },
  respiration:      { 'deep-cough': 2, 'limited': 1, 'apnoeic': 0 },
  circulation:      { 'within-20': 2, 'within-50': 1, 'over-50': 0 },
  consciousness:    { 'awake': 2, 'arousable': 1, 'unresponsive': 0 },
  oxygenSaturation: { 'room-air': 2, 'needs-o2': 1, 'low-on-o2': 0 }
};

// ─── PADSS criterion enum → 0/1/2 level ───────────────────────────────
const PADSS_SCORES = {
  padssVitalSigns:       { 'within-20': 2, 'within-40': 1, 'over-40': 0 },
  padssAmbulation:       { 'steady': 2, 'with-assistance': 1, 'unable': 0 },
  padssNauseaVomiting:   { 'minimal': 2, 'moderate': 1, 'severe': 0 },
  padssPain:             { 'minimal': 2, 'moderate': 1, 'severe': 0 },
  padssSurgicalBleeding: { 'minimal': 2, 'moderate': 1, 'severe': 0 }
};

/**
 * Score a single Aldrete parameter. A missing ('') answer contributes 0.
 * @param {keyof ALDRETE_SCORES} parameter
 * @param {string} value
 * @returns {0 | 1 | 2}
 */
function aldreteScore(parameter, value) {
  const map = ALDRETE_SCORES[parameter];
  if (!map) return 0;
  const score = map[value];
  return score === undefined ? 0 : score;
}

/**
 * Score a single PADSS criterion, or null when the answer is missing.
 * @param {keyof PADSS_SCORES} criterion
 * @param {string} value
 * @returns {0 | 1 | 2 | null}
 */
function padssScore(criterion, value) {
  const map = PADSS_SCORES[criterion];
  if (!map) return null;
  const score = map[value];
  return score === undefined ? null : score;
}

// Rule metadata rows, mirroring the
// `post_anaesthesia_care_unit_record_grade_rule` SQL table
// (rule_id, parameter, category, description). The `evaluate` accessor pulls the
// raw enum answer out of the nested record so the grader can award points.
/** @type {Array<{id:string, parameter:string, category:string, description:string, get:(d:PacuRecord)=>string}>} */
const aldreteRules = [
  { id: 'R-ACTIVITY-01', parameter: 'activity', category: 'aldrete-parameter',
    description: 'Activity — voluntary limb movement on command',
    get: (d) => d.activity.activity },
  { id: 'R-RESPIRATION-01', parameter: 'respiration', category: 'aldrete-parameter',
    description: 'Respiration — breathing effort, cough, ventilation',
    get: (d) => d.respiration.respiration },
  { id: 'R-CIRCULATION-01', parameter: 'circulation', category: 'aldrete-parameter',
    description: 'Circulation — blood pressure deviation from baseline',
    get: (d) => d.circulation.circulation },
  { id: 'R-CONSCIOUSNESS-01', parameter: 'consciousness', category: 'aldrete-parameter',
    description: 'Consciousness — level of arousal',
    get: (d) => d.consciousness.consciousness },
  { id: 'R-OXYGEN-SATURATION-01', parameter: 'oxygenSaturation', category: 'aldrete-parameter',
    description: 'Oxygen saturation — SpO2 and supplemental-oxygen need',
    get: (d) => d.oxygenSaturation.oxygenSaturation }
];

export { ALDRETE_SCORES, PADSS_SCORES, aldreteScore, padssScore, aldreteRules };
