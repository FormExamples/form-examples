// Option lists shared by the step components.
// Values match the SQL CHECK constraints in
// sql/02_create_table_patient.sql, sql/03_create_table_clinician.sql, and
// sql/04_create_table_knee_replacement_surgery_evaluation.sql.

export interface Option {
	value: string;
	label: string;
}

export const YES_NO: Option[] = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' }
];

export const OPTIONS: Record<string, Option[]> = {
	role: [
		{ value: 'orthopaedic-surgeon', label: 'Orthopaedic surgeon' },
		{ value: 'extended-scope-physiotherapist', label: 'Extended-scope physiotherapist' },
		{ value: 'other', label: 'Other' }
	],
	registrationBody: [
		{ value: 'GMC', label: 'GMC' },
		{ value: 'HCPC', label: 'HCPC' },
		{ value: 'other', label: 'Other' }
	],
	sex: [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	kneeSide: [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'bilateral', label: 'Bilateral' }
	],
	priorKneeSurgeryType: [
		{ value: 'arthroscopy', label: 'Arthroscopy' },
		{ value: 'ligament-repair', label: 'Ligament repair' },
		{ value: 'previous-partial-replacement', label: 'Previous partial replacement' },
		{ value: 'other', label: 'Other' }
	],
	walkingDistanceBeforePain: [
		{ value: 'unlimited', label: 'Unlimited' },
		{ value: 'over-1km', label: 'Over 1km' },
		{ value: '100m-to-1km', label: '100m to 1km' },
		{ value: 'under-100m', label: 'Under 100m' },
		{ value: 'housebound', label: 'Housebound' }
	],
	stairClimbingAbility: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'with-rail', label: 'With a rail' },
		{ value: 'one-step-at-a-time', label: 'One step at a time' },
		{ value: 'unable', label: 'Unable' }
	],
	walkingAid: [
		{ value: 'none', label: 'None' },
		{ value: 'stick', label: 'Stick' },
		{ value: 'frame', label: 'Frame' },
		{ value: 'wheelchair', label: 'Wheelchair' }
	],
	coronalDeformityType: [
		{ value: 'none', label: 'None' },
		{ value: 'varus', label: 'Varus (bow-legged)' },
		{ value: 'valgus', label: 'Valgus (knock-kneed)' }
	],
	coronalDeformitySeverity: [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	],
	ligament: [
		{ value: 'stable', label: 'Stable' },
		{ value: 'lax', label: 'Lax' }
	],
	patellarTracking: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'maltracking', label: 'Maltracking' }
	],
	ctIndication: [
		{ value: 'robotic-assisted-planning', label: 'Robotic-assisted surgical planning' },
		{ value: 'bone-loss-assessment', label: 'Bone-loss assessment' },
		{ value: 'other', label: 'Other' }
	],
	injectionType: [
		{ value: 'corticosteroid', label: 'Corticosteroid' },
		{ value: 'hyaluronic-acid', label: 'Hyaluronic acid' },
		{ value: 'both', label: 'Both' },
		{ value: 'other', label: 'Other' }
	],
	goodPartialNone: [
		{ value: 'good', label: 'Good' },
		{ value: 'partial', label: 'Partial' },
		{ value: 'none', label: 'None' }
	],
	diabetesControlled: [
		{ value: 'not-diabetic', label: 'Not diabetic' },
		{ value: 'well-controlled', label: 'Well controlled' },
		{ value: 'poorly-controlled', label: 'Poorly controlled' }
	],
	smokingStatus: [
		{ value: 'never', label: 'Never smoked' },
		{ value: 'ex-smoker', label: 'Ex-smoker' },
		{ value: 'current', label: 'Current smoker' }
	],
	planRecommendation: [
		{ value: 'total-knee-replacement', label: 'Total knee replacement' },
		{ value: 'partial-knee-replacement', label: 'Partial knee replacement' },
		{ value: 'continue-conservative-management', label: 'Continue conservative management' },
		{ value: 'mdt-review', label: 'Refer for MDT review' },
		{ value: 'not-currently-a-candidate', label: 'Not currently a candidate' }
	],
	candidacy: [
		{ value: 'strong-candidate', label: 'Strong candidate for surgery' },
		{ value: 'candidate', label: 'Candidate for surgery' },
		{ value: 'continue-conservative', label: 'Continue conservative management' },
		{ value: 'not-indicated', label: 'Surgery not indicated' },
		{ value: 'mdt-review', label: 'Refer for multidisciplinary team review' }
	]
};

/**
 * The Oxford Knee Score response options, item by item, worded per the
 * published instrument (Dawson et al. 1998). Value is the score 0 (worst) to
 * 4 (best); options are listed 4 down to 0 so the best answer reads first.
 */
export const OKS_OPTIONS: Record<string, Option[]> = {
	oksPainSeverity: [
		{ value: '4', label: 'None' },
		{ value: '3', label: 'Very mild' },
		{ value: '2', label: 'Mild' },
		{ value: '1', label: 'Moderate' },
		{ value: '0', label: 'Severe' }
	],
	oksWashingAndDrying: [
		{ value: '4', label: 'No difficulty at all' },
		{ value: '3', label: 'Very little difficulty' },
		{ value: '2', label: 'Moderate difficulty' },
		{ value: '1', label: 'Extreme difficulty' },
		{ value: '0', label: 'Impossible to do' }
	],
	oksTransport: [
		{ value: '4', label: 'No difficulty at all' },
		{ value: '3', label: 'Very little difficulty' },
		{ value: '2', label: 'Moderate difficulty' },
		{ value: '1', label: 'Extreme difficulty' },
		{ value: '0', label: 'Impossible to do' }
	],
	oksWalkingDistance: [
		{ value: '4', label: 'No pain / unlimited' },
		{ value: '3', label: 'More than 30 minutes, but not unlimited' },
		{ value: '2', label: '16 to 30 minutes' },
		{ value: '1', label: '5 to 15 minutes' },
		{ value: '0', label: 'Only inside the house / housebound' }
	],
	oksPainSittingOrLying: [
		{ value: '4', label: 'None' },
		{ value: '3', label: 'Very mild' },
		{ value: '2', label: 'Mild' },
		{ value: '1', label: 'Moderate' },
		{ value: '0', label: 'Severe' }
	],
	oksLimping: [
		{ value: '4', label: 'Rarely / never' },
		{ value: '3', label: 'Sometimes, or just at first' },
		{ value: '2', label: 'Often, not just at first' },
		{ value: '1', label: 'Most of the time' },
		{ value: '0', label: 'All of the time' }
	],
	oksKneeling: [
		{ value: '4', label: 'No difficulty at all' },
		{ value: '3', label: 'Very little difficulty' },
		{ value: '2', label: 'Moderate difficulty' },
		{ value: '1', label: 'Extreme difficulty' },
		{ value: '0', label: 'Impossible to do' }
	],
	oksNightPainFrequency: [
		{ value: '4', label: 'No nights' },
		{ value: '3', label: 'Only 1 or 2 nights' },
		{ value: '2', label: 'Some nights' },
		{ value: '1', label: 'Most nights' },
		{ value: '0', label: 'Every night' }
	],
	oksPainInterferingWithWork: [
		{ value: '4', label: 'Not at all' },
		{ value: '3', label: 'A little bit' },
		{ value: '2', label: 'Moderately' },
		{ value: '1', label: 'Greatly' },
		{ value: '0', label: 'Totally' }
	],
	oksGivingWay: [
		{ value: '4', label: 'Rarely / never' },
		{ value: '3', label: 'Sometimes, or just at first' },
		{ value: '2', label: 'Often, not just at first' },
		{ value: '1', label: 'Most of the time' },
		{ value: '0', label: 'All of the time' }
	],
	oksShopping: [
		{ value: '4', label: 'No difficulty at all' },
		{ value: '3', label: 'Very little difficulty' },
		{ value: '2', label: 'Moderate difficulty' },
		{ value: '1', label: 'Extreme difficulty' },
		{ value: '0', label: 'Impossible to do' }
	],
	oksStairs: [
		{ value: '4', label: 'No difficulty at all' },
		{ value: '3', label: 'Very little difficulty' },
		{ value: '2', label: 'Moderate difficulty' },
		{ value: '1', label: 'Extreme difficulty' },
		{ value: '0', label: 'Impossible to do' }
	]
};
