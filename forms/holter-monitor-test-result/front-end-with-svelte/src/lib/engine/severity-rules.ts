import type {
	HolterMonitorResult,
	ResultClassification,
	AbnormalitySeverity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasHighEctopyBurden } from './utils';

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in ambulatory
 * ECG actionable-reporting principles (ISHNE-HRS consensus, NICE NG196 AF-burden
 * categories, ESC pacing thresholds):
 * - major: a critical rhythm finding.
 * - moderate: an actionable arrhythmia (atrial fibrillation, supraventricular
 *   tachycardia) or a high ventricular ectopic burden (>= 10 %).
 * - minor: low-level ectopy or a symptom-rhythm correlation without a major
 *   arrhythmia.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 */
export function gradeSeverity(
	r: HolterMonitorResult,
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
			description: 'Critical rhythm finding present; abnormality severity graded major.'
		});
		return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
	}

	if (r.atrialFibrillationDetected) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-01',
			axis: 'severity',
			category: 'atrial-fibrillation',
			description: 'Atrial fibrillation detected; abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'af-detected', firedRules };
	}

	if (r.supraventricularTachycardia) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-02',
			axis: 'severity',
			category: 'supraventricular-tachycardia',
			description: 'Supraventricular tachycardia present; abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'svt', firedRules };
	}

	if (hasHighEctopyBurden(r)) {
		firedRules.push({
			ruleId: 'R-SEV-MODERATE-03',
			axis: 'severity',
			category: 'high-ectopy-burden',
			description:
				'High ventricular ectopic burden (>= 10 %); abnormality severity graded moderate.'
		});
		return { abnormalitySeverity: 'moderate', reportingCategory: 'high-ectopy', firedRules };
	}

	if (r.symptomRhythmCorrelation || r.significantPauses) {
		firedRules.push({
			ruleId: 'R-SEV-MINOR-01',
			axis: 'severity',
			category: 'minor-finding',
			description:
				'A minor finding (symptom-rhythm correlation or low-level pause) is present; abnormality severity graded minor.'
		});
		return { abnormalitySeverity: 'minor', reportingCategory: 'minor-finding', firedRules };
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
