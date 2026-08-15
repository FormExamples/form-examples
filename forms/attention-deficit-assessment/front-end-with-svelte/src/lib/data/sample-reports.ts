import type { AssessmentData, ADHDClassification, ADHDSubtype } from '#lib/engine/types.js';
import { calculateASRS } from '#lib/engine/asrs-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	asrsTotal: number;
	partAScreenerPositive: boolean;
	classification: ADHDClassification;
	subtype: ADHDSubtype;
	comorbidityFlag: boolean;
	flagCount: number;
}

/** Low scores throughout — unlikely ADHD. */
function unlikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Susan',
		lastName: 'Walker',
		dateOfBirth: '1990-03-14',
		sex: 'female',
		occupation: 'Accountant',
		educationLevel: 'undergraduate'
	};
	d.asrsPartA = {
		focusDifficulty: 0,
		organizationDifficulty: 1,
		rememberingDifficulty: 0,
		avoidingTasks: 1,
		fidgeting: 0,
		overlyActive: 0
	};
	d.asrsPartB = {
		carelessMistakes: 1,
		attentionDifficulty: 0,
		concentrationDifficulty: 1,
		misplacingThings: 1,
		distractedByNoise: 0,
		leavingSeat: 0,
		restlessness: 1,
		difficultyRelaxing: 0,
		talkingTooMuch: 1,
		finishingSentences: 0,
		difficultyWaiting: 0,
		interruptingOthers: 0
	};
	d.childhoodHistory = { ...d.childhoodHistory, childhoodSymptoms: 'no', onsetBeforeAge12: 'no' };
	return d;
}

/** Moderate scores — screener negative but elevated total: possible ADHD. */
function possible(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Helen',
		lastName: 'Davies',
		dateOfBirth: '1985-07-22',
		sex: 'female',
		occupation: 'Teacher',
		educationLevel: 'postgraduate'
	};
	// Part A kept just below the shaded threshold so the screener stays negative,
	// while overall symptom load pushes the total over 24.
	d.asrsPartA = {
		focusDifficulty: 1,
		organizationDifficulty: 1,
		rememberingDifficulty: 1,
		avoidingTasks: 2,
		fidgeting: 2,
		overlyActive: 2
	};
	d.asrsPartB = {
		carelessMistakes: 2,
		attentionDifficulty: 2,
		concentrationDifficulty: 2,
		misplacingThings: 2,
		distractedByNoise: 2,
		leavingSeat: 1,
		restlessness: 2,
		difficultyRelaxing: 2,
		talkingTooMuch: 1,
		finishingSentences: 1,
		difficultyWaiting: 1,
		interruptingOthers: 1
	};
	d.childhoodHistory = {
		...d.childhoodHistory,
		childhoodSymptoms: 'yes',
		childhoodSymptomsDetails: 'Some inattentiveness reported at school.',
		onsetBeforeAge12: 'yes'
	};
	d.comorbidConditions = {
		...d.comorbidConditions,
		depression: 'yes',
		depressionDetails: 'Mild, managed without medication.'
	};
	return d;
}

/** Screener positive with a high total — likely ADHD, inattentive presentation. */
function likely(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1993-11-05',
		sex: 'female',
		occupation: 'Software developer',
		educationLevel: 'undergraduate'
	};
	// Inattentive Part A items shaded (>=2) plus one hyperactive item shaded
	// (>=3), giving four shaded Part A items so the screener is positive.
	d.asrsPartA = {
		focusDifficulty: 3,
		organizationDifficulty: 3,
		rememberingDifficulty: 3,
		avoidingTasks: 3,
		fidgeting: 1,
		overlyActive: 1
	};
	d.asrsPartB = {
		carelessMistakes: 3,
		attentionDifficulty: 3,
		concentrationDifficulty: 3,
		misplacingThings: 3,
		distractedByNoise: 3,
		leavingSeat: 1,
		restlessness: 1,
		difficultyRelaxing: 1,
		talkingTooMuch: 1,
		finishingSentences: 1,
		difficultyWaiting: 1,
		interruptingOthers: 1
	};
	d.childhoodHistory = {
		...d.childhoodHistory,
		childhoodSymptoms: 'yes',
		childhoodSymptomsDetails: 'Persistent inattention since primary school.',
		schoolPerformance: 'below-average',
		onsetBeforeAge12: 'yes'
	};
	d.functionalImpact = {
		...d.functionalImpact,
		workAcademicImpact: 'moderate',
		timeManagementImpact: 'severe',
		dailyLivingImpact: 'moderate'
	};
	d.comorbidConditions = {
		...d.comorbidConditions,
		anxiety: 'yes',
		anxietyDetails: 'Generalised anxiety.'
	};
	d.medications = [{ name: 'Sertraline', dose: '50 mg', frequency: 'Once daily' }];
	return d;
}

/** Screener positive with a very high total — highly likely, combined presentation. */
function highlyLikely(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'George',
		lastName: 'Clark',
		dateOfBirth: '1996-02-18',
		sex: 'male',
		occupation: 'Chef',
		educationLevel: 'college'
	};
	d.asrsPartA = {
		focusDifficulty: 4,
		organizationDifficulty: 4,
		rememberingDifficulty: 4,
		avoidingTasks: 4,
		fidgeting: 4,
		overlyActive: 4
	};
	d.asrsPartB = {
		carelessMistakes: 4,
		attentionDifficulty: 4,
		concentrationDifficulty: 3,
		misplacingThings: 4,
		distractedByNoise: 4,
		leavingSeat: 3,
		restlessness: 4,
		difficultyRelaxing: 4,
		talkingTooMuch: 4,
		finishingSentences: 3,
		difficultyWaiting: 4,
		interruptingOthers: 4
	};
	d.childhoodHistory = {
		...d.childhoodHistory,
		childhoodSymptoms: 'yes',
		childhoodSymptomsDetails: 'Hyperactive and inattentive throughout childhood.',
		schoolPerformance: 'failing',
		behaviouralReports: 'yes',
		behaviouralReportsDetails: 'Repeated reports of disruptive behaviour.',
		onsetBeforeAge12: 'yes'
	};
	d.functionalImpact = {
		workAcademicImpact: 'severe',
		relationshipImpact: 'severe',
		dailyLivingImpact: 'severe',
		financialManagementImpact: 'severe',
		timeManagementImpact: 'severe'
	};
	d.comorbidConditions = {
		...d.comorbidConditions,
		anxiety: 'yes',
		anxietyDetails: 'Persistent.',
		substanceUse: 'yes',
		substanceUseDetails: 'Alcohol — increased use.'
	};
	d.allergies = [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }];
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AD-2026-0001', patientName: 'Walker, Susan', assessedDate: '2026-06-10', data: unlikely() },
	{ id: 'AD-2026-0002', patientName: 'Davies, Helen', assessedDate: '2026-06-12', data: possible() },
	{ id: 'AD-2026-0003', patientName: 'Patel, Priya', assessedDate: '2026-06-15', data: likely() },
	{
		id: 'AD-2026-0004',
		patientName: 'Clark, George',
		assessedDate: '2026-06-18',
		data: highlyLikely()
	}
];

/** Whether any comorbid condition was answered "yes". */
function hasComorbidity(d: AssessmentData): boolean {
	const c = d.comorbidConditions;
	return [
		c.anxiety,
		c.depression,
		c.substanceUse,
		c.sleepDisorders,
		c.learningDisabilities,
		c.autismSpectrum
	].includes('yes');
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateASRS(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		asrsTotal: g.asrsTotal,
		partAScreenerPositive: g.partAScreenerPositive,
		classification: g.classification,
		subtype: g.subtype,
		comorbidityFlag: hasComorbidity(s.data),
		flagCount: g.additionalFlags.length
	};
});
