// Declarative CKD-EPI 2021 creatinine constants and CKD G-stage banding rules.
//
// Unlike an additive score, the eGFR is a *formula*: the value is computed once
// (see `grader.js`) using the CKD-EPI 2021 creatinine equation (race-free) and
// then banded into a KDIGO 2012 CKD G-stage. The rows below mirror the
// `estimated_glomerular_filtration_rate_calculator_grade_rule` SQL table
// (rule_id, instrument, band, category, description). The grader evaluates the
// staging rules against the unrounded eGFR and records the matching band.

/**
 * @typedef {import('./types.js').FiredRule} FiredRule
 *
 * @typedef {Object} StageRule
 * @property {string} id
 * @property {string} instrument   - staging
 * @property {string} band         - G1 | G2 | G3a | G3b | G4 | G5
 * @property {string} category
 * @property {string} label        - human-readable stage description
 * @property {string} description
 * @property {(egfr: number) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.EstimatedGlomerularFiltrationRateCalculator.
(function () {
'use strict';
window.EstimatedGlomerularFiltrationRateCalculator =
  window.EstimatedGlomerularFiltrationRateCalculator || {};

// ─── CKD-EPI 2021 creatinine constants (spec §4) ────────────────
/** Conversion divisor: serum creatinine umol/L → mg/dL. */
const UMOL_PER_MGDL = 88.42;
/** Sex-specific creatinine scaling factor kappa. */
const KAPPA_FEMALE = 0.7;
const KAPPA_MALE = 0.9;
/** Sex-specific low-ratio exponent alpha. */
const ALPHA_FEMALE = -0.241;
const ALPHA_MALE = -0.302;
/** High-ratio (max) exponent, applied to max(Scr/kappa, 1). */
const MAX_EXPONENT = -1.200;
/** Base coefficient. */
const BASE_COEFFICIENT = 142;
/** Per-year age-decay base. */
const AGE_DECAY_BASE = 0.9938;
/** Female multiplier. */
const FEMALE_MULTIPLIER = 1.012;

// ─── G-stage band boundaries (mL/min/1.73 m^2) ──────────────────
const G1_MIN = 90;   // >= 90
const G2_MIN = 60;   // 60–89
const G3A_MIN = 45;  // 45–59
const G3B_MIN = 30;  // 30–44
const G4_MIN = 15;   // 15–29
                     // < 15 → G5

/** Margin (mL/min) around a band boundary used by the confirm-CKD flag. */
const BOUNDARY_MARGIN = 3;

/**
 * CKD G-stage banding rules, evaluated against the unrounded eGFR. Each higher
 * band is inclusive of its lower bound (≥ 90, ≥ 60, ≥ 45, ≥ 30, ≥ 15).
 * @type {StageRule[]}
 */
const stageRules = [
  {
    id: 'R-STAGE-G1-01',
    instrument: 'staging',
    band: 'G1',
    category: 'g-stage',
    label: 'Normal or high',
    description: 'eGFR ≥ 90 mL/min/1.73 m² — G1 (normal or high)',
    evaluate: (e) => e >= G1_MIN
  },
  {
    id: 'R-STAGE-G2-01',
    instrument: 'staging',
    band: 'G2',
    category: 'g-stage',
    label: 'Mildly decreased',
    description: 'eGFR 60–89 mL/min/1.73 m² — G2 (mildly decreased)',
    evaluate: (e) => e >= G2_MIN && e < G1_MIN
  },
  {
    id: 'R-STAGE-G3A-01',
    instrument: 'staging',
    band: 'G3a',
    category: 'g-stage',
    label: 'Mildly to moderately decreased',
    description: 'eGFR 45–59 mL/min/1.73 m² — G3a (mildly to moderately decreased)',
    evaluate: (e) => e >= G3A_MIN && e < G2_MIN
  },
  {
    id: 'R-STAGE-G3B-01',
    instrument: 'staging',
    band: 'G3b',
    category: 'g-stage',
    label: 'Moderately to severely decreased',
    description: 'eGFR 30–44 mL/min/1.73 m² — G3b (moderately to severely decreased)',
    evaluate: (e) => e >= G3B_MIN && e < G3A_MIN
  },
  {
    id: 'R-STAGE-G4-01',
    instrument: 'staging',
    band: 'G4',
    category: 'g-stage',
    label: 'Severely decreased',
    description: 'eGFR 15–29 mL/min/1.73 m² — G4 (severely decreased)',
    evaluate: (e) => e >= G4_MIN && e < G3B_MIN
  },
  {
    id: 'R-STAGE-G5-01',
    instrument: 'staging',
    band: 'G5',
    category: 'g-stage',
    label: 'Kidney failure',
    description: 'eGFR < 15 mL/min/1.73 m² — G5 (kidney failure)',
    evaluate: (e) => e < G4_MIN
  }
];

Object.assign(window.EstimatedGlomerularFiltrationRateCalculator, {
  UMOL_PER_MGDL,
  KAPPA_FEMALE,
  KAPPA_MALE,
  ALPHA_FEMALE,
  ALPHA_MALE,
  MAX_EXPONENT,
  BASE_COEFFICIENT,
  AGE_DECAY_BASE,
  FEMALE_MULTIPLIER,
  G1_MIN,
  G2_MIN,
  G3A_MIN,
  G3B_MIN,
  G4_MIN,
  BOUNDARY_MARGIN,
  stageRules
});
})();
