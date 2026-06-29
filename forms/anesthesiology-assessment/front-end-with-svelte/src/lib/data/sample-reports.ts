import type { AssessmentData, AsaClass, MallampatiClass, RiskLevel } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/composite-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the anaesthetist dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	asaClass: AsaClass;
	mallampatiClass: MallampatiClass;
	rcriScore: number;
	stopbangScore: number;
	riskLevel: RiskLevel;
	airwayFlag: boolean;
	flagCount: number;
}

/** A low-risk patient: fit, ASA II, unremarkable airway, minor surgery. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1992-04-12',
		sex: 'male'
	};
	d.plannedSurgery = {
		...d.plannedSurgery,
		procedureName: 'Inguinal hernia repair',
		surgeonName: 'Mr Patel',
		surgeryGrade: 'minor',
		proposedAnaesthesia: 'general'
	};
	d.vitalSigns = { ...d.vitalSigns, height: 178, weight: 78, bmi: 24.6, neckCircumference: 38, spo2: 99 };
	d.physicalExam = { ...d.physicalExam, mallampatiClass: 'i', neckMobility: 'full', jawProtrusion: 'normal' };
	d.socialHistory = { ...d.socialHistory, smoking: 'never', canClimbTwoFlights: 'yes', exerciseTolerance: 'gt-4-mets' };
	d.investigationsAndPlan = { ...d.investigationsAndPlan, asaClass: 'ii', emergencyCase: 'no' };
	return d;
}

/** A moderate-risk patient: ASA III for controlled systemic disease. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1959-09-30',
		sex: 'female'
	};
	d.plannedSurgery = {
		...d.plannedSurgery,
		procedureName: 'Laparoscopic cholecystectomy',
		surgeryGrade: 'intermediate',
		proposedAnaesthesia: 'general'
	};
	d.medicalHistory = { ...d.medicalHistory, hypertension: 'yes', diabetesType2: 'yes', asthma: 'yes' };
	d.medications = { ...d.medications, onInsulin: 'no', onSteroids: 'yes' };
	d.vitalSigns = { ...d.vitalSigns, height: 162, weight: 82, bmi: 31.2, neckCircumference: 39, spo2: 97 };
	d.physicalExam = { ...d.physicalExam, mallampatiClass: 'ii', neckMobility: 'full', jawProtrusion: 'normal' };
	d.socialHistory = { ...d.socialHistory, smoking: 'ex', snoresLoudly: 'yes', canClimbTwoFlights: 'yes' };
	d.investigationsAndPlan = { ...d.investigationsAndPlan, asaClass: 'iii', emergencyCase: 'no' };
	return d;
}

/** A high-risk patient: ASA III plus a predicted difficult airway and anticoagulation. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1948-01-22',
		sex: 'female'
	};
	d.plannedSurgery = {
		...d.plannedSurgery,
		procedureName: 'Total hip replacement',
		surgeryGrade: 'major',
		proposedAnaesthesia: 'combined'
	};
	d.medicalHistory = {
		...d.medicalHistory,
		hypertension: 'yes',
		ischaemicHeartDisease: 'yes',
		arrhythmia: 'yes',
		copd: 'yes'
	};
	d.medications = { ...d.medications, onAnticoagulants: 'yes', onAntiplatelets: 'yes' };
	d.allergies = { ...d.allergies, list: [{ allergen: 'Penicillin', type: 'drug', reaction: 'Rash', severity: 'moderate' }] };
	d.previousAnaesthesia = { ...d.previousAnaesthesia, difficultIntubation: true, ponv: true };
	d.vitalSigns = { ...d.vitalSigns, height: 160, weight: 70, bmi: 27.3, neckCircumference: 41, spo2: 95, systolicBp: 168, diastolicBp: 92 };
	d.physicalExam = { ...d.physicalExam, mallampatiClass: 'iii', mouthOpening: 3.5, neckMobility: 'limited', jawProtrusion: 'limited' };
	d.socialHistory = { ...d.socialHistory, smoking: 'ex', snoresLoudly: 'yes', tiredDuringDay: 'yes', canClimbTwoFlights: 'no' };
	d.investigationsAndPlan = {
		...d.investigationsAndPlan,
		asaClass: 'iii',
		emergencyCase: 'no',
		rcriIschaemicHeartDisease: 'yes'
	};
	return d;
}

/** A critical patient: ASA V emergency, multiple cardiac criteria, difficult airway, anaphylaxis history. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1955-11-03',
		sex: 'male'
	};
	d.plannedSurgery = {
		...d.plannedSurgery,
		procedureName: 'Emergency laparotomy',
		surgeryGrade: 'complex',
		proposedAnaesthesia: 'general'
	};
	d.medicalHistory = {
		...d.medicalHistory,
		hypertension: 'yes',
		ischaemicHeartDisease: 'yes',
		heartFailure: 'yes',
		strokeTia: 'yes',
		chronicKidneyDisease: 'yes',
		gord: 'yes'
	};
	d.medications = { ...d.medications, onInsulin: 'yes', onAnticoagulants: 'yes' };
	d.allergies = {
		...d.allergies,
		latexAllergy: 'yes',
		list: [{ allergen: 'Morphine', type: 'drug', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }]
	};
	d.previousAnaesthesia = { ...d.previousAnaesthesia, difficultIntubation: true, malignantHyperthermia: 'yes' };
	d.vitalSigns = { ...d.vitalSigns, height: 180, weight: 132, bmi: 40.7, neckCircumference: 45, spo2: 91, systolicBp: 195, diastolicBp: 115 };
	d.physicalExam = { ...d.physicalExam, mallampatiClass: 'iv', mouthOpening: 2.5, neckMobility: 'fixed', jawProtrusion: 'limited' };
	d.socialHistory = { ...d.socialHistory, smoking: 'current', alcoholUnitsPerWeek: 30, snoresLoudly: 'yes', tiredDuringDay: 'yes', observedApnea: 'yes', canClimbTwoFlights: 'no' };
	d.investigationsAndPlan = {
		...d.investigationsAndPlan,
		asaClass: 'v',
		emergencyCase: 'yes',
		rcriIschaemicHeartDisease: 'yes',
		rcriCongestiveHeartFailure: 'yes',
		rcriCerebrovascularDisease: 'yes',
		rcriHighCreatinine: 'yes'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'AA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'AA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'AA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		asaClass: g.asa.class,
		mallampatiClass: g.airway.mallampatiClass,
		rcriScore: g.rcri.score,
		stopbangScore: g.stopbang.score,
		riskLevel: g.overallRisk,
		airwayFlag: g.airway.riskLevel === 'high' || s.data.previousAnaesthesia.difficultIntubation,
		flagCount: g.additionalFlags.length
	};
});
