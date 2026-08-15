import type { CoagulationTestRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';
import { countSelectedTests } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: CoagulationTestRequest;
}

/**
 * A routine, appropriate request: warfarin monitoring with PT/INR, a correctly
 * filled citrate specimen, and a complete request. Grades to accept / routine.
 */
function routineRequest(): CoagulationTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		...r.clinician,
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7012345',
		requesterContact: 'sarah.owen@nhs.net · 01865 000000',
		siteName: 'Headington Medical Practice',
		referralDate: '2026-06-10'
	};
	r.patient = {
		firstName: 'Margaret',
		lastName: 'Hughes',
		dateOfBirth: '1958-03-14',
		nhsNumber: '485 777 3456'
	};
	r.tests.prothrombinTimeInr = true;
	r.clinical = {
		...r.clinical,
		primaryIndication: 'anticoagulation-monitoring',
		clinicalDetails: 'Warfarin dose review; INR last week 3.8; no active bleeding.',
		onAnticoagulant: true,
		anticoagulantAgent: 'warfarin'
	};
	r.specimen = {
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-10T09:30',
		citrateTubeFill: 'adequate',
		citrateRatioCorrect: 'yes'
	};
	r.triage = { ...r.triage, urgency: 'routine', setting: 'community' };
	return r;
}

/**
 * A STAT request: suspected disseminated intravascular coagulation with the full
 * DIC panel. Suspected DIC auto-escalates triage to stat.
 */
function statDicRequest(): CoagulationTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		...r.clinician,
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		supervisingConsultant: 'Dr H Patel',
		requesterContact: 'ED bleep 1234',
		siteName: 'City General ED',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148'
	};
	r.tests.prothrombinTimeInr = true;
	r.tests.activatedPartialThromboplastinTime = true;
	r.tests.fibrinogen = true;
	r.tests.dDimer = true;
	r.clinical = {
		...r.clinical,
		primaryIndication: 'disseminated-intravascular-coagulation',
		clinicalDetails: 'Septic shock with oozing from cannula sites; suspected DIC.',
		activeBleeding: true,
		suspectedDic: true
	};
	r.specimen = {
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-13T02:10',
		citrateTubeFill: 'adequate',
		citrateRatioCorrect: 'yes'
	};
	r.triage = { ...r.triage, urgency: 'stat', setting: 'emergency' };
	return r;
}

/**
 * A reject-risk request: a bleeding-disorder work-up collected into an
 * under-filled citrate tube. The pre-analytical axis is reject-risk → reject.
 */
function rejectRiskRequest(): CoagulationTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		...r.clinician,
		clinicianName: 'Dr James Carter',
		clinicianRole: 'haematologist',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net',
		siteName: 'Selly Oak Haematology Day Unit',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1990-11-02',
		nhsNumber: '402 118 9921'
	};
	r.tests.factorAssays = true;
	r.tests.vonWillebrandScreen = true;
	r.clinical = {
		...r.clinical,
		primaryIndication: 'bleeding-disorder',
		clinicalDetails: 'Lifelong easy bruising and mucocutaneous bleeding; investigate for vWD.',
		bleedingHistory: true
	};
	r.specimen = {
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-12T11:00',
		citrateTubeFill: 'underfilled',
		citrateRatioCorrect: 'no'
	};
	r.triage = { ...r.triage, urgency: 'routine', setting: 'outpatient' };
	return r;
}

/**
 * A query-referrer request: a pre-operative indication paired with a mismatched
 * thrombophilia screen, with no specimen yet. Appropriateness is usually-not-
 * appropriate → query the referrer.
 */
function queryReferrerRequest(): CoagulationTestRequest {
	const r = createDefaultRequest();
	r.clinician = {
		...r.clinician,
		clinicianName: 'Dr Lucy Adeyemi',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7211456',
		requesterContact: 'pre-op bleep 4321',
		siteName: 'Pre-operative Assessment Clinic',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Helen',
		lastName: 'Whitcombe',
		dateOfBirth: '1972-01-30',
		nhsNumber: '517 220 6680'
	};
	r.tests.thrombophiliaScreen = true;
	r.clinical = {
		...r.clinical,
		primaryIndication: 'pre-operative',
		clinicalDetails: 'Routine pre-operative work-up before elective hip replacement.'
	};
	r.specimen = { ...r.specimen, specimenCollected: 'no' };
	r.triage = { ...r.triage, urgency: 'routine', setting: 'outpatient' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{ id: 'CG-2026-0001', patientName: 'Margaret Hughes', referralDate: '2026-06-10', request: routineRequest() },
	{ id: 'CG-2026-0002', patientName: 'Anthony Brooks', referralDate: '2026-06-13', request: statDicRequest() },
	{ id: 'CG-2026-0003', patientName: 'Derek Mensah', referralDate: '2026-06-12', request: rejectRiskRequest() },
	{ id: 'CG-2026-0004', patientName: 'Helen Whitcombe', referralDate: '2026-06-14', request: queryReferrerRequest() }
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		primaryIndication: s.request.clinical.primaryIndication,
		testCount: countSelectedTests(s.request.tests),
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		preanalyticalBand: g.preanalyticalBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
