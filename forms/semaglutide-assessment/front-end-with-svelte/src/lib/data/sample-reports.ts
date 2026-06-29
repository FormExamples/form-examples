import type { AssessmentData, EligibilityStatus } from '$lib/engine/types';
import { evaluateEligibility } from '$lib/engine/eligibility-grader';
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
	eligibilityStatus: EligibilityStatus;
	bmi: number | null;
	bmiCategory: string;
	primaryIndication: string;
	absoluteCount: number;
	relativeCount: number;
	flagCount: number;
}

/** An eligible patient: type 2 diabetes, no contraindications. */
function eligible(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dob: '1968-03-15', sex: 'male' };
	d.indicationGoals = { ...d.indicationGoals, primaryIndication: 'type2-diabetes', weightLossGoalPercent: 10, motivationLevel: 'high', previousWeightLossAttempts: 'Diet and exercise' };
	d.bodyComposition = { ...d.bodyComposition, heightCm: 178, weightKg: 102, waistCircumference: 112 };
	d.metabolicProfile = { ...d.metabolicProfile, hba1c: 7.6, fastingGlucose: 8, totalCholesterol: 5.2, ldl: 3.1, hdl: 1.2, triglycerides: 1.9, thyroidFunction: 'Normal' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bloodPressureSystolic: 132, bloodPressureDiastolic: 82, heartRate: 74, previousMI: 'no', heartFailure: 'no', peripheralVascularDisease: 'no', cerebrovascularDisease: 'no' };
	d.contraindicationsScreening = {
		personalHistoryMTC: 'no', familyHistoryMTC: 'no', men2Syndrome: 'no', pancreatitisHistory: 'no',
		severeGIDisease: 'no', pregnancyPlanned: 'no', breastfeeding: 'no', type1Diabetes: 'no',
		diabeticRetinopathySevere: 'no', allergySemaglutide: 'no'
	};
	d.gastrointestinalHistory = { ...d.gastrointestinalHistory, nauseaHistory: 'no', vomitingHistory: 'no', gastroparesis: 'no', gallstoneHistory: 'no', ibd: 'no', gerdHistory: 'no', previousBariatricSurgery: 'no' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, eatingDisorderHistory: 'no', depressionHistory: 'no', suicidalIdeation: 'no', bodyDysmorphia: 'no', bingeDrinkingHistory: 'no' };
	d.treatmentPlan = { ...d.treatmentPlan, selectedFormulation: 'subcutaneous-weekly', startingDose: '0.25 mg weekly', titrationSchedule: 'Standard 4-weekly', monitoringFrequency: 'Monthly', dietaryGuidance: 'yes', exercisePlan: 'yes', followUpWeeks: 4 };
	return d;
}

/** A conditional patient: weight management, gallstone history + insulin flag. */
function conditionalGI(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dob: '1975-07-22', sex: 'female' };
	d.indicationGoals = { ...d.indicationGoals, primaryIndication: 'weight-management', weightLossGoalPercent: 15, motivationLevel: 'high', previousWeightLossAttempts: 'Multiple diets' };
	d.bodyComposition = { ...d.bodyComposition, heightCm: 162, weightKg: 92, waistCircumference: 104 };
	d.metabolicProfile = { ...d.metabolicProfile, hba1c: 6.1, fastingGlucose: 5.8, totalCholesterol: 5.6, ldl: 3.4, hdl: 1.1, triglycerides: 2.4, thyroidFunction: 'Normal' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bloodPressureSystolic: 138, bloodPressureDiastolic: 86, heartRate: 78, previousMI: 'no', heartFailure: 'no', peripheralVascularDisease: 'no', cerebrovascularDisease: 'no' };
	d.contraindicationsScreening = {
		personalHistoryMTC: 'no', familyHistoryMTC: 'no', men2Syndrome: 'no', pancreatitisHistory: 'no',
		severeGIDisease: 'no', pregnancyPlanned: 'no', breastfeeding: 'no', type1Diabetes: 'no',
		diabeticRetinopathySevere: 'no', allergySemaglutide: 'no'
	};
	d.gastrointestinalHistory = { ...d.gastrointestinalHistory, nauseaHistory: 'no', vomitingHistory: 'no', gastroparesis: 'no', gallstoneHistory: 'yes', ibd: 'no', gerdHistory: 'yes', previousBariatricSurgery: 'no' };
	d.currentMedications = { ...d.currentMedications, insulinTherapy: 'yes', insulinType: 'Basal insulin glargine', sulfonylureas: 'no' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, eatingDisorderHistory: 'no', depressionHistory: 'no', suicidalIdeation: 'no', bodyDysmorphia: 'no', bingeDrinkingHistory: 'no' };
	d.treatmentPlan = { ...d.treatmentPlan, selectedFormulation: 'subcutaneous-weekly', startingDose: '0.25 mg weekly', titrationSchedule: 'Standard 4-weekly', monitoringFrequency: 'Monthly', dietaryGuidance: 'yes', exercisePlan: 'yes', followUpWeeks: 4 };
	return d;
}

/** A conditional patient: weight management, eating-disorder history relative contraindication. */
function conditionalMH(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dob: '1952-11-08', sex: 'female' };
	d.indicationGoals = { ...d.indicationGoals, primaryIndication: 'weight-management', weightLossGoalPercent: 12, motivationLevel: 'moderate', previousWeightLossAttempts: 'Slimming groups' };
	d.bodyComposition = { ...d.bodyComposition, heightCm: 160, weightKg: 88, waistCircumference: 102 };
	d.metabolicProfile = { ...d.metabolicProfile, hba1c: 8.4, fastingGlucose: 9.2, totalCholesterol: 5.9, ldl: 3.6, hdl: 1.0, triglycerides: 2.8, thyroidFunction: 'Normal' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bloodPressureSystolic: 144, bloodPressureDiastolic: 90, heartRate: 80, previousMI: 'yes', heartFailure: 'no', peripheralVascularDisease: 'no', cerebrovascularDisease: 'no' };
	d.contraindicationsScreening = {
		personalHistoryMTC: 'no', familyHistoryMTC: 'no', men2Syndrome: 'no', pancreatitisHistory: 'no',
		severeGIDisease: 'no', pregnancyPlanned: 'no', breastfeeding: 'no', type1Diabetes: 'no',
		diabeticRetinopathySevere: 'no', allergySemaglutide: 'no'
	};
	d.gastrointestinalHistory = { ...d.gastrointestinalHistory, nauseaHistory: 'no', vomitingHistory: 'no', gastroparesis: 'no', gallstoneHistory: 'no', ibd: 'no', gerdHistory: 'no', previousBariatricSurgery: 'no' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, eatingDisorderHistory: 'yes', eatingDisorderDetails: 'Bulimia nervosa, treated 2010', depressionHistory: 'yes', suicidalIdeation: 'no', bodyDysmorphia: 'no', bingeDrinkingHistory: 'no' };
	d.treatmentPlan = { ...d.treatmentPlan, selectedFormulation: 'oral-daily', startingDose: '3 mg daily', titrationSchedule: 'Standard', monitoringFrequency: 'Monthly', dietaryGuidance: 'yes', exercisePlan: 'no', followUpWeeks: 4 };
	return d;
}

/** An ineligible patient: personal history of medullary thyroid carcinoma. */
function ineligible(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dob: '1980-01-30', sex: 'male' };
	d.indicationGoals = { ...d.indicationGoals, primaryIndication: 'weight-management', weightLossGoalPercent: 20, motivationLevel: 'high', previousWeightLossAttempts: 'Diet' };
	d.bodyComposition = { ...d.bodyComposition, heightCm: 180, weightKg: 125, waistCircumference: 124 };
	d.metabolicProfile = { ...d.metabolicProfile, hba1c: 6.4, fastingGlucose: 6.0, totalCholesterol: 5.4, ldl: 3.2, hdl: 1.0, triglycerides: 2.6, thyroidFunction: 'Normal' };
	d.cardiovascularRisk = { ...d.cardiovascularRisk, bloodPressureSystolic: 140, bloodPressureDiastolic: 88, heartRate: 76, previousMI: 'no', heartFailure: 'no', peripheralVascularDisease: 'no', cerebrovascularDisease: 'no' };
	d.contraindicationsScreening = {
		personalHistoryMTC: 'yes', familyHistoryMTC: 'no', men2Syndrome: 'no', pancreatitisHistory: 'no',
		severeGIDisease: 'no', pregnancyPlanned: 'no', breastfeeding: 'no', type1Diabetes: 'no',
		diabeticRetinopathySevere: 'no', allergySemaglutide: 'no'
	};
	d.gastrointestinalHistory = { ...d.gastrointestinalHistory, nauseaHistory: 'no', vomitingHistory: 'no', gastroparesis: 'no', gallstoneHistory: 'no', ibd: 'no', gerdHistory: 'no', previousBariatricSurgery: 'no' };
	d.mentalHealthScreening = { ...d.mentalHealthScreening, eatingDisorderHistory: 'no', depressionHistory: 'no', suicidalIdeation: 'no', bodyDysmorphia: 'no', bingeDrinkingHistory: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: eligible() },
	{ id: 'SA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: conditionalGI() },
	{ id: 'SA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: conditionalMH() },
	{ id: 'SA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: ineligible() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = evaluateEligibility(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		eligibilityStatus: g.eligibilityStatus,
		bmi: g.bmi,
		bmiCategory: g.bmiCategoryLabel,
		primaryIndication: s.data.indicationGoals.primaryIndication,
		absoluteCount: g.absoluteContraindications.length,
		relativeCount: g.relativeContraindications.length,
		flagCount: flags.length
	};
});
