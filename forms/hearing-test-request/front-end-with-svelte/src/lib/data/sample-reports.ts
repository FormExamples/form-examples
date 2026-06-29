import type { HearingRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefault } from '$lib/stores/request.svelte';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: HearingRequest;
}

/**
 * A routine, appropriate request: bilateral age-related hearing loss referred
 * for pure-tone audiometry with a complete request. Grades to accept / routine.
 */
function routineRequest(): HearingRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr Sarah Owen';
	d.clinician.clinicianRole = 'GP';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7012345';
	d.clinician.requesterContact = 'sarah.owen@nhs.net · 01865 000000';
	d.clinician.siteName = 'Headington Medical Practice';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Margaret';
	d.patient.lastName = 'Hughes';
	d.patient.dateOfBirth = '1958-03-14';
	d.patient.nhsNumber = '485 777 3456';
	d.request.testType = 'pure-tone-audiometry';
	d.request.laterality = 'bilateral';
	d.request.primaryIndication = 'hearing-loss';
	d.request.clinicalQuestion =
		'Quantify bilateral hearing loss and advise on hearing-aid candidacy.';
	d.request.relevantHistory = 'Gradual bilateral hearing loss over two years; no otalgia.';
	d.symptoms.hearingLoss = true;
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	return d;
}

/**
 * An emergency request: sudden sensorineural hearing loss in the left ear within
 * the past 30 days. Auto-escalates triage to emergency and clinical priority to
 * high.
 */
function emergencySuddenRequest(): HearingRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr Priya Nair';
	d.clinician.clinicianRole = 'Emergency medicine registrar';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7456120';
	d.clinician.supervisingConsultant = 'Dr H Patel';
	d.clinician.requesterContact = 'ED bleep 1234';
	d.clinician.siteName = 'City General ED';
	d.clinician.referralDate = '2026-06-13';
	d.patient.firstName = 'Anthony';
	d.patient.lastName = 'Brooks';
	d.patient.dateOfBirth = '1965-07-21';
	d.patient.nhsNumber = '309 552 0148';
	d.request.testType = 'pure-tone-audiometry';
	d.request.laterality = 'left';
	d.request.primaryIndication = 'sudden-hearing-loss';
	d.request.clinicalQuestion =
		'Sudden left-sided hearing loss over two days — confirm sensorineural loss for urgent steroid decision.';
	d.request.relevantHistory = 'No trauma, no preceding URTI; left aural fullness and tinnitus.';
	d.symptoms.hearingLoss = true;
	d.symptoms.tinnitus = true;
	d.symptoms.suddenOnset = true;
	d.symptoms.onsetWithinDays = 'within-30-days';
	d.triage.urgency = 'urgent';
	d.triage.setting = 'outpatient';
	return d;
}

/**
 * An urgent request: unilateral asymmetric hearing loss and tinnitus warranting
 * retrocochlear work-up. The unilateral red flag escalates triage to urgent.
 */
function urgentUnilateralRequest(): HearingRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr James Carter';
	d.clinician.clinicianRole = 'ENT specialty doctor';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7099887';
	d.clinician.requesterContact = 'james.carter@nhs.net · 0121 000000';
	d.clinician.siteName = 'Selly Oak ENT Clinic';
	d.clinician.referralDate = '2026-06-12';
	d.patient.firstName = 'Derek';
	d.patient.lastName = 'Mensah';
	d.patient.dateOfBirth = '1971-11-02';
	d.patient.nhsNumber = '402 118 9921';
	d.request.testType = 'auditory-brainstem-response';
	d.request.laterality = 'right';
	d.request.primaryIndication = 'vertigo';
	d.request.clinicalQuestion =
		'Right-sided asymmetric hearing loss with tinnitus and unsteadiness — exclude vestibular schwannoma.';
	d.request.relevantHistory = 'Three-month history of right-sided tinnitus and episodic imbalance.';
	d.symptoms.hearingLoss = true;
	d.symptoms.tinnitus = true;
	d.symptoms.vertigo = true;
	d.triage.urgency = 'routine';
	d.triage.setting = 'outpatient';
	return d;
}

/**
 * A request to query: a clearly mismatched indication / test pairing (newborn
 * hearing screen requested for adult tinnitus) with no clinical question.
 * Grades usually-not-appropriate → query-referrer.
 */
function queryReferrerRequest(): HearingRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr Helen Shah';
	d.clinician.clinicianRole = 'GP';
	d.clinician.registrationBody = 'GMC';
	d.clinician.registrationNumber = '7011224';
	d.clinician.requesterContact = 'helen.shah@nhs.net';
	d.clinician.siteName = 'Riverside Surgery';
	d.clinician.referralDate = '2026-06-14';
	d.patient.firstName = 'Iris';
	d.patient.lastName = 'Bennett';
	d.patient.dateOfBirth = '1980-02-09';
	d.patient.nhsNumber = '500 221 7788';
	d.request.testType = 'newborn-hearing-screen';
	d.request.laterality = 'bilateral';
	d.request.primaryIndication = 'tinnitus';
	d.request.clinicalQuestion = '';
	d.request.relevantHistory = 'Bilateral tinnitus, no hearing concern reported.';
	d.symptoms.tinnitus = true;
	d.triage.urgency = 'routine';
	d.triage.setting = 'community';
	return d;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'HR-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'HR-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: emergencySuddenRequest()
	},
	{
		id: 'HR-2026-0003',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: urgentUnilateralRequest()
	},
	{
		id: 'HR-2026-0004',
		patientName: 'Iris Bennett',
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
		testType: s.request.request.testType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessBand: g.appropriatenessBand,
		appropriatenessScore: g.appropriatenessScore,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		priorityBand: g.priorityBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
