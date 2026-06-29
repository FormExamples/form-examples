import type { AssessmentData, GAFScore, RiskLevel } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/gaf-grader';
import { gafBracketLabel } from '$lib/engine/utils';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

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
	gafScore: GAFScore;
	gafBracket: string;
	violenceRisk: RiskLevel;
	legalStatus: string;
	suicideFlag: boolean;
	flagCount: number;
}

/** A high-functioning assessment: minimal symptoms, voluntary, low risk. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1985-04-12',
		sex: 'male',
		legalStatus: 'voluntary'
	};
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Mild work-related stress', severity: 'mild' };
	d.mentalStatusExam = { ...d.mentalStatusExam, mood: 'euthymic', affect: 'congruent', thoughtProcess: 'linear', insight: 'full', judgement: 'intact' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'no', violenceRisk: 'none', safeguardingConcerns: 'no' };
	d.socialHistory = { ...d.socialHistory, housing: 'stable', employment: 'employed' };
	return d;
}

/** A moderate assessment: moderate depression, voluntary, moderate risk. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1972-09-30',
		sex: 'female',
		legalStatus: 'voluntary'
	};
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Low mood and poor sleep', severity: 'moderate' };
	d.psychiatricHistory = { ...d.psychiatricHistory, previousHospitalizations: 'no', previousSuicideAttempts: 'no' };
	d.mentalStatusExam = { ...d.mentalStatusExam, mood: 'depressed', affect: 'restricted', thoughtProcess: 'linear', insight: 'partial', judgement: 'intact' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'yes', suicidalPlan: 'no', violenceRisk: 'low', safeguardingConcerns: 'no' };
	d.moodAndAnxiety = { ...d.moodAndAnxiety, phq9Score: 16, gad7Score: 12 };
	d.currentMedications = { ...d.currentMedications, medications: [{ name: 'Sertraline', dose: '50 mg', frequency: 'once daily' }], compliance: 'yes' };
	d.socialHistory = { ...d.socialHistory, housing: 'stable', employment: 'unemployed' };
	return d;
}

/** A high-risk assessment: severe depression, prior attempts, active SI + plan. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1960-01-22',
		sex: 'female',
		legalStatus: 'voluntary'
	};
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Severe depression with hopelessness', severity: 'severe' };
	d.psychiatricHistory = { ...d.psychiatricHistory, previousHospitalizations: 'yes', previousSuicideAttempts: 'yes', suicideAttemptDetails: 'Overdose 2023', selfHarmHistory: 'yes' };
	d.mentalStatusExam = { ...d.mentalStatusExam, mood: 'depressed', affect: 'flat', thoughtProcess: 'circumstantial', insight: 'partial', judgement: 'impaired' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'yes', suicidalPlan: 'yes', suicidalIntent: 'no', suicidalMeans: 'yes', selfHarmCurrent: 'yes', violenceRisk: 'moderate', safeguardingConcerns: 'no' };
	d.moodAndAnxiety = { ...d.moodAndAnxiety, phq9Score: 23, gad7Score: 17 };
	d.currentMedications = { ...d.currentMedications, medications: [{ name: 'Venlafaxine', dose: '150 mg', frequency: 'once daily' }], compliance: 'no', complianceDetails: 'Stopped two weeks ago' };
	d.socialHistory = { ...d.socialHistory, housing: 'temporary', employment: 'disability' };
	return d;
}

/** A critical assessment: psychosis, involuntary admission, imminent violence risk. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1990-11-03',
		sex: 'male',
		legalStatus: 'involuntary'
	};
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Acute psychosis with paranoid delusions', severity: 'severe' };
	d.psychiatricHistory = { ...d.psychiatricHistory, previousHospitalizations: 'yes', previousSuicideAttempts: 'no' };
	d.mentalStatusExam = { ...d.mentalStatusExam, mood: 'irritable', affect: 'labile', thoughtProcess: 'loosening', perceptualDisturbances: 'yes', perceptualDetails: 'Auditory hallucinations', insight: 'none', judgement: 'poor' };
	d.riskAssessment = { ...d.riskAssessment, suicidalIdeation: 'no', violenceRisk: 'imminent', safeguardingConcerns: 'yes', safeguardingDetails: 'Vulnerable adult at home' };
	d.moodAndAnxiety = { ...d.moodAndAnxiety, psychoticSymptoms: 'yes', psychoticDetails: 'Persecutory delusions', maniaScreen: 'yes' };
	d.substanceUse = { ...d.substanceUse, drugUse: 'yes', drugDetails: 'Stimulant use', withdrawalRisk: 'yes', withdrawalDetails: 'Heavy alcohol use' };
	d.capacityAndConsent = { ...d.capacityAndConsent, decisionMakingCapacity: 'lacks-capacity' };
	d.socialHistory = { ...d.socialHistory, housing: 'homeless', employment: 'unemployed' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'PA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'PA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'PA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		gafScore: g.gafScore,
		gafBracket: gafBracketLabel(g.gafScore),
		violenceRisk: (s.data.riskAssessment.violenceRisk || 'none') as RiskLevel,
		legalStatus: s.data.demographics.legalStatus || 'voluntary',
		suicideFlag: s.data.riskAssessment.suicidalIdeation === 'yes',
		flagCount: g.additionalFlags.length
	};
});
