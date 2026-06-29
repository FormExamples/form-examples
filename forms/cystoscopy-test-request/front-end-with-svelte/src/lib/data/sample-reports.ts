import type { CystoscopyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/result.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: CystoscopyRequest;
}

/**
 * A routine, appropriate request: non-visible haematuria, flexible cystoscopy,
 * complete, no red flags. Grades to accept / routine / low risk.
 */
function routineRequest(): CystoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Anita Shah',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'anita.shah@nhs.net · 01865 000000',
		supervisingConsultant: '',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1972-03-14',
		age: 54,
		nhsNumber: '485 777 3456'
	};
	r.request = {
		procedure: 'flexible-cystoscopy',
		primaryIndication: 'non-visible-haematuria',
		clinicalQuestion: 'Asymptomatic non-visible haematuria — please assess the bladder mucosa.',
		relevantHistory: 'Incidental non-visible haematuria on routine dip; normal renal function.'
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-08-01',
		setting: 'outpatient',
		notes: ''
	};
	return r;
}

/**
 * A suspected-cancer two-week-wait request: visible haematuria, aged 68,
 * flexible cystoscopy. Two-week-wait eligible; escalates to the two-week-wait
 * tier. Grades to accept / two-week-wait with the 2WW + visible-haematuria flags.
 */
function twoWeekWaitRequest(): CystoscopyRequest {
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
		dateOfBirth: '1958-11-02',
		age: 68,
		nhsNumber: '402 118 9921'
	};
	r.request = {
		procedure: 'flexible-cystoscopy',
		primaryIndication: 'visible-haematuria',
		clinicalQuestion: 'Single episode of visible haematuria — exclude bladder malignancy.',
		relevantHistory: 'One episode of frank haematuria, no UTI symptoms, ex-smoker.'
	};
	r.symptoms.symptomHaematuria = true;
	r.symptoms.visibleHaematuria = true;
	r.triage = {
		urgency: 'two-week-wait',
		requestedByDate: '2026-06-26',
		setting: 'outpatient',
		notes: 'Refer on the suspected-cancer pathway.'
	};
	return r;
}

/**
 * A high-risk request: recurrent UTI on warfarin with an active UTI. Anticoagulant
 * + active-UTI drive the risk axis to high and defer the procedure. Appropriate
 * and complete, so still accepted, but flagged for the booking team.
 */
function highRiskRequest(): CystoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Mr Olu Adeyemi',
		clinicianRole: 'urologist',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'urology.triage@nhs.net',
		supervisingConsultant: '',
		siteName: 'City General Urology',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1949-07-21',
		age: 76,
		nhsNumber: '309 552 0148'
	};
	r.request = {
		procedure: 'flexible-cystoscopy',
		primaryIndication: 'recurrent-uti',
		clinicalQuestion: 'Recurrent UTIs in an anticoagulated patient — assess for a bladder cause.',
		relevantHistory: 'Four culture-proven UTIs in 12 months; warfarin for atrial fibrillation.'
	};
	r.symptoms.symptomDysuria = true;
	r.symptoms.symptomFrequency = true;
	r.symptoms.currentUti = true;
	r.bleeding.takingAnticoagulant = true;
	r.bleeding.anticoagulantAgent = 'Warfarin';
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-08-15',
		setting: 'outpatient',
		notes: 'Defer until the active UTI is treated.'
	};
	return r;
}

/**
 * A query-referrer request: lower urinary tract symptoms with retention but the
 * requested procedure does not match the indication, so appropriateness is
 * usually-not-appropriate. Retention escalates the tier to urgent.
 */
function queryReferrerRequest(): CystoscopyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7330091',
		requesterContact: 'ward bleep 2143',
		supervisingConsultant: 'Mr H Patel',
		siteName: 'City General Ward 12',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Frank',
		lastName: 'Doyle',
		dateOfBirth: '1955-01-30',
		age: 71,
		nhsNumber: '610 220 7788'
	};
	r.request = {
		procedure: 'other',
		primaryIndication: 'lower-urinary-tract-symptoms',
		clinicalQuestion: 'Worsening LUTS with an episode of retention — advise on the right examination.',
		relevantHistory: 'Long-standing LUTS; one episode of acute retention requiring catheterisation.'
	};
	r.symptoms.symptomFrequency = true;
	r.symptoms.symptomRetention = true;
	r.triage = {
		urgency: 'urgent',
		requestedByDate: '2026-06-28',
		setting: 'inpatient',
		notes: ''
	};
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'CY-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'CY-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: twoWeekWaitRequest()
	},
	{
		id: 'CY-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: highRiskRequest()
	},
	{
		id: 'CY-2026-0004',
		patientName: 'Frank Doyle',
		referralDate: '2026-06-14',
		request: queryReferrerRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		procedure: s.request.request.procedure,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		riskBand: g.riskBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
