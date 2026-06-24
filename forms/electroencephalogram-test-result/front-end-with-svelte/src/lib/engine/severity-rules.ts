import type {
	ElectroencephalogramResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the SCORE
 * structured-reporting framework and ACNS critical-care EEG terminology:
 * - major: a critical finding (status epilepticus, recorded seizure, or
 *   epileptiform discharges).
 * - moderate: an actionable abnormal finding (focal slowing, generalised
 *   slowing, a photoparoxysmal response, or an abnormal background rhythm).
 * - minor: a minor background abnormality only (excess-slow or asymmetric).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: ElectroencephalogramResult,
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
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-epileptiform', firedRules };
	}

	const actionable =
		r.focalSlowing ||
		r.generalisedSlowing ||
		r.photoparoxysmalResponse ||
		r.backgroundRhythm === 'abnormal';

	if (actionable) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'actionable-finding',
			description:
				'An actionable abnormal finding (focal slowing, generalised slowing, photoparoxysmal response, or abnormal background) is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'abnormal-background', firedRules };
	}

	if (r.backgroundRhythm === 'excess-slow' || r.backgroundRhythm === 'asymmetric') {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'minor-background',
			description:
				'A minor background abnormality (excess slowing or asymmetry) only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'minor-background', firedRules };
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
