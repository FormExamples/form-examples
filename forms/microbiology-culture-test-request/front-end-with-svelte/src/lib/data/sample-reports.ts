import type { MicrobiologyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: MicrobiologyRequest;
}

/**
 * A routine, appropriate request: midstream urine MC&S for a UTI, fully
 * complete. Grades to accept / routine.
 */
function routineUrineRequest(): MicrobiologyRequest {
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
	r.specimen = {
		specimenType: 'urine',
		specimenSiteDetail: 'Midstream urine',
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-10T09:30'
	};
	r.tests.cultureAndSensitivity = true;
	r.clinical = {
		primaryIndication: 'urinary-tract-infection',
		clinicalDetails: 'Dysuria and urinary frequency for three days; afebrile, no flank pain.',
		fever: false,
		currentAntibiotics: false,
		antibioticName: '',
		recentTravel: false,
		immunocompromised: false
	};
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/**
 * A stat request: suspected sepsis with a blood culture taken before
 * antibiotics. Auto-escalates triage to stat (NICE NG51).
 */
function sepsisBloodCultureRequest(): MicrobiologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'hospital-doctor',
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
		dateOfBirth: '1965-07-21',
		nhsNumber: '309 552 0148'
	};
	r.specimen = {
		specimenType: 'blood-culture',
		specimenSiteDetail: 'Peripheral venous, two sets',
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-13T22:10'
	};
	r.tests.cultureAndSensitivity = true;
	r.tests.gramStain = true;
	r.clinical = {
		primaryIndication: 'suspected-sepsis',
		clinicalDetails:
			'Pyrexia 39.4°C, tachycardia, hypotension and confusion; NEWS2 9. Cultures before first dose.',
		fever: true,
		currentAntibiotics: false,
		antibioticName: '',
		recentTravel: false,
		immunocompromised: false
	};
	r.triage = { urgency: 'urgent', requestedByDate: '', setting: 'emergency', notes: '' };
	return r;
}

/**
 * A reject-risk request: blood culture requested while the patient is already
 * on antibiotics. Drives pre-analytical to reject-risk → reject.
 */
function bloodCultureOnAntibioticsRequest(): MicrobiologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'ward bleep 4567',
		supervisingConsultant: '',
		siteName: 'Selly Oak Hospital',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921'
	};
	r.specimen = {
		specimenType: 'blood-culture',
		specimenSiteDetail: 'Peripheral venous',
		specimenCollected: 'yes',
		collectionDatetime: '2026-06-12T14:00'
	};
	r.tests.cultureAndSensitivity = true;
	r.clinical = {
		primaryIndication: 'pyrexia-unknown-origin',
		clinicalDetails: 'Persistent low-grade pyrexia; already commenced on IV co-amoxiclav yesterday.',
		fever: true,
		currentAntibiotics: true,
		antibioticName: 'Co-amoxiclav',
		recentTravel: false,
		immunocompromised: false
	};
	r.triage = { urgency: 'urgent', requestedByDate: '', setting: 'inpatient', notes: '' };
	return r;
}

/**
 * An incomplete request: wound swab ordered but the specimen has not been
 * collected and clinical details are absent. Reject-risk + low completeness.
 */
function incompleteWoundRequest(): MicrobiologyRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Nurse Aisha Khan',
		clinicianRole: 'nurse',
		registrationBody: 'NMC',
		registrationNumber: '',
		requesterContact: '',
		supervisingConsultant: '',
		siteName: 'Community Clinic',
		referralDate: ''
	};
	r.patient = {
		firstName: 'Lewis',
		lastName: 'Grant',
		dateOfBirth: '',
		nhsNumber: ''
	};
	r.specimen = {
		specimenType: 'wound-swab',
		specimenSiteDetail: 'Left leg ulcer',
		specimenCollected: 'no',
		collectionDatetime: ''
	};
	r.tests.cultureAndSensitivity = true;
	r.clinical = {
		primaryIndication: 'wound-infection',
		clinicalDetails: '',
		fever: false,
		currentAntibiotics: false,
		antibioticName: '',
		recentTravel: false,
		immunocompromised: false
	};
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'MC-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineUrineRequest()
	},
	{
		id: 'MC-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: sepsisBloodCultureRequest()
	},
	{
		id: 'MC-2026-0003',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: bloodCultureOnAntibioticsRequest()
	},
	{
		id: 'MC-2026-0004',
		patientName: 'Lewis Grant',
		referralDate: '2026-06-11',
		request: incompleteWoundRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		specimenType: s.request.specimen.specimenType,
		primaryIndication: s.request.clinical.primaryIndication,
		appropriatenessBand: g.appropriatenessBand,
		preanalyticalBand: g.preanalyticalBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
