import type {
	BiopsyResult,
	ResultClassification,
	AbnormalitySeverity,
	HistologicalGrade,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Maps the histological differentiation grade to its Axis B severity weight,
 * per the index.md mapping (RCPath / TNM8 differentiation grades):
 * - well-differentiated (G1) → minor
 * - moderately-differentiated (G2) → moderate
 * - poorly-differentiated (G3) / undifferentiated (G4) → major
 * - not-applicable (benign / non-neoplastic) → none
 */
function gradeWeight(grade: HistologicalGrade): AbnormalitySeverity {
	switch (grade) {
		case 'well-differentiated':
			return 'minor';
		case 'moderately-differentiated':
			return 'moderate';
		case 'poorly-differentiated':
		case 'undifferentiated':
			return 'major';
		default:
			return 'none';
	}
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCPath
 * cancer-dataset core items and TNM8 / ICCR structured grading:
 * - major: a critical finding, an involved margin, or a poorly-differentiated /
 *   undifferentiated tumour.
 * - moderate: a moderately-differentiated tumour, or an abnormal feature
 *   (lymphovascular invasion / close margin) without a higher grade.
 * - minor: a well-differentiated tumour.
 * - none: a benign / non-neoplastic specimen.
 *
 * The `reportingCategory` carries a short structured label combining the
 * histological grade and the resection-margin status, suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: BiopsyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const weight = gradeWeight(r.histologicalGrade);

	// A free reportingCategory label carrying the grade / diagnosis summary.
	const category = buildReportingCategory(r);

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description:
				'Critical finding (unexpected malignancy or involved margin) present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (r.malignancyPresent && weight === 'major') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'high-grade-malignancy',
			description:
				'Poorly-differentiated or undifferentiated malignancy; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (r.malignancyPresent && weight === 'moderate') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'intermediate-grade-malignancy',
			description: 'Moderately-differentiated malignancy; abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (r.lymphovascularInvasion || r.resectionMargins === 'close') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal feature (lymphovascular invasion or a close margin) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (r.malignancyPresent && weight === 'minor') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'low-grade-malignancy',
			description: 'Well-differentiated malignancy; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
	}

	if (r.malignancyPresent) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'malignancy-ungraded',
			description: 'Malignancy present without a recorded grade; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive specimen; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: category || 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal feature; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: category || 'benign', firedRules };
}

/** Builds a short structured reporting category from the grade and margins. */
function buildReportingCategory(r: BiopsyResult): string {
	if (r.reportingCategory.trim() !== '') return r.reportingCategory.trim();
	const parts: string[] = [];
	if (r.malignancyPresent) {
		parts.push('malignant');
		if (r.histologicalGrade !== '' && r.histologicalGrade !== 'not-applicable') {
			parts.push(r.histologicalGrade);
		}
	} else {
		parts.push('benign');
	}
	if (r.resectionMargins === 'involved') parts.push('margin-involved');
	else if (r.resectionMargins === 'close') parts.push('margin-close');
	return parts.join(' / ');
}
