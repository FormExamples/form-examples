import type { AssessmentData } from '$lib/engine/types';
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
	riskPercent: number;
	riskCategory: string;
	smokingStatus: string;
	smokerFlag: boolean;
	onStatinFlag: boolean;
	flagCount: number;
}

/** A low-risk profile: middle-aged non-smoker, favourable cholesterol, no treatment. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'John Smith', dateOfBirth: '1976-04-12', nhsNumber: '485 777 3456' };
	d.demographics = { ...d.demographics, age: 49, sex: 'male', ethnicity: 'whitebritish', heightCm: 178, weightKg: 78 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'never' };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 118, diastolicBp: 76, onBpTreatment: 'no' };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 180, hdlCholesterol: 60, cholesterolUnit: 'mgDl', fastingSample: 'yes' };
	d.medicalHistory = { ...d.medicalHistory, hasDiabetes: 'no', hasPriorChd: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, physicalActivity: 'moderate', alcoholConsumption: 'moderate', dietQuality: 'good' };
	d.currentMedications = { ...d.currentMedications, onStatin: 'no', onAspirin: 'no' };
	return d;
}

/** An intermediate-risk profile: older male, raised cholesterol, treated hypertension. */
function intermediateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'Robert Hughes', dateOfBirth: '1959-09-30', nhsNumber: '602 113 9087' };
	d.demographics = { ...d.demographics, age: 66, sex: 'male', ethnicity: 'whiteother', heightCm: 175, weightKg: 88 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'former', yearsSinceQuit: 8 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 142, diastolicBp: 88, onBpTreatment: 'yes', bpMedicationName: 'Amlodipine 5 mg' };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 235, hdlCholesterol: 42, cholesterolUnit: 'mgDl', fastingSample: 'yes' };
	d.medicalHistory = { ...d.medicalHistory, hasDiabetes: 'no', hasPriorChd: 'no' };
	d.familyHistory = { ...d.familyHistory, familyChdHistory: 'yes', familyChdAgeOnset: '55to65' };
	d.lifestyleFactors = { ...d.lifestyleFactors, physicalActivity: 'light', alcoholConsumption: 'moderate', dietQuality: 'average' };
	d.currentMedications = { ...d.currentMedications, onStatin: 'no', onAspirin: 'no', onAntihypertensive: 'yes', antihypertensiveName: 'Amlodipine 5 mg' };
	return d;
}

/** A high-risk profile: older female smoker, high cholesterol, treated hypertension. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'Margaret Jones', dateOfBirth: '1953-01-22', nhsNumber: '714 920 5512' };
	d.demographics = { ...d.demographics, age: 72, sex: 'female', ethnicity: 'whitebritish', heightCm: 160, weightKg: 84 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'current', cigarettesPerDay: 15, yearsSmoked: 45 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 168, diastolicBp: 96, onBpTreatment: 'yes', bpMedicationName: 'Ramipril 10 mg' };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 290, hdlCholesterol: 38, cholesterolUnit: 'mgDl', fastingSample: 'yes' };
	d.medicalHistory = { ...d.medicalHistory, hasDiabetes: 'no', hasPriorChd: 'no' };
	d.familyHistory = { ...d.familyHistory, familyChdHistory: 'yes', familyChdAgeOnset: 'under55' };
	d.lifestyleFactors = { ...d.lifestyleFactors, physicalActivity: 'sedentary', alcoholConsumption: 'moderate', dietQuality: 'poor', bmi: 32.8 };
	d.currentMedications = { ...d.currentMedications, onStatin: 'no', onAspirin: 'no', onAntihypertensive: 'yes', antihypertensiveName: 'Ramipril 10 mg' };
	return d;
}

/** A very-high-risk profile: older male smoker, severe hypercholesterolemia, untreated severe BP. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, fullName: 'David Williams', dateOfBirth: '1950-11-03', nhsNumber: '388 401 7765' };
	d.demographics = { ...d.demographics, age: 75, sex: 'male', ethnicity: 'whitebritish', heightCm: 180, weightKg: 102 };
	d.smokingHistory = { ...d.smokingHistory, smokingStatus: 'current', cigarettesPerDay: 25, yearsSmoked: 50 };
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 184, diastolicBp: 104, onBpTreatment: 'no' };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 312, hdlCholesterol: 30, cholesterolUnit: 'mgDl', fastingSample: 'yes' };
	d.medicalHistory = { ...d.medicalHistory, hasDiabetes: 'no', hasPriorChd: 'no' };
	d.familyHistory = { ...d.familyHistory, familyChdHistory: 'yes', familyChdAgeOnset: 'under55' };
	d.lifestyleFactors = { ...d.lifestyleFactors, physicalActivity: 'sedentary', alcoholConsumption: 'heavy', dietQuality: 'poor', bmi: 31.5 };
	d.currentMedications = { ...d.currentMedications, onStatin: 'no', onAspirin: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FR-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'FR-2026-0002', patientName: 'Hughes, Robert', assessedDate: '2026-06-12', data: intermediateRisk() },
	{ id: 'FR-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'FR-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: veryHighRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRisk(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		riskPercent: g.tenYearRiskPercent,
		riskCategory: g.riskCategory,
		smokingStatus: s.data.smokingHistory.smokingStatus,
		smokerFlag: s.data.smokingHistory.smokingStatus === 'current',
		onStatinFlag: s.data.currentMedications.onStatin === 'yes',
		flagCount: flags.length
	};
});
