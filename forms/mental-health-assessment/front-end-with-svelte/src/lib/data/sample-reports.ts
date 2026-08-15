import type { AssessmentData, SeverityLevel } from '#lib/engine/types.js';
import { gradeAssessment } from '#lib/engine/mh-grader.js';
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
	phq9Score: number;
	phq9Severity: SeverityLevel;
	gad7Score: number;
	gad7Severity: SeverityLevel;
	safetyFlag: boolean;
	flagCount: number;
}

/** A minimal presentation: low PHQ-9 / GAD-7, no safety concerns. */
function minimal(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1986-04-12',
		sex: 'male',
		emergencyContactName: 'Mary Smith',
		emergencyContactPhone: '07700 900111',
		emergencyContactRelationship: 'Spouse'
	};
	d.phqResponses = {
		interest: 0, depression: 1, sleep: 1, energy: 0, appetite: 0,
		selfEsteem: 0, concentration: 0, psychomotor: 0, suicidalThoughts: 0
	};
	d.gadResponses = {
		nervousness: 1, uncontrollableWorry: 0, excessiveWorry: 0, troubleRelaxing: 0,
		restlessness: 0, irritability: 1, fearfulness: 0
	};
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'none', selfHarm: 'none', harmToOthers: 'none', hasSafetyPlan: '' };
	d.substanceUse = { ...d.substanceUse, alcoholFrequency: 'monthly-or-less', alcoholQuantity: '1-2', bingeDrinking: 'never', drugUse: 'never', tobaccoUse: 'never' };
	d.socialFunctional = { ...d.socialFunctional, employmentStatus: 'employed-full-time', relationshipStatus: 'married', housingStatus: 'stable', supportSystem: 'strong', functionalImpairment: 'none' };
	return d;
}

/** A moderate presentation: moderate depression and anxiety, occasional drug use. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1991-09-30',
		sex: 'female',
		emergencyContactName: 'Anil Patel',
		emergencyContactPhone: '07700 900222',
		emergencyContactRelationship: 'Brother'
	};
	d.phqResponses = {
		interest: 2, depression: 2, sleep: 1, energy: 2, appetite: 1,
		selfEsteem: 1, concentration: 1, psychomotor: 0, suicidalThoughts: 0
	};
	d.gadResponses = {
		nervousness: 2, uncontrollableWorry: 2, excessiveWorry: 2, troubleRelaxing: 2,
		restlessness: 1, irritability: 1, fearfulness: 2
	};
	d.moodAffect = { ...d.moodAffect, currentMood: 'low', sleepQuality: 'poor', appetiteChanges: 'decrease', energyLevel: 'low', concentration: 'fair' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'none', selfHarm: 'past', selfHarmDetails: 'Adolescence', harmToOthers: 'none', hasSafetyPlan: '' };
	d.substanceUse = { ...d.substanceUse, alcoholFrequency: '2-3-per-week', alcoholQuantity: '3-4', bingeDrinking: 'monthly', drugUse: 'occasional', drugDetails: 'Cannabis', tobaccoUse: 'former' };
	d.currentMedications = { ...d.currentMedications, psychiatricMedications: [{ name: 'Sertraline', dose: '50 mg', frequency: 'Once daily' }] };
	d.treatmentHistory = { ...d.treatmentHistory, previousTherapy: 'yes', therapyDetails: 'CBT 2023', previousHospitalizations: 'no' };
	d.socialFunctional = { ...d.socialFunctional, employmentStatus: 'employed-part-time', relationshipStatus: 'single', housingStatus: 'stable', supportSystem: 'moderate', functionalImpairment: 'moderate' };
	return d;
}

/** A high-risk presentation: severe depression, active SI without plan, no safety plan. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1973-01-22',
		sex: 'female',
		emergencyContactName: 'Tom Jones',
		emergencyContactPhone: '07700 900333',
		emergencyContactRelationship: 'Son'
	};
	d.phqResponses = {
		interest: 3, depression: 3, sleep: 3, energy: 3, appetite: 2,
		selfEsteem: 3, concentration: 2, psychomotor: 1, suicidalThoughts: 2
	};
	d.gadResponses = {
		nervousness: 3, uncontrollableWorry: 3, excessiveWorry: 3, troubleRelaxing: 2,
		restlessness: 2, irritability: 2, fearfulness: 2
	};
	d.moodAffect = { ...d.moodAffect, currentMood: 'very-low', sleepQuality: 'very-poor', appetiteChanges: 'significant-decrease', energyLevel: 'very-low', concentration: 'very-poor' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'active-no-plan', suicidalIdeationDetails: 'Reports wishing not to wake', selfHarm: 'current', selfHarmDetails: 'Cutting', harmToOthers: 'none', hasSafetyPlan: 'no' };
	d.substanceUse = { ...d.substanceUse, alcoholFrequency: '4-or-more-per-week', alcoholQuantity: '5-6', bingeDrinking: 'weekly', drugUse: 'regular', drugDetails: 'Benzodiazepines', tobaccoUse: 'current' };
	d.currentMedications = { ...d.currentMedications, psychiatricMedications: [{ name: 'Mirtazapine', dose: '30 mg', frequency: 'At night' }] };
	d.treatmentHistory = { ...d.treatmentHistory, previousTherapy: 'yes', previousHospitalizations: 'yes', hospitalizationDetails: 'Inpatient 2022', currentProviders: 'Community mental health team' };
	d.socialFunctional = { ...d.socialFunctional, employmentStatus: 'unemployed', relationshipStatus: 'divorced', housingStatus: 'unstable', supportSystem: 'limited', functionalImpairment: 'severe' };
	return d;
}

/** A critical presentation: maximal scores, active SI with plan, homeless, no support. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1969-11-03',
		sex: 'male',
		emergencyContactName: 'Susan Williams',
		emergencyContactPhone: '07700 900444',
		emergencyContactRelationship: 'Sister'
	};
	d.phqResponses = {
		interest: 3, depression: 3, sleep: 3, energy: 3, appetite: 3,
		selfEsteem: 3, concentration: 3, psychomotor: 3, suicidalThoughts: 3
	};
	d.gadResponses = {
		nervousness: 3, uncontrollableWorry: 3, excessiveWorry: 3, troubleRelaxing: 3,
		restlessness: 3, irritability: 3, fearfulness: 3
	};
	d.moodAffect = { ...d.moodAffect, currentMood: 'very-low', sleepQuality: 'very-poor', appetiteChanges: 'significant-decrease', energyLevel: 'very-low', concentration: 'very-poor' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'active-with-plan', suicidalIdeationDetails: 'Has identified means', selfHarm: 'current', harmToOthers: 'thoughts', harmToOthersDetails: 'Towards former partner', hasSafetyPlan: 'no' };
	d.substanceUse = { ...d.substanceUse, alcoholFrequency: '4-or-more-per-week', alcoholQuantity: '10-or-more', bingeDrinking: 'daily-or-almost', drugUse: 'regular', drugDetails: 'Heroin', tobaccoUse: 'current' };
	d.socialFunctional = { ...d.socialFunctional, employmentStatus: 'disabled', relationshipStatus: 'separated', housingStatus: 'homeless', supportSystem: 'none', functionalImpairment: 'severe' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MH-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: minimal() },
	{ id: 'MH-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'MH-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'MH-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		phq9Score: g.phq9.score,
		phq9Severity: g.phq9.severity,
		gad7Score: g.gad7.score,
		gad7Severity: g.gad7.severity,
		safetyFlag: g.additionalFlags.some((f) => f.priority === 'high'),
		flagCount: g.additionalFlags.length
	};
});
