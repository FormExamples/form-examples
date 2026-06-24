import type {
	CardiacStressResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalResult,
	hasAnyAbnormalFinding,
	dukeRiskBand,
	DUKE_LOW_RISK_MIN
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in ACC/AHA
 * prognostic stratification and the Duke treadmill score risk bands:
 * - major: a critical result (strongly positive, exertional hypotension,
 *   ischaemia at low workload, or a high-risk Duke score).
 * - moderate: an actionable abnormal finding (induced ischaemia, chest pain,
 *   arrhythmia) without a critical trigger.
 * - minor: an isolated minor finding (e.g. early termination only).
 * - none: a negative / normal test.
 *
 * The `reportingCategory` carries the structured risk label — the Duke
 * treadmill score risk band where available (low / intermediate / high risk).
 */
export function gradeSeverity(
	r: CardiacStressResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const dukeBand = dukeRiskBand(r.dukeTreadmillScore);

	if (hasCriticalResult(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-result',
			description: 'Critical result present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: dukeBand || 'critical-actionable',
			firedRules
		};
	}

	const actionable = r.ischaemicStChanges || r.chestPainInduced || r.arrhythmiaInduced;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (induced ischaemia, chest pain, or arrhythmia) is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: dukeBand || 'actionable-finding',
			firedRules
		};
	}

	if (r.terminatedEarly && classification !== 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'early-termination',
			description: 'Test terminated early without an actionable finding; severity graded minor.'
		});
		return {
			abnormalitySeverity: 'minor',
			reportingCategory: dukeBand || 'submaximal',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive study; abnormality severity not established.'
		});
		return {
			abnormalitySeverity: 'none',
			reportingCategory: dukeBand || 'indeterminate',
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	// A negative test with a recorded low-risk Duke score is a reassuring band.
	const negativeBand =
		dukeBand ||
		(r.dukeTreadmillScore !== null && r.dukeTreadmillScore >= DUKE_LOW_RISK_MIN
			? 'duke-low-risk'
			: 'normal');
	return { abnormalitySeverity: 'none', reportingCategory: negativeBand, firedRules };
}
