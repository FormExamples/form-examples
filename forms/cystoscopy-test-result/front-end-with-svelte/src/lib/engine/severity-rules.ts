import type {
	CystoscopyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasOnlyMinorFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in BAUS
 * actionable-reporting principles and structured-reporting systems such as the
 * EAU NMIBC risk groups and suspected-tumour categories:
 * - major: a bladder tumour / suspicious lesion, or a large lesion (>= 30 mm).
 * - moderate: an actionable abnormal finding (inflammation / cystitis, bladder
 *   stones, urethral stricture) or a measurable lesion (10–29 mm).
 * - minor: benign structural findings only (trabeculation / prostatic
 *   enlargement).
 * - none: a normal examination.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: CystoscopyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const size = r.tumourSizeMm;

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description:
				'Bladder tumour or suspicious lesion present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'suspected-tumour', firedRules };
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

	const actionable = r.inflammationCystitis || r.bladderStones || r.urethralStricture;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (inflammation / cystitis, bladder stones, or urethral stricture) is present; severity graded moderate.'
		});
		const category = size !== null && size >= 10 ? 'measurable-lesion' : 'actionable-finding';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (hasOnlyMinorFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'benign-structural-finding',
			description:
				'Benign structural finding(s) only (trabeculation / prostatic enlargement); abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'benign-structural', firedRules };
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
