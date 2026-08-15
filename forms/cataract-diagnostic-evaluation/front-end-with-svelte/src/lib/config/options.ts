// Option lists shared by the step components.
// Values match the SQL CHECK constraints in
// sql/04_create_table_cataract_diagnostic_evaluation.sql.

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
		{ value: 'optometrist', label: 'Optometrist (GOC)' },
		{ value: 'ophthalmologist', label: 'Ophthalmologist (GMC)' },
		{ value: 'orthoptist', label: 'Orthoptist (working under supervision)' },
		{ value: 'other', label: 'Other' }
	],
	registrationBody: [
		{ value: 'GOC', label: 'GOC — General Optical Council' },
		{ value: 'GMC', label: 'GMC — General Medical Council' },
		{ value: 'HCPC', label: 'HCPC' },
		{ value: 'other', label: 'Other' }
	],
	sex: [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	symptomLaterality: [
		{ value: 'right-eye', label: 'Right eye' },
		{ value: 'left-eye', label: 'Left eye' },
		{ value: 'both-eyes', label: 'Both eyes' }
	],
	historySteroidUse: [
		{ value: 'none', label: 'None' },
		{ value: 'systemic', label: 'Systemic' },
		{ value: 'topical', label: 'Topical' },
		{ value: 'both', label: 'Both systemic and topical' }
	],
	historySmokingStatus: [
		{ value: 'never', label: 'Never smoked' },
		{ value: 'former', label: 'Former smoker' },
		{ value: 'current', label: 'Current smoker' }
	],
	refractionStability: [
		{ value: 'stable', label: 'Stable' },
		{ value: 'changing', label: 'Changing' }
	],
	cataractType: [
		{ value: 'nuclear', label: 'Nuclear' },
		{ value: 'cortical', label: 'Cortical' },
		{ value: 'posterior-subcapsular', label: 'Posterior subcapsular' },
		{ value: 'mixed', label: 'Mixed' },
		{ value: 'none', label: 'None' }
	],
	anteriorChamberDepth: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'shallow', label: 'Shallow' },
		{ value: 'deep', label: 'Deep' }
	],
	cornealClarity: [
		{ value: 'clear', label: 'Clear' },
		{ value: 'hazy', label: 'Hazy' },
		{ value: 'scarred', label: 'Scarred' }
	],
	pupilReaction: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'sluggish', label: 'Sluggish' },
		{ value: 'fixed', label: 'Fixed' }
	],
	severity4: [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	],
	tonometryMethod: [
		{ value: 'goldmann', label: 'Goldmann applanation' },
		{ value: 'non-contact', label: 'Non-contact (air-puff)' },
		{ value: 'icare', label: 'iCare rebound' },
		{ value: 'other', label: 'Other' }
	],
	maculaFindings: [
		{ value: 'normal', label: 'Normal' },
		{ value: 'amd-suspected', label: 'AMD suspected' },
		{ value: 'other', label: 'Other' }
	],
	managementRecommendation: [
		{ value: 'monitor', label: 'Monitor' },
		{ value: 'spectacle-change', label: 'Spectacle change' },
		{ value: 'surgical-referral-routine', label: 'Surgical referral — routine' },
		{ value: 'surgical-referral-urgent', label: 'Surgical referral — urgent' }
	],
	eyeChoice: [
		{ value: 'right', label: 'Right' },
		{ value: 'left', label: 'Left' },
		{ value: 'both', label: 'Both' },
		{ value: 'none', label: 'None' }
	],
	surgicalCandidacy: [
		{ value: 'not-indicated', label: 'Surgery not indicated' },
		{ value: 'consider', label: 'Consider surgical referral' },
		{ value: 'indicated', label: 'Surgery indicated' },
		{ value: 'urgent-referral', label: 'Urgent referral' }
	]
};
