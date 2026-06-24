import type {
	PetScanResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and the metabolic structured-reporting
 * systems — the 5-point Deauville score (Lugano classification, lymphoma) and
 * PERCIST (solid tumours):
 * - major: a critical finding (distant metastasis / progressive disease), or
 *   high metabolic avidity (SUVmax >= 10).
 * - moderate: an actionable abnormal finding (hypermetabolic lesion / nodal
 *   uptake) or a measurable lesion.
 * - minor: incidental-only findings.
 * - none: a normal / negative study.
 *
 * The `reportingCategory` carries the clinician's free-text structured-reporting
 * label (e.g. a Deauville score 1-5 or a PERCIST response category) when one was
 * entered; otherwise a short derived label suitable for downstream workflows.
 */
export function gradeSeverity(
	r: PetScanResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const entered = r.reportingCategory.trim();
	const suv = r.suvMax;

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: entered || 'critical-actionable',
			firedRules
		};
	}

	if (suv !== null && suv >= 10) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'high-avidity',
			description: 'Highly tracer-avid disease (SUVmax 10 or greater); abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: entered || 'high-avidity',
			firedRules
		};
	}

	const actionable = r.hypermetabolicLesion || r.nodalUptake || hasAnyAbnormalFinding(r);

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (hypermetabolic lesion or nodal uptake) is present; severity graded moderate.'
		});
		const derived =
			r.largestLesionSizeMm !== null && r.largestLesionSizeMm >= 10
				? 'measurable-lesion'
				: 'actionable-finding';
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: entered || derived,
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
		return { abnormalitySeverity: 'minor', reportingCategory: entered || 'incidental', firedRules };
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
			reportingCategory: entered || 'indeterminate',
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: entered || 'normal', firedRules };
}
