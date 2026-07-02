import type { AbeGroup, AssessmentData, Axis, Component, GoldGrade } from './types';

// ──────────────────────────────────────────────
// Shared threshold helpers (single source of truth for the grader)
//
// Unlike an additive score, this review derives four independent outputs: the
// GOLD airflow-limitation grade (banded from FEV₁ % predicted), the symptom
// axis, the exacerbation axis, the combined ABE assessment group, and the
// review-completeness grade. These helpers are the single source of truth the
// grader (`copd-review-grader.ts`) reads to compute the final values.
// ──────────────────────────────────────────────

/** GOLD airflow-limitation grade banded from FEV₁ % predicted. */
export function goldGradeOf(data: AssessmentData): GoldGrade {
	const pct = data.spirometry.fev1PercentPredicted;
	if (pct === null || pct === undefined) return null;
	if (pct >= 80) return 1;
	if (pct >= 50) return 2;
	if (pct >= 30) return 3;
	return 4;
}

/** Symptom axis: high when mMRC ≥ 2 or CAT ≥ 10, else low. */
export function symptomBurdenOf(data: AssessmentData): Axis {
	const mmrc = data.symptoms.mmrcGrade;
	const cat = data.symptoms.catScore;
	const high =
		(mmrc !== null && mmrc !== undefined && mmrc >= 2) ||
		(cat !== null && cat !== undefined && cat >= 10);
	return high ? 'high' : 'low';
}

/**
 * Exacerbation axis: high when ≥ 2 moderate or ≥ 1 hospitalised exacerbation in
 * the past 12 months, else low.
 */
export function exacerbationRiskOf(data: AssessmentData): Axis {
	const mod = data.exacerbations.exacerbationsLast12m;
	const hosp = data.exacerbations.hospitalisationsLast12m;
	const high =
		(mod !== null && mod !== undefined && mod >= 2) ||
		(hosp !== null && hosp !== undefined && hosp >= 1);
	return high ? 'high' : 'low';
}

/**
 * Whether any symptom or exacerbation datum has been recorded (needed before an
 * ABE group can be assigned).
 */
export function hasAxisData(data: AssessmentData): boolean {
	const s = data.symptoms;
	const e = data.exacerbations;
	return (
		s.mmrcGrade !== null ||
		s.catScore !== null ||
		e.exacerbationsLast12m !== null ||
		e.hospitalisationsLast12m !== null
	);
}

/** Combined ABE assessment group. */
export function abeGroupOf(data: AssessmentData): AbeGroup {
	if (!hasAxisData(data)) return null;
	if (exacerbationRiskOf(data) === 'high') return 'E';
	if (symptomBurdenOf(data) === 'high') return 'B';
	return 'A';
}

// ──────────────────────────────────────────────
// Declarative audit-trail rules
// ──────────────────────────────────────────────

/** A declarative classification rule (mirrors the grade_rule SQL table). */
export interface CopdRule {
	id: string;
	/** gold | symptom | exacerbation | abe */
	section: string;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/**
 * Declarative classification rules — one fires per gold / symptom /
 * exacerbation / abe axis. The grader (`copd-review-grader.ts`) evaluates every
 * rule and collects the fired rows into the audit trail.
 */
export const copdRules: CopdRule[] = [
	// ─── GOLD airflow-limitation grade ────────────────────────────
	{
		id: 'R-GOLD-GRADE-1-01',
		section: 'gold',
		category: 'airflow-grading',
		description: 'GOLD 1 (mild): post-bronchodilator FEV₁ % predicted ≥ 80',
		evaluate: (d) => goldGradeOf(d) === 1
	},
	{
		id: 'R-GOLD-GRADE-2-01',
		section: 'gold',
		category: 'airflow-grading',
		description: 'GOLD 2 (moderate): post-bronchodilator FEV₁ % predicted 50 to < 80',
		evaluate: (d) => goldGradeOf(d) === 2
	},
	{
		id: 'R-GOLD-GRADE-3-01',
		section: 'gold',
		category: 'airflow-grading',
		description: 'GOLD 3 (severe): post-bronchodilator FEV₁ % predicted 30 to < 50',
		evaluate: (d) => goldGradeOf(d) === 3
	},
	{
		id: 'R-GOLD-GRADE-4-01',
		section: 'gold',
		category: 'airflow-grading',
		description: 'GOLD 4 (very severe): post-bronchodilator FEV₁ % predicted < 30',
		evaluate: (d) => goldGradeOf(d) === 4
	},
	{
		id: 'R-GOLD-UNGRADED-01',
		section: 'gold',
		category: 'airflow-grading',
		description: 'FEV₁ % predicted not recorded — GOLD airflow grade cannot be assigned',
		evaluate: (d) => goldGradeOf(d) === null
	},

	// ─── Symptom axis ─────────────────────────────────────────────
	{
		id: 'R-SYMPTOM-HIGH-01',
		section: 'symptom',
		category: 'symptom-axis',
		description: 'High symptom burden: mMRC ≥ 2 or CAT ≥ 10',
		evaluate: (d) => symptomBurdenOf(d) === 'high'
	},
	{
		id: 'R-SYMPTOM-LOW-01',
		section: 'symptom',
		category: 'symptom-axis',
		description: 'Low symptom burden: mMRC < 2 and CAT < 10',
		evaluate: (d) => symptomBurdenOf(d) === 'low'
	},

	// ─── Exacerbation axis ────────────────────────────────────────
	{
		id: 'R-EXACERBATION-HIGH-01',
		section: 'exacerbation',
		category: 'exacerbation-axis',
		description:
			'High exacerbation risk: ≥ 2 moderate or ≥ 1 hospitalised exacerbation in 12 months',
		evaluate: (d) => exacerbationRiskOf(d) === 'high'
	},
	{
		id: 'R-EXACERBATION-LOW-01',
		section: 'exacerbation',
		category: 'exacerbation-axis',
		description:
			'Low exacerbation risk: < 2 moderate and no hospitalised exacerbation in 12 months',
		evaluate: (d) => exacerbationRiskOf(d) === 'low'
	},

	// ─── Combined ABE assessment group ────────────────────────────
	{
		id: 'R-ABE-GROUP-A-01',
		section: 'abe',
		category: 'abe-grouping',
		description: 'ABE group A: low symptom burden and low exacerbation risk',
		evaluate: (d) => abeGroupOf(d) === 'A'
	},
	{
		id: 'R-ABE-GROUP-B-01',
		section: 'abe',
		category: 'abe-grouping',
		description: 'ABE group B: high symptom burden and low exacerbation risk',
		evaluate: (d) => abeGroupOf(d) === 'B'
	},
	{
		id: 'R-ABE-GROUP-E-01',
		section: 'abe',
		category: 'abe-grouping',
		description: 'ABE group E: high exacerbation risk (regardless of symptom burden)',
		evaluate: (d) => abeGroupOf(d) === 'E'
	},
	{
		id: 'R-ABE-UNGROUPED-01',
		section: 'abe',
		category: 'abe-grouping',
		description: 'No symptom or exacerbation data recorded — ABE group cannot be assigned',
		evaluate: (d) => abeGroupOf(d) === null
	}
];

// ──────────────────────────────────────────────
// Completeness components
// ──────────────────────────────────────────────

/** Core clinical elements: any missing → 'incomplete'. */
export const coreComponents: Component[] = [
	{
		id: 'spirometry',
		label: 'Spirometry (FEV₁ % predicted)',
		present: (d) => d.spirometry.fev1PercentPredicted !== null
	},
	{
		id: 'symptom-measure',
		label: 'A symptom measure (mMRC or CAT)',
		present: (d) => d.symptoms.mmrcGrade !== null || d.symptoms.catScore !== null
	},
	{
		id: 'exacerbation-history',
		label: 'Exacerbation history',
		present: (d) => d.exacerbations.exacerbationsLast12m !== null
	},
	{
		id: 'smoking-status',
		label: 'Smoking status',
		present: (d) => d.smoking.smokingStatus !== ''
	},
	{
		id: 'inhaler-technique-check',
		label: 'Inhaler-technique check',
		present: (d) => d.inhaler.inhalerTechniqueChecked !== ''
	},
	{
		id: 'vaccination-status',
		label: 'Vaccination status (influenza, pneumococcal, COVID-19)',
		present: (d) =>
			d.vaccinations.influenzaVaccine !== '' &&
			d.vaccinations.pneumococcalVaccine !== '' &&
			d.vaccinations.covidVaccine !== ''
	},
	{
		id: 'pulmonary-rehab-status',
		label: 'Pulmonary-rehabilitation status',
		present: (d) => d.rehab.pulmonaryRehabStatus !== ''
	},
	{
		id: 'self-management-plan',
		label: 'Self-management plan',
		present: (d) => d.selfManagement.selfManagementPlan !== ''
	}
];

/** Supporting items: all core present but any of these missing → 'partial'. */
export const supportingComponents: Component[] = [
	{
		id: 'diagnosis-confirmed',
		label: 'Diagnosis confirmed on spirometry',
		present: (d) => d.diagnosis.spirometryConfirmed !== ''
	},
	{
		id: 'mrc-grade',
		label: 'MRC dyspnoea grade',
		present: (d) => d.symptoms.mrcGrade !== null
	},
	{
		id: 'hospitalisations',
		label: 'Hospitalised-exacerbation count',
		present: (d) => d.exacerbations.hospitalisationsLast12m !== null
	},
	{
		id: 'cessation-support',
		label: 'Cessation support offered',
		present: (d) => d.smoking.cessationSupportOffered !== ''
	},
	{
		id: 'inhaler-technique-adequate',
		label: 'Inhaler-technique adequacy',
		present: (d) => d.inhaler.inhalerTechniqueAdequate !== ''
	},
	{
		id: 'adherence',
		label: 'Adherence',
		present: (d) => d.inhaler.adherence !== ''
	},
	{
		id: 'oxygen-use',
		label: 'Oxygen use',
		present: (d) => d.rehab.oxygenUse !== ''
	},
	{
		id: 'rescue-pack-supplied',
		label: 'Rescue pack supplied',
		present: (d) => d.selfManagement.rescuePackSupplied !== ''
	}
];
