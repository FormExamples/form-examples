import type { StageRule } from './types';

/**
 * Declarative CKD-EPI 2021 creatinine constants and CKD G-stage banding rules.
 *
 * Unlike an additive score, the eGFR is a *formula*: the value is computed once
 * (see `egfr-grader.ts`) using the CKD-EPI 2021 creatinine equation (race-free)
 * and then banded into a KDIGO 2012 CKD G-stage. The rows below mirror the
 * `estimated_glomerular_filtration_rate_calculator_grade_rule` SQL table.
 */

// ─── CKD-EPI 2021 creatinine constants (spec §4) ────────────────
/** Conversion divisor: serum creatinine µmol/L → mg/dL. */
export const UMOL_PER_MGDL = 88.42;
/** Sex-specific creatinine scaling factor kappa. */
export const KAPPA_FEMALE = 0.7;
export const KAPPA_MALE = 0.9;
/** Sex-specific low-ratio exponent alpha. */
export const ALPHA_FEMALE = -0.241;
export const ALPHA_MALE = -0.302;
/** High-ratio (max) exponent, applied to max(Scr/kappa, 1). */
export const MAX_EXPONENT = -1.2;
/** Base coefficient. */
export const BASE_COEFFICIENT = 142;
/** Per-year age-decay base. */
export const AGE_DECAY_BASE = 0.9938;
/** Female multiplier. */
export const FEMALE_MULTIPLIER = 1.012;

// ─── G-stage band boundaries (mL/min/1.73 m²) ───────────────────
/** G1 lower bound (>= 90). */
export const G1_MIN = 90;
/** G2 lower bound (60–89). */
export const G2_MIN = 60;
/** G3a lower bound (45–59). */
export const G3A_MIN = 45;
/** G3b lower bound (30–44). */
export const G3B_MIN = 30;
/** G4 lower bound (15–29); below this is G5. */
export const G4_MIN = 15;

/** Margin (mL/min) around a band boundary used by the confirm-CKD flag. */
export const BOUNDARY_MARGIN = 3;

/**
 * CKD G-stage banding rules, evaluated against the unrounded eGFR. Each higher
 * band is inclusive of its lower bound (≥ 90, ≥ 60, ≥ 45, ≥ 30, ≥ 15).
 */
export const stageRules: StageRule[] = [
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
