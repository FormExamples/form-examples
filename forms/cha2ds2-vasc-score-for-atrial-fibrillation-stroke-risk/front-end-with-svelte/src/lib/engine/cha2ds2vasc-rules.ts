import type { Cha2ds2VascRule } from './types';

/**
 * Declarative CHA2DS2-VASc grading rules.
 *
 * The CHA2DS2-VASc instrument has eight weighted criteria. Each rule evaluates
 * the patient data and returns true when its criterion is positive; the grader
 * (`cha2ds2vasc-grader.ts`) sums the points into the total score (0-9) and
 * derives the risk band. The two age rules are mutually exclusive by their
 * predicates (>= 75 scores 2; 65-74 scores 1; never both). Rows mirror the
 * `cha2ds2_vasc_grade_rule` SQL table.
 */
export const cha2ds2VascRules: Cha2ds2VascRule[] = [
	// ─── C: CONGESTIVE HEART FAILURE / LV DYSFUNCTION (1) ─────────
	{
		id: 'R-CONGESTIVE-HEART-FAILURE-01',
		criterion: 'congestive-heart-failure',
		points: 1,
		category: 'criterion-fired',
		description: 'Congestive heart failure or left-ventricular dysfunction present',
		evaluate: (d) => d.cardiac.congestiveHeartFailure === 'yes'
	},

	// ─── H: HYPERTENSION (1) ──────────────────────────────────────
	{
		id: 'R-HYPERTENSION-01',
		criterion: 'hypertension',
		points: 1,
		category: 'criterion-fired',
		description: 'Hypertension: history of hypertension, on treatment, or BP > 140/90',
		evaluate: (d) => d.cardiac.hypertension === 'yes'
	},

	// ─── A2: AGE >= 75 (2) ────────────────────────────────────────
	{
		id: 'R-AGE-2POINT-01',
		criterion: 'age',
		points: 2,
		category: 'criterion-fired',
		description: 'Age 75 years or older',
		evaluate: (d) => d.identification.ageYears !== null && d.identification.ageYears >= 75
	},

	// ─── A: AGE 65-74 (1) ─────────────────────────────────────────
	{
		id: 'R-AGE-1POINT-01',
		criterion: 'age',
		points: 1,
		category: 'criterion-fired',
		description: 'Age 65 to 74 years inclusive',
		evaluate: (d) =>
			d.identification.ageYears !== null &&
			d.identification.ageYears >= 65 &&
			d.identification.ageYears < 75
	},

	// ─── D: DIABETES MELLITUS (1) ─────────────────────────────────
	{
		id: 'R-DIABETES-01',
		criterion: 'diabetes',
		points: 1,
		category: 'criterion-fired',
		description:
			'Diabetes mellitus: fasting glucose > 125 mg/dL (7 mmol/L) or on hypoglycaemic treatment',
		evaluate: (d) => d.metabolic.diabetes === 'yes'
	},

	// ─── S2: PRIOR STROKE / TIA / THROMBOEMBOLISM (2) ─────────────
	{
		id: 'R-STROKE-2POINT-01',
		criterion: 'stroke',
		points: 2,
		category: 'criterion-fired',
		description: 'Prior stroke, transient ischaemic attack, or systemic thromboembolism',
		evaluate: (d) => d.metabolic.priorStrokeTiaThromboembolism === 'yes'
	},

	// ─── V: VASCULAR DISEASE (1) ──────────────────────────────────
	{
		id: 'R-VASCULAR-DISEASE-01',
		criterion: 'vascular-disease',
		points: 1,
		category: 'criterion-fired',
		description:
			'Vascular disease: prior myocardial infarction, peripheral artery disease, or aortic plaque',
		evaluate: (d) => d.cardiac.vascularDisease === 'yes'
	},

	// ─── Sc: SEX CATEGORY (FEMALE) (1) ────────────────────────────
	{
		id: 'R-SEX-FEMALE-01',
		criterion: 'sex',
		points: 1,
		category: 'criterion-fired',
		description: 'Female sex category (risk modifier, not an independent risk factor)',
		evaluate: (d) => d.identification.sex === 'female'
	}
];
