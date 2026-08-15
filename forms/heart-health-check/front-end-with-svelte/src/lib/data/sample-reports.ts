import type { AssessmentData } from '#lib/engine/types.js';
import { gradeAssessment } from '#lib/engine/risk-grader.js';
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
	age: number | null;
	sex: string;
	riskCategory: string;
	tenYearRisk: number;
	heartAge: number | null;
	flagCount: number;
}

/** A low-risk check: younger non-smoker, normal BP and cholesterol. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		fullName: 'Jones, Margaret',
		dateOfBirth: '1978-05-14',
		nhsNumber: '384 615 7230',
		gpName: 'Dr A Patel'
	};
	d.demographicsEthnicity = { ...d.demographicsEthnicity, age: 48, sex: 'female', ethnicity: 'whiteBritish', townsendDeprivation: 0 };
	d.bloodPressure = { ...d.bloodPressure, systolicBP: 118, diastolicBP: 76, onBPTreatment: 'no' };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 4.5, hdlCholesterol: 1.6, totalHDLRatio: 2.8, onStatin: 'no' };
	d.smokingAlcohol = { ...d.smokingAlcohol, smokingStatus: 'nonSmoker', alcoholUnitsPerWeek: 6 };
	d.physicalActivityDiet = { ...d.physicalActivityDiet, physicalActivityMinutesPerWeek: 200, activityIntensity: 'moderate' };
	d.bodyMeasurements = { ...d.bodyMeasurements, heightCm: 165, weightKg: 62, bmi: 22.8 };
	return d;
}

/** A moderate-risk check: middle-aged ex-smoker with raised BP and ratio. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		fullName: 'Taylor, James',
		dateOfBirth: '1968-02-09',
		nhsNumber: '835 162 4097',
		gpName: 'Dr B Singh'
	};
	d.demographicsEthnicity = { ...d.demographicsEthnicity, age: 58, sex: 'male', ethnicity: 'whiteBritish', townsendDeprivation: 2 };
	d.bloodPressure = { ...d.bloodPressure, systolicBP: 150, diastolicBP: 92, onBPTreatment: 'yes', numberOfBPMedications: 1 };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 6.2, hdlCholesterol: 1.0, totalHDLRatio: 6.2, onStatin: 'no' };
	d.smokingAlcohol = { ...d.smokingAlcohol, smokingStatus: 'exSmoker', yearsSinceQuit: 5, alcoholUnitsPerWeek: 18 };
	d.familyHistory = { ...d.familyHistory, familyCVDUnder60: 'yes', familyCVDRelationship: 'father' };
	d.physicalActivityDiet = { ...d.physicalActivityDiet, physicalActivityMinutesPerWeek: 60, activityIntensity: 'light' };
	d.bodyMeasurements = { ...d.bodyMeasurements, heightCm: 176, weightKg: 92, bmi: 29.7 };
	return d;
}

/** A high-risk check: older smoker with diabetes and high BP. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		fullName: 'Smith, John',
		dateOfBirth: '1964-03-01',
		nhsNumber: '943 476 5919',
		gpName: 'Dr C Okafor'
	};
	d.demographicsEthnicity = { ...d.demographicsEthnicity, age: 62, sex: 'male', ethnicity: 'southAsian', townsendDeprivation: 4 };
	d.bloodPressure = { ...d.bloodPressure, systolicBP: 168, systolicBPSD: 12, diastolicBP: 98, onBPTreatment: 'yes', numberOfBPMedications: 2 };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 6.8, hdlCholesterol: 0.9, totalHDLRatio: 7.6, onStatin: 'yes' };
	d.medicalConditions = { ...d.medicalConditions, hasDiabetes: 'type2', hasChronicKidneyDisease: 'yes' };
	d.smokingAlcohol = { ...d.smokingAlcohol, smokingStatus: 'moderateSmoker', cigarettesPerDay: 15, alcoholUnitsPerWeek: 12 };
	d.familyHistory = { ...d.familyHistory, familyCVDUnder60: 'yes', familyCVDRelationship: 'brother' };
	d.physicalActivityDiet = { ...d.physicalActivityDiet, physicalActivityMinutesPerWeek: 20, activityIntensity: 'light' };
	d.bodyMeasurements = { ...d.bodyMeasurements, heightCm: 174, weightKg: 98, bmi: 32.4, waistCircumferenceCm: 112 };
	return d;
}

/** A very high-risk check: severe hypertension, heavy smoker, type 2 diabetes, AF. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		fullName: 'Clark, George',
		dateOfBirth: '1953-08-20',
		nhsNumber: '386 219 5740',
		gpName: 'Dr D Murphy'
	};
	d.demographicsEthnicity = { ...d.demographicsEthnicity, age: 72, sex: 'male', ethnicity: 'whiteBritish', townsendDeprivation: 6 };
	d.bloodPressure = { ...d.bloodPressure, systolicBP: 186, systolicBPSD: 16, diastolicBP: 104, onBPTreatment: 'yes', numberOfBPMedications: 3 };
	d.cholesterol = { ...d.cholesterol, totalCholesterol: 7.4, hdlCholesterol: 0.8, totalHDLRatio: 9.3, onStatin: 'no' };
	d.medicalConditions = { ...d.medicalConditions, hasDiabetes: 'type2', hasAtrialFibrillation: 'yes', hasChronicKidneyDisease: 'yes', hasRheumatoidArthritis: 'yes' };
	d.smokingAlcohol = { ...d.smokingAlcohol, smokingStatus: 'heavySmoker', cigarettesPerDay: 25, alcoholUnitsPerWeek: 30 };
	d.familyHistory = { ...d.familyHistory, familyCVDUnder60: 'yes', familyCVDRelationship: 'father' };
	d.physicalActivityDiet = { ...d.physicalActivityDiet, physicalActivityMinutesPerWeek: 10, activityIntensity: 'sedentary' };
	d.bodyMeasurements = { ...d.bodyMeasurements, heightCm: 172, weightKg: 122, bmi: 41.2, waistCircumferenceCm: 128 };
	d.reviewCalculate = { ...d.reviewCalculate, clinicianName: 'Dr D Murphy', reviewDate: '2026-02-15', auditScore: 18 };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'HHC-2026-0001', patientName: 'Jones, Margaret', assessedDate: '2026-03-08', data: lowRisk() },
	{ id: 'HHC-2026-0002', patientName: 'Taylor, James', assessedDate: '2026-03-06', data: moderateRisk() },
	{ id: 'HHC-2026-0003', patientName: 'Smith, John', assessedDate: '2026-03-01', data: highRisk() },
	{ id: 'HHC-2026-0004', patientName: 'Clark, George', assessedDate: '2026-02-15', data: veryHighRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		age: s.data.demographicsEthnicity.age,
		sex: s.data.demographicsEthnicity.sex,
		riskCategory: g.riskCategory,
		tenYearRisk: g.tenYearRiskPercent,
		heartAge: g.heartAge,
		flagCount: g.additionalFlags.length
	};
});
