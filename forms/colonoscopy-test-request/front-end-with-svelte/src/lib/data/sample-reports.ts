import type { ColonoscopyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: ColonoscopyRequest;
}

/**
 * A routine, appropriate request: change in bowel habit, colonoscopy, complete,
 * negative FIT, fit for prep, ASA II. Grades to accept / routine.
 */
function routineRequest(): ColonoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456',
		bodyMassIndex: 26.4,
		setting: 'community'
	};
	r.request = {
		procedure: 'colonoscopy',
		primaryIndication: 'change-in-bowel-habit',
		clinicalQuestion: 'Investigate three-month change in bowel habit; exclude colorectal malignancy.',
		relevantHistory: 'Looser stools and increased frequency over three months; no overt bleeding.'
	};
	r.redFlags = {
		weightLoss: false,
		anaemia: false,
		abdominalMass: false,
		rectalBleeding: false,
		fitResultUgG: 4,
		haemoglobinGL: 132
	};
	r.fitness = {
		fitForBowelPrep: true,
		bowelPrepAgent: 'PEG-based split-dose',
		chronicKidneyDisease: false,
		egfrMlMin: 88,
		asaGrade: 'II'
	};
	r.triage = { urgency: 'routine', requestedByDate: '2026-07-20', notes: '' };
	return r;
}

/**
 * A two-week-wait request: positive FIT (≥10 µg Hb/g) with rectal bleeding,
 * colonoscopy. Escalates to the suspected-cancer two-week-wait pathway.
 */
function twoWeekWaitRequest(): ColonoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: '',
		siteName: 'Selly Oak Surgery',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1955-11-02',
		nhsNumber: '402 118 9921',
		bodyMassIndex: 24.1,
		setting: 'community'
	};
	r.request = {
		procedure: 'colonoscopy',
		primaryIndication: 'positive-fit',
		clinicalQuestion: 'Positive FIT with rectal bleeding — investigate for colorectal cancer.',
		relevantHistory: 'Intermittent rectal bleeding for six weeks; FIT 180 µg Hb/g.'
	};
	r.redFlags = {
		weightLoss: true,
		anaemia: false,
		abdominalMass: false,
		rectalBleeding: true,
		fitResultUgG: 180,
		haemoglobinGL: 121
	};
	r.fitness = {
		fitForBowelPrep: true,
		bowelPrepAgent: 'PEG-based split-dose',
		chronicKidneyDisease: false,
		egfrMlMin: 79,
		asaGrade: 'II'
	};
	r.triage = { urgency: 'two-week-wait', requestedByDate: '2026-06-24', notes: 'Track on 2WW pathway.' };
	return r;
}

/**
 * A high-risk request: patient on a DOAC with ASA III, polyp surveillance.
 * High bleeding risk drives the risk axis to high → redirect for review.
 */
function highRiskAnticoagRequest(): ColonoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'gastroenterologist',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'gastro.sec@nhs.net',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General Gastroenterology',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1948-07-21',
		nhsNumber: '309 552 0148',
		bodyMassIndex: 31.2,
		setting: 'outpatient'
	};
	r.request = {
		procedure: 'colonoscopy',
		primaryIndication: 'polyp-surveillance',
		clinicalQuestion: 'Surveillance colonoscopy three years after adenoma removal.',
		relevantHistory: 'Two tubular adenomas removed in 2023; atrial fibrillation on apixaban.'
	};
	r.medication = {
		takingAnticoagulant: true,
		anticoagulantAgent: 'apixaban',
		takingAntiplatelet: false,
		antiplateletAgent: '',
		diabetesMedication: 'oral'
	};
	r.fitness = {
		fitForBowelPrep: true,
		bowelPrepAgent: 'PEG-based split-dose',
		chronicKidneyDisease: false,
		egfrMlMin: 62,
		asaGrade: 'III'
	};
	r.redFlags = {
		weightLoss: false,
		anaemia: false,
		abdominalMass: false,
		rectalBleeding: false,
		fitResultUgG: 6,
		haemoglobinGL: 138
	};
	r.triage = { urgency: 'routine', requestedByDate: '2026-08-01', notes: 'Plan periprocedural anticoagulant management.' };
	return r;
}

/**
 * An emergency request: inpatient/emergency setting with active rectal bleeding
 * and an incomplete referral (no FIT, unfit for prep). Auto-escalates to
 * emergency; flags missing FIT and unfit-for-prep.
 */
function emergencyRequest(): ColonoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Lucy Adeyemi',
		clinicianRole: 'colorectal-surgeon',
		registrationBody: 'GMC',
		registrationNumber: '7501233',
		requesterContact: 'surgical bleep 2210',
		supervisingConsultant: '',
		siteName: 'City General ED',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Brian',
		lastName: 'Okafor',
		dateOfBirth: '1962-02-09',
		nhsNumber: '276 410 8833',
		bodyMassIndex: 28.0,
		setting: 'emergency'
	};
	r.request = {
		procedure: 'colonoscopy',
		primaryIndication: 'rectal-bleeding',
		clinicalQuestion: 'Acute large-volume rectal bleeding with haemodynamic instability.',
		relevantHistory: 'Presented to ED with brisk per-rectal bleeding; resuscitation ongoing.'
	};
	r.redFlags = {
		weightLoss: false,
		anaemia: true,
		abdominalMass: false,
		rectalBleeding: true,
		fitResultUgG: null,
		haemoglobinGL: 78
	};
	r.fitness = {
		fitForBowelPrep: false,
		bowelPrepAgent: '',
		chronicKidneyDisease: false,
		egfrMlMin: 71,
		asaGrade: 'IV'
	};
	r.triage = { urgency: 'emergency', requestedByDate: '2026-06-14', notes: 'Same-day procedure required.' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{ id: 'CO-2026-0001', patientName: 'Margaret Hughes', referralDate: '2026-06-10', request: routineRequest() },
	{ id: 'CO-2026-0002', patientName: 'Derek Mensah', referralDate: '2026-06-12', request: twoWeekWaitRequest() },
	{ id: 'CO-2026-0003', patientName: 'Anthony Brooks', referralDate: '2026-06-13', request: highRiskAnticoagRequest() },
	{ id: 'CO-2026-0004', patientName: 'Brian Okafor', referralDate: '2026-06-14', request: emergencyRequest() }
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		procedure: s.request.request.procedure,
		primaryIndication: s.request.request.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		riskBand: g.riskBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
