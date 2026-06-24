import type {
	FluoroscopyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and a free structured `reportingCategory`
 * label:
 * - major: a critical finding (perforation / leak or obstruction), or a fistula.
 * - moderate: an actionable abnormal finding (stricture, filling defect,
 *   dysmotility).
 * - minor: reflux only, or incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: FluoroscopyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (r.fistula) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'fistula',
			description: 'A fistulous tract is demonstrated; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'fistula', firedRules };
	}

	const actionable = r.stricture || r.fillingDefect || r.dysmotility;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (stricture, filling defect, or dysmotility) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'actionable-finding', firedRules };
	}

	if (r.reflux) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'reflux',
			description: 'Reflux demonstrated without other abnormality; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'reflux', firedRules };
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
