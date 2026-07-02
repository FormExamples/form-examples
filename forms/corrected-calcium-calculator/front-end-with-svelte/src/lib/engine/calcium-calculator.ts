import type { AssessmentData, Classification, FiredRule, GradingResult } from './types';
import { REF_ALBUMIN, FACTOR, classificationRules } from './calcium-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Round a number to two decimal places (returns null unchanged). */
export function roundTwo(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n * 100) / 100;
}

/**
 * Pure function: compute the full corrected-calcium grade for the supplied
 * assessment data.
 *
 * Correction algorithm (spec §4):
 *   correctedCalcium = (totalCalcium != null && albumin != null)
 *                      ? totalCalcium + 0.02 × (40 − albumin)
 *                      : null
 *
 *   classification =
 *       correctedCalcium == null   -> 'unknown'
 *       correctedCalcium <  2.20   -> 'hypocalcaemia'
 *       correctedCalcium <= 2.60   -> 'normal'
 *       else                       -> 'hypercalcaemia'
 *
 * The unrounded value drives classification and every flag threshold; the value
 * is rounded to two decimal places for display only.
 */
export function calculateCorrectedCalcium(data: AssessmentData): GradingResult {
	const totalCalcium = data.calcium.totalCalcium;
	const albumin = data.albumin.albumin;

	const firedRules: FiredRule[] = [];

	// ─── Correction ────────────────────────────────────────────────
	let correctedCalciumRaw: number | null = null;
	if (totalCalcium !== null && albumin !== null) {
		correctedCalciumRaw = totalCalcium + FACTOR * (REF_ALBUMIN - albumin);
	}

	if (correctedCalciumRaw === null) {
		firedRules.push({
			id: 'R-CORRECTION-INCOMPLETE-01',
			instrument: 'correction',
			band: 'unknown',
			category: 'missing-input',
			description: 'Correction not computed — total calcium and/or albumin is missing'
		});
		return {
			correctedCalcium: null,
			correctedCalciumRaw: null,
			classification: 'unknown',
			firedRules,
			flaggedIssues: detectFlaggedIssues(data, null),
			timestamp: new Date().toISOString()
		};
	}

	firedRules.push({
		id: 'R-CORRECTION-01',
		instrument: 'correction',
		band: 'unknown',
		category: 'correction',
		description:
			`Corrected calcium = ${totalCalcium} + 0.02 × (40 − ${albumin}) = ` +
			`${roundTwo(correctedCalciumRaw)} mmol/L`
	});

	// ─── Classification ────────────────────────────────────────────
	let classification: Classification = 'unknown';
	for (const rule of classificationRules) {
		try {
			if (rule.evaluate(correctedCalciumRaw)) {
				classification = rule.band as Classification;
				firedRules.push({
					id: rule.id,
					instrument: rule.instrument,
					band: rule.band,
					category: rule.category,
					description: rule.description
				});
				break;
			}
		} catch (e) {
			console.warn(`Corrected-calcium rule ${rule.id} evaluation failed:`, e);
		}
	}

	return {
		correctedCalcium: roundTwo(correctedCalciumRaw),
		correctedCalciumRaw,
		classification,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, correctedCalciumRaw),
		timestamp: new Date().toISOString()
	};
}
