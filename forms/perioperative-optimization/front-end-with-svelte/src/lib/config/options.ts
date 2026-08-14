// Option lists shared by the step components.
// Values match the SQL CHECK constraints in
// sql/08_create_table_perioperative_optimization.sql.

export interface Option {
	value: string;
	label: string;
}

export const YES_NO_OPTS: Option[] = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' }
];

export const OPTIONS: Record<string, Option[]> = {
	role: [
		{ value: 'preoperative-assessment-nurse', label: 'Pre-operative assessment nurse' },
		{ value: 'perioperative-physician', label: 'Perioperative physician' },
		{ value: 'anaesthetist', label: 'Anaesthetist' },
		{ value: 'surgeon', label: 'Surgeon' },
		{ value: 'prehabilitation-therapist', label: 'Prehabilitation therapist' },
		{ value: 'physiotherapist', label: 'Physiotherapist' },
		{ value: 'pharmacist', label: 'Pharmacist' },
		{ value: 'dietitian', label: 'Dietitian' },
		{ value: 'specialist-nurse', label: 'Specialist nurse' },
		{ value: 'other', label: 'Other' }
	],
	registrationBody: [
		{ value: 'GMC', label: 'GMC' }, { value: 'NMC', label: 'NMC' },
		{ value: 'HCPC', label: 'HCPC' }, { value: 'GPhC', label: 'GPhC' },
		{ value: 'other', label: 'Other' }
	],
	pathwayStage: [
		{ value: 'referral', label: 'Referral' },
		{ value: 'waiting-list', label: 'Waiting list' },
		{ value: 'pre-assessment', label: 'Pre-assessment' },
		{ value: 'prehabilitation', label: 'Prehabilitation' },
		{ value: 'pre-admission', label: 'Pre-admission' },
		{ value: 'review', label: 'Review' }
	],
	assessmentMode: [
		{ value: 'clinic', label: 'Clinic' }, { value: 'telephone', label: 'Telephone' },
		{ value: 'video', label: 'Video' }, { value: 'online-portal', label: 'Online portal' },
		{ value: 'home-visit', label: 'Home visit' }
	],
	referralSource: [
		{ value: 'surgical-team', label: 'Surgical team' },
		{ value: 'general-practitioner', label: 'General practitioner' },
		{ value: 'anaesthetist', label: 'Anaesthetist' },
		{ value: 'waiting-list-office', label: 'Waiting-list office' },
		{ value: 'self-referral', label: 'Self-referral' },
		{ value: 'other', label: 'Other' }
	],
	sex: [
		{ value: 'female', label: 'Female' }, { value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	urgency: [
		{ value: 'elective', label: 'Elective' }, { value: 'scheduled', label: 'Scheduled' },
		{ value: 'expedited', label: 'Expedited' }, { value: 'urgent', label: 'Urgent' },
		{ value: 'emergency', label: 'Emergency' }
	],
	surgicalSeverity: [
		{ value: 'minor', label: 'Minor' }, { value: 'intermediate', label: 'Intermediate' },
		{ value: 'major', label: 'Major' }, { value: 'major-plus', label: 'Major plus' }
	],
	laterality: [
		{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' },
		{ value: 'bilateral', label: 'Bilateral' }, { value: 'midline', label: 'Midline' },
		{ value: 'na', label: 'Not applicable' }
	],
	pregnancyStatus: [
		{ value: 'not-applicable', label: 'Not applicable' },
		{ value: 'not-pregnant', label: 'Not pregnant' },
		{ value: 'pregnant', label: 'Pregnant' },
		{ value: 'breastfeeding', label: 'Breastfeeding' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	adherence: [
		{ value: 'full', label: 'Full' }, { value: 'partial', label: 'Partial' },
		{ value: 'none', label: 'None' }, { value: 'unknown', label: 'Unknown' }
	],
	allergySeverity: [
		{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }, { value: 'anaphylaxis', label: 'Anaphylaxis' }
	],
	anaemiaRoute: [
		{ value: 'oral', label: 'Oral (8-week lead time)' },
		{ value: 'intravenous', label: 'Intravenous (4-week lead time)' },
		{ value: 'none', label: 'None' }
	],
	diabetesType: [
		{ value: 'none', label: 'None' }, { value: 'type-1', label: 'Type 1' },
		{ value: 'type-2', label: 'Type 2' }, { value: 'gestational', label: 'Gestational' },
		{ value: 'other', label: 'Other' }
	],
	diabetesTreatment: [
		{ value: 'diet-only', label: 'Diet only' },
		{ value: 'oral-agents', label: 'Oral agents' },
		{ value: 'insulin', label: 'Insulin' },
		{ value: 'oral-and-insulin', label: 'Oral and insulin' },
		{ value: 'glp1-agonist', label: 'GLP-1 agonist' },
		{ value: 'other', label: 'Other' }
	],
	hypoAwareness: [
		{ value: 'normal', label: 'Normal' }, { value: 'impaired', label: 'Impaired' },
		{ value: 'absent', label: 'Absent' }
	],
	smokingStatus: [
		{ value: 'never', label: 'Never smoked' }, { value: 'former', label: 'Former smoker' },
		{ value: 'current', label: 'Current smoker' }
	],
	auditCFrequency: [
		{ value: '0', label: '0 — Never' },
		{ value: '1', label: '1 — Monthly or less' },
		{ value: '2', label: '2 — Two to four times a month' },
		{ value: '3', label: '3 — Two to three times a week' },
		{ value: '4', label: '4 — Four or more times a week' }
	],
	auditCQuantity: [
		{ value: '0', label: '0 — 1 or 2' }, { value: '1', label: '1 — 3 or 4' },
		{ value: '2', label: '2 — 5 or 6' }, { value: '3', label: '3 — 7 to 9' },
		{ value: '4', label: '4 — 10 or more' }
	],
	auditCBinge: [
		{ value: '0', label: '0 — Never' }, { value: '1', label: '1 — Less than monthly' },
		{ value: '2', label: '2 — Monthly' }, { value: '3', label: '3 — Weekly' },
		{ value: '4', label: '4 — Daily or almost daily' }
	],
	appetite: [
		{ value: 'good', label: 'Good' }, { value: 'fair', label: 'Fair' },
		{ value: 'poor', label: 'Poor' }, { value: 'absent', label: 'Absent' }
	],
	activityLevel: [
		{ value: 'sedentary', label: 'Sedentary' },
		{ value: 'lightly-active', label: 'Lightly active' },
		{ value: 'moderately-active', label: 'Moderately active' },
		{ value: 'very-active', label: 'Very active' }
	],
	stairs: [
		{ value: 'yes-easily', label: 'Yes, easily' },
		{ value: 'yes-with-difficulty', label: 'Yes, with difficulty' },
		{ value: 'no', label: 'No' }
	],
	cognitiveTool: [
		{ value: '4at', label: '4AT' }, { value: 'amt', label: 'AMT' },
		{ value: 'moca', label: 'MoCA' }, { value: 'mmse', label: 'MMSE' },
		{ value: 'none', label: 'None done' }
	],
	severity4: [
		{ value: 'none', label: 'None' }, { value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }
	],
	mobilityAid: [
		{ value: 'none', label: 'None' }, { value: 'stick', label: 'Stick' },
		{ value: 'frame', label: 'Frame' }, { value: 'crutches', label: 'Crutches' },
		{ value: 'wheelchair', label: 'Wheelchair' }, { value: 'bed-bound', label: 'Bed-bound' }
	],
	livingSituation: [
		{ value: 'alone', label: 'Alone' }, { value: 'with-partner', label: 'With a partner' },
		{ value: 'with-family', label: 'With family' }, { value: 'shared-house', label: 'Shared house' },
		{ value: 'care-home', label: 'Care home' }, { value: 'supported-living', label: 'Supported living' },
		{ value: 'homeless', label: 'Homeless' }, { value: 'other', label: 'Other' }
	],
	carePackage: [
		{ value: 'none', label: 'None' }, { value: 'informal', label: 'Informal' },
		{ value: 'daily', label: 'Daily' }, { value: 'twice-daily', label: 'Twice daily' },
		{ value: 'live-in', label: 'Live-in' }
	],
	heartRhythm: [
		{ value: 'sinus', label: 'Sinus' },
		{ value: 'atrial-fibrillation', label: 'Atrial fibrillation' },
		{ value: 'flutter', label: 'Flutter' }, { value: 'heart-block', label: 'Heart block' },
		{ value: 'paced', label: 'Paced' }, { value: 'other', label: 'Other' }
	],
	exerciseTolerance: [
		{ value: 'good', label: 'Good' }, { value: 'moderate', label: 'Moderate' },
		{ value: 'poor', label: 'Poor' }, { value: 'unable', label: 'Unable' }
	],
	airwaysControl: [
		{ value: 'none', label: 'Not applicable' }, { value: 'controlled', label: 'Controlled' },
		{ value: 'partly-controlled', label: 'Partly controlled' },
		{ value: 'uncontrolled', label: 'Uncontrolled' }
	],
	depressionScreen: [
		{ value: 'negative', label: 'Negative' }, { value: 'positive', label: 'Positive' },
		{ value: 'not-done', label: 'Not done' }
	],
	supportAfterDischarge: [
		{ value: 'good', label: 'Good' }, { value: 'some', label: 'Some' },
		{ value: 'limited', label: 'Limited' }, { value: 'none', label: 'None' }
	],
	healthLiteracy: [
		{ value: 'high', label: 'High' }, { value: 'moderate', label: 'Moderate' },
		{ value: 'low', label: 'Low' }
	],
	readiness: [
		{ value: 'ready', label: 'Ready for surgery' },
		{ value: 'optimization-in-progress', label: 'Optimization in progress' },
		{ value: 'optimization-required', label: 'Optimization required' },
		{ value: 'defer-surgery', label: 'Defer surgery' }
	],
	gateDecision: [
		{ value: 'proceed', label: 'Proceed as listed' },
		{ value: 'proceed-with-prehabilitation', label: 'Proceed with prehabilitation' },
		{ value: 'defer-and-optimize', label: 'Defer and optimize' },
		{ value: 'accept-unoptimized-risk', label: 'Accept unoptimized risk' },
		{ value: 'mdt-review', label: 'Refer to MDT review' },
		{ value: 'cancel', label: 'Cancel' }
	]
};