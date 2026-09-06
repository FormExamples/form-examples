import type {
	BloodTestResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalValue, hasAbnormalResult, structuredReportingCategory } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCPath
 * actionable-reporting and the magnitude of deviation from the reference range:
 * - major: a critical (panic) value, or an overall status of critical.
 * - moderate: an abnormal result present (per the reporter summary flag).
 * - minor: a structured band that deviates from normal but is not flagged
 *   abnormal (e.g. CKD G2, prediabetes).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label (e.g. an eGFR CKD stage or
 * a glycaemic band) suitable for downstream structured-reporting workflows; if
 * the reporter supplied one, it takes precedence.
 */
export function gradeSeverity(
	r: BloodTestResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const structured = structuredReportingCategory(r);
	const category = r.reportingCategory.trim() !== '' ? r.reportingCategory.trim() : structured;

	if (hasCriticalValue(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-value',
			description: 'Critical (panic) value present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: category || 'critical-actionable',
			firedRules
		};
	}

	if (hasAbnormalResult(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'abnormal-result',
			description:
				'One or more abnormal results are present; abnormality severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: category || 'abnormal',
			firedRules
		};
	}

	if (structured !== '' && !structured.includes('G1') && !structured.includes('normal')) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'structured-band',
			description:
				'A structured-reporting band deviates from normal but no result was flagged abnormal; severity graded minor.'
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
		return { abnormalitySeverity: 'none', reportingCategory: category || 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-result',
		description: 'No abnormal result; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: category || 'normal', firedRules };
}
