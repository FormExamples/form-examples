// Option lists shared by the step components.
// Values match the SQL CHECK constraints in sql/02_create_table_patient.sql,
// sql/03_create_table_clinician.sql, and
// sql/04_create_table_hernia_diagnostic_evaluation.sql.

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
		{ value: 'general-practitioner', label: 'General practitioner' },
		{ value: 'surgical-registrar', label: 'Surgical registrar' },
		{ value: 'general-surgeon', label: 'General surgeon' },
		{ value: 'nurse-practitioner', label: 'Nurse practitioner' },
		{ value: 'other', label: 'Other' }
	],
	registrationBody: [
		{ value: 'GMC', label: 'GMC' },
		{ value: 'NMC', label: 'NMC' },
		{ value: 'other', label: 'Other' }
	],
	sex: [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'intersex', label: 'Intersex' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	],
	durationOfBulge: [
		{ value: 'less-than-1-week', label: 'Less than 1 week' },
		{ value: '1-4-weeks', label: '1 to 4 weeks' },
		{ value: '1-6-months', label: '1 to 6 months' },
		{ value: '6-12-months', label: '6 to 12 months' },
		{ value: 'more-than-1-year', label: 'More than 1 year' }
	],
	painOnset: [
		{ value: 'sudden', label: 'Sudden' },
		{ value: 'gradual', label: 'Gradual' }
	],
	priorHerniaRepairMesh: [
		{ value: 'mesh', label: 'Mesh' },
		{ value: 'no-mesh', label: 'No mesh' },
		{ value: 'unknown', label: 'Unknown' }
	],
	inspectionLocation: [
		{ value: 'groin', label: 'Groin' },
		{ value: 'umbilical', label: 'Umbilical' },
		{ value: 'epigastric', label: 'Epigastric' },
		{ value: 'incisional', label: 'Incisional' },
		{ value: 'femoral', label: 'Femoral' },
		{ value: 'other', label: 'Other' }
	],
	skinChanges: [
		{ value: 'none', label: 'None' },
		{ value: 'erythema', label: 'Erythema' },
		{ value: 'discolouration', label: 'Discolouration' },
		{ value: 'both', label: 'Both' }
	],
	reducibilityStatus: [
		{ value: 'reducible', label: 'Reducible' },
		{ value: 'irreducible', label: 'Irreducible' },
		{ value: 'incarcerated', label: 'Incarcerated' }
	],
	herniaType: [
		{ value: 'inguinal', label: 'Inguinal' },
		{ value: 'femoral', label: 'Femoral' },
		{ value: 'umbilical', label: 'Umbilical' },
		{ value: 'epigastric', label: 'Epigastric' },
		{ value: 'incisional', label: 'Incisional' },
		{ value: 'paraumbilical', label: 'Paraumbilical' },
		{ value: 'spigelian', label: 'Spigelian' },
		{ value: 'other', label: 'Other' }
	],
	inguinalSubtype: [
		{ value: 'direct', label: 'Direct' },
		{ value: 'indirect', label: 'Indirect' },
		{ value: 'pantaloon', label: 'Pantaloon' },
		{ value: 'uncertain', label: 'Uncertain' }
	],
	laterality: [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'bilateral', label: 'Bilateral' }
	],
	ehsSizeGrade: [
		{ value: '1', label: 'Grade 1 (< 2cm)' },
		{ value: '2', label: 'Grade 2 (2–4cm)' },
		{ value: '3', label: 'Grade 3 (> 4cm)' }
	],
	imagingFinding: [
		{ value: 'confirms-hernia', label: 'Confirms hernia' },
		{ value: 'no-hernia', label: 'No hernia' },
		{ value: 'inconclusive', label: 'Inconclusive' }
	],
	imagingIndication: [
		{ value: 'atypical-presentation', label: 'Atypical presentation' },
		{ value: 'occult-suspicion', label: 'Occult suspicion' },
		{ value: 'inconclusive-exam', label: 'Inconclusive examination' },
		{ value: 'pre-op-planning', label: 'Pre-operative planning' },
		{ value: 'not-indicated', label: 'Not indicated' }
	],
	managementPlan: [
		{ value: 'watchful-waiting', label: 'Watchful waiting' },
		{ value: 'elective-repair-referral', label: 'Elective repair referral' },
		{ value: 'urgent-referral', label: 'Urgent referral' },
		{ value: 'emergency-referral', label: 'Emergency referral' },
		{ value: 'conservative', label: 'Conservative' }
	],
	referralTargetTimeframe: [
		{ value: 'same-day', label: 'Same day' },
		{ value: 'immediate', label: 'Immediate' },
		{ value: 'within-2-weeks', label: 'Within 2 weeks' },
		{ value: 'within-6-weeks', label: 'Within 6 weeks' },
		{ value: 'within-18-weeks', label: 'Within 18 weeks' }
	],
	overrideUrgency: [
		{ value: 'routine', label: 'Routine' },
		{ value: 'soon', label: 'Soon (elective referral)' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'emergency', label: 'Emergency' }
	]
};
