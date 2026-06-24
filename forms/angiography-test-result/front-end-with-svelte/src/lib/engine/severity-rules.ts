import type {
	AngiographyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalFinding,
	hasOnlyIncidentalFinding,
	stenosisSeverityCategory
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and structured arterial-stenosis grading
 * (NASCET / ECST stenosis-severity categories):
 * - major: a critical finding, or a high-grade stenosis (>= 70 %).
 * - moderate: an actionable abnormal finding (significant stenosis, aneurysm,
 *   thrombus) or a moderate stenosis (50–69 %).
 * - minor: incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` carries the stenosis-severity category
 * (<50% / 50-69% / 70-99% / near-occlusion / occluded) where applicable.
 */
export function gradeSeverity(
	r: AngiographyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const pct = r.maxStenosisPercent;
	const stenosisCategory = stenosisSeverityCategory(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: stenosisCategory || 'critical-actionable',
			firedRules
		};
	}

	if (pct !== null && pct >= 70) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'high-grade-stenosis',
			description: 'Maximum stenosis is 70 % or greater; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: stenosisCategory, firedRules };
	}

	const actionable = r.significantStenosis || r.aneurysm || r.thrombus;

	if (actionable || (pct !== null && pct >= 50)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (significant stenosis, aneurysm, thrombus, or 50–69 % stenosis) is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: stenosisCategory || 'actionable-finding',
			firedRules
		};
	}

	if (hasOnlyIncidentalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'incidental-finding',
			description: 'Incidental finding(s) only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'incidental', firedRules };
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

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: stenosisCategory || 'normal', firedRules };
}
