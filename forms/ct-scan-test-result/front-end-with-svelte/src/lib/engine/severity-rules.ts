import type {
	CtScanResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and structured-reporting systems such as
 * ACR Lung-RADS and the ACR incidental-findings categories:
 * - major: a critical finding, or a large lesion (>= 30 mm).
 * - moderate: an actionable abnormal finding (mass, fracture, infection,
 *   obstruction) or a measurable lesion (10–29 mm).
 * - minor: incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: CtScanResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const size = r.largestLesionSizeMm;

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (size !== null && size >= 30) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'large-lesion',
			description: 'Largest lesion is 30 mm or larger; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'large-lesion', firedRules };
	}

	const actionable =
		r.massOrLesion ||
		r.fracture ||
		r.infectionInflammation ||
		r.obstruction ||
		r.acuteFinding;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (mass, fracture, infection, obstruction, or acute finding) is present; severity graded moderate.'
		});
		const category = size !== null && size >= 10 ? 'measurable-lesion' : 'actionable-finding';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
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
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
