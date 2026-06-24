import type {
	CytologyResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasLowGradeCategory } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the NHS
 * cervical-screening / RCPath structured-reporting bands:
 * - major: a critical finding (malignant cells, high-grade dyskaryosis, Thy5,
 *   breast C5).
 * - moderate: dysplasia / dyskaryosis present, or a low-grade / borderline /
 *   atypical / suspicious reporting category.
 * - minor: an isolated HPV-positive surveillance result.
 * - none: a normal specimen.
 *
 * The `reportingCategory` carries the recorded structured-reporting grading
 * label (e.g. an NHS dyskaryosis grade, RCPath Thy or breast C category); it
 * falls back to a derived label when the report did not record one.
 */
export function gradeSeverity(
	r: CytologyResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const recorded = r.reportingCategory.trim();

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical finding present; abnormality severity graded major.'
		});
		return {
			abnormalitySeverity: 'major',
			reportingCategory: recorded || 'high-grade / malignant',
			firedRules
		};
	}

	if (r.dysplasiaPresent || hasLowGradeCategory(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'low-grade-abnormality',
			description:
				'Dysplasia / dyskaryosis or a low-grade / borderline / atypical category is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: recorded || 'low-grade / borderline',
			firedRules
		};
	}

	if (r.hpvResult === 'positive') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'hpv-positive',
			description: 'HPV positive with negative cytology; abnormality severity graded minor.'
		});
		return {
			abnormalitySeverity: 'minor',
			reportingCategory: recorded || 'hpv-surveillance',
			firedRules
		};
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive specimen; abnormality severity not established.'
		});
		return {
			abnormalitySeverity: 'none',
			reportingCategory: recorded || 'indeterminate',
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
		reportingCategory: recorded || 'negative',
		firedRules
	};
}
