import type { BandRule } from './types';

/**
 * Declarative MELD constants and mortality-band classification rules.
 *
 * Unlike an additive checklist, MELD is a *weighted logarithmic formula*: the
 * integer score is computed once (see `meld-grader.ts`) and then classified
 * into an estimated-3-month-mortality band. The rules below describe the five
 * bands, evaluated against the final clamped score (6–40). Rows mirror the
 * `model_for_end_stage_liver_disease_score_grade_rule` SQL table.
 */

// ─── Formula coefficients and bounds (spec §4) ──────────────────
/** Coefficient on ln(bilirubin) in the base MELD formula. */
export const COEF_BILIRUBIN = 3.78;
/** Coefficient on ln(INR) in the base MELD formula. */
export const COEF_INR = 11.2;
/** Coefficient on ln(creatinine) in the base MELD formula. */
export const COEF_CREATININE = 9.57;
/** Additive constant in the base MELD formula. */
export const CONSTANT = 6.43;
/** Lower bound applied to bilirubin, INR, and creatinine before ln (ln 1 = 0). */
export const LOWER_BOUND = 1.0;
/** Upper bound (cap) applied to creatinine in MELD / MELD-Na. */
export const CREATININE_CAP = 4.0;
/** Creatinine value substituted by the dialysis rule (mg/dL). */
export const DIALYSIS_CREATININE = 4.0;
/** umol/L -> mg/dL divisor for bilirubin. */
export const BILIRUBIN_UMOL_DIVISOR = 17.1;
/** umol/L -> mg/dL divisor for creatinine. */
export const CREATININE_UMOL_DIVISOR = 88.4;
/** Lower clamp for serum sodium in the MELD-Na correction (mEq/L). */
export const SODIUM_LOW = 125;
/** Upper clamp for serum sodium in the MELD-Na correction (mEq/L). */
export const SODIUM_HIGH = 137;
/** Base MELD above which the sodium correction is applied. */
export const SODIUM_GATE = 11;
/** Final score clamp — lower bound. */
export const SCORE_MIN = 6;
/** Final score clamp — upper bound. */
export const SCORE_MAX = 40;

// ─── MELD 3.0 bounds (spec §6) ──────────────────────────────────
/** MELD 3.0 caps creatinine at 3.0 mg/dL. */
export const MELD3_CREATININE_CAP = 3.0;
/** MELD 3.0 lower-clamps albumin at 1.5 g/dL. */
export const MELD3_ALBUMIN_LOW = 1.5;
/** MELD 3.0 upper-clamps albumin at 3.5 g/dL. */
export const MELD3_ALBUMIN_HIGH = 3.5;

/**
 * Mortality-band classification rules, evaluated against the final clamped
 * integer MELD score. Contiguous, non-overlapping bands per spec §8.
 */
export const bandRules: BandRule[] = [
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
