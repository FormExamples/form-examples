import type {
	SleepStudyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalFinding,
	hasOnlyPeriodicLimbMovements,
	ahiSeverityBand,
	ahiReportingCategory
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the AASM AHI
 * severity bands (none <5, mild 5 to <15, moderate 15 to <30, severe >=30)
 * interpreted alongside the desaturation burden:
 * - major: a critical finding, or severe OSA (AHI >= 30).
 * - moderate: moderate OSA (AHI 15 to <30) or another actionable finding.
 * - minor: mild OSA, or periodic-limb-movements only.
 * - none: a normal study.
 *
 * The `reportingCategory` is the AHI severity-band label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: SleepStudyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const band = ahiSeverityBand(r.apnoeaHypopnoeaIndex);
	const category = ahiReportingCategory(r.apnoeaHypopnoeaIndex);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (band === 'severe') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'severe-osa',
			description: 'Severe OSA (AHI >= 30); abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	const actionable =
		band === 'moderate' ||
		r.centralSleepApnoea ||
		r.significantDesaturation;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (moderate OSA, central sleep apnoea, or significant desaturation) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (band === 'mild' || r.obstructiveSleepApnoea) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'mild-osa',
			description: 'Mild OSA; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
	}

	if (hasOnlyPeriodicLimbMovements(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'periodic-limb-movements',
			description: 'Periodic limb movements only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'Periodic limb movements', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive study; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'Indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: category, firedRules };
}
