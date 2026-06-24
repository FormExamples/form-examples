import type {
	MicrobiologyCultureResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalOrganism,
	isPositiveCulture,
	hasResistanceMarker,
	hasPositiveSpecialisedTest
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the infection
 * significance of the finding and the resistance markers (MRSA / ESBL / CPE):
 * - major: a critical organism / result, or a multi-resistant alert organism
 *   (CPE / ESBL / MRSA) on a significant culture.
 * - moderate: significant growth of a clinically relevant organism, or a
 *   positive specialised test (C. difficile toxin / acid-fast bacilli).
 * - minor: mixed / contaminant growth or a single resistance marker without a
 *   significant culture.
 * - none: no growth / normal result.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * infection-significance reporting workflows.
 */
export function gradeSeverity(
	r: MicrobiologyCultureResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalOrganism(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-organism',
			description: 'Critical organism / result present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (hasResistanceMarker(r) && isPositiveCulture(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'resistant-organism',
			description:
				'A resistant alert organism (MRSA / ESBL) on a significant culture; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'resistant-organism', firedRules };
	}

	if (isPositiveCulture(r) || hasPositiveSpecialisedTest(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'significant-finding',
			description:
				'A clinically significant finding (significant growth or positive specialised test) is present; severity graded moderate.'
		});
		const category = hasPositiveSpecialisedTest(r) ? 'specialised-positive' : 'significant-growth';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (hasResistanceMarker(r) || r.cultureResult === 'mixed-growth') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'minor-finding',
			description:
				'Mixed / contaminant growth or an isolated resistance marker without a significant culture; abnormality severity graded minor.'
		});
		const category = r.cultureResult === 'mixed-growth' ? 'mixed-growth' : 'resistance-marker';
		return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive result; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'no-significant-growth',
		description: 'No significant growth; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}
