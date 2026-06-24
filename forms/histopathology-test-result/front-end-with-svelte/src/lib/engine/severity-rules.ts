import type {
	HistopathologyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Builds the structured-reporting `reportingCategory` label from the RCPath
 * cancer-dataset core data items: histological grade and the pathological TNM
 * stage (pT / pN / pM). Falls back to a descriptive label where staging is not
 * recorded. The report's own free-text `reportingCategory` (the grade/stage
 * summary line) takes precedence when supplied.
 */
function buildReportingCategory(r: HistopathologyResult, fallback: string): string {
	if (r.reportingCategory.trim() !== '') {
		return r.reportingCategory.trim();
	}
	const parts: string[] = [];
	const tnm = [r.tnmPt, r.tnmPn, r.tnmPm].map((t) => t.trim()).filter((t) => t !== '');
	if (tnm.length > 0) {
		parts.push(tnm.join(' '));
	}
	if (r.histologicalGrade !== '' && r.histologicalGrade !== 'not-applicable') {
		parts.push(r.histologicalGrade);
	}
	return parts.length > 0 ? parts.join(', ') : fallback;
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the RCPath
 * cancer-dataset grade/stage core items (differentiation, pTNM, resection
 * margins, lymphovascular invasion):
 * - major: a critical finding (unexpected malignancy / involved margin), an
 *   undifferentiated or poorly differentiated tumour, or nodal / distant
 *   metastatic disease.
 * - moderate: confirmed malignancy or another actionable abnormal finding.
 * - minor: a close margin or lymphovascular invasion without malignancy.
 * - none: a normal study.
 *
 * The `reportingCategory` carries the grade/stage summary suitable for
 * downstream structured-reporting and MDT workflows.
 */
export function gradeSeverity(
	r: HistopathologyResult,
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
		return {
			abnormalitySeverity: 'major',
			reportingCategory: buildReportingCategory(r, 'critical-actionable'),
			firedRules
		};
	}

	const highGrade =
		r.histologicalGrade === 'poorly-differentiated' ||
		r.histologicalGrade === 'undifferentiated';
	const nodalOrMetastatic =
		(r.tnmPn.trim() !== '' && !/N0/i.test(r.tnmPn)) ||
		(r.tnmPm.trim() !== '' && /M1/i.test(r.tnmPm));

	if (r.malignancyPresent && (highGrade || nodalOrMetastatic)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'high-grade-or-advanced-stage',
			description:
				'Malignancy with a high histological grade or nodal / distant metastatic stage; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: buildReportingCategory(r, 'high-grade-malignancy'),
			firedRules
		};
	}

	if (r.malignancyPresent) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'malignancy-present',
			description: 'Confirmed malignancy present; abnormality severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: buildReportingCategory(r, 'malignancy'),
			firedRules
		};
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'abnormal-finding',
			description:
				'A close margin or lymphovascular invasion without malignancy; abnormality severity graded minor.'
		});
		return {
			abnormalitySeverity: 'minor',
			reportingCategory: buildReportingCategory(r, 'borderline'),
			firedRules
		};
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
	return { abnormalitySeverity: 'none', reportingCategory: 'benign', firedRules };
}
