import type {
	AllergySkinResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in EAACI / BSACI
 * skin-test and specific-IgE interpretation guidance:
 * - major: a critical event (anaphylaxis during the test).
 * - moderate: clinically relevant sensitisation confirmed.
 * - minor: a positive reaction (sensitisation) without confirmed clinical relevance.
 * - none: an all-negative or inconclusive study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows (a sensitisation pattern or component-resolved
 * diagnostics summary).
 */
export function gradeSeverity(
	r: AllergySkinResult,
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
			category: 'anaphylaxis-during-test',
			description: 'Anaphylaxis during the test; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (r.sensitisationConfirmed) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'clinically-relevant-sensitisation',
			description:
				'Clinically relevant sensitisation confirmed; abnormality severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: 'clinically-relevant-sensitisation',
			firedRules
		};
	}

	if (r.positiveReactions) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'sensitisation',
			description:
				'Positive reaction(s) present without confirmed clinical relevance (sensitisation only); abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'sensitisation', firedRules };
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
		category: 'all-negative',
		description: 'No positive reaction; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'all-negative', firedRules };
}
