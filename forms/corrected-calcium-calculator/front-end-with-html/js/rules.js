// Declarative corrected-calcium rules and constants.
//
// Unlike an additive score, the corrected calcium is a *formula*: the corrected
// value is computed once (see `grader.js`) and then classified against the adult
// reference range. The rules below describe (a) the correction itself and (b)
// the three reference-range classification bands. The grader evaluates the
// classification rules against the unrounded corrected value and records the
// matching band as an audit row. Rows here mirror the
// `corrected_calcium_calculator_grade_rule` SQL table (rule_id, instrument,
// band, category, description).

/**
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} ClassificationRule
 * @property {string} id
 * @property {string} instrument   - classification
 * @property {string} band         - hypocalcaemia | normal | hypercalcaemia
 * @property {string} category
 * @property {string} description
 * @property {(correctedCalcium: number) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.CorrectedCalciumCalculator.
(function () {
'use strict';
window.CorrectedCalciumCalculator =
  window.CorrectedCalciumCalculator || {};

// ─── Correction constants (spec §4) ─────────────────────────────
/** Reference (normal) albumin in g/L that results are corrected to. */
const REF_ALBUMIN = 40;
/** Adjustment factor in mmol/L per g/L of albumin below/above the reference. */
const FACTOR = 0.02;
/** Lower bound of the adult corrected-calcium reference range (mmol/L, inclusive). */
const LOW = 2.20;
/** Upper bound of the adult corrected-calcium reference range (mmol/L, inclusive). */
const HIGH = 2.60;
/** Severe-hypercalcaemia threshold (mmol/L, inclusive). */
const SEVERE_HIGH = 3.0;
/** Severe-hypocalcaemia threshold (mmol/L, exclusive lower). */
const SEVERE_LOW = 1.9;

/**
 * Reference-range classification rules, evaluated against the unrounded
 * corrected calcium value. Boundaries 2.20 and 2.60 are inclusive-to-normal.
 * @type {ClassificationRule[]}
 */
const classificationRules = [
  {
    id: 'R-CLASSIFY-HYPOCALCAEMIA-01',
    instrument: 'classification',
    band: 'hypocalcaemia',
    category: 'reference-range',
    description: 'Corrected calcium below 2.20 mmol/L — hypocalcaemia',
    evaluate: (c) => c < LOW
  },
  {
    id: 'R-CLASSIFY-NORMAL-01',
    instrument: 'classification',
    band: 'normal',
    category: 'reference-range',
    description: 'Corrected calcium within 2.20–2.60 mmol/L — normal adult reference range',
    evaluate: (c) => c >= LOW && c <= HIGH
  },
  {
    id: 'R-CLASSIFY-HYPERCALCAEMIA-01',
    instrument: 'classification',
    band: 'hypercalcaemia',
    category: 'reference-range',
    description: 'Corrected calcium above 2.60 mmol/L — hypercalcaemia',
    evaluate: (c) => c > HIGH
  }
];

Object.assign(window.CorrectedCalciumCalculator, {
  REF_ALBUMIN,
  FACTOR,
  LOW,
  HIGH,
  SEVERE_HIGH,
  SEVERE_LOW,
  classificationRules
});
})();
