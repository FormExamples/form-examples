import type { AssessmentData, RiskLevel } from '$lib/engine/types';
import { calculateRisk } from '$lib/engine/risk-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
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
	gestationalWeeks: number | null;
	riskScore: number;
	riskLevel: RiskLevel;
	bpFlag: boolean;
	multipleFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: uncomplicated, normal vitals and labs. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Emma', lastName: 'Carter', dateOfBirth: '1996-03-18' };
	d.pregnancyDetails = { ...d.pregnancyDetails, gestationalWeeks: 24, estimatedDueDate: '2026-10-02', conceptionMethod: 'natural', multipleGestation: 'no', placentaLocation: 'posterior' };
	d.obstetricHistory = { ...d.obstetricHistory, gravida: 2, para: 1, abortions: 0, livingChildren: 1 };
	d.vitalSigns = { ...d.vitalSigns, bloodPressureSystolic: 118, bloodPressureDiastolic: 74, weight: 68, height: 166, bmi: 24.7, fundalHeight: 24, fetalHeartRate: 142 };
	d.laboratoryResults = { ...d.laboratoryResults, bloodType: 'O', rhFactor: 'positive', hemoglobin: 12.6, glucose: 4.9, gbs: 'no' };
	d.lifestyleNutrition = { ...d.lifestyleNutrition, smoking: 'no', alcohol: 'no', drugs: 'no', exercise: 'moderate', diet: 'good', folicAcid: 'yes' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, edinburghScore: 4, anxietyLevel: 'none', supportSystem: 'yes', domesticViolenceScreen: 'no' };
	return d;
}

/** A moderate-risk assessment: a few risk factors requiring monitoring. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Sofia', lastName: 'Nguyen', dateOfBirth: '1989-07-25' };
	d.pregnancyDetails = { ...d.pregnancyDetails, gestationalWeeks: 30, estimatedDueDate: '2026-08-20', conceptionMethod: 'ivf', multipleGestation: 'no', placentaLocation: 'anterior' };
	d.obstetricHistory = { ...d.obstetricHistory, gravida: 1, para: 0, abortions: 0, livingChildren: 0, previousComplications: { ...d.obstetricHistory.previousComplications, gestationalDiabetes: 'yes' } };
	d.medicalHistory = { ...d.medicalHistory, thyroid: 'yes' };
	d.vitalSigns = { ...d.vitalSigns, bloodPressureSystolic: 128, bloodPressureDiastolic: 82, weight: 88, height: 160, bmi: 34.4, fundalHeight: 30, fetalHeartRate: 150 };
	d.laboratoryResults = { ...d.laboratoryResults, bloodType: 'A', rhFactor: 'positive', hemoglobin: 11.4, glucose: 8.1, gbs: 'no' };
	d.lifestyleNutrition = { ...d.lifestyleNutrition, smoking: 'no', alcohol: 'no', drugs: 'no', exercise: 'light', diet: 'fair', folicAcid: 'yes' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, edinburghScore: 11, anxietyLevel: 'mild', supportSystem: 'yes', domesticViolenceScreen: 'no' };
	return d;
}

/** A high-risk assessment: hypertension, previous preeclampsia, abnormal labs. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Amara', lastName: 'Okafor', dateOfBirth: '1985-11-09' };
	d.pregnancyDetails = { ...d.pregnancyDetails, gestationalWeeks: 33, estimatedDueDate: '2026-07-30', conceptionMethod: 'natural', multipleGestation: 'no', placentaLocation: 'low-lying' };
	d.obstetricHistory = { ...d.obstetricHistory, gravida: 3, para: 1, abortions: 1, livingChildren: 1, previousComplications: { ...d.obstetricHistory.previousComplications, preeclampsia: 'yes', pretermBirth: 'yes' } };
	d.medicalHistory = { ...d.medicalHistory, hypertension: 'yes', diabetes: 'yes' };
	d.currentSymptoms = { ...d.currentSymptoms, headache: 'yes', edema: 'yes' };
	d.vitalSigns = { ...d.vitalSigns, bloodPressureSystolic: 148, bloodPressureDiastolic: 96, weight: 92, height: 158, bmi: 36.9, fundalHeight: 34, fetalHeartRate: 156 };
	d.laboratoryResults = { ...d.laboratoryResults, bloodType: 'B', rhFactor: 'negative', hemoglobin: 10.2, glucose: 8.6, gbs: 'yes' };
	d.lifestyleNutrition = { ...d.lifestyleNutrition, smoking: 'yes', alcohol: 'no', drugs: 'no', exercise: 'none', diet: 'fair', folicAcid: 'no' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, edinburghScore: 12, anxietyLevel: 'moderate', supportSystem: 'yes', domesticViolenceScreen: 'no' };
	return d;
}

/** A very-high-risk assessment: multiple severe factors and acute symptoms. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Helen', lastName: 'Robertson', dateOfBirth: '1981-02-14' };
	d.pregnancyDetails = { ...d.pregnancyDetails, gestationalWeeks: 29, estimatedDueDate: '2026-09-05', conceptionMethod: 'icsi', multipleGestation: 'yes', placentaLocation: 'previa' };
	d.obstetricHistory = { ...d.obstetricHistory, gravida: 4, para: 2, abortions: 1, livingChildren: 2, previousComplications: { preeclampsia: 'yes', gestationalDiabetes: 'yes', pretermBirth: 'yes', cesareanSection: 'yes' } };
	d.medicalHistory = { ...d.medicalHistory, hypertension: 'yes', diabetes: 'yes', autoimmune: 'yes', thyroid: 'yes' };
	d.currentSymptoms = { ...d.currentSymptoms, bleeding: 'yes', headache: 'yes', visionChanges: 'yes', edema: 'yes', reducedFetalMovement: 'yes' };
	d.vitalSigns = { ...d.vitalSigns, bloodPressureSystolic: 168, bloodPressureDiastolic: 112, weight: 98, height: 162, bmi: 37.3, fundalHeight: 30, fetalHeartRate: 168 };
	d.laboratoryResults = { ...d.laboratoryResults, bloodType: 'AB', rhFactor: 'negative', hemoglobin: 9.4, glucose: 9.8, gbs: 'yes' };
	d.lifestyleNutrition = { ...d.lifestyleNutrition, smoking: 'yes', alcohol: 'yes', drugs: 'yes', exercise: 'none', diet: 'poor', folicAcid: 'no' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, edinburghScore: 17, anxietyLevel: 'severe', supportSystem: 'no', domesticViolenceScreen: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Carter, Emma', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'PA-2026-0002', patientName: 'Nguyen, Sofia', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'PA-2026-0003', patientName: 'Okafor, Amara', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'PA-2026-0004', patientName: 'Robertson, Helen', assessedDate: '2026-06-18', data: veryHighRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRisk(s.data);
	const flags = detectAdditionalFlags(s.data);
	const bpFlag =
		(s.data.vitalSigns.bloodPressureSystolic !== null && s.data.vitalSigns.bloodPressureSystolic >= 140) ||
		(s.data.vitalSigns.bloodPressureDiastolic !== null && s.data.vitalSigns.bloodPressureDiastolic >= 90);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		gestationalWeeks: s.data.pregnancyDetails.gestationalWeeks,
		riskScore: g.riskScore,
		riskLevel: g.riskLevel,
		bpFlag,
		multipleFlag: s.data.pregnancyDetails.multipleGestation === 'yes',
		flagCount: flags.length
	};
});
