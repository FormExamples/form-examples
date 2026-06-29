import type { TumorMarkerRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { countSelectedMarkers } from '$lib/engine/markers';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: TumorMarkerRequest;
}

/**
 * Appropriate, complete suspected-ovarian-cancer request: CA125 for suspected
 * malignancy. Auto-escalates to two-week-wait (CA125 + suspected malignancy per
 * NICE NG12). Grades usually-appropriate / two-week-wait.
 */
function suspectedOvarianRequest(): TumorMarkerRequest {
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
	r.markers.ca125 = true;
	r.context = {
		primaryIndication: 'suspected-malignancy',
		clinicalDetails:
			'Postmenopausal woman with three months of abdominal distension, bloating, and a palpable pelvic mass.',
		knownCancerSite: 'Ovary (suspected)',
		onTreatment: false,
		previousMarkerValue: null,
		previousMarkerDate: ''
	};
	r.triage = {
		urgency: 'two-week-wait',
		requestedByDate: '2026-06-24',
		setting: 'community',
		notes: ''
	};
	return r;
}

/**
 * Routine, appropriate monitoring request: CEA for colorectal recurrence
 * surveillance with a prior baseline value and date. Grades accept / routine,
 * interpretation ok.
 */
function colorectalMonitoringRequest(): TumorMarkerRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'oncologist',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net',
		supervisingConsultant: '',
		siteName: 'City General Oncology',
		referralDate: '2026-06-11'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1955-09-02',
		nhsNumber: '402 118 9921'
	};
	r.markers.carcinoembryonicAntigenCea = true;
	r.context = {
		primaryIndication: 'recurrence-surveillance',
		clinicalDetails:
			'Stage III colorectal cancer, completed adjuvant chemotherapy 6 months ago; routine surveillance.',
		knownCancerSite: 'Colorectal',
		onTreatment: false,
		previousMarkerValue: 2.1,
		previousMarkerDate: '2026-03-12'
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '',
		setting: 'outpatient',
		notes: 'Compare against the March baseline.'
	};
	return r;
}

/**
 * Screening misuse: PSA requested as broad high-risk screening. Forces
 * misuse-risk interpretation and usually-not-appropriate; recommendation
 * redirects / queries the referrer.
 */
function screeningMisuseRequest(): TumorMarkerRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'priya.nair@nhs.net',
		supervisingConsultant: '',
		siteName: 'Selly Oak Surgery',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1968-07-21',
		nhsNumber: '309 552 0148'
	};
	r.markers.psa = true;
	r.markers.ca19_9 = true;
	r.context = {
		primaryIndication: 'screening-high-risk',
		clinicalDetails: 'Asymptomatic; patient requests a "cancer check" panel.',
		knownCancerSite: '',
		onTreatment: false,
		previousMarkerValue: null,
		previousMarkerDate: ''
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '',
		setting: 'community',
		notes: ''
	};
	return r;
}

/**
 * Marker-indication mismatch and missing clinical details: CA15-3 (a breast
 * monitoring marker) requested for suspected malignancy, with no clinical
 * details. Grades may-be-appropriate with reduced completeness.
 */
function mismatchIncompleteRequest(): TumorMarkerRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Helen Patel',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7333210',
		requesterContact: 'ward bleep 2210',
		supervisingConsultant: 'Dr M Okafor',
		siteName: 'City General Ward 12',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Joan',
		lastName: 'Reed',
		dateOfBirth: '1949-11-30',
		nhsNumber: '610 223 7788'
	};
	r.markers.ca15_3 = true;
	r.context = {
		primaryIndication: 'suspected-malignancy',
		clinicalDetails: '',
		knownCancerSite: '',
		onTreatment: false,
		previousMarkerValue: null,
		previousMarkerDate: ''
	};
	r.triage = {
		urgency: 'urgent',
		requestedByDate: '2026-06-20',
		setting: 'inpatient',
		notes: ''
	};
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'TM-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: suspectedOvarianRequest()
	},
	{
		id: 'TM-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-11',
		request: colorectalMonitoringRequest()
	},
	{
		id: 'TM-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-12',
		request: screeningMisuseRequest()
	},
	{
		id: 'TM-2026-0004',
		patientName: 'Joan Reed',
		referralDate: '2026-06-13',
		request: mismatchIncompleteRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		indication: s.request.context.primaryIndication,
		markerCount: countSelectedMarkers(s.request.markers),
		urgency: s.request.triage.urgency,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		interpretationBand: g.interpretationBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
