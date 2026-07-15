// Declarative AAA diameter-classification rules and thresholds.
//
// Unlike an additive score, the AAA result is a *classification*: the maximum
// antero-posterior aortic diameter is classified against fixed NHS AAA
// Screening Programme thresholds. The rules below describe the four diameter
// bands (normal / small / medium / large). The grader (`grader.js`) applies the
// non-visualised guard first, then evaluates the classification rules against
// the measured diameter and records the matching band as an audit row. Rows here
// mirror the `abdominal_aortic_aneurysm_screening_grade_rule` SQL table
// (rule_id, instrument, band, category, description).

/**
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} ClassificationRule
 * @property {string} id
 * @property {string} instrument   - classification
 * @property {string} band         - normal | small | medium | large
 * @property {string} category
 * @property {string} description
 * @property {(diameterCm: number) => boolean} evaluate
 */

// ─── Diameter thresholds (spec §4) ──────────────────────────────
/** Lower bound of a small aneurysm (cm, inclusive). Below this is normal. */
const SMALL_MIN = 3.0;
/** Lower bound of a medium aneurysm (cm, inclusive). */
const MEDIUM_MIN = 4.5;
/** Lower bound of a large aneurysm (cm, inclusive). */
const LARGE_MIN = 5.5;
/** Growth (cm) over ~12 months that triggers the rapid-growth flag. */
const RAPID_GROWTH_CM = 1.0;

/**
 * Diameter classification rules, evaluated against the measured maximum aortic
 * diameter (cm). Bands are lower-bound inclusive, upper-bound exclusive:
 * `[3.0, 4.5)` small, `[4.5, 5.5)` medium, `[5.5, ∞)` large; `< 3.0` normal.
 * @type {ClassificationRule[]}
 */
const classificationRules = [
  {
    id: 'R-CLASSIFY-NORMAL-01',
    instrument: 'classification',
    band: 'normal',
    category: 'diameter-band',
    description: 'Maximum aortic diameter below 3.0 cm — no aneurysm (normal)',
    evaluate: (d) => d < SMALL_MIN
  },
  {
    id: 'R-CLASSIFY-SMALL-01',
    instrument: 'classification',
    band: 'small',
    category: 'diameter-band',
    description: 'Maximum aortic diameter 3.0–4.4 cm — small aneurysm',
    evaluate: (d) => d >= SMALL_MIN && d < MEDIUM_MIN
  },
  {
    id: 'R-CLASSIFY-MEDIUM-01',
    instrument: 'classification',
    band: 'medium',
    category: 'diameter-band',
    description: 'Maximum aortic diameter 4.5–5.4 cm — medium aneurysm',
    evaluate: (d) => d >= MEDIUM_MIN && d < LARGE_MIN
  },
  {
    id: 'R-CLASSIFY-LARGE-01',
    instrument: 'classification',
    band: 'large',
    category: 'diameter-band',
    description: 'Maximum aortic diameter 5.5 cm or more — large aneurysm',
    evaluate: (d) => d >= LARGE_MIN
  }
];

export { SMALL_MIN, MEDIUM_MIN, LARGE_MIN, RAPID_GROWTH_CM, classificationRules };
