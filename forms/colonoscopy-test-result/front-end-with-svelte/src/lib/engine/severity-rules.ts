import type {
	ColonoscopyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in BSG
 * actionable-reporting principles and the BSG / ACPGBI / PHE polyp-surveillance
 * risk bands:
 * - major: a critical finding (mass / perforation), or a large polyp (>= 20 mm).
 * - moderate: an actionable abnormal finding (polyps, inflammation suggestive of
 *   IBD, angiodysplasia, an identified bleeding source) or a surveillance-band
 *   polyp burden (>= 10 mm or >= 3 polyps).
 * - minor: incidental-only findings (e.g. isolated diverticulosis).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * polyp-surveillance workflows.
 */
export function gradeSeverity(
	r: ColonoscopyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const size = r.largestPolypMm;
	const count = r.polypCount;

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (size !== null && size >= 20) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'large-polyp',
			description: 'Largest polyp is 20 mm or larger; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'large-polyp', firedRules };
	}

	const actionable =
		r.polypsFound ||
		r.inflammationIbd ||
		r.angiodysplasia ||
		r.bleedingSourceIdentified;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (polyps, IBD inflammation, angiodysplasia, or an identified bleeding source) is present; severity graded moderate.'
		});
		const highRiskBurden = (size !== null && size >= 10) || (count !== null && count >= 3);
		const category = highRiskBurden ? 'high-risk-surveillance' : 'low-risk-surveillance';
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
