import type {
	AmbulatoryBloodPressureResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalFinding,
	daytimeHypertensive,
	twentyFourHourHypertensive,
	nighttimeHypertensive,
	STAGE2_HTN_SYSTOLIC,
	STAGE2_HTN_DIASTOLIC
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the NICE
 * NG136 / BIHS / ESH ABPM hypertension stage banding. The `reportingCategory`
 * carries the hypertension stage label suitable for downstream structured
 * reporting:
 * - major / severe: a severe-hypertension result (ABPM average >= 150/95).
 * - moderate / stage 2: ABPM daytime average >= 150/95, or confirmed / masked
 *   hypertension.
 * - minor / stage 1: a raised average below the stage-2 threshold, white-coat
 *   effect, or isolated nocturnal hypertension.
 * - none / normotensive: a normal study.
 */
export function gradeSeverity(
	r: AmbulatoryBloodPressureResult,
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
			category: 'severe-hypertension',
			description: 'Severe hypertension present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'severe', firedRules };
	}

	const daytimeStage2 =
		(r.daytimeAverageSystolic !== null && r.daytimeAverageSystolic >= STAGE2_HTN_SYSTOLIC) ||
		(r.daytimeAverageDiastolic !== null && r.daytimeAverageDiastolic >= STAGE2_HTN_DIASTOLIC);

	if (daytimeStage2 || r.hypertensionConfirmed || r.maskedHypertension) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'stage-2-hypertension',
			description:
				'Stage 2 hypertension (ABPM daytime average >= 150/95) or confirmed / masked hypertension present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'stage-2', firedRules };
	}

	if (daytimeHypertensive(r) || twentyFourHourHypertensive(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'stage-1-hypertension',
			description: 'Raised ambulatory average below the stage-2 threshold; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'stage-1', firedRules };
	}

	if (r.nocturnalHypertension || nighttimeHypertensive(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-02',
			axis: 'severity',
			category: 'nocturnal-hypertension',
			description: 'Isolated nocturnal hypertension present; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'nocturnal-hypertension', firedRules };
	}

	if (r.whiteCoatEffect) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-03',
			axis: 'severity',
			category: 'white-coat-effect',
			description: 'White-coat effect present; severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'white-coat', firedRules };
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
	return { abnormalitySeverity: 'none', reportingCategory: 'normotensive', firedRules };
}
