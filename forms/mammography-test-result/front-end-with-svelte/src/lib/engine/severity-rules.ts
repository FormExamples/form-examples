import type {
	MammographyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasOnlyIncidentalFinding, biRadsShortLabel } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), driven by the ACR
 * BI-RADS final assessment category, which is also carried verbatim in the
 * `reportingCategory` label (e.g. "BI-RADS 4b"):
 * - major: BI-RADS 4c / 5 / 6 (high suspicion or known malignancy).
 * - moderate: BI-RADS 4a / 4b (suspicious), or an actionable abnormal finding
 *   when no BI-RADS category has been assigned.
 * - minor: BI-RADS 3 (probably benign), or incidental-only findings.
 * - none: BI-RADS 1 / 2 (negative / benign) or a normal study.
 */
export function gradeSeverity(
	r: MammographyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const cat = r.biRadsCategory;
	// The reporting category always carries the BI-RADS final assessment.
	const reportingCategory = cat === '' ? 'unassigned' : biRadsShortLabel(cat);

	if (cat === '4c' || cat === '5' || cat === '6') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'birads-high',
			description: `BI-RADS ${cat}; abnormality severity graded major.`
		});
		return { abnormalitySeverity: 'major', reportingCategory, firedRules };
	}

	if (cat === '4a' || cat === '4b') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'birads-suspicious',
			description: `BI-RADS ${cat} (suspicious); abnormality severity graded moderate.`
		});
		return { abnormalitySeverity: 'moderate', reportingCategory, firedRules };
	}

	if (cat === '3') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'birads-probably-benign',
			description: 'BI-RADS 3 (probably benign); abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory, firedRules };
	}

	if (cat === '1' || cat === '2') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-01',
			axis: 'severity',
			category: 'birads-negative',
			description: `BI-RADS ${cat} (negative / benign); abnormality severity graded none.`
		});
		return { abnormalitySeverity: 'none', reportingCategory, firedRules };
	}

	// ─── No BI-RADS assigned: fall back to structured findings ───
	const actionable =
		r.mass ||
		r.architecturalDistortion ||
		r.asymmetry ||
		r.skinOrNippleChange ||
		r.lymphadenopathy ||
		r.calcifications;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (mass, calcifications, distortion, asymmetry, skin/nipple change, or lymphadenopathy) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'actionable-finding', firedRules };
	}

	if (hasOnlyIncidentalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'incidental-finding',
			description: 'Incidental finding(s) only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'incidental', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-03',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive study; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-02',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description:
			'No BI-RADS category assigned and no abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
