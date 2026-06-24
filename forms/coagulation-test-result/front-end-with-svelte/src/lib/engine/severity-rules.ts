import type {
	CoagulationResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalValue,
	hasDicPicture,
	hasAnyAbnormalValue,
	hasIsolatedApttProlongation
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCPath
 * actionable-reporting principles and BSH haemostasis structured-reporting
 * labels (anticoagulant-effect, DIC-picture, isolated-APTT-prolongation):
 * - major: a critical value, or a DIC picture.
 * - moderate: an actionable abnormal value outside the reference range.
 * - minor: a borderline anticoagulant effect with no other abnormality.
 * - none: a normal result.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: CoagulationResult,
	classification: ResultClassification
): {
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalValue(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-01',
			axis: 'severity',
			category: 'critical-value',
			description: 'Critical value present; abnormality severity graded major.'
		});
		const category = hasDicPicture(r) ? 'DIC-picture' : 'critical-actionable';
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (hasDicPicture(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MAJOR-02',
			axis: 'severity',
			category: 'dic-picture',
			description:
				'A DIC picture (low fibrinogen, raised D-dimer, and prolonged PT/APTT) is present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'DIC-picture', firedRules };
	}

	if (hasIsolatedApttProlongation(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'isolated-aptt-prolongation',
			description:
				'An isolated APTT prolongation (with a normal PT/INR) is present; severity graded moderate.'
		});
		return {
			abnormalitySeverity: 'moderate',
			reportingCategory: 'isolated-APTT-prolongation',
			firedRules
		};
	}

	if (r.overallResultStatus === 'abnormal' || hasAnyAbnormalValue(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-value',
			description:
				'One or more result values are outside the reference range; severity graded moderate.'
		});
		const category = r.onAnticoagulant ? 'anticoagulant-effect' : 'abnormal-haemostasis';
		return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
	}

	if (r.onAnticoagulant) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'anticoagulant-effect',
			description:
				'Patient is on anticoagulant therapy with values within the expected therapeutic range; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'anticoagulant-effect', firedRules };
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
		category: 'no-abnormal-value',
		description: 'No abnormal value; abnormality severity graded none.'
	});
	return { abnormalitySeverity: 'none', reportingCategory: 'normal-haemostasis', firedRules };
}
