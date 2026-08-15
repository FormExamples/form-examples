import type { AssessmentData } from '#lib/engine/types.js';
import { calculateRisk } from '#lib/engine/risk-grader.js';
import { isSmoker } from '#lib/engine/utils.js';
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
	riskCategory: string;
	tenYearRisk: number;
	thirtyYearRisk: number;
	diabetes: boolean;
	smoker: boolean;
	flagCount: number;
}

/** A low-risk assessment: young, healthy, no risk factors. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'John Smith', nhsNumber: '943 476 5919' };
	d.demographics = { ...d.demographics, age: 35, sex: 'male', ethnicity: 'white', heightCm: 178, weightKg: 78 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 110, diastolicBp: 70, onAntihypertensive: 'no' };
	d.cholesterolLipids = { ...d.cholesterolLipids, totalCholesterol: 180, hdlCholesterol: 65, onStatin: 'no' };
	d.metabolicHealth = { ...d.metabolicHealth, hasDiabetes: 'no', bmi: 22 };
	d.renalFunction = { ...d.renalFunction, egfr: 100 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'never' };
	d.medicalHistory = { ...d.medicalHistory, hasKnownCvd: 'no' };
	return d;
}

/** A borderline-risk assessment: several mild risk factors. */
function borderlineRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'Emma Robinson', nhsNumber: '742 051 3896' };
	d.demographics = { ...d.demographics, age: 60, sex: 'female', ethnicity: 'white', heightCm: 165, weightKg: 74 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 135, diastolicBp: 82, onAntihypertensive: 'no' };
	d.cholesterolLipids = { ...d.cholesterolLipids, totalCholesterol: 210, hdlCholesterol: 48, onStatin: 'no' };
	d.metabolicHealth = { ...d.metabolicHealth, hasDiabetes: 'no', bmi: 27 };
	d.renalFunction = { ...d.renalFunction, egfr: 75 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'former', yearsSinceQuit: 8 };
	d.medicalHistory = { ...d.medicalHistory, hasKnownCvd: 'no', familyCvdHistory: 'yes', familyCvdDetails: 'Father MI age 62' };
	return d;
}

/** An intermediate-risk assessment: diabetes, hypertension, raised lipids. */
function intermediateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'Robert Wilson', nhsNumber: '608 341 2975' };
	d.demographics = { ...d.demographics, age: 55, sex: 'male', ethnicity: 'asian', heightCm: 172, weightKg: 83 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 145, diastolicBp: 90, onAntihypertensive: 'yes', numberOfBpMedications: 1 };
	d.cholesterolLipids = { ...d.cholesterolLipids, totalCholesterol: 245, hdlCholesterol: 45, ldlCholesterol: 160, onStatin: 'no' };
	d.metabolicHealth = { ...d.metabolicHealth, hasDiabetes: 'yes', diabetesType: 'type2', hba1cValue: 7.8, hba1cUnit: 'percent', bmi: 28 };
	d.renalFunction = { ...d.renalFunction, egfr: 75, urineAcr: 12 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'never' };
	d.medicalHistory = { ...d.medicalHistory, hasKnownCvd: 'no' };
	d.currentMedications = { ...d.currentMedications, onDiabetesMedication: 'yes' };
	return d;
}

/** A high-risk assessment: many uncontrolled factors. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'George Clark', nhsNumber: '386 219 5740' };
	d.demographics = { ...d.demographics, age: 70, sex: 'male', ethnicity: 'white', heightCm: 175, weightKg: 110 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 185, diastolicBp: 100, onAntihypertensive: 'yes', numberOfBpMedications: 2 };
	d.cholesterolLipids = { ...d.cholesterolLipids, totalCholesterol: 290, hdlCholesterol: 32, ldlCholesterol: 205, onStatin: 'no' };
	d.metabolicHealth = { ...d.metabolicHealth, hasDiabetes: 'yes', diabetesType: 'type2', hba1cValue: 9.4, hba1cUnit: 'percent', bmi: 36 };
	d.renalFunction = { ...d.renalFunction, egfr: 25, urineAcr: 320, ckdStage: 'stage4' };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'current', cigarettesPerDay: 25, yearsSmoked: 45 };
	d.medicalHistory = { ...d.medicalHistory, hasKnownCvd: 'no', atrialFibrillation: 'yes' };
	d.currentMedications = { ...d.currentMedications, onDiabetesMedication: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PR-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'PR-2026-0002', patientName: 'Robinson, Emma', assessedDate: '2026-06-12', data: borderlineRisk() },
	{ id: 'PR-2026-0003', patientName: 'Wilson, Robert', assessedDate: '2026-06-15', data: intermediateRisk() },
	{ id: 'PR-2026-0004', patientName: 'Clark, George', assessedDate: '2026-06-18', data: highRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRisk(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		riskCategory: g.riskCategory,
		tenYearRisk: g.tenYearRiskPercent,
		thirtyYearRisk: g.thirtyYearRiskPercent,
		diabetes: s.data.metabolicHealth.hasDiabetes === 'yes',
		smoker: isSmoker(s.data.smokingHistory.smokingStatus),
		flagCount: g.additionalFlags.length
	};
});
