import type {
	CardiologyResponse,
	ResponseClassification,
	Severity,
	FiredRule
} from './types';
import { hasCriticalFinding, hasAnyCardiacFinding, hasReducedEjectionFraction } from './utils';

/**
 * Axis B — condition severity & structured-finding category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in NICE NG106
 * (chronic heart failure) and the 2021 ESC/EACTS valvular heart disease
 * guidelines:
 * - major: a critical result, severe valve disease, significant arrhythmia, or
 *   reduced ejection fraction (HFrEF; LVEF < 40 %).
 * - moderate: any other structured cardiac finding (ischaemia/CAD, structural
 *   abnormality, uncontrolled hypertension).
 * - minor: a mild reduction in ejection fraction (40–49 %, HFmrEF) with no other
 *   finding.
 * - none: no structured cardiac finding.
 *
 * The `severityCategory` is a short label for the dominant finding, suitable for
 * downstream structured-reporting workflows.
 */
export function gradeSeverity(
	r: CardiologyResponse,
	classification: ResponseClassification
): {
	severity: Severity;
	severityCategory: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEVERITY-MAJOR-01',
			axis: 'severity',
			category: 'critical-finding',
			description: 'Critical result present; condition severity graded major.'
		});
		return { severity: 'major', severityCategory: 'critical-cardiac', firedRules };
	}

	if (r.significantValveDisease) {
		firedRules.push({
			ruleId: 'R-SEVERITY-MAJOR-02',
			axis: 'severity',
			category: 'severe-valve-disease',
			description: 'Significant valve disease present; condition severity graded major.'
		});
		return { severity: 'major', severityCategory: 'valve-disease', firedRules };
	}

	if (hasReducedEjectionFraction(r)) {
		firedRules.push({
			ruleId: 'R-SEVERITY-MAJOR-03',
			axis: 'severity',
			category: 'reduced-ejection-fraction',
			description:
				'Reduced left-ventricular ejection fraction (HFrEF); condition severity graded major.'
		});
		return { severity: 'major', severityCategory: 'reduced-ejection-fraction', firedRules };
	}

	if (r.significantArrhythmia) {
		firedRules.push({
			ruleId: 'R-SEVERITY-MAJOR-04',
			axis: 'severity',
			category: 'significant-arrhythmia',
			description: 'Significant arrhythmia present; condition severity graded major.'
		});
		return { severity: 'major', severityCategory: 'arrhythmia', firedRules };
	}

	// Mildly reduced ejection fraction (HFmrEF; 40–49 %) with no other finding.
	const mildlyReducedEf =
		r.lvEjectionFractionPercent !== null &&
		r.lvEjectionFractionPercent >= 40 &&
		r.lvEjectionFractionPercent < 50;

	if (r.ischaemiaOrCad || r.structuralAbnormality || r.uncontrolledHypertension) {
		const category = r.ischaemiaOrCad
			? 'ischaemia-cad'
			: r.structuralAbnormality
				? 'structural-abnormality'
				: 'uncontrolled-hypertension';
		firedRules.push({
			ruleId: 'R-SEVERITY-MODERATE-01',
			axis: 'severity',
			category,
			description:
				'A structured cardiac finding (ischaemia/CAD, structural abnormality, or uncontrolled hypertension) is present; severity graded moderate.'
		});
		return { severity: 'moderate', severityCategory: category, firedRules };
	}

	if (mildlyReducedEf) {
		firedRules.push({
			ruleId: 'R-SEVERITY-MINOR-01',
			axis: 'severity',
			category: 'mildly-reduced-ejection-fraction',
			description:
				'Mildly reduced left-ventricular ejection fraction (HFmrEF, 40–49 %); severity graded minor.'
		});
		return { severity: 'minor', severityCategory: 'mildly-reduced-ejection-fraction', firedRules };
	}

	if (classification === 'inconclusive') {
		firedRules.push({
			ruleId: 'R-SEVERITY-NONE-02',
			axis: 'severity',
			category: 'inconclusive',
			description: 'Inconclusive response; condition severity not established.'
		});
		return { severity: 'none', severityCategory: 'indeterminate', firedRules };
	}

	// Defensive: no finding but somehow flagged as a cardiac condition.
	if (hasAnyCardiacFinding(r)) {
		firedRules.push({
			ruleId: 'R-SEVERITY-MODERATE-02',
			axis: 'severity',
			category: 'cardiac-finding',
			description: 'A structured cardiac finding is present; severity graded moderate.'
		});
		return { severity: 'moderate', severityCategory: 'cardiac-finding', firedRules };
	}

	firedRules.push({
		ruleId: 'R-SEVERITY-NONE-01',
		axis: 'severity',
		category: 'no-finding',
		description: 'No structured cardiac finding; condition severity graded none.'
	});
	return { severity: 'none', severityCategory: 'no-abnormality', firedRules };
}
