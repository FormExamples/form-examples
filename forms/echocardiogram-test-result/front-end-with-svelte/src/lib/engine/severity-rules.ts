import type {
	EchocardiogramResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import {
	hasCriticalFinding,
	hasSevereValveDisease,
	hasModerateValveDisease,
	hasSevereLvImpairment,
	hasAnyValveDisease,
	hasAnyLvImpairment
} from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the ASE/EACVI
 * chamber-quantification and valve-disease severity-grading conventions and the
 * British Society of Echocardiography minimum dataset:
 * - major: a critical finding (severe valve disease, vegetation, pericardial
 *   effusion, severe LV impairment, intracardiac thrombus).
 * - moderate: moderate valve disease or moderate LV impairment, or a regional
 *   wall-motion abnormality.
 * - minor: mild valve disease, mild LV impairment, or LV hypertrophy only.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: EchocardiogramResult,
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
		const category = hasSevereValveDisease(r)
			? 'severe-valve-disease'
			: hasSevereLvImpairment(r)
				? 'severe-lv-impairment'
				: 'critical-actionable';
		return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
	}

	if (hasModerateValveDisease(r) || r.lvFunction === 'moderately-impaired') {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'moderate-abnormality',
			description:
				'Moderate valve disease or moderate LV impairment is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'moderate-abnormality', firedRules };
	}

	if (r.regionalWallMotionAbnormality) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'regional-wall-motion',
			description: 'A regional wall-motion abnormality is present; severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'regional-wall-motion', firedRules };
	}

	const minor =
		hasAnyValveDisease(r) || hasAnyLvImpairment(r) || r.lvHypertrophy;

	if (minor) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'minor-abnormality',
			description:
				'Mild valve disease, mild LV impairment, or LV hypertrophy only; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'minor-abnormality', firedRules };
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
