import type {
	UltrasoundResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and structured-reporting systems such as
 * ACR TI-RADS (thyroid) and the breast U-classification:
 * - major: a critical finding, or a large lesion (>= 30 mm).
 * - moderate: an actionable abnormal finding (mass, gallstones, hydronephrosis,
 *   free fluid, organ enlargement) or a measurable lesion (10–29 mm).
 * - minor: a simple cyst or incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` prefers any operator-entered structured-reporting
 * label (e.g. an ACR TI-RADS level or breast U-classification) and otherwise
 * falls back to a short derived structured label.
 */
export function gradeSeverity(
	r: UltrasoundResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const size = r.largestLesionSizeMm;
	const entered = r.reportingCategory.trim();

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

	if (size !== null && size >= 30) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'large-lesion',
			description: 'Largest lesion is 30 mm or larger; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: entered || 'large-lesion', firedRules };
	}

	const actionable =
		r.massOrLesion ||
		r.gallstones ||
		r.hydronephrosis ||
		r.freeFluid ||
		r.organEnlargement;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (mass, gallstones, hydronephrosis, free fluid, or organ enlargement) is present; severity graded moderate.'
		});
		const derived = size !== null && size >= 10 ? 'measurable-lesion' : 'actionable-finding';
		return { abnormalitySeverity: 'moderate', reportingCategory: entered || derived, firedRules };
	}

	if (r.cyst) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'simple-cyst',
			description: 'A simple cyst is present with no other abnormal finding; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: entered || 'simple-cyst', firedRules };
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
