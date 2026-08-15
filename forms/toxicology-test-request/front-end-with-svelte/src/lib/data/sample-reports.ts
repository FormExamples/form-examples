import type { ToxicologyRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';
import { countSelectedAssays } from '#lib/engine/utils.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: ToxicologyRequest;
}

/**
 * A routine therapeutic-drug-monitoring request: a lithium level for a stable
 * patient. Grades to accept / routine with no flags.
 */
function routineTdmRequest(): ToxicologyRequest {
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
		nhsNumber: '485 777 3456'
	};
	r.assays.lithiumLevel = true;
	r.clinical = {
		primaryIndication: 'therapeutic-drug-monitoring',
		clinicalDetails: 'Stable on lithium for bipolar affective disorder; routine 3-monthly level.',
		suspectedAgent: 'lithium',
		timeSinceIngestionHours: null,
		deliberateOverdose: false,
		symptomatic: false
	};
	r.specimen = { specimenCollected: 'yes', collectionDatetime: '2026-06-10T09:30' };
	r.triage = { urgency: 'routine', requestedByDate: '2026-06-12', setting: 'outpatient', notes: '' };
	return r;
}

/**
 * A stat suspected-overdose request: a paracetamol level sampled at 6 h with a
 * deliberate overdose. Appropriate, timing valid, but auto-escalates to stat.
 */
function overdoseParacetamolRequest(): ToxicologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'emergency-physician',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'ED bleep 1234',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General ED',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1995-07-21',
		nhsNumber: '309 552 0148'
	};
	r.assays.paracetamolLevel = true;
	r.assays.salicylateLevel = true;
	r.clinical = {
		primaryIndication: 'suspected-overdose',
		clinicalDetails: 'Witnessed ingestion of 30 paracetamol tablets 6 h ago; nausea, otherwise stable.',
		suspectedAgent: 'paracetamol',
		timeSinceIngestionHours: 6,
		deliberateOverdose: true,
		symptomatic: false
	};
	r.specimen = { specimenCollected: 'yes', collectionDatetime: '2026-06-13T14:00' };
	r.triage = { urgency: 'urgent', requestedByDate: '2026-06-13', setting: 'emergency', notes: '' };
	return r;
}

/**
 * A stat self-harm request with an early paracetamol level (2 h post-ingestion)
 * — invalid for the nomogram. Drives timing invalid + query-referrer.
 */
function earlyParacetamolRequest(): ToxicologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net',
		supervisingConsultant: '',
		siteName: 'Selly Oak Hospital',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Leah',
		lastName: 'Donnelly',
		dateOfBirth: '2003-02-09',
		nhsNumber: '402 118 9921'
	};
	r.assays.paracetamolLevel = true;
	r.clinical = {
		primaryIndication: 'deliberate-self-harm',
		clinicalDetails: 'Reported ingestion of paracetamol 2 h ago following an argument; tearful, no symptoms.',
		suspectedAgent: 'paracetamol',
		timeSinceIngestionHours: 2,
		deliberateOverdose: true,
		symptomatic: false
	};
	r.specimen = { specimenCollected: 'yes', collectionDatetime: '2026-06-14T19:15' };
	r.triage = { urgency: 'urgent', requestedByDate: '2026-06-14', setting: 'emergency', notes: '' };
	return r;
}

/**
 * An occupational screen ordered with a mismatched assay (lithium level) and no
 * specimen collected. Grades to usually-not-appropriate / query-referrer.
 */
function mismatchedScreenRequest(): ToxicologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Owen Pryce',
		clinicianRole: 'other',
		registrationBody: 'GMC',
		registrationNumber: '7300210',
		requesterContact: 'occ-health@example.org',
		supervisingConsultant: '',
		siteName: 'Occupational Health Service',
		referralDate: '2026-06-15'
	};
	r.patient = {
		firstName: 'Raymond',
		lastName: 'Iqbal',
		dateOfBirth: '1980-12-01',
		nhsNumber: '601 339 2255'
	};
	r.assays.lithiumLevel = true;
	r.clinical = {
		primaryIndication: 'occupational-screen',
		clinicalDetails: 'Pre-placement occupational screen requested by employer.',
		suspectedAgent: '',
		timeSinceIngestionHours: null,
		deliberateOverdose: false,
		symptomatic: false
	};
	r.specimen = { specimenCollected: 'no', collectionDatetime: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'TOX-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineTdmRequest()
	},
	{
		id: 'TOX-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: overdoseParacetamolRequest()
	},
	{
		id: 'TOX-2026-0003',
		patientName: 'Leah Donnelly',
		referralDate: '2026-06-14',
		request: earlyParacetamolRequest()
	},
	{
		id: 'TOX-2026-0004',
		patientName: 'Raymond Iqbal',
		referralDate: '2026-06-15',
		request: mismatchedScreenRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		indication: s.request.clinical.primaryIndication,
		assayCount: countSelectedAssays(s.request.assays),
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		timingBand: g.timingBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
