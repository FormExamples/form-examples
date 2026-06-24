import type {
	TumorMarkerResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { isCriticalResult, hasGermCellCriticalMarker, hasActionSignal } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in ACB / RCPath
 * tumour-marker interpretation and the ASCO germ-cell marker pattern:
 * - major: a critical result, or a germ-cell-marker pattern (very high
 *   AFP / beta-hCG).
 * - moderate: a markedly elevated value or a rising trend on treatment.
 * - minor: a mildly raised value reported abnormal without an action signal.
 * - none: a normal result.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: TumorMarkerResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (isCriticalResult(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-result',
			description: 'Critical result present; abnormality severity graded major.'
		});
		const category = hasGermCellCriticalMarker(r) ? 'germ-cell-marker-pattern' : 'critical-result';
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (hasActionSignal(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'action-signal',
			description:
				'A markedly elevated value or a rising trend on treatment is present; severity graded moderate.'
		});
		const category = r.trend === 'rising' ? 'rising-trend-on-treatment' : 'markedly-elevated';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (r.overallResultStatus === 'abnormal') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'mildly-raised',
			description:
				'Result reported abnormal without a markedly elevated value or rising trend; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'mildly-raised', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive result; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'normal',
		description: 'No abnormal marker pattern; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
