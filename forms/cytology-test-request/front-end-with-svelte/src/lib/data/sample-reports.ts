import type { CytologyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: CytologyRequest;
}

/**
 * A routine, appropriate cervical-screening smear that has not yet been taken.
 * Grades to usually-appropriate / routine / accept (with a not-collected flag).
 */
function routineScreeningRequest(): CytologyRequest {
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
		dateOfBirth: '1979-03-14',
		nhsNumber: '485 777 3456',
		interpreterRequired: false
	};
	r.request = {
		specimenType: 'cervical-smear',
		specimenSite: 'Cervix',
		primaryIndication: 'cervical-screening',
		clinicalQuestion: 'Routine recall cervical screening — HPV primary screen with cytology triage.',
		clinicalDetails: 'Asymptomatic, on routine recall. No previous abnormal cytology.'
	};
	r.context = {
		hpvTestRequested: true,
		previousAbnormalCytology: 'none',
		lastMenstrualPeriodDate: '2026-05-28'
	};
	r.collection = { specimenCollected: 'no', collectionDatetime: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/**
 * A suspected-malignancy pleural effusion. Suspected-cancer indication
 * auto-escalates triage to two-week-wait and raises a high-priority flag.
 */
function suspectedMalignancyRequest(): CytologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'respiratory-physician',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'ext 4421',
		supervisingConsultant: '',
		siteName: 'Selly Oak Respiratory Clinic',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		interpreterRequired: false
	};
	r.request = {
		specimenType: 'fluid-pleural-ascitic',
		specimenSite: 'Right pleural cavity',
		primaryIndication: 'suspected-malignancy',
		clinicalQuestion: 'Exclude malignant cells in a new unilateral pleural effusion.',
		clinicalDetails: 'Unintentional weight loss, smoker, large right pleural effusion on CXR.'
	};
	r.context = {
		hpvTestRequested: false,
		previousAbnormalCytology: 'none',
		lastMenstrualPeriodDate: ''
	};
	r.collection = { specimenCollected: 'yes', collectionDatetime: '' };
	r.triage = { urgency: 'urgent', requestedByDate: '', setting: 'outpatient', notes: '' };
	return r;
}

/**
 * A haematuria urine cytology with previous high-grade cytology and a stale
 * specimen. Two-week-wait triage, reject-risk adequacy → redirect / recollect.
 */
function staleUrineRequest(): CytologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'urologist',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'bleep 1234',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General Urology',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148',
		interpreterRequired: false
	};
	r.request = {
		specimenType: 'urine-cytology',
		specimenSite: 'Voided urine',
		primaryIndication: 'haematuria',
		clinicalQuestion: 'Visible haematuria — assess for urothelial malignancy.',
		clinicalDetails: 'Painless visible haematuria; previous high-grade urinary cytology.'
	};
	r.context = {
		hpvTestRequested: false,
		previousAbnormalCytology: 'high-grade',
		lastMenstrualPeriodDate: ''
	};
	// Collected well over 48h ago → reject-risk pre-analytical band.
	r.collection = { specimenCollected: 'yes', collectionDatetime: '2026-01-02T08:00' };
	r.triage = { urgency: 'urgent', requestedByDate: '', setting: 'outpatient', notes: '' };
	return r;
}

/**
 * A mismatched, incomplete request: a thyroid-nodule indication with a urine
 * specimen. Usually-not-appropriate → query-referrer.
 */
function mismatchedRequest(): CytologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Tom Reilly',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7222334',
		requesterContact: '',
		supervisingConsultant: '',
		siteName: 'Riverside Surgery',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Eleanor',
		lastName: 'Page',
		dateOfBirth: '1972-02-09',
		nhsNumber: '',
		interpreterRequired: false
	};
	r.request = {
		specimenType: 'urine-cytology',
		specimenSite: '',
		primaryIndication: 'thyroid-nodule',
		clinicalQuestion: 'Assess thyroid nodule.',
		clinicalDetails: ''
	};
	r.context = {
		hpvTestRequested: false,
		previousAbnormalCytology: '',
		lastMenstrualPeriodDate: ''
	};
	r.collection = { specimenCollected: 'no', collectionDatetime: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'CY-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineScreeningRequest()
	},
	{
		id: 'CY-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: suspectedMalignancyRequest()
	},
	{
		id: 'CY-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: staleUrineRequest()
	},
	{
		id: 'CY-2026-0004',
		patientName: 'Eleanor Page',
		referralDate: '2026-06-14',
		request: mismatchedRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		specimenType: s.request.request.specimenType,
		primaryIndication: s.request.request.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		preanalyticalBand: g.preanalyticalBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
