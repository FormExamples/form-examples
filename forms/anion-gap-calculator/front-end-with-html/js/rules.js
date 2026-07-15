// Declarative anion-gap rules and constants.
//
// Unlike an additive score, the anion gap is a *formula*: the raw gap and its
// albumin-corrected value are computed once (see `grader.js`) and then
// classified against a reference range whose upper bound depends on whether
// potassium was included. The rules below describe the four classification
// bands (low / normal / high / very-high). The grader evaluates them against
// the unrounded classification value (the corrected gap when an albumin is
// available, otherwise the raw gap) and records the matching band as an audit
// row. Rows here mirror the `anion_gap_calculator_grade_rule` SQL table
// (rule_id, instrument, band, category, description).

/**
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} ClassificationRule
 * @property {string} id
 * @property {string} instrument   - classification
 * @property {string} band         - low | normal | high | very-high
 * @property {string} category
 * @property {string} description
 * @property {(value: number, normalLow: number, normalHigh: number) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.AnionGapCalculator.

// ─── Formula and reference constants (spec §4) ──────────────────
/** Reference (normal) albumin in g/L the gap is corrected to. */
const REF_ALBUMIN = 40;
/** mmol/L of anion gap restored per g/L of albumin below the reference. */
const ALBUMIN_FACTOR = 0.25;
/** Lower bound of the normal anion-gap reference range (mmol/L, inclusive). */
const NORMAL_LOW = 8;
/** Upper bound when potassium is included, `(Na + K) − (Cl + HCO3)`. */
const NORMAL_HIGH_WITH_K = 16;
/** Upper bound when potassium is excluded, `Na − (Cl + HCO3)`. */
const NORMAL_HIGH_WITHOUT_K = 12;
/** Very-high escalation threshold (mmol/L, inclusive). */
const VERY_HIGH = 20;

/**
 * Reference-range classification rules, evaluated against the unrounded
 * classification value. Order matters: very-high (a subset of high) is tested
 * first, then high, then low, then normal. The lower bound (8) and the dynamic
 * upper bound (16 with potassium, 12 without) are inclusive-to-normal.
 * @type {ClassificationRule[]}
 */
const classificationRules = [
  {
    id: 'R-CLASSIFY-VERY-HIGH-01',
    instrument: 'classification',
    band: 'very-high',
    category: 'reference-range',
    description: 'Anion gap at or above 20 mmol/L — very high, urgent',
    evaluate: (v) => v >= VERY_HIGH
  },
  {
    id: 'R-CLASSIFY-HIGH-01',
    instrument: 'classification',
    band: 'high',
    category: 'reference-range',
    description: 'Anion gap above the normal upper bound — high anion gap metabolic acidosis',
    evaluate: (v, low, high) => v > high
  },
  {
    id: 'R-CLASSIFY-LOW-01',
    instrument: 'classification',
    band: 'low',
    category: 'reference-range',
    description: 'Anion gap below 8 mmol/L — low',
    evaluate: (v, low) => v < low
  },
  {
    id: 'R-CLASSIFY-NORMAL-01',
    instrument: 'classification',
    band: 'normal',
    category: 'reference-range',
    description: 'Anion gap within the normal reference range',
    evaluate: (v, low, high) => v >= low && v <= high
  }
];

export { REF_ALBUMIN, ALBUMIN_FACTOR, NORMAL_LOW, NORMAL_HIGH_WITH_K, NORMAL_HIGH_WITHOUT_K, VERY_HIGH, classificationRules };
