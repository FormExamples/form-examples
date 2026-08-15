// Option lists shared by the step components.
// Values match the SQL CHECK constraints in
// sql/04_create_table_health_screening_questionnaire.sql.

export interface Option {
	value: string;
	label: string;
}

export const YES_NO: Option[] = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' }
];

export const OPTIONS: Record<string, Option[]> = {
	sex: [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	identifierType: [
		{ value: 'nhs-number', label: 'NHS number' },
		{ value: 'employee-number', label: 'Employee number' },
		{ value: 'other', label: 'Other' }
	],
	assessorRole: [
		{ value: 'occupational-health-nurse', label: 'Occupational health nurse' },
		{ value: 'general-practitioner', label: 'General practitioner' },
		{ value: 'practice-nurse', label: 'Practice nurse' },
		{ value: 'physiotherapist', label: 'Physiotherapist' },
		{ value: 'personal-trainer', label: 'Personal trainer' },
		{ value: 'gym-instructor', label: 'Gym instructor' },
		{ value: 'sports-therapist', label: 'Sports therapist' },
		{ value: 'hr-officer', label: 'HR officer' },
		{ value: 'other', label: 'Other' }
	],
	screeningPurpose: [
		{ value: 'occupational-pre-placement', label: 'Occupational pre-placement' },
		{ value: 'routine-public-health', label: 'Routine public health' },
		{ value: 'perioperative-referral', label: 'Perioperative referral' },
		{ value: 'physical-activity-readiness', label: 'Physical activity readiness' },
		{ value: 'other', label: 'Other' }
	],
	assessmentMode: [
		{ value: 'in-person', label: 'In person' },
		{ value: 'telephone', label: 'Telephone' },
		{ value: 'online', label: 'Online' }
	],
	usualActivityLevel: [
		{ value: 'sedentary', label: 'Sedentary' },
		{ value: 'light', label: 'Light' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'active', label: 'Active' },
		{ value: 'very-active', label: 'Very active' }
	],
	smokingStatus: [
		{ value: 'never', label: 'Never smoked' },
		{ value: 'ex-smoker', label: 'Ex-smoker' },
		{ value: 'current-smoker', label: 'Current smoker' },
		{ value: 'vapes-only', label: 'Vapes only' }
	],
	physicalDemandsOfRole: [
		{ value: 'sedentary', label: 'Sedentary' },
		{ value: 'light', label: 'Light' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'heavy', label: 'Heavy' }
	],
	vaccinationUpToDate: [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unsure', label: 'Unsure' }
	],
	riskBand: [
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'high', label: 'High' },
		{ value: 'refer-urgently', label: 'Refer urgently' }
	]
};

/** The AUDIT-C 0–4 option lists, per item, matching the validated wording. */
export const AUDIT_C_FREQUENCY: Option[] = [
	{ value: '0', label: 'Never' },
	{ value: '1', label: 'Monthly or less' },
	{ value: '2', label: '2 to 4 times a month' },
	{ value: '3', label: '2 to 3 times a week' },
	{ value: '4', label: '4 or more times a week' }
];

export const AUDIT_C_TYPICAL_QUANTITY: Option[] = [
	{ value: '0', label: '1 or 2' },
	{ value: '1', label: '3 or 4' },
	{ value: '2', label: '5 or 6' },
	{ value: '3', label: '7 to 9' },
	{ value: '4', label: '10 or more' }
];

export const AUDIT_C_BINGE_FREQUENCY: Option[] = [
	{ value: '0', label: 'Never' },
	{ value: '1', label: 'Less than monthly' },
	{ value: '2', label: 'Monthly' },
	{ value: '3', label: 'Weekly' },
	{ value: '4', label: 'Daily or almost daily' }
];

/** 0–4 self-report scale, used for stress level and sleep quality. */
export const SCALE_0_TO_4: Option[] = [
	{ value: '0', label: '0 — None' },
	{ value: '1', label: '1' },
	{ value: '2', label: '2' },
	{ value: '3', label: '3' },
	{ value: '4', label: '4 — Severe' }
];
