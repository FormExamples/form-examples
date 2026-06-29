import type { EegRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/stores/request.svelte';

/** A sample EEG request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: EegRequest;
}

/** Combine a patient section's first / last name into a display name. */
function fullName(first: string, last: string): string {
	return [first, last].filter(Boolean).join(' ');
}

/**
 * A routine, appropriate request: suspected epilepsy investigated with a routine
 * awake EEG, complete request. Grades to usually-appropriate / routine / accept.
 */
function routineRequest(): EegRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Sarah Owen',
		clinicianRole: 'GP',
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
		interpreterRequired: false
	};
	r.request = {
		eegType: 'routine-awake',
		primaryIndication: 'suspected-epilepsy',
		clinicalQuestion:
			'Are there interictal epileptiform discharges to support a diagnosis of focal epilepsy?',
		relevantHistory: 'Two witnessed episodes of altered awareness with automatisms over six months.'
	};
	r.context = {
		seizureFrequency: 'Two episodes in six months',
		currentAntiepileptics: 'None.',
		firstSeizure: false,
		knownEpilepsy: false
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-07-20',
		setting: 'outpatient',
		notes: ''
	};
	return r;
}

/**
 * An urgent request: a recent first unprovoked seizure flagged for the
 * first-seizure pathway. Red flag auto-escalates triage to urgent.
 */
function firstSeizureRequest(): EegRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'Emergency medicine doctor',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'Selly Oak Hospital ED',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1991-11-02',
		nhsNumber: '402 118 9921',
		interpreterRequired: false
	};
	r.request = {
		eegType: 'routine-awake',
		primaryIndication: 'first-seizure',
		clinicalQuestion:
			'First unprovoked seizure — please assess for interictal discharges to inform recurrence risk.',
		relevantHistory: 'Single generalised tonic-clonic seizure two days ago; previously well.'
	};
	r.context = {
		seizureFrequency: 'Single episode',
		currentAntiepileptics: 'None.',
		firstSeizure: true,
		knownEpilepsy: false
	};
	r.redFlags = {
		recentSeizure: true,
		suspectedStatusEpilepticus: false
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-06-19',
		setting: 'outpatient',
		notes: 'Refer via first-seizure clinic.'
	};
	return r;
}

/**
 * An emergency request: suspected status epilepticus. Auto-escalates triage to
 * emergency and raises the highest clinical priority.
 */
function statusEpilepticusRequest(): EegRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'Intensive care registrar',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'ICU bleep 1234',
		supervisingConsultant: 'Dr A Khan',
		siteName: 'City General ICU',
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
		eegType: 'routine-awake',
		primaryIndication: 'status-epilepticus',
		clinicalQuestion:
			'Persisting reduced consciousness after convulsions — please assess for non-convulsive status epilepticus.',
		relevantHistory: 'Prolonged convulsive seizure terminated with benzodiazepines; not regaining consciousness.'
	};
	r.context = {
		seizureFrequency: 'Ongoing',
		currentAntiepileptics: 'Levetiracetam loading, midazolam infusion.',
		firstSeizure: false,
		knownEpilepsy: true
	};
	r.redFlags = {
		recentSeizure: true,
		suspectedStatusEpilepticus: true
	};
	r.triage = {
		urgency: 'emergency',
		requestedByDate: '2026-06-13',
		setting: 'inpatient',
		notes: 'On-call neurophysiology informed.'
	};
	return r;
}

/**
 * A request to query: the clinical question implies the EEG is being used to
 * exclude epilepsy, contrary to NICE NG217 — flagged and recommended for a
 * referrer query.
 */
function queryReferrerRequest(): EegRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Helen Brooks',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7188204',
		requesterContact: 'helen.brooks@nhs.net',
		supervisingConsultant: '',
		siteName: 'Cowley Road Surgery',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Olivia',
		lastName: 'Reed',
		dateOfBirth: '1979-02-08',
		nhsNumber: '511 230 7765',
		interpreterRequired: false
	};
	r.request = {
		eegType: 'routine-awake',
		primaryIndication: 'funny-turns',
		clinicalQuestion: 'Normal EEG to reassure the patient this is not epilepsy.',
		relevantHistory: 'Recurrent brief episodes of light-headedness; likely vasovagal.'
	};
	r.context = {
		seizureFrequency: 'Several per month',
		currentAntiepileptics: 'None.',
		firstSeizure: false,
		knownEpilepsy: false
	};
	r.triage = {
		urgency: 'routine',
		requestedByDate: '2026-07-25',
		setting: 'community',
		notes: ''
	};
	return r;
}

/** The sample EEG requests used by the dashboard and seeded into the wizard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'EE-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'EE-2026-0002',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-12',
		request: firstSeizureRequest()
	},
	{
		id: 'EE-2026-0003',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-13',
		request: statusEpilepticusRequest()
	},
	{
		id: 'EE-2026-0004',
		patientName: 'Olivia Reed',
		referralDate: '2026-06-14',
		request: queryReferrerRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName || fullName(s.request.patient.firstName, s.request.patient.lastName),
		eegType: s.request.request.eegType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		triageTier: g.triageTier,
		completenessPercent: g.completenessPercent,
		priorityBand: g.priorityBand,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
