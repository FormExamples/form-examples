import type { AssessmentData, ControlClass, HypertensionStage, ReviewStatus } from '$lib/engine/types';
import { review } from '$lib/engine/hypertension-review-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample review: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	reviewedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	practiceSite: string;
	controlClass: ControlClass;
	primarySource: string;
	hypertensionStage: HypertensionStage;
	reviewStatus: ReviewStatus;
	highFlagCount: number;
	flagCount: number;
	reviewedDate: string;
}

/** Severe uncontrolled, partial — clinic BP 186/122; several components outstanding. */
function severeUncontrolled(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Rahman',
		clinicianRole: 'gp',
		reviewedAt: '2026-06-24',
		practiceSite: 'Riverside Medical Practice'
	};
	d.identification = {
		patientIdentifier: 'NHS 943 476 5919',
		ageBand: '60-79',
		sex: 'male',
		ethnicity: 'south-asian'
	};
	d.diagnosis = {
		diagnosisDate: '2016-03-10',
		type2Diabetes: 'yes',
		chronicKidneyDisease: 'no',
		establishedCvd: 'no',
		atrialFibrillation: 'no'
	};
	d.clinicBp = { clinicSystolic: 186, clinicDiastolic: 122, posturalDrop: 'no' };
	d.homeBp = { homeSystolic: null, homeDiastolic: null, monitoringMethod: 'clinic-only' };
	d.medication = { antihypertensiveAgents: 3, adherence: 'poor', sideEffects: 'yes' };
	d.cardiovascularRisk = { qriskPercent: 24.5, smokingStatus: 'current', statinTherapy: 'no' };
	d.summary = {
		reviewContext:
			'Accelerated hypertension on a background of type 2 diabetes; poor adherence and troublesome side effects. Same-day assessment arranged.'
	};
	return d;
}

/** Uncontrolled, partial — home reading above target; annual bloods outstanding. */
function uncontrolledPartial(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'PN J. Okonkwo',
		clinicianRole: 'practice-nurse',
		reviewedAt: '2026-06-25',
		practiceSite: 'Greenfield Health Centre'
	};
	d.identification = {
		patientIdentifier: 'MRN-573110',
		ageBand: '40-59',
		sex: 'female',
		ethnicity: 'white'
	};
	d.diagnosis = {
		diagnosisDate: '2020-09-01',
		type2Diabetes: 'no',
		chronicKidneyDisease: 'no',
		establishedCvd: 'no',
		atrialFibrillation: 'no'
	};
	d.clinicBp = { clinicSystolic: 148, clinicDiastolic: 92, posturalDrop: 'no' };
	d.homeBp = { homeSystolic: 142, homeDiastolic: 88, monitoringMethod: 'hbpm' };
	d.medication = { antihypertensiveAgents: 1, adherence: 'good', sideEffects: 'no' };
	d.cardiovascularRisk = { qriskPercent: 8.2, smokingStatus: 'never', statinTherapy: 'no' };
	d.urine = { urineAcr: 1.8 };
	d.lifestyle = { bmi: 29.4, lifestyleAdvice: 'Weight management and reduced dietary salt advised.' };
	d.summary = {
		reviewContext:
			'Home readings above target on monotherapy. Step up per NICE NG136 and request outstanding annual bloods.'
	};
	return d;
}

/** Controlled, complete — at target with every review component documented. */
function controlledComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'gp',
		reviewedAt: '2026-06-25',
		practiceSite: 'Riverside Medical Practice'
	};
	d.identification = {
		patientIdentifier: 'MRN-100517',
		ageBand: '40-59',
		sex: 'female',
		ethnicity: 'white'
	};
	d.diagnosis = {
		diagnosisDate: '2018-11-20',
		type2Diabetes: 'no',
		chronicKidneyDisease: 'no',
		establishedCvd: 'no',
		atrialFibrillation: 'no'
	};
	d.clinicBp = { clinicSystolic: 132, clinicDiastolic: 82, posturalDrop: 'no' };
	d.homeBp = { homeSystolic: 128, homeDiastolic: 80, monitoringMethod: 'hbpm' };
	d.medication = { antihypertensiveAgents: 2, adherence: 'good', sideEffects: 'no' };
	d.cardiovascularRisk = { qriskPercent: 7.4, smokingStatus: 'never', statinTherapy: 'yes' };
	d.bloods = {
		serumCreatinine: 78,
		egfr: 90,
		serumPotassium: 4.3,
		hba1c: 37,
		totalCholesterol: 4.4,
		hdlCholesterol: 1.5
	};
	d.urine = { urineAcr: 0.9 };
	d.lifestyle = { bmi: 25.1, lifestyleAdvice: 'Maintain current diet and activity levels.' };
	d.complications = { complications: 'No target-organ damage identified.' };
	d.summary = {
		reviewContext: 'Well controlled on dual therapy. Continue current management; 12-month recall.'
	};
	return d;
}

/** Incomplete — no blood-pressure reading recorded, control not classified. */
function incompleteNoBp(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'pharmacist',
		reviewedAt: '2026-06-26',
		practiceSite: 'Greenfield Health Centre'
	};
	d.identification = {
		patientIdentifier: 'MRN-880204',
		ageBand: '18-39',
		sex: 'male',
		ethnicity: 'black-african-caribbean'
	};
	d.diagnosis = {
		diagnosisDate: '2023-02-14',
		type2Diabetes: 'no',
		chronicKidneyDisease: 'no',
		establishedCvd: 'no',
		atrialFibrillation: 'no'
	};
	d.medication = { antihypertensiveAgents: 1, adherence: 'partial', sideEffects: 'no' };
	d.summary = {
		reviewContext:
			'Structured medication review only; no blood pressure recorded this visit. Bring the patient back for readings.'
	};
	return d;
}

/** The sample reviews, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'HTN-2026-0001',
		patientName: 'Ahmed, Bilal',
		reviewedDate: '2026-06-24',
		data: severeUncontrolled()
	},
	{
		id: 'HTN-2026-0002',
		patientName: 'Fletcher, Diane',
		reviewedDate: '2026-06-25',
		data: uncontrolledPartial()
	},
	{
		id: 'HTN-2026-0003',
		patientName: 'Mackenzie, Iona',
		reviewedDate: '2026-06-25',
		data: controlledComplete()
	},
	{
		id: 'HTN-2026-0004',
		patientName: 'Novak, Jan',
		reviewedDate: '2026-06-26',
		data: incompleteNoBp()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = review(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		practiceSite: s.data.context.practiceSite,
		controlClass: g.controlStatus.controlClass,
		primarySource: g.controlStatus.primarySource,
		hypertensionStage: g.controlStatus.hypertensionStage,
		reviewStatus: g.reviewStatus,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		reviewedDate: s.reviewedDate
	};
});
