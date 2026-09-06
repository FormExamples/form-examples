import type {
	ToxicologyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasToxicResult,
	LITHIUM_TOXIC_MMOL_L,
	CARBOXYHAEMOGLOBIN_TOXIC_PERCENT,
	SALICYLATE_TOXIC_MG_L
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in TOXBASE /
 * NPIS toxic-threshold guidance and the MHRA paracetamol treatment nomogram:
 * - major: a toxic level (paracetamol above the treatment line, toxic-level
 *   flag, or a level over a recognised toxic threshold).
 * - moderate: an actionable abnormal status without a frank toxic level.
 * - minor: a result value present but within range, with no abnormal status.
 * - none: a normal study with no result value.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows (e.g. a paracetamol-nomogram band or a
 * therapeutic / toxic descriptor).
 */
export function gradeSeverity(
	r: ToxicologyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasToxicResult(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'toxic-level',
			description: 'Toxic level present; abnormality severity graded major.'
		});
		const category =
			r.paracetamolNomogram === 'above-treatment-line'
				? 'paracetamol-above-treatment-line'
				: 'toxic-range';
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	const overThreshold =
		(r.lithiumLevelMmolL !== null && r.lithiumLevelMmolL >= LITHIUM_TOXIC_MMOL_L) ||
		(r.carboxyhaemoglobinPercent !== null &&
			r.carboxyhaemoglobinPercent >= CARBOXYHAEMOGLOBIN_TOXIC_PERCENT) ||
		(r.salicylateLevelMgL !== null && r.salicylateLevelMgL >= SALICYLATE_TOXIC_MG_L);

	if (overThreshold) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'over-toxic-threshold',
			description:
				'A reported level is over a recognised toxic threshold (lithium, carboxyhaemoglobin, or salicylate); severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'toxic-range', firedRules };
	}

	if (r.overallResultStatus === 'abnormal' || classification === 'abnormal') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'abnormal-status',
			description:
				'An actionable abnormal result is present without a frank toxic level; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'elevated-range', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive study; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	if (r.paracetamolNomogram === 'below-treatment-line') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'below-treatment-line',
			description:
				'Paracetamol level is below the treatment line; a reassuring interpreted result. Severity graded minor.'
		});
		return {
			abnormalitySeverity: 'minor',
			reportingCategory: 'paracetamol-below-treatment-line',
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-result',
		description: 'No abnormal result; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
