// Declarative Apgar sign-scoring rules.
//
// The Apgar score has exactly five signs (Appearance, Pulse, Grimace, Activity,
// Respiration), each an explicit 0/1/2 selection. Unlike a binary criterion
// screen, every sign contributes its own selected value (0, 1, or 2) to the
// per-timepoint total of 0-10. Each rule below reads one sign from a single
// timepoint and returns its numeric points, plus a human description of the
// selected level. The grader (`grader.js`) sums the five signs per timepoint.
// Rows here mirror the `apgar_score_grade_rule` SQL table (rule_id, sign,
// category, description).

/**
 * @typedef {import('./types.js').Timepoint} Timepoint
 * @typedef {import('./types.js').SignScore} SignScore
 *
 * @typedef {Object} ApgarRule
 * @property {string} id
 * @property {string} sign        - appearance | pulse | grimace | activity | respiration
 * @property {string} letter      - A | P | G | A | R
 * @property {string} category
 * @property {string} description
 * @property {(t: Timepoint) => number} score  - selected 0/1/2 for this sign (0 when unanswered)
 */

// Wrapped in an IIFE; published via window.ApgarScore.

/** Parse a '0' | '1' | '2' | '' sign selection to a number (0 when unanswered). */
function signPoints(value) {
  return value === '' || value == null ? 0 : Number(value);
}

/** @type {ApgarRule[]} */
const apgarRules = [
  // ─── SIGN A: APPEARANCE (skin colour) ─────────────────────────
  {
    id: 'R-APPEARANCE-01',
    sign: 'appearance',
    letter: 'A',
    category: 'apgar-sign',
    description: 'Appearance (skin colour) — 0 blue/pale, 1 acrocyanosis, 2 completely pink',
    score: (t) => signPoints(t.appearance)
  },

  // ─── SIGN P: PULSE (heart rate) ───────────────────────────────
  {
    id: 'R-PULSE-01',
    sign: 'pulse',
    letter: 'P',
    category: 'apgar-sign',
    description: 'Pulse (heart rate) — 0 absent, 1 below 100/min, 2 at least 100/min',
    score: (t) => signPoints(t.pulse)
  },

  // ─── SIGN G: GRIMACE (reflex irritability) ────────────────────
  {
    id: 'R-GRIMACE-01',
    sign: 'grimace',
    letter: 'G',
    category: 'apgar-sign',
    description: 'Grimace (reflex irritability) — 0 no response, 1 grimace/feeble cry, 2 cry/cough/sneeze',
    score: (t) => signPoints(t.grimace)
  },

  // ─── SIGN A: ACTIVITY (muscle tone) ───────────────────────────
  {
    id: 'R-ACTIVITY-01',
    sign: 'activity',
    letter: 'A',
    category: 'apgar-sign',
    description: 'Activity (muscle tone) — 0 limp, 1 some flexion, 2 active movement',
    score: (t) => signPoints(t.activity)
  },

  // ─── SIGN R: RESPIRATION ──────────────────────────────────────
  {
    id: 'R-RESPIRATION-01',
    sign: 'respiration',
    letter: 'R',
    category: 'apgar-sign',
    description: 'Respiration — 0 absent, 1 slow/irregular/weak cry, 2 strong regular cry',
    score: (t) => signPoints(t.respiration)
  }
];

export { apgarRules, signPoints };
