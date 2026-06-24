import type {
	UrinalysisResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalFinding,
	hasSignificantGrowth,
	hasUtiFeatures,
	hasOnlyIncidentalFinding,
	isDipstickPositive,
	isDipstickStrong
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in UK SMI B41
 * significance-of-bacteriuria principles and asymptomatic-bacteriuria
 * categories:
 * - major: a critical finding, or significant growth in pregnancy.
 * - moderate: significant bacteriuria, or UTI features (pyuria / nitrites /
 *   organisms seen), or visible / dipstick haematuria.
 * - minor: incidental-only findings (glucosuria, crystals, casts).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: UrinalysisResult,
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
		const category =
			hasSignificantGrowth(r) && r.pregnant
				? 'significant bacteriuria in pregnancy'
				: 'critical-actionable';
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (hasSignificantGrowth(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'significant-bacteriuria',
			description: 'Significant bacteriuria on culture; abnormality severity graded moderate.'
		});
		const organism = r.organismIsolated.trim() !== '' ? `significant ${r.organismIsolated} bacteriuria` : 'significant bacteriuria';
		return { abnormalitySeverity: 'moderate', reportingCategory: organism, firedRules };
	}

	if (hasUtiFeatures(r) || isDipstickPositive(r.blood) || isDipstickStrong(r.protein)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'uti-features',
			description:
				'UTI features (pyuria, nitrites, organisms seen) or dipstick haematuria / proteinuria present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'suspected urinary tract infection', firedRules };
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
