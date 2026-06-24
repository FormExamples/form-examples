import type {
	NuclearMedicineResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding } from './utils';

/**
 * Resolves the structured-reporting category label. The clinician-entered
 * `reportingCategory` (e.g. a V/Q PE-probability category such as
 * "high-probability", or a bone-scan metastatic-pattern category) takes
 * precedence; otherwise a derived structured label is used.
 */
function resolveReportingCategory(r: NuclearMedicineResult, derived: string): string {
	const entered = r.reportingCategory.trim();
	return entered !== '' ? entered : derived;
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and structured-reporting systems such as the
 * modified-PIOPED V/Q PE-probability categories and bone-scan metastatic
 * patterns:
 * - major: a critical finding, or a markedly reduced ejection fraction (< 40 %).
 * - moderate: an actionable abnormal finding (abnormal uptake, perfusion
 *   defect, or photopenic area).
 * - minor: incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows (e.g. V/Q PE probability).
 */
export function gradeSeverity(
	r: NuclearMedicineResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const ef = r.ejectionFractionPercent;

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: resolveReportingCategory(r, 'critical-actionable'),
			firedRules
		};
	}

	if (ef !== null && ef < 40) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'reduced-ejection-fraction',
			description:
				'Left-ventricular ejection fraction is markedly reduced (< 40 %); abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: resolveReportingCategory(r, 'reduced-ejection-fraction'),
			firedRules
		};
	}

	const actionable = r.abnormalUptake || r.perfusionDefect || r.photopenicArea;

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (abnormal uptake, perfusion defect, or photopenic area) is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: resolveReportingCategory(r, 'actionable-finding'),
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
		return {
			abnormalitySeverity: 'minor',
			reportingCategory: resolveReportingCategory(r, 'incidental'),
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
		return {
			abnormalitySeverity: 'none',
			reportingCategory: resolveReportingCategory(r, 'indeterminate'),
			firedRules
		};
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-abnormal-finding',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return {
		abnormalitySeverity: 'none',
		reportingCategory: resolveReportingCategory(r, 'normal'),
		firedRules
	};
}
