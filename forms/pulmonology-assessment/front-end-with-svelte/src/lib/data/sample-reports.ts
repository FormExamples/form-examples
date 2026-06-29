import type { AssessmentData, GoldStage, AbcdGroup } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/gold-grader';
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
	goldStage: GoldStage;
	abcdGroup: AbcdGroup;
	fev1Predicted: number | null;
	smokerFlag: boolean;
	oxygenFlag: boolean;
	flagCount: number;
}

/** GOLD I — mild airflow limitation, low symptom burden, ex-smoker. */
function goldI(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1962-04-12', sex: 'male', weight: 82, height: 178, bmi: 25.9 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Mild exertional breathlessness', symptomDuration: '6 months', dyspnoeaGradeMRC: '1' };
	d.spirometry = { ...d.spirometry, fev1: 2.9, fvc: 4.4, fev1FvcRatio: 0.66, fev1PercentPredicted: 86, bronchodilatorResponse: 'no' };
	d.symptomAssessment = { ...d.symptomAssessment, catScore: 6, mmrcDyspnoea: '1', coughFrequency: 'occasional', sputumProduction: 'occasional' };
	d.exacerbationHistory = { ...d.exacerbationHistory, exacerbationsPerYear: 0, hospitalizationsPerYear: 0, icuAdmissions: 0, intubationHistory: 'no' };
	d.currentMedications = { ...d.currentMedications, saba: 'yes', laba: 'no', lama: 'no', ics: 'no', oralCorticosteroids: 'no', oxygenTherapy: 'no', nebulizers: 'no' };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'ex', packYears: 20, occupationalExposures: 'no', biomassFuelExposure: 'no' };
	d.functionalStatus = { ...d.functionalStatus, exerciseTolerance: 'vigorous-exercise', sixMinuteWalkDistance: 480, oxygenSaturationRest: 97, oxygenSaturationExertion: 95, adlLimitations: 'no' };
	return d;
}

/** GOLD II — moderate limitation, current smoker, allergy documented. */
function goldII(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1957-09-30', sex: 'female', weight: 68, height: 162, bmi: 25.9 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Cough and breathlessness on exertion', symptomDuration: '2 years', dyspnoeaGradeMRC: '2' };
	d.spirometry = { ...d.spirometry, fev1: 1.9, fvc: 3.4, fev1FvcRatio: 0.56, fev1PercentPredicted: 64, bronchodilatorResponse: 'no' };
	d.symptomAssessment = { ...d.symptomAssessment, catScore: 14, mmrcDyspnoea: '2', coughFrequency: 'daily', sputumProduction: 'daily' };
	d.exacerbationHistory = { ...d.exacerbationHistory, exacerbationsPerYear: 1, hospitalizationsPerYear: 0, icuAdmissions: 0, intubationHistory: 'no' };
	d.currentMedications = { ...d.currentMedications, saba: 'yes', laba: 'yes', lama: 'yes', ics: 'no', oralCorticosteroids: 'no', oxygenTherapy: 'no', nebulizers: 'no' };
	d.allergies = [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }];
	d.comorbidities = { ...d.comorbidities, cardiovascularDisease: 'yes', cardiovascularDetails: 'Hypertension' };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'current', packYears: 30, occupationalExposures: 'no', biomassFuelExposure: 'no' };
	d.functionalStatus = { ...d.functionalStatus, exerciseTolerance: 'moderate-exercise', sixMinuteWalkDistance: 390, oxygenSaturationRest: 95, oxygenSaturationExertion: 91, adlLimitations: 'no' };
	return d;
}

/** GOLD III — severe limitation, frequent exacerbations, oral steroids. */
function goldIII(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1949-01-22', sex: 'female', weight: 58, height: 160, bmi: 22.7 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Severe breathlessness, frequent chest infections', symptomDuration: '5 years', dyspnoeaGradeMRC: '3' };
	d.spirometry = { ...d.spirometry, fev1: 1.1, fvc: 2.6, fev1FvcRatio: 0.42, fev1PercentPredicted: 42, bronchodilatorResponse: 'yes' };
	d.symptomAssessment = { ...d.symptomAssessment, catScore: 22, mmrcDyspnoea: '3', coughFrequency: 'persistent', sputumProduction: 'copious' };
	d.exacerbationHistory = { ...d.exacerbationHistory, exacerbationsPerYear: 3, hospitalizationsPerYear: 1, icuAdmissions: 0, intubationHistory: 'no' };
	d.currentMedications = { ...d.currentMedications, saba: 'yes', laba: 'yes', lama: 'yes', ics: 'yes', oralCorticosteroids: 'yes', oxygenTherapy: 'no', nebulizers: 'yes' };
	d.comorbidities = { ...d.comorbidities, osteoporosis: 'yes', depression: 'yes' };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'ex', packYears: 45, occupationalExposures: 'yes', occupationalDetails: 'Coal mining', biomassFuelExposure: 'no' };
	d.functionalStatus = { ...d.functionalStatus, exerciseTolerance: 'light-housework', sixMinuteWalkDistance: 240, oxygenSaturationRest: 93, oxygenSaturationExertion: 86, adlLimitations: 'yes', adlDetails: 'Breathless climbing stairs' };
	return d;
}

/** GOLD IV — very severe limitation, LTOT, prior ICU/intubation. */
function goldIV(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1952-11-03', sex: 'male', weight: 54, height: 175, bmi: 17.6 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Breathless at rest', symptomDuration: '8 years', dyspnoeaGradeMRC: '4' };
	d.spirometry = { ...d.spirometry, fev1: 0.6, fvc: 1.9, fev1FvcRatio: 0.32, fev1PercentPredicted: 24, bronchodilatorResponse: 'no' };
	d.symptomAssessment = { ...d.symptomAssessment, catScore: 30, mmrcDyspnoea: '4', coughFrequency: 'persistent', sputumProduction: 'copious' };
	d.exacerbationHistory = { ...d.exacerbationHistory, exacerbationsPerYear: 4, hospitalizationsPerYear: 2, icuAdmissions: 1, intubationHistory: 'yes' };
	d.currentMedications = { ...d.currentMedications, saba: 'yes', laba: 'yes', lama: 'yes', ics: 'yes', oralCorticosteroids: 'yes', oxygenTherapy: 'yes', oxygenLitresPerMinute: 2, nebulizers: 'yes' };
	d.allergies = [{ allergen: 'Contrast media', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }];
	d.comorbidities = { ...d.comorbidities, cardiovascularDisease: 'yes', cardiovascularDetails: 'Cor pulmonale', lungCancer: 'no', depression: 'yes' };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'current', packYears: 60, occupationalExposures: 'no', biomassFuelExposure: 'yes' };
	d.functionalStatus = { ...d.functionalStatus, exerciseTolerance: 'unable', sixMinuteWalkDistance: 120, oxygenSaturationRest: 88, oxygenSaturationExertion: 80, adlLimitations: 'yes', adlDetails: 'Dependent for most ADLs' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: goldI() },
	{ id: 'PA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: goldII() },
	{ id: 'PA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: goldIII() },
	{ id: 'PA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: goldIV() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		goldStage: g.goldStage,
		abcdGroup: g.abcdGroup,
		fev1Predicted: s.data.spirometry.fev1PercentPredicted,
		smokerFlag: s.data.smokingExposures.smokingStatus === 'current',
		oxygenFlag: s.data.currentMedications.oxygenTherapy === 'yes',
		flagCount: g.additionalFlags.length
	};
});
