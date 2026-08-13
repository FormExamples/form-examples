// MUST (Malnutrition Universal Screening Tool) rules.
//
// MUST is published by BAPEN and is free for non-commercial use with
// attribution. See doc/must-scoring-rules.md for the rule-by-rule table and
// the mid-upper-arm-circumference fallback.
//
// Every function here is pure: same inputs, same outputs, no I/O, no clock.

import type {
	AnthropometrySection,
	DieticAssessment,
	FiredRule,
	MustRisk,
	ScreeningSection
} from './types';
import { num, round1, rule } from './utils';

export interface BmiResult {
	bmi: number | null;
	adjustedWeightKg: number | null;
	adjusted: boolean;
}

export interface WeightLossResult {
	percent: number | null;
	baselineKg: number | null;
	baselineSource: string;
}

export interface ComponentResult {
	score: number;
	estimated: boolean;
	rule: FiredRule | null;
}

export interface MustResult {
	bmi: number | null;
	adjustedWeightKg: number | null;
	weightLossPercent: number | null;
	bmiScore: number;
	weightLossScore: number;
	acuteDiseaseScore: number;
	total: number;
	risk: MustRisk;
	estimated: boolean;
	firedRules: FiredRule[];
}

/**
 * Compute body mass index, applying the oedema weight adjustment first so
 * fluid weight does not mask true loss.
 */
export function computeBmi(a: AnthropometrySection): BmiResult {
	const heightCm = num(a.heightAsCm);
	const rawWeight = num(a.weightAsKg);
	if (rawWeight === null) {
		return { bmi: null, adjustedWeightKg: null, adjusted: false };
	}

	const oedemaAdjustment = a.oedemaPresent === 'yes' ? (num(a.oedemaAdjustmentKg) ?? 0) : 0;
	const adjustedWeightKg = round1(Math.max(0, rawWeight - oedemaAdjustment));
	const adjusted = oedemaAdjustment > 0;

	if (heightCm === null || heightCm <= 0) {
		return { bmi: null, adjustedWeightKg, adjusted };
	}
	const metres = heightCm / 100;
	return { bmi: round1(adjustedWeightKg / (metres * metres)), adjustedWeightKg, adjusted };
}

/**
 * Percentage unplanned weight loss over the last 3 to 6 months. Prefers the
 * recorded usual weight, then the 6-month weight, then the 3-month weight.
 */
export function computeWeightLossPercent(a: AnthropometrySection): WeightLossResult {
	const current = num(a.weightAsKg);
	const candidates: Array<[string, number | null]> = [
		['usual weight', num(a.usualWeightAsKg)],
		['weight 6 months ago', num(a.weight6MonthsAgoAsKg)],
		['weight 3 months ago', num(a.weight3MonthsAgoAsKg)]
	];
	const found = candidates.find(([, v]) => v !== null && v > 0);
	if (current === null || !found) {
		return { percent: null, baselineKg: null, baselineSource: '' };
	}
	const [baselineSource, baselineKg] = found as [string, number];
	return {
		percent: round1(((baselineKg - current) / baselineKg) * 100),
		baselineKg,
		baselineSource
	};
}

/** MUST step 1 — body mass index score, with the MUAC fallback. */
export function scoreMustBmi(a: AnthropometrySection, bmi: number | null): ComponentResult {
	if (bmi !== null) {
		if (bmi < 18.5) {
			return {
				score: 2,
				estimated: false,
				rule: rule('R-MUST-BMI-2', 'must', 'bmi', 2, 'high', 'anthropometry',
					`Body mass index ${bmi} kg/m² is below 18.5.`)
			};
		}
		if (bmi <= 20.0) {
			return {
				score: 1,
				estimated: false,
				rule: rule('R-MUST-BMI-1', 'must', 'bmi', 1, 'medium', 'anthropometry',
					`Body mass index ${bmi} kg/m² is between 18.5 and 20.0.`)
			};
		}
		return {
			score: 0,
			estimated: false,
			rule: rule('R-MUST-BMI-0', 'must', 'bmi', 0, 'low', 'anthropometry',
				`Body mass index ${bmi} kg/m² is above 20.0.`)
		};
	}

	const muac = num(a.midUpperArmCircumferenceAsCm);
	if (muac === null) return { score: 0, estimated: true, rule: null };
	if (muac < 20.0) {
		return {
			score: 2,
			estimated: true,
			rule: rule('R-MUST-MUAC-2', 'must', 'bmi', 2, 'high', 'anthropometry',
				`Mid-upper-arm circumference ${muac} cm is below 20.0, suggesting a body mass index below 18.5.`)
		};
	}
	if (muac < 23.5) {
		return {
			score: 1,
			estimated: true,
			rule: rule('R-MUST-MUAC-1', 'must', 'bmi', 1, 'medium', 'anthropometry',
				`Mid-upper-arm circumference ${muac} cm is below 23.5, suggesting a body mass index below 20.0.`)
		};
	}
	return {
		score: 0,
		estimated: true,
		rule: rule('R-MUST-MUAC-0', 'must', 'bmi', 0, 'low', 'anthropometry',
			`Mid-upper-arm circumference ${muac} cm suggests a body mass index above 20.0.`)
	};
}

/** MUST step 2 — unplanned weight-loss score. */
export function scoreMustWeightLoss(
	a: AnthropometrySection,
	weightLoss: WeightLossResult
): ComponentResult {
	if (weightLoss.percent === null) {
		if (a.clothesOrJewelleryLooser === 'yes') {
			return {
				score: 1,
				estimated: true,
				rule: rule('R-MUST-WL-SUBJECTIVE', 'must', 'weight-loss', 1, 'medium', 'weight history',
					'No baseline weight available; clothes or jewellery reported as looser, so the MUST subjective criterion is applied.')
			};
		}
		return { score: 0, estimated: true, rule: null };
	}

	if (a.weightLossIsIntentional === 'yes') {
		return {
			score: 0,
			estimated: false,
			rule: rule('R-MUST-WL-PLANNED', 'must', 'weight-loss', 0, 'low', 'weight history',
				`Weight loss of ${weightLoss.percent}% was intentional, so it does not score in MUST.`)
		};
	}

	const pct = weightLoss.percent;
	if (pct > 10) {
		return {
			score: 2,
			estimated: false,
			rule: rule('R-MUST-WL-2', 'must', 'weight-loss', 2, 'high', 'weight history',
				`Unplanned weight loss of ${pct}% against ${weightLoss.baselineSource} exceeds 10%.`)
		};
	}
	if (pct >= 5) {
		return {
			score: 1,
			estimated: false,
			rule: rule('R-MUST-WL-1', 'must', 'weight-loss', 1, 'medium', 'weight history',
				`Unplanned weight loss of ${pct}% against ${weightLoss.baselineSource} is between 5% and 10%.`)
		};
	}
	return {
		score: 0,
		estimated: false,
		rule: rule('R-MUST-WL-0', 'must', 'weight-loss', 0, 'low', 'weight history',
			`Unplanned weight loss of ${pct}% against ${weightLoss.baselineSource} is below 5%.`)
	};
}

/** MUST step 3 — acute disease effect. Both conditions must hold. */
export function scoreMustAcuteDisease(s: ScreeningSection): {
	score: number;
	rule: FiredRule | null;
} {
	if (s.acutelyIll === 'yes' && s.noNutritionalIntakeOver5Days === 'yes') {
		return {
			score: 2,
			rule: rule('R-MUST-ACUTE-2', 'must', 'acute-disease', 2, 'high', 'acute illness',
				'Acutely ill with no nutritional intake, or unlikely intake, for more than five days.')
		};
	}
	return { score: 0, rule: null };
}

/** Map a MUST total to its BAPEN risk category. */
export function mustRiskCategory(total: number): MustRisk {
	if (total === 0) return 'low';
	if (total === 1) return 'medium';
	return 'high';
}

/** Compute the whole MUST result for an assessment. */
export function scoreMust(data: DieticAssessment): MustResult {
	const { bmi, adjustedWeightKg, adjusted } = computeBmi(data.anthropometry);
	const weightLoss = computeWeightLossPercent(data.anthropometry);

	const bmiPart = scoreMustBmi(data.anthropometry, bmi);
	const weightLossPart = scoreMustWeightLoss(data.anthropometry, weightLoss);
	const acutePart = scoreMustAcuteDisease(data.screening);

	const firedRules = [bmiPart.rule, weightLossPart.rule, acutePart.rule].filter(
		(r): r is FiredRule => r !== null
	);

	if (adjusted) {
		firedRules.push(
			rule('R-MUST-BMI-ADJ', 'must', 'bmi', null, '', 'anthropometry',
				`Weight adjusted by ${data.anthropometry.oedemaAdjustmentKg} kg for oedema before computing body mass index.`)
		);
	}
	if (data.anthropometry.amputationPresent === 'yes') {
		firedRules.push(
			rule('R-MUST-BMI-AMP', 'must', 'bmi', null, '', 'anthropometry',
				'Amputation recorded; body mass index is interpreted against the residual-limb adjustment and the score is marked estimated.')
		);
	}

	const total = bmiPart.score + weightLossPart.score + acutePart.score;
	const estimated =
		bmiPart.estimated ||
		weightLossPart.estimated ||
		data.anthropometry.measurementMethod === 'declined' ||
		data.anthropometry.measurementMethod === 'estimated' ||
		data.anthropometry.amputationPresent === 'yes';

	return {
		bmi,
		adjustedWeightKg,
		weightLossPercent: weightLoss.percent,
		bmiScore: bmiPart.score,
		weightLossScore: weightLossPart.score,
		acuteDiseaseScore: acutePart.score,
		total,
		risk: mustRiskCategory(total),
		estimated,
		firedRules
	};
}
