import type { AssessmentData, CareSetting, RiskBand } from '$lib/engine/types';
import { calculateQrisk3Grade } from '$lib/engine/qrisk3-grader';
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
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	tenYearRiskPercent: number | null;
	riskBand: RiskBand;
	heartAge: number | null;
	statinOffer: boolean;
	flagCount: number;
}

/** Low risk — young, healthy woman well below the NICE threshold. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Shah',
		clinicianRole: 'gp',
		assessedAt: '2026-06-10T09:15',
		careSetting: 'general-practice'
	};
	d.identification = {
		patientIdentifier: 'GP-40021',
		age: 45,
		sex: 'female',
		ethnicity: 'white-or-not-stated',
		townsendScore: -1,
		postcode: 'LS1 4AP'
	};
	d.eligibility = { hasEstablishedCvd: 'no', hasFamilialHypercholesterolaemia: 'no' };
	d.lifestyle = { smokingStatus: 'non', bodyMassIndex: 24 };
	d.cardiometabolic = {
		diabetesStatus: 'none',
		cholesterolHdlRatio: 3.5,
		systolicBloodPressure: 118,
		systolicBloodPressureSd: 8,
		onBloodPressureTreatment: 'no'
	};
	d.comorbidities = {
		familyHistoryChd: 'no',
		atrialFibrillation: 'no',
		chronicKidneyDiseaseStage: 'none',
		migraine: 'no',
		rheumatoidArthritis: 'no',
		systemicLupusErythematosus: 'no',
		severeMentalIllness: 'no',
		erectileDysfunction: 'no'
	};
	d.medication = { onAtypicalAntipsychotics: 'no', onCorticosteroids: 'no' };
	d.note.clinicalNote = 'Low risk; routine lifestyle advice given.';
	return d;
}

/** Raised risk — man over the 10% NICE threshold but below 20%. */
function raisedRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse J. Owusu',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T11:40',
		careSetting: 'nhs-health-check'
	};
	d.identification = {
		patientIdentifier: 'GP-40188',
		age: 65,
		sex: 'male',
		ethnicity: 'indian',
		townsendScore: 2,
		postcode: 'B10 0JJ'
	};
	d.eligibility = { hasEstablishedCvd: 'no', hasFamilialHypercholesterolaemia: 'no' };
	d.lifestyle = { smokingStatus: 'ex', bodyMassIndex: 30 };
	d.cardiometabolic = {
		diabetesStatus: 'none',
		cholesterolHdlRatio: 5,
		systolicBloodPressure: 145,
		systolicBloodPressureSd: 12,
		onBloodPressureTreatment: 'yes'
	};
	d.comorbidities = {
		familyHistoryChd: 'yes',
		atrialFibrillation: 'no',
		chronicKidneyDiseaseStage: 'none',
		migraine: 'no',
		rheumatoidArthritis: 'no',
		systemicLupusErythematosus: 'no',
		severeMentalIllness: 'no',
		erectileDysfunction: 'no'
	};
	d.medication = { onAtypicalAntipsychotics: 'no', onCorticosteroids: 'no' };
	d.note.clinicalNote = 'Over the NICE threshold; statin offer discussed.';
	return d;
}

/** High risk — older man with multiple comorbidities, well above 20%. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr M. Iqbal',
		clinicianRole: 'gp',
		assessedAt: '2026-06-15T14:05',
		careSetting: 'general-practice'
	};
	d.identification = {
		patientIdentifier: 'GP-40233',
		age: 68,
		sex: 'male',
		ethnicity: 'pakistani',
		townsendScore: 4,
		postcode: 'BD3 8QX'
	};
	d.eligibility = { hasEstablishedCvd: 'no', hasFamilialHypercholesterolaemia: 'no' };
	d.lifestyle = { smokingStatus: 'heavy', bodyMassIndex: 31 };
	d.cardiometabolic = {
		diabetesStatus: 'type2',
		cholesterolHdlRatio: 6,
		systolicBloodPressure: 155,
		systolicBloodPressureSd: 14,
		onBloodPressureTreatment: 'yes'
	};
	d.comorbidities = {
		familyHistoryChd: 'no',
		atrialFibrillation: 'yes',
		chronicKidneyDiseaseStage: 'none',
		migraine: 'no',
		rheumatoidArthritis: 'no',
		systemicLupusErythematosus: 'no',
		severeMentalIllness: 'no',
		erectileDysfunction: 'yes'
	};
	d.medication = { onAtypicalAntipsychotics: 'no', onCorticosteroids: 'no' };
	d.note.clinicalNote = 'High risk; prioritised statin and lifestyle optimisation.';
	return d;
}

/** Not eligible — established CVD makes the primary-prevention score invalid. */
function notEligible(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Pharmacist L. Grant',
		clinicianRole: 'pharmacist',
		assessedAt: '2026-06-18T16:20',
		careSetting: 'pharmacy'
	};
	d.identification = {
		patientIdentifier: 'PH-7781',
		age: 72,
		sex: 'female',
		ethnicity: 'white-or-not-stated',
		townsendScore: 1,
		postcode: 'EH8 9YL'
	};
	d.eligibility = { hasEstablishedCvd: 'yes', hasFamilialHypercholesterolaemia: 'no' };
	d.lifestyle = { smokingStatus: 'ex', bodyMassIndex: 28 };
	d.cardiometabolic = {
		diabetesStatus: 'none',
		cholesterolHdlRatio: 5,
		systolicBloodPressure: 150,
		systolicBloodPressureSd: 11,
		onBloodPressureTreatment: 'yes'
	};
	d.comorbidities = {
		familyHistoryChd: 'no',
		atrialFibrillation: 'no',
		chronicKidneyDiseaseStage: 'none',
		migraine: 'no',
		rheumatoidArthritis: 'no',
		systemicLupusErythematosus: 'no',
		severeMentalIllness: 'no',
		erectileDysfunction: 'no'
	};
	d.medication = { onAtypicalAntipsychotics: 'no', onCorticosteroids: 'no' };
	d.note.clinicalNote = 'Established CVD — manage via secondary-prevention pathway.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'QR-2026-0001', patientName: 'Bennett, Claire', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'QR-2026-0002', patientName: 'Sharma, Rajesh', assessedDate: '2026-06-12', data: raisedRisk() },
	{ id: 'QR-2026-0003', patientName: 'Khan, Imran', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'QR-2026-0004', patientName: 'Fraser, Margaret', assessedDate: '2026-06-18', data: notEligible() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateQrisk3Grade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		tenYearRiskPercent: g.tenYearRiskPercent,
		riskBand: g.riskBand,
		heartAge: g.heartAge,
		statinOffer: g.tenYearRiskPercent !== null && g.tenYearRiskPercent >= 10,
		flagCount: g.flaggedIssues.length
	};
});
