// Declarative Glasgow Coma Scale scoring tables.
//
// The GCS rates the best response for each of three components — Eye opening
// (E, 1-4), Verbal response (V, 1-5), and Motor response (M, 1-6) — from a
// fixed descriptor list, plus a "not testable" (NT) option per component. This
// file holds the descriptor→score lookup tables, the ordered option lists used
// to build the wizard dropdowns, and the severity-band definitions. The grader
// (`grader.js`) resolves each component to a numeric score (or null for NT),
// sums the total, derives the band, and computes the GCS-Pupils score.
//
// Rows here mirror the descriptor tables in the form spec and the
// `glasgow_coma_scale_grade_rule` SQL table (rule_id, component, points,
// category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ComponentOption
 * @property {string} value        - enum stored in state (mirrors SQL check constraint)
 * @property {number | null} score - resolved numeric score, or null for NT
 * @property {string} label        - human-readable descriptor for the dropdown
 */

// Wrapped in an IIFE; published via window.GlasgowComaScale.

/** Eye opening (E) — descriptor options, high score first. */
/** @type {ComponentOption[]} */
const eyeOptions = [
  { value: 'spontaneous', score: 4, label: '4 — Spontaneous (eyes open without stimulation)' },
  { value: 'to-sound',    score: 3, label: '3 — To sound (opens to spoken/shouted request)' },
  { value: 'to-pressure', score: 2, label: '2 — To pressure (opens to fingertip pressure)' },
  { value: 'none',        score: 1, label: '1 — None (no eye opening to any stimulus)' },
  { value: 'NT',          score: null, label: 'NT — Not testable (e.g. periorbital swelling, dressings)' }
];

/** Verbal response (V) — descriptor options, high score first. */
/** @type {ComponentOption[]} */
const verbalOptions = [
  { value: 'orientated', score: 5, label: '5 — Orientated (states name, place, and date)' },
  { value: 'confused',   score: 4, label: '4 — Confused (converses but disorientated)' },
  { value: 'words',      score: 3, label: '3 — Words (intelligible single words only)' },
  { value: 'sounds',     score: 2, label: '2 — Sounds (groans or moans, no words)' },
  { value: 'none',       score: 1, label: '1 — None (no audible response)' },
  { value: 'NT',         score: null, label: 'NT — Not testable (e.g. intubation, tracheostomy, language barrier)' }
];

/** Motor response (M) — descriptor options, high score first. */
/** @type {ComponentOption[]} */
const motorOptions = [
  { value: 'obeys-commands',  score: 6, label: '6 — Obeys commands (performs a two-part request)' },
  { value: 'localising',      score: 5, label: '5 — Localising (purposeful movement to stimulus)' },
  { value: 'normal-flexion',  score: 4, label: '4 — Normal flexion (withdraws, not localising)' },
  { value: 'abnormal-flexion', score: 3, label: '3 — Abnormal flexion (decorticate posturing)' },
  { value: 'extension',       score: 2, label: '2 — Extension (decerebrate posturing)' },
  { value: 'none',            score: 1, label: '1 — None (no motor response)' },
  { value: 'NT',              score: null, label: 'NT — Not testable (e.g. neuromuscular blockade, spinal injury)' }
];

/**
 * Resolve a component descriptor to its numeric score.
 * Returns `null` for NT and `undefined`-safe for unanswered ('').
 * @param {ComponentOption[]} options
 * @param {string} value
 * @returns {number | null}
 */
function scoreFor(options, value) {
  const opt = options.find((o) => o.value === value);
  return opt ? opt.score : null;
}

/** Human-readable descriptor label for a chosen component value. */
function descriptorLabel(options, value) {
  const opt = options.find((o) => o.value === value);
  return opt ? opt.label : '';
}

/**
 * Severity bands over the defined total (3-15). Ordered high-to-low.
 * @type {{ band: 'mild'|'moderate'|'severe', min: number, max: number, interpretation: string }[]}
 */
const severityBands = [
  { band: 'mild',     min: 13, max: 15, interpretation: 'Mild impairment — normal-to-drowsy' },
  { band: 'moderate', min: 9,  max: 12, interpretation: 'Moderate impairment' },
  { band: 'severe',   min: 3,  max: 8,  interpretation: 'Severe impairment — coma; GCS <= 8 signals airway risk' }
];

/**
 * Band a defined total. Returns '' when total is null/out of range.
 * @param {number | null} total
 * @returns {'mild'|'moderate'|'severe'|''}
 */
function bandForTotal(total) {
  if (total === null || total === undefined) return '';
  const found = severityBands.find((b) => total >= b.min && total <= b.max);
  return found ? found.band : '';
}

export { eyeOptions, verbalOptions, motorOptions, scoreFor, descriptorLabel, severityBands, bandForTotal };
