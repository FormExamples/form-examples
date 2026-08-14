// Safety-flag detection.
//
// Flags fire independently of the OKS score and are never suppressed by a
// clinician override of the candidacy recommendation — see
// doc/safety-case-notes.md. Flag IDs are stable and identical across every
// front-end and the back-end.

import type {
	AdditionalFlag,
	Candidacy,
	FlagCategory,
	FlagPriority,
	KneeReplacementSurgeryEvaluation
} from './types';
import { computeBmi, num } from './utils';

export interface FlagContext {
	candidacy: Candidacy;
	maxKellgrenLawrenceGrade: number | null;
	age: number | null;
}

const SURGICAL_RECOMMENDATIONS = ['total-knee-replacement', 'partial-knee-replacement'];

/** Detect safety flags for a knee-replacement surgery evaluation, most severe first. */
export function detectFlags(
	data: KneeReplacementSurgeryEvaluation,
	context: FlagContext
): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const push = (
		flagId: string,
		category: FlagCategory,
		priority: FlagPriority,
		description: string,
		suggestedAction: string
	) => flags.push({ flagId, category, priority, description, suggestedAction });

	const { age } = context;
	const surgicalRecommendationMade = SURGICAL_RECOMMENDATIONS.includes(data.plan.planRecommendation);

	// --- Conservative treatment ---------------------------------------------
	if (surgicalRecommendationMade && data.conservative.conservativeMeasuresExhausted !== 'yes') {
		push(
			'F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001',
			'conservative-treatment-not-exhausted',
			'medium',
			'A surgical recommendation has been made but conservative measures are not recorded as exhausted.',
			'Confirm physiotherapy, weight management, injection, and analgesic trials have been tried and document the outcome before listing for surgery.'
		);
	}

	// --- Body mass index -----------------------------------------------------
	const bmi = computeBmi(data.patient.heightAsCm, data.patient.weightAsKg);
	if (bmi !== null && bmi >= 40) {
		push(
			'F-HIGH-BMI-SURGICAL-RISK-001',
			'high-bmi-surgical-risk',
			'medium',
			`Body mass index ${bmi} kg/m² is 40 or above.`,
			'Discuss weight-management options and surgical risk with the patient; consider a bariatric or weight-management referral before listing.'
		);
	}

	// --- Pre-operative bloods --------------------------------------------------
	const bloodsChecklist: Array<[string, string]> = [
		['full blood count', data.preOpBloods.fbcDone],
		['renal function', data.preOpBloods.renalFunctionDone],
		['clotting', data.preOpBloods.clottingDone],
		['electrocardiogram', data.preOpBloods.ecgDone],
		['MRSA screen', data.preOpBloods.mrsaScreenDone],
		['urinalysis', data.preOpBloods.urinalysisDone]
	];
	const incomplete = bloodsChecklist.filter(([, done]) => done !== 'yes').map(([label]) => label);
	if (surgicalRecommendationMade && incomplete.length > 0) {
		push(
			'F-PRE-OP-BLOODS-INCOMPLETE-001',
			'pre-op-bloods-incomplete',
			'medium',
			`A surgical recommendation has been made but the following pre-operative checks are not done: ${incomplete.join(', ')}.`,
			'Complete the outstanding pre-operative checklist items before adding the patient to the surgical waiting list.'
		);
	}

	// --- Fixed flexion deformity -----------------------------------------------
	const fixedFlexionDegrees = num(data.rangeOfMotion.fixedFlexionDeformityDegrees);
	if (
		data.rangeOfMotion.fixedFlexionDeformityPresent === 'yes' &&
		fixedFlexionDegrees !== null &&
		fixedFlexionDegrees > 15
	) {
		push(
			'F-FIXED-FLEXION-DEFORMITY-001',
			'fixed-flexion-deformity',
			'medium',
			`Fixed flexion deformity of ${fixedFlexionDegrees} degrees exceeds 15 degrees.`,
			'Flag for surgical planning: a fixed flexion deformity above 15 degrees affects the surgical approach and soft-tissue balancing.'
		);
	}

	// --- Bilateral symptoms --------------------------------------------------
	if (data.history.kneeSide === 'bilateral') {
		push(
			'F-BILATERAL-SYMPTOMATIC-001',
			'bilateral-symptomatic',
			'low',
			'Both knees are recorded as significantly symptomatic.',
			'Discuss staging: simultaneous bilateral replacement versus sequential single-knee procedures.'
		);
	}

	// --- Life stage ------------------------------------------------------------
	if (age !== null && age < 16) {
		push(
			'F-PAEDIATRIC-001',
			'paediatric',
			'high',
			`The patient is ${age} years old; the Oxford Knee Score is not validated below 16 years.`,
			'Refer to a paediatric orthopaedic pathway. Treat the score on this report as invalid.'
		);
	}

	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
