import type { HolterRequest, RequestRow } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: HolterRequest;
}

/**
 * A routine, appropriate request: frequent palpitations with a matched 24-hour
 * Holter and a complete request. Grades to accept / routine.
 */
function routineRequest(): HolterRequest {
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
		bodyMassIndex: 27.4
	};
	r.request = {
		monitorType: '24-hour',
		primaryIndication: 'palpitations',
		clinicalQuestion: 'Daily palpitations — capture the rhythm during a typical episode.',
		relevantHistory: 'Several months of daily brief palpitations, no syncope.'
	};
	r.symptoms = {
		palpitations: true,
		syncope: false,
		presyncope: false,
		breathlessness: false,
		symptomFrequency: 'daily'
	};
	r.cardiac = { knownArrhythmia: '', recentStrokeTia: false, relevantMedications: 'Bisoprolol 2.5 mg OD.' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/**
 * An emergency request: unexplained syncope with presyncope, monitored with a
 * matched 14-day recorder. Syncope auto-escalates triage to emergency.
 */
function syncopeRequest(): HolterRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Priya Nair',
		clinicianRole: 'Cardiology registrar',
		registrationBody: 'GMC',
		registrationNumber: '7456120',
		requesterContact: 'cardiology bleep 1234',
		supervisingConsultant: 'Dr H Patel',
		siteName: 'City General Hospital',
		referralDate: '2026-06-12'
	};
	r.patient = {
		firstName: 'Anthony',
		lastName: 'Brooks',
		dateOfBirth: '1949-11-02',
		nhsNumber: '402 118 9921',
		bodyMassIndex: 24.1
	};
	r.request = {
		monitorType: '14-day',
		primaryIndication: 'syncope',
		clinicalQuestion: 'Recurrent unexplained syncope — exclude an arrhythmic cause.',
		relevantHistory: 'Two collapses in the last month with no prodrome; normal resting ECG.'
	};
	r.symptoms = {
		palpitations: false,
		syncope: true,
		presyncope: true,
		breathlessness: false,
		symptomFrequency: 'monthly'
	};
	r.cardiac = { knownArrhythmia: '', recentStrokeTia: false, relevantMedications: 'Ramipril 5 mg OD.' };
	r.triage = { urgency: 'urgent', requestedByDate: '2026-06-19', setting: 'outpatient', notes: '' };
	return r;
}

/**
 * An urgent request: post-stroke AF screen with a recent stroke, monitored with
 * a 14-day recorder. Recent stroke / TIA auto-escalates triage to urgent.
 */
function postStrokeRequest(): HolterRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr James Carter',
		clinicianRole: 'Stroke physician',
		registrationBody: 'GMC',
		registrationNumber: '7099887',
		requesterContact: 'james.carter@nhs.net · 0121 000000',
		supervisingConsultant: '',
		siteName: 'Selly Oak Stroke Unit',
		referralDate: '2026-06-13'
	};
	r.patient = {
		firstName: 'Derek',
		lastName: 'Mensah',
		dateOfBirth: '1951-07-21',
		nhsNumber: '309 552 0148',
		bodyMassIndex: 29.8
	};
	r.request = {
		monitorType: '14-day',
		primaryIndication: 'post-stroke-af-screen',
		clinicalQuestion: 'Cryptogenic stroke — prolonged monitoring to detect paroxysmal AF.',
		relevantHistory: 'Ischaemic stroke three weeks ago; sinus rhythm on admission ECG.'
	};
	r.symptoms = {
		palpitations: false,
		syncope: false,
		presyncope: false,
		breathlessness: false,
		symptomFrequency: 'weekly'
	};
	r.cardiac = {
		knownArrhythmia: '',
		recentStrokeTia: true,
		relevantMedications: 'Clopidogrel, atorvastatin.'
	};
	r.triage = { urgency: 'urgent', requestedByDate: '', setting: 'inpatient', notes: '' };
	return r;
}

/**
 * A redirect request: rare palpitations requested on a 24-hour Holter — too
 * short for the symptom frequency, so the monitor mismatches and the engine
 * recommends redirection to a longer / event recorder.
 */
function mismatchRequest(): HolterRequest {
	const r = createDefaultRequest();
	r.clinician = {
		clinicianName: 'Dr Helen Cross',
		clinicianRole: 'GP',
		registrationBody: 'GMC',
		registrationNumber: '7033221',
		requesterContact: 'helen.cross@nhs.net',
		supervisingConsultant: '',
		siteName: 'Cowley Road Surgery',
		referralDate: '2026-06-14'
	};
	r.patient = {
		firstName: 'Susan',
		lastName: 'Patel',
		dateOfBirth: '1972-02-09',
		nhsNumber: '517 904 2210',
		bodyMassIndex: 23.0
	};
	r.request = {
		monitorType: '24-hour',
		primaryIndication: 'palpitations',
		clinicalQuestion: 'Infrequent palpitations — capture the rhythm during an episode.',
		relevantHistory: 'Palpitations roughly once every few weeks, lasting seconds.'
	};
	r.symptoms = {
		palpitations: true,
		syncope: false,
		presyncope: false,
		breathlessness: false,
		symptomFrequency: 'rare'
	};
	r.cardiac = { knownArrhythmia: '', recentStrokeTia: false, relevantMedications: '' };
	r.triage = { urgency: 'routine', requestedByDate: '', setting: 'community', notes: '' };
	return r;
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{
		id: 'HMR-2026-0001',
		patientName: 'Margaret Hughes',
		referralDate: '2026-06-10',
		request: routineRequest()
	},
	{
		id: 'HMR-2026-0002',
		patientName: 'Anthony Brooks',
		referralDate: '2026-06-12',
		request: syncopeRequest()
	},
	{
		id: 'HMR-2026-0003',
		patientName: 'Derek Mensah',
		referralDate: '2026-06-13',
		request: postStrokeRequest()
	},
	{
		id: 'HMR-2026-0004',
		patientName: 'Susan Patel',
		referralDate: '2026-06-14',
		request: mismatchRequest()
	}
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		monitorType: s.request.request.monitorType,
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
