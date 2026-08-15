import type { AssessmentData, RiskCategory } from '#lib/engine/types.js';
import { gradeAssessment } from '#lib/engine/risk-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';
import { hba1cMmolMol, hasEstablishedCvd } from '#lib/engine/utils.js';

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
	riskCategory: RiskCategory;
	hba1cMmolMol: number | null;
	systolicBp: number | null;
	cvdFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: well controlled, no firing rules. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		fullName: 'John Smith',
		dateOfBirth: '1968-04-12',
		sex: 'male',
		nhsNumber: '943 476 5919',
		heightCm: 178,
		weightKg: 78,
		ethnicity: 'white'
	};
	d.diabetesHistory = {
		...d.diabetesHistory,
		diabetesType: 'type2',
		ageAtDiagnosis: 52,
		diabetesDurationYears: 6,
		hba1cValue: 45,
		hba1cUnit: 'mmolMol',
		fastingGlucose: 6.1,
		diabetesTreatment: 'oral'
	};
	d.bloodPressure = {
		...d.bloodPressure,
		systolicBp: 122,
		diastolicBp: 76,
		onAntihypertensive: 'no',
		bpAtTarget: 'yes'
	};
	d.lipidProfile = {
		...d.lipidProfile,
		totalCholesterol: 4.2,
		hdlCholesterol: 1.4,
		ldlCholesterol: 2.1,
		triglycerides: 1.2,
		onStatin: 'yes',
		statinName: 'Atorvastatin 20 mg'
	};
	d.renalFunction = { ...d.renalFunction, egfr: 88, urineAcr: 1.2, proteinuria: 'none', ckdStage: 'G2' };
	d.lifestyleFactors = {
		...d.lifestyleFactors,
		smokingStatus: 'never',
		physicalActivity: 'moderatelyActive',
		dietQuality: 'good',
		bmi: 24.6
	};
	d.currentMedications = { ...d.currentMedications, metformin: 'yes' };
	d.complicationsScreening = { ...d.complicationsScreening, retinopathyStatus: 'none' };
	return d;
}

/** A moderate-risk assessment: only low-severity rules fire. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		fullName: 'Priya Patel',
		dateOfBirth: '1959-09-30',
		sex: 'female',
		nhsNumber: '721 938 4102',
		heightCm: 162,
		weightKg: 70,
		ethnicity: 'asian'
	};
	d.diabetesHistory = {
		...d.diabetesHistory,
		diabetesType: 'type2',
		ageAtDiagnosis: 55,
		diabetesDurationYears: 8,
		hba1cValue: 50,
		hba1cUnit: 'mmolMol',
		diabetesTreatment: 'oral'
	};
	d.bloodPressure = { ...d.bloodPressure, systolicBp: 132, diastolicBp: 80, onAntihypertensive: 'no' };
	d.lipidProfile = {
		...d.lipidProfile,
		totalCholesterol: 5.0,
		hdlCholesterol: 1.3,
		ldlCholesterol: 2.4,
		triglycerides: 2.5,
		onStatin: 'yes'
	};
	d.renalFunction = { ...d.renalFunction, egfr: 78, urineAcr: 1.5, proteinuria: 'none', ckdStage: 'G2' };
	d.lifestyleFactors = {
		...d.lifestyleFactors,
		smokingStatus: 'former',
		yearsSinceQuit: 9,
		physicalActivity: 'sedentary',
		dietQuality: 'fair',
		bmi: 26.7
	};
	d.currentMedications = { ...d.currentMedications, metformin: 'yes' };
	d.complicationsScreening = { ...d.complicationsScreening, retinopathyStatus: 'background' };
	return d;
}

/** A high-risk assessment: at least one medium-severity rule fires. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		fullName: 'Margaret Jones',
		dateOfBirth: '1955-01-22',
		sex: 'female',
		nhsNumber: '384 615 7230',
		heightCm: 160,
		weightKg: 82,
		ethnicity: 'white'
	};
	d.diabetesHistory = {
		...d.diabetesHistory,
		diabetesType: 'type2',
		ageAtDiagnosis: 50,
		diabetesDurationYears: 15,
		hba1cValue: 64,
		hba1cUnit: 'mmolMol',
		diabetesTreatment: 'combined',
		insulinDurationYears: 3
	};
	d.bloodPressure = {
		...d.bloodPressure,
		systolicBp: 152,
		diastolicBp: 92,
		onAntihypertensive: 'yes',
		numberOfBpMedications: 2,
		bpAtTarget: 'no'
	};
	d.lipidProfile = {
		...d.lipidProfile,
		totalCholesterol: 5.6,
		hdlCholesterol: 1.0,
		ldlCholesterol: 3.1,
		triglycerides: 2.0,
		onStatin: 'yes'
	};
	d.renalFunction = { ...d.renalFunction, egfr: 52, urineAcr: 6, proteinuria: 'microalbuminuria', ckdStage: 'G3a' };
	d.lifestyleFactors = {
		...d.lifestyleFactors,
		smokingStatus: 'current',
		cigarettesPerDay: 15,
		physicalActivity: 'lightlyActive',
		dietQuality: 'fair',
		bmi: 32.0
	};
	d.currentMedications = { ...d.currentMedications, metformin: 'yes', aceInhibitorOrArb: 'yes' };
	d.complicationsScreening = {
		...d.complicationsScreening,
		retinopathyStatus: 'background',
		neuropathySymptoms: 'yes',
		monofilamentTest: 'normal'
	};
	return d;
}

/** A very-high-risk assessment: established CVD and severe abnormalities. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		fullName: 'David Williams',
		dateOfBirth: '1952-11-03',
		sex: 'male',
		nhsNumber: '512 847 9063',
		heightCm: 180,
		weightKg: 102,
		ethnicity: 'white'
	};
	d.diabetesHistory = {
		...d.diabetesHistory,
		diabetesType: 'type2',
		ageAtDiagnosis: 44,
		diabetesDurationYears: 24,
		hba1cValue: 88,
		hba1cUnit: 'mmolMol',
		diabetesTreatment: 'insulin',
		insulinDurationYears: 8
	};
	d.cardiovascularHistory = {
		...d.cardiovascularHistory,
		previousMi: 'yes',
		peripheralArterialDisease: 'yes',
		currentChestPain: 'yes'
	};
	d.bloodPressure = {
		...d.bloodPressure,
		systolicBp: 185,
		diastolicBp: 104,
		onAntihypertensive: 'yes',
		numberOfBpMedications: 3,
		bpAtTarget: 'no'
	};
	d.lipidProfile = {
		...d.lipidProfile,
		totalCholesterol: 8.2,
		hdlCholesterol: 0.9,
		ldlCholesterol: 5.4,
		triglycerides: 3.1,
		onStatin: 'no'
	};
	d.renalFunction = { ...d.renalFunction, egfr: 26, urineAcr: 35, proteinuria: 'macroalbuminuria', ckdStage: 'G4' };
	d.lifestyleFactors = {
		...d.lifestyleFactors,
		smokingStatus: 'current',
		cigarettesPerDay: 25,
		physicalActivity: 'sedentary',
		dietQuality: 'poor',
		bmi: 31.5
	};
	d.currentMedications = { ...d.currentMedications, metformin: 'no', insulin: 'yes' };
	d.complicationsScreening = {
		...d.complicationsScreening,
		retinopathyStatus: 'proliferative',
		neuropathySymptoms: 'yes',
		monofilamentTest: 'abnormal',
		footUlcerHistory: 'yes'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SD-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'SD-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'SD-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'SD-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: veryHighRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		riskCategory: g.riskCategory,
		hba1cMmolMol: hba1cMmolMol(s.data),
		systolicBp: s.data.bloodPressure.systolicBp,
		cvdFlag: hasEstablishedCvd(s.data),
		flagCount: g.additionalFlags.length
	};
});
