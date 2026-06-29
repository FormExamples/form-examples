import type { UrinalysisRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: UrinalysisRequest;
}

/**
 * A routine, appropriate suspected-UTI screen: dipstick on a midstream sample,
 * complete request. Grades to accept / routine.
 */
function routineUtiRequest(): UrinalysisRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr H Iqbal';
	r.clinician.clinicianRole = 'gp';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7012345';
	r.clinician.requesterContact = 'h.iqbal@nhs.net';
	r.clinician.siteName = 'Headington Medical Practice';
	r.clinician.referralDate = '2026-05-04';
	r.patient.firstName = 'Amara';
	r.patient.lastName = 'Okafor';
	r.patient.dateOfBirth = '1979-02-11';
	r.patient.nhsNumber = '401 234 5678';
	r.tests.dipstick = true;
	r.context.primaryIndication = 'suspected-uti';
	r.context.clinicalDetails = 'Dysuria and frequency for 2 days, otherwise systemically well.';
	r.specimen.specimenType = 'midstream';
	r.specimen.specimenCollected = 'yes';
	r.specimen.collectionDatetime = '2026-05-04T09:30';
	r.triage.urgency = 'routine';
	r.triage.setting = 'community';
	return r;
}

/**
 * A visible-haematuria request: MC&S plus cytology for a haematuria work-up.
 * Visible haematuria auto-escalates triage to urgent and raises the 2WW flag.
 */
function haematuria2wwRequest(): UrinalysisRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr K Mensah';
	r.clinician.clinicianRole = 'gp';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7099887';
	r.clinician.requesterContact = 'k.mensah@nhs.net';
	r.clinician.siteName = 'Selly Oak Surgery';
	r.clinician.referralDate = '2026-05-05';
	r.patient.firstName = 'Sofia';
	r.patient.lastName = 'Bianchi';
	r.patient.dateOfBirth = '1958-08-22';
	r.patient.nhsNumber = '402 345 6789';
	r.tests.microscopyCultureSensitivity = true;
	r.tests.cytology = true;
	r.context.primaryIndication = 'haematuria';
	r.context.clinicalDetails = '68F, single episode of unexplained visible haematuria, no infection symptoms.';
	r.symptoms.symptomVisibleHaematuria = true;
	r.specimen.specimenType = 'midstream';
	r.specimen.specimenCollected = 'yes';
	r.specimen.collectionDatetime = '2026-05-05T11:00';
	r.triage.urgency = 'urgent';
	r.triage.setting = 'outpatient';
	return r;
}

/**
 * A request whose specimen has not yet been collected: MC&S ordered but no
 * sample provided. Preanalytical reject-risk drives a reject recommendation.
 */
function specimenNotCollectedRequest(): UrinalysisRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr L Romano';
	r.clinician.clinicianRole = 'hospital-doctor';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7456120';
	r.clinician.requesterContact = 'ward bleep 4521';
	r.clinician.siteName = 'City General Ward 7';
	r.clinician.referralDate = '2026-05-05';
	r.patient.firstName = 'Petra';
	r.patient.lastName = 'Novak';
	r.patient.dateOfBirth = '1990-12-03';
	r.patient.nhsNumber = '403 456 7890';
	r.tests.microscopyCultureSensitivity = true;
	r.context.primaryIndication = 'suspected-uti';
	r.context.clinicalDetails = 'Recurrent lower-UTI symptoms; awaiting sample.';
	r.specimen.specimenType = 'midstream';
	r.specimen.specimenCollected = 'no';
	r.triage.urgency = 'routine';
	r.triage.setting = 'inpatient';
	return r;
}

/**
 * A suspected-pyelonephritis request: fever with loin pain auto-escalates the
 * triage tier to stat regardless of the other axes.
 */
function pyelonephritisStatRequest(): UrinalysisRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr M Adebayo';
	r.clinician.clinicianRole = 'hospital-doctor';
	r.clinician.registrationBody = 'GMC';
	r.clinician.registrationNumber = '7333221';
	r.clinician.requesterContact = 'ED bleep 1234';
	r.clinician.siteName = 'City General ED';
	r.clinician.referralDate = '2026-05-06';
	r.patient.firstName = 'Layla';
	r.patient.lastName = 'Hassan';
	r.patient.dateOfBirth = '1972-04-17';
	r.patient.nhsNumber = '404 567 8901';
	r.tests.microscopyCultureSensitivity = true;
	r.context.primaryIndication = 'suspected-uti';
	r.context.clinicalDetails = 'Fever, rigors, and right loin pain — query upper-tract infection.';
	r.symptoms.symptomFever = true;
	r.symptoms.symptomLoinPain = true;
	r.symptoms.symptomDysuria = true;
	r.specimen.specimenType = 'midstream';
	r.specimen.specimenCollected = 'yes';
	r.specimen.collectionDatetime = '2026-05-06T08:15';
	r.triage.urgency = 'urgent';
	r.triage.setting = 'emergency';
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{ id: 'UA-2026-0001', patientName: 'Amara Okafor', referralDate: '2026-05-04', request: routineUtiRequest() },
	{ id: 'UA-2026-0002', patientName: 'Sofia Bianchi', referralDate: '2026-05-05', request: haematuria2wwRequest() },
	{ id: 'UA-2026-0003', patientName: 'Petra Novak', referralDate: '2026-05-05', request: specimenNotCollectedRequest() },
	{ id: 'UA-2026-0004', patientName: 'Layla Hassan', referralDate: '2026-05-06', request: pyelonephritisStatRequest() }
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		referralDate: s.referralDate,
		indication: s.request.context.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		preanalyticalBand: g.preanalyticalBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
