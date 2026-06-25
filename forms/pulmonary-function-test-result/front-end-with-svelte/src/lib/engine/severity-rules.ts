import type {
	PulmonaryFunctionResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Maps the recorded ventilatory severity band to a GOLD / ATS-ERS structured
 * reporting-category label, banded by FEV1 % predicted where available
 * (GOLD 1 ≥ 80 %, GOLD 2 50–79 %, GOLD 3 30–49 %, GOLD 4 < 30 %).
 */
function reportingCategoryFor(r: PulmonaryFunctionResult): string {
	const pct = r.fev1PercentPredicted;
	if (r.airflowObstruction && pct !== null) {
		if (pct >= 80) return 'GOLD 1 (mild)';
		if (pct >= 50) return 'GOLD 2 (moderate)';
		if (pct >= 30) return 'GOLD 3 (severe)';
		return 'GOLD 4 (very-severe)';
	}
	switch (r.severity) {
		case 'mild':
			return 'ATS/ERS mild';
		case 'moderate':
			return 'ATS/ERS moderate';
		case 'severe':
			return 'ATS/ERS severe';
		case 'very-severe':
			return 'ATS/ERS very-severe';
		default:
			return r.reportingCategory.trim() !== '' ? r.reportingCategory.trim() : 'normal';
	}
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the ATS/ERS
 * 2022 z-score severity grading and GOLD percent-predicted banding:
 * - major: a critical finding, or severe / very-severe ventilatory impairment.
 * - moderate: a moderate ventilatory impairment, or any actionable abnormal
 *   structured finding.
 * - minor: mild ventilatory impairment, or reduced gas transfer only.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: PulmonaryFunctionResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const category = reportingCategoryFor(r);

	if (hasCriticalFinding(r) || r.severity === 'severe' || r.severity === 'very-severe') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'severe-impairment',
			description:
				'Severe or very-severe ventilatory impairment; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (r.severity === 'moderate') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'moderate-impairment',
			description: 'Moderate ventilatory impairment; abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if ((r.airflowObstruction || r.restriction) && r.severity === '') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'Airflow obstruction or restriction present without a graded severity; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (r.severity === 'mild' || r.reducedGasTransfer) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'mild-impairment',
			description:
				'Mild ventilatory impairment or reduced gas transfer only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
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

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'abnormal-finding',
			description:
				'An abnormal ventilatory pattern is present without a graded severity; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
