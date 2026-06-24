import type {
	BloodCrossMatchResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	isAboDiscrepancy,
	isTwoSampleRuleUnmet,
	insufficientUnits
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in BSH
 * pre-transfusion compatibility guidance and SHOT identity-safety priorities:
 * - major: an ABO discrepancy, an unmet two-sample rule, or an incompatible
 *   crossmatch (events that can cause an ABO-incompatible transfusion).
 * - moderate: clinically-significant antibodies (a positive antibody screen)
 *   requiring antigen-negative selection, or insufficient compatible units.
 * - minor: a minor administrative shortfall (e.g. a special requirement noted
 *   without a confirmed crossmatch).
 * - none: a compatible result with no abnormal finding.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * compatibility-status / antibody-significance reporting workflows.
 */
export function gradeSeverity(
	r: BloodCrossMatchResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (isAboDiscrepancy(r) || isTwoSampleRuleUnmet(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'identity-safety',
			description:
				'An ABO discrepancy or unmet two-sample rule is present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'identity-safety-event', firedRules };
	}

	if (r.crossmatchResult === 'incompatible') {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'incompatible-crossmatch',
			description: 'Crossmatch is incompatible; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'incompatible', firedRules };
	}

	if (r.antibodyScreenResult === 'positive') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'significant-antibodies',
			description:
				'Antibody screen positive (clinically-significant antibodies); antigen-negative selection required. Severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: 'clinically-significant-antibodies',
			firedRules
		};
	}

	if (insufficientUnits(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'insufficient-units',
			description:
				'Fewer compatible units are available than were crossmatched; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'insufficient-units', firedRules };
	}

	if (r.specialRequirements.trim() !== '' && r.crossmatchResult !== 'compatible') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'special-requirement',
			description:
				'A special component requirement is noted without a confirmed compatible crossmatch; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'special-requirement', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEV-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive work-up; abnormality severity not established.'
		});
		return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEV-NONE-01',
		axis: 'severity',
		category: 'compatible',
		description: 'No abnormal finding; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'compatible', firedRules };
}
