import type {
	EyeVisionResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalFinding,
	hasAnyAbnormalFinding,
	hasReferableRetinopathy,
	hasElevatedIop
} from './utils';

/**
 * Derives a structured-reporting category label from the diabetic-retinopathy
 * grade, in the style of an NHS Diabetic Eye Screening Programme grade
 * (e.g. R2M1). Falls back to a short descriptive label otherwise.
 */
function reportingCategoryFor(r: EyeVisionResult): string {
	const rGrade =
		r.retinopathyGrade === 'none'
			? 'R0'
			: r.retinopathyGrade === 'background'
				? 'R1'
				: r.retinopathyGrade === 'pre-proliferative'
					? 'R2'
					: r.retinopathyGrade === 'proliferative'
						? 'R3'
						: '';
	const mGrade =
		r.retinopathyGrade === 'maculopathy' || r.macularAbnormality ? 'M1' : '';
	const composite = `${rGrade}${mGrade}`;
	if (composite !== '') return composite;
	if (hasAnyAbnormalFinding(r)) return 'actionable-finding';
	return 'normal';
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCOphth
 * actionable-reporting principles, NICE NG81 intraocular-pressure thresholds,
 * and the NHS Diabetic Eye Screening Programme grading criteria:
 * - major: a critical finding, or referable diabetic retinopathy
 *   (pre-proliferative / proliferative / maculopathy).
 * - moderate: an actionable abnormal finding (optic-disc abnormality, macular
 *   abnormality, bilateral field defect, or an intraocular pressure at or above
 *   the NG81 threshold).
 * - minor: a single low-acuity / minor structured abnormal finding.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: EyeVisionResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const reportingCategory = reportingCategoryFor(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory, firedRules };
	}

	if (hasReferableRetinopathy(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'referable-retinopathy',
			description:
				'Referable diabetic retinopathy (pre-proliferative, proliferative, or maculopathy) is present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory, firedRules };
	}

	const actionable =
		r.opticDiscAbnormality ||
		r.macularAbnormality ||
		r.visualFieldResult === 'bilateral-defect' ||
		hasElevatedIop(r);

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (optic-disc abnormality, macular abnormality, bilateral field defect, or elevated intraocular pressure) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory, firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'minor-finding',
			description:
				'A minor structured abnormal finding (e.g. reduced acuity, unilateral field defect, or background retinopathy) is present; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory, firedRules };
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
	return { abnormalitySeverity: 'none', reportingCategory, firedRules };
}
