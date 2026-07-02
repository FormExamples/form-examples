// QRISK3 representative weighted-model coefficient tables and transforms.
//
// ============================================================================
// IMPORTANT — REPRESENTATIVE APPROXIMATION, NOT THE OFFICIAL QRISK3 ALGORITHM.
// ============================================================================
// The published QRISK3-2017 model (Hippisley-Cox et al., BMJ 2017; 357:j2099)
// is a sex-specific Cox proportional-hazards survival model with dozens of
// fitted coefficients, fractional-polynomial transforms of the continuous
// variables, and numerous age-interaction terms. Reproducing the full official
// coefficient set is out of scope for this front-end.
//
// The tables below are a DOCUMENTED, REPRESENTATIVE weighted-risk model built in
// the *shape* of QRISK3: each input is centred on an approximate cohort mean and
// multiplied by a plausible log-hazard-ratio-style weight; the weighted
// contributions sum to a linear predictor `LP` that `qrisk3-grader.ts` maps
// through an approximate baseline survival to a 10-year risk percentage. The
// numbers are illustrative and directionally sensible (they rank patients the
// way QRISK3 would), but they are NOT the official coefficients and MUST NOT be
// used for real clinical decision-making. For production use, integrate the
// open-source ClinRisk QRISK3-2017 reference implementation.
//
// This file mirrors the shape of the `..._grade_rule` SQL table (rule_id,
// factor, weight metadata) and is consumed by `qrisk3-grader.ts`. The
// coefficients are ported verbatim from the HTML front-end engine
// (`front-end-with-html/js/rules.js`).

import type { CkdStage, DiabetesStatus, Ethnicity, SmokingStatus } from './types';

/**
 * Approximate cohort means used to centre the continuous variables. Centring
 * makes the linear predictor ~0 for an "average" patient so the baseline
 * survival maps to the average population risk.
 */
export const MEANS = {
	age: 60,
	bodyMassIndex: 26,
	cholesterolHdlRatio: 4,
	systolicBloodPressure: 130,
	systolicBloodPressureSd: 9,
	townsendScore: 0
} as const;

/**
 * Sex-specific pieces: the per-year age weight and the 10-year baseline
 * survival S0 (representative values in the spirit of the published female /
 * male baseline survivals). Women carry lower absolute risk, hence higher S0.
 */
export const SEX_MODEL: Record<'female' | 'male', { ageWeight: number; baselineSurvival: number }> =
	{
		female: { ageWeight: 0.066, baselineSurvival: 0.988876 },
		male: { ageWeight: 0.058, baselineSurvival: 0.977268 }
	};

/**
 * Continuous-variable weights (log-HR-style, per unit above the centred mean).
 * Shared across sexes except `age`, which comes from SEX_MODEL above.
 */
export const CONTINUOUS_WEIGHTS = {
	bodyMassIndex: 0.021,
	cholesterolHdlRatio: 0.15,
	systolicBloodPressure: 0.011,
	systolicBloodPressureSd: 0.01,
	townsendScore: 0.033
} as const;

/**
 * Categorical-variable weight tables. Each key maps an enum value to its LP
 * contribution. The empty-string default (unanswered) contributes 0.
 */
export const SMOKING_WEIGHTS: Record<SmokingStatus, number> = {
	non: 0,
	ex: 0.1,
	light: 0.22,
	moderate: 0.4,
	heavy: 0.56,
	'': 0
};

export const DIABETES_WEIGHTS: Record<DiabetesStatus, number> = {
	none: 0,
	type1: 1.05,
	type2: 0.56,
	'': 0
};

export const ETHNICITY_WEIGHTS: Record<Ethnicity, number> = {
	'white-or-not-stated': 0,
	indian: 0.28,
	pakistani: 0.37,
	bangladeshi: 0.51,
	'other-asian': 0.12,
	'black-caribbean': -0.15,
	'black-african': -0.28,
	chinese: -0.42,
	other: -0.1,
	'': 0
};

export const CKD_WEIGHTS: Record<CkdStage, number> = {
	none: 0,
	stage3: 0.24,
	stage4: 0.45,
	stage5: 0.6,
	'': 0
};

/** Binary yes/no comorbidity and medication weights (contribution when 'yes'). */
export const BINARY_WEIGHTS = {
	onBloodPressureTreatment: 0.55,
	familyHistoryChd: 0.44,
	atrialFibrillation: 0.88,
	migraine: 0.3,
	rheumatoidArthritis: 0.22,
	systemicLupusErythematosus: 0.44,
	severeMentalIllness: 0.25,
	erectileDysfunction: 0.22,
	onAtypicalAntipsychotics: 0.28,
	onCorticosteroids: 0.4
} as const;
