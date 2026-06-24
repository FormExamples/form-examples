import type {
	XRayResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles:
 * - major: a critical finding (pneumothorax / free air / unstable fracture).
 * - moderate: an actionable abnormal finding (fracture, dislocation,
 *   consolidation, pleural effusion, foreign body, or bony lesion).
 * - minor: incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows; a free-text override on the result is
 * preferred when present.
 */
export function gradeSeverity(
	r: XRayResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const override = r.reportingCategory.trim();

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: override || 'critical-actionable',
			firedRules
		};
	}

	const actionable =
		r.fracture ||
		r.dislocation ||
		r.consolidation ||
		r.pleuralEffusion ||
		r.foreignBody ||
		r.bonyLesion;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (fracture, dislocation, consolidation, pleural effusion, foreign body, or bony lesion) is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: override || 'abnormal-acute',
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
		return { abnormalitySeverity: 'minor', reportingCategory: override || 'incidental', firedRules };
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
			reportingCategory: override || 'indeterminate',
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: override || 'normal', firedRules };
}
