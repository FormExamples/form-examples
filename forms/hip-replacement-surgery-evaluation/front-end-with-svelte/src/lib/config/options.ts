// Option lists shared by the step components.
// Values match the SQL CHECK constraints in
// sql/02_create_table_patient.sql, sql/03_create_table_clinician.sql, and
// sql/04_create_table_hip_replacement_surgery_evaluation.sql.

export interface Option {
	value: string;
	label: string;
}

/** The common yes / no / unanswered option pair, reused across many fields. */
export const YES_NO: Option[] = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' }
];

export const OPTIONS: Record<string, Option[]> = {
	role: [
		{ value: 'orthopaedic-surgeon', label: 'Orthopaedic surgeon' },
		{ value: 'extended-scope-physiotherapist', label: 'Extended-scope physiotherapist' },
		{ value: 'orthopaedic-registrar', label: 'Orthopaedic registrar' },
		{ value: 'nurse-practitioner', label: 'Nurse practitioner' },
		{ value: 'other', label: 'Other' }
	],
	sex: [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	affectedSide: [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'bilateral', label: 'Bilateral' }
	],
	walkingDistanceBeforePain: [
		{ value: 'unlimited', label: 'Unlimited' },
		{ value: 'over-1km', label: 'Over 1km' },
		{ value: '100m-to-1km', label: '100m to 1km' },
		{ value: 'under-100m', label: 'Under 100m' },
		{ value: 'housebound', label: 'Housebound' }
	],
	shoesAndSocksDifficulty: [
		{ value: 'none', label: 'None' },
		{ value: 'some', label: 'Some' },
		{ value: 'severe', label: 'Severe' },
		{ value: 'unable', label: 'Unable' }
	],
	walkingAidUse: [
		{ value: 'none', label: 'None' },
		{ value: 'stick', label: 'Stick' },
		{ value: 'frame', label: 'Frame' },
		{ value: 'wheelchair', label: 'Wheelchair' }
	],
	jointStability: [
		{ value: 'stable', label: 'Stable' },
		{ value: 'unstable', label: 'Unstable' }
	],
	tendernessSite: [
		{ value: 'none', label: 'None' },
		{ value: 'groin', label: 'Groin' },
		{ value: 'trochanteric', label: 'Trochanteric' },
		{ value: 'buttock', label: 'Buttock' },
		{ value: 'other', label: 'Other' }
	],
	jointSpaceNarrowing: [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	],
	ctIndication: [
		{ value: 'none', label: 'None' },
		{ value: 'robotic-assisted-planning', label: 'Robotic-assisted planning' },
		{ value: 'complex-deformity', label: 'Complex deformity' },
		{ value: 'other', label: 'Other' }
	],
	treatmentResponse: [
		{ value: 'no-relief', label: 'No relief' },
		{ value: 'partial-relief', label: 'Partial relief' },
		{ value: 'good-relief', label: 'Good relief' }
	],
	diabetesControlled: [
		{ value: 'not-diabetic', label: 'Not diabetic' },
		{ value: 'controlled', label: 'Controlled' },
		{ value: 'poorly-controlled', label: 'Poorly controlled' }
	],
	smokingStatus: [
		{ value: 'never', label: 'Never smoked' },
		{ value: 'ex-smoker', label: 'Ex-smoker' },
		{ value: 'current-smoker', label: 'Current smoker' }
	],
	recommendation: [
		{ value: 'total-hip-replacement', label: 'Total hip replacement' },
		{ value: 'hip-resurfacing', label: 'Hip resurfacing' },
		{ value: 'continue-conservative-management', label: 'Continue conservative management' },
		{ value: 'mdt-review', label: 'MDT review' },
		{ value: 'not-currently-a-candidate', label: 'Not currently a candidate' }
	],
	overrideCandidacy: [
		{ value: 'strong-candidate', label: 'Strong candidate for surgery' },
		{ value: 'candidate', label: 'Candidate for surgery' },
		{ value: 'continue-conservative', label: 'Continue conservative management' },
		{ value: 'not-indicated', label: 'Not currently indicated' },
		{ value: 'mdt-review', label: 'Multidisciplinary-team review' }
	]
};
