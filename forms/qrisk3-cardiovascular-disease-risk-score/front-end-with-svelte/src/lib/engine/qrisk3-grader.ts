// QRISK3 grader. Pure functions: take an `AssessmentData` object, build a
// weighted linear predictor from the representative coefficient tables in
// `qrisk3-coefficients.ts`, and map it through an approximate baseline survival
// to a 10-year CVD risk percentage, a risk band, and a heart age.
//
// ============================================================================
// REPRESENTATIVE MODEL — see the header of `qrisk3-coefficients.ts`. This is a
// documented approximation in the shape of QRISK3, NOT the official QRISK3-2017
// algorithm. Ported verbatim from `front-end-with-html/js/grader.js`.
// ============================================================================
//
// Grading algorithm (spec §4):
//   1. Select the sex-specific sub-model (age weight + baseline survival S0).
//   2. Centre each continuous input on its cohort mean and multiply by its
//      weight; add the categorical / binary weights. Sum -> linear predictor LP.
//   3. tenYearRiskPercent = 100 * (1 - S0^exp(LP)); round to 1 dp; clamp 0..99.9.
//   4. riskBand: >= 20 'high'; >= 10 'raised'; else 'low'.
//   5. heartAge: invert the risk function with all modifiable factors optimal.
//
// A missing REQUIRED input (age, sex, BMI, cholesterol:HDL ratio, systolic BP)
// blocks a valid result: the grader returns computable=false with null risk and
// heart age, and `flagged-issues.ts` raises a completeness flag separately. The
// optional townsendScore defaults to the cohort mean (neutral contribution).

import type { AssessmentData, Contribution, GradingResult, RiskBand } from './types';
import {
	MEANS,
	SEX_MODEL,
	CONTINUOUS_WEIGHTS,
	SMOKING_WEIGHTS,
	DIABETES_WEIGHTS,
	ETHNICITY_WEIGHTS,
	CKD_WEIGHTS,
	BINARY_WEIGHTS
} from './qrisk3-coefficients';
import { ethnicityLabel, smokingLabel, diabetesLabel, ckdStageLabel } from './utils';
import { detectFlaggedIssues } from './flagged-issues';

const YES_NO_LABEL: Record<string, string> = { yes: 'Yes', no: 'No', '': 'Not recorded' };

/** True when every required numeric / model-selecting input is present. */
export function hasRequiredInputs(data: AssessmentData): boolean {
	return (
		data.identification.age !== null &&
		data.identification.sex !== '' &&
		data.lifestyle.bodyMassIndex !== null &&
		data.cardiometabolic.cholesterolHdlRatio !== null &&
		data.cardiometabolic.systolicBloodPressure !== null
	);
}

/**
 * Build the weighted contributions (the LP terms). Returns the contribution
 * list and the summed linear predictor. Pure; safe to call with partial data.
 */
export function buildContributions(data: AssessmentData): {
	contributions: Contribution[];
	linearPredictor: number;
} {
	const id = data.identification;
	const life = data.lifestyle;
	const cm = data.cardiometabolic;
	const co = data.comorbidities;
	const med = data.medication;

	const sex: 'female' | 'male' = id.sex === 'male' ? 'male' : 'female';
	const ageWeight = SEX_MODEL[sex].ageWeight;

	const contributions: Contribution[] = [];
	const push = (cid: string, factor: string, value: string, weight: number) => {
		contributions.push({ id: cid, factor, value: String(value), weight });
	};

	// ── Continuous, centred on cohort means ──────────────────────────────
	if (id.age !== null) {
		push('C-AGE', 'Age', `${id.age} years`, ageWeight * (id.age - MEANS.age));
	}
	if (life.bodyMassIndex !== null) {
		push(
			'C-BMI',
			'Body mass index',
			`${life.bodyMassIndex} kg/m²`,
			CONTINUOUS_WEIGHTS.bodyMassIndex * (life.bodyMassIndex - MEANS.bodyMassIndex)
		);
	}
	if (cm.cholesterolHdlRatio !== null) {
		push(
			'C-CHOL',
			'Cholesterol : HDL ratio',
			`${cm.cholesterolHdlRatio}`,
			CONTINUOUS_WEIGHTS.cholesterolHdlRatio * (cm.cholesterolHdlRatio - MEANS.cholesterolHdlRatio)
		);
	}
	if (cm.systolicBloodPressure !== null) {
		push(
			'C-SBP',
			'Systolic blood pressure',
			`${cm.systolicBloodPressure} mmHg`,
			CONTINUOUS_WEIGHTS.systolicBloodPressure *
				(cm.systolicBloodPressure - MEANS.systolicBloodPressure)
		);
	}
	if (cm.systolicBloodPressureSd !== null) {
		push(
			'C-SBP-SD',
			'Systolic BP variability (SD)',
			`${cm.systolicBloodPressureSd} mmHg`,
			CONTINUOUS_WEIGHTS.systolicBloodPressureSd *
				(cm.systolicBloodPressureSd - MEANS.systolicBloodPressureSd)
		);
	}
	// Optional Townsend: default to the cohort mean (neutral) when unanswered.
	const townsend = id.townsendScore === null ? MEANS.townsendScore : id.townsendScore;
	push(
		'C-TOWNSEND',
		'Townsend deprivation score',
		id.townsendScore === null ? 'Not recorded (cohort mean)' : `${id.townsendScore}`,
		CONTINUOUS_WEIGHTS.townsendScore * (townsend - MEANS.townsendScore)
	);

	// ── Categorical ──────────────────────────────────────────────────────
	if (id.ethnicity !== '') {
		push('C-ETHNICITY', 'Ethnicity', ethnicityLabel(id.ethnicity), ETHNICITY_WEIGHTS[id.ethnicity]);
	}
	if (life.smokingStatus !== '') {
		push(
			'C-SMOKING',
			'Smoking status',
			smokingLabel(life.smokingStatus),
			SMOKING_WEIGHTS[life.smokingStatus]
		);
	}
	if (cm.diabetesStatus !== '') {
		push(
			'C-DIABETES',
			'Diabetes status',
			diabetesLabel(cm.diabetesStatus),
			DIABETES_WEIGHTS[cm.diabetesStatus]
		);
	}
	if (co.chronicKidneyDiseaseStage !== '') {
		push(
			'C-CKD',
			'Chronic kidney disease',
			ckdStageLabel(co.chronicKidneyDiseaseStage),
			CKD_WEIGHTS[co.chronicKidneyDiseaseStage]
		);
	}

	// ── Binary yes/no comorbidities and medication ──────────────────────
	const binaryFactors: [string, string, keyof typeof BINARY_WEIGHTS, string][] = [
		['C-BP-TREAT', 'On blood-pressure treatment', 'onBloodPressureTreatment', cm.onBloodPressureTreatment],
		['C-FH-CHD', 'Family history of CHD (< 60)', 'familyHistoryChd', co.familyHistoryChd],
		['C-AF', 'Atrial fibrillation', 'atrialFibrillation', co.atrialFibrillation],
		['C-MIGRAINE', 'Migraine', 'migraine', co.migraine],
		['C-RA', 'Rheumatoid arthritis', 'rheumatoidArthritis', co.rheumatoidArthritis],
		['C-SLE', 'Systemic lupus erythematosus', 'systemicLupusErythematosus', co.systemicLupusErythematosus],
		['C-SMI', 'Severe mental illness', 'severeMentalIllness', co.severeMentalIllness],
		['C-ANTIPSYCH', 'Atypical antipsychotics', 'onAtypicalAntipsychotics', med.onAtypicalAntipsychotics],
		['C-STEROID', 'Regular corticosteroids', 'onCorticosteroids', med.onCorticosteroids]
	];
	for (const [cid, factor, key, value] of binaryFactors) {
		if (value === 'yes') {
			push(cid, factor, YES_NO_LABEL[value], BINARY_WEIGHTS[key]);
		}
	}
	// Erectile dysfunction contributes only in the male model.
	if (sex === 'male' && co.erectileDysfunction === 'yes') {
		push('C-ED', 'Erectile dysfunction', 'Yes', BINARY_WEIGHTS.erectileDysfunction);
	}

	const linearPredictor = contributions.reduce((sum, c) => sum + c.weight, 0);
	return { contributions, linearPredictor };
}

/** Round to one decimal place. */
function round1(n: number): number {
	return Math.round(n * 10) / 10;
}

/**
 * Map a linear predictor to a 10-year risk percentage via the sex-specific
 * baseline survival: risk = 100 * (1 - S0^exp(LP)).
 */
export function riskFromLinearPredictor(lp: number, sex: 'female' | 'male'): number {
	const s0 = SEX_MODEL[sex].baselineSurvival;
	const risk = 100 * (1 - Math.pow(s0, Math.exp(lp)));
	return Math.min(99.9, Math.max(0, round1(risk)));
}

/**
 * Estimate heart age: the age (same sex, otherwise-optimal risk factors) that
 * yields the same 10-year risk. Invert
 * risk = 100*(1 - S0^exp(ageWeight*(age-mean))).
 */
export function estimateHeartAge(riskPercent: number | null, sex: 'female' | 'male'): number | null {
	if (riskPercent === null || riskPercent <= 0) return null;
	const s0 = SEX_MODEL[sex].baselineSurvival;
	const ageWeight = SEX_MODEL[sex].ageWeight;
	const survival = 1 - riskPercent / 100;
	if (survival <= 0) return null;
	// exp(ageWeight*(age-mean)) = ln(survival)/ln(S0)
	const ratio = Math.log(survival) / Math.log(s0);
	if (ratio <= 0) return null;
	const age = MEANS.age + Math.log(ratio) / ageWeight;
	// Clamp to a sensible communication range.
	return Math.round(Math.min(111, Math.max(25, age)));
}

/**
 * Pure function: compute the full QRISK3 grade for the supplied assessment data.
 */
export function calculateQrisk3Grade(data: AssessmentData): GradingResult {
	const { contributions, linearPredictor } = buildContributions(data);
	const computable = hasRequiredInputs(data);
	const sex: 'female' | 'male' = data.identification.sex === 'male' ? 'male' : 'female';
	const timestamp = new Date().toISOString();

	if (!computable) {
		return {
			linearPredictor: Math.round(linearPredictor * 1000) / 1000,
			tenYearRiskPercent: null,
			riskBand: 'low',
			heartAge: null,
			computable: false,
			contributions,
			flaggedIssues: detectFlaggedIssues(data, null),
			timestamp
		};
	}

	const tenYearRiskPercent = riskFromLinearPredictor(linearPredictor, sex);
	const riskBand: RiskBand =
		tenYearRiskPercent >= 20 ? 'high' : tenYearRiskPercent >= 10 ? 'raised' : 'low';
	const heartAge = estimateHeartAge(tenYearRiskPercent, sex);

	return {
		linearPredictor: Math.round(linearPredictor * 1000) / 1000,
		tenYearRiskPercent,
		riskBand,
		heartAge,
		computable: true,
		contributions,
		flaggedIssues: detectFlaggedIssues(data, tenYearRiskPercent),
		timestamp
	};
}
