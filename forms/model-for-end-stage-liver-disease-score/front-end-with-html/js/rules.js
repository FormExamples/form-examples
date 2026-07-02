// Declarative MELD constants and mortality-band classification rules.
//
// Unlike an additive checklist, MELD is a *weighted logarithmic formula*: the
// integer score is computed once (see `grader.js`) and then classified into an
// estimated-3-month-mortality band. The rules below describe the five bands.
// The grader evaluates them against the final clamped score (6–40) and records
// the matching band as an audit row. Rows here mirror the
// `model_for_end_stage_liver_disease_score_grade_rule` SQL table
// (rule_id, instrument, band, category, description).

/**
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} BandRule
 * @property {string} id
 * @property {string} instrument   - band
 * @property {string} band         - low | moderate | high | very-high | extreme
 * @property {string} category
 * @property {string} description
 * @property {number} percent      - representative 3-month mortality estimate
 * @property {(score: number) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.ModelForEndStageLiverDiseaseScore.
(function () {
'use strict';
window.ModelForEndStageLiverDiseaseScore =
  window.ModelForEndStageLiverDiseaseScore || {};

// ─── Formula coefficients and bounds (spec §4) ──────────────────
/** Coefficient on ln(bilirubin) in the base MELD formula. */
const COEF_BILIRUBIN = 3.78;
/** Coefficient on ln(INR) in the base MELD formula. */
const COEF_INR = 11.2;
/** Coefficient on ln(creatinine) in the base MELD formula. */
const COEF_CREATININE = 9.57;
/** Additive constant in the base MELD formula. */
const CONSTANT = 6.43;
/** Lower bound applied to bilirubin, INR, and creatinine before ln (ln 1 = 0). */
const LOWER_BOUND = 1.0;
/** Upper bound (cap) applied to creatinine in MELD / MELD-Na. */
const CREATININE_CAP = 4.0;
/** Creatinine value substituted by the dialysis rule (mg/dL). */
const DIALYSIS_CREATININE = 4.0;
/** umol/L -> mg/dL divisor for bilirubin. */
const BILIRUBIN_UMOL_DIVISOR = 17.1;
/** umol/L -> mg/dL divisor for creatinine. */
const CREATININE_UMOL_DIVISOR = 88.4;
/** Lower clamp for serum sodium in the MELD-Na correction (mEq/L). */
const SODIUM_LOW = 125;
/** Upper clamp for serum sodium in the MELD-Na correction (mEq/L). */
const SODIUM_HIGH = 137;
/** Base MELD above which the sodium correction is applied. */
const SODIUM_GATE = 11;
/** Final score clamp — lower bound. */
const SCORE_MIN = 6;
/** Final score clamp — upper bound. */
const SCORE_MAX = 40;

// ─── MELD 3.0 bounds (spec §6) ──────────────────────────────────
/** MELD 3.0 caps creatinine at 3.0 mg/dL. */
const MELD3_CREATININE_CAP = 3.0;
/** MELD 3.0 lower-clamps albumin at 1.5 g/dL. */
const MELD3_ALBUMIN_LOW = 1.5;
/** MELD 3.0 upper-clamps albumin at 3.5 g/dL. */
const MELD3_ALBUMIN_HIGH = 3.5;

/**
 * Mortality-band classification rules, evaluated against the final clamped
 * integer MELD score. Contiguous, non-overlapping bands per spec §8.
 * @type {BandRule[]}
 */
const bandRules = [
  {
    id: 'R-BAND-LOW-01',
    instrument: 'band',
    band: 'low',
    category: 'mortality-band',
    description: 'MELD score ≤ 9 — low estimated 3-month mortality (~2%)',
    percent: 2,
    evaluate: (s) => s <= 9
  },
  {
    id: 'R-BAND-MODERATE-01',
    instrument: 'band',
    band: 'moderate',
    category: 'mortality-band',
    description: 'MELD score 10–19 — moderate estimated 3-month mortality (~6%)',
    percent: 6,
    evaluate: (s) => s >= 10 && s <= 19
  },
  {
    id: 'R-BAND-HIGH-01',
    instrument: 'band',
    band: 'high',
    category: 'mortality-band',
    description: 'MELD score 20–29 — high estimated 3-month mortality (~20%)',
    percent: 20,
    evaluate: (s) => s >= 20 && s <= 29
  },
  {
    id: 'R-BAND-VERY-HIGH-01',
    instrument: 'band',
    band: 'very-high',
    category: 'mortality-band',
    description: 'MELD score 30–39 — very high estimated 3-month mortality (~53%)',
    percent: 53,
    evaluate: (s) => s >= 30 && s <= 39
  },
  {
    id: 'R-BAND-EXTREME-01',
    instrument: 'band',
    band: 'extreme',
    category: 'mortality-band',
    description: 'MELD score ≥ 40 — extreme estimated 3-month mortality (~71%)',
    percent: 71,
    evaluate: (s) => s >= 40
  }
];

Object.assign(window.ModelForEndStageLiverDiseaseScore, {
  COEF_BILIRUBIN,
  COEF_INR,
  COEF_CREATININE,
  CONSTANT,
  LOWER_BOUND,
  CREATININE_CAP,
  DIALYSIS_CREATININE,
  BILIRUBIN_UMOL_DIVISOR,
  CREATININE_UMOL_DIVISOR,
  SODIUM_LOW,
  SODIUM_HIGH,
  SODIUM_GATE,
  SCORE_MIN,
  SCORE_MAX,
  MELD3_CREATININE_CAP,
  MELD3_ALBUMIN_LOW,
  MELD3_ALBUMIN_HIGH,
  bandRules
});
})();
