import type { SleepStudyRequest, RequestRow } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/grader';
import { createDefaultRequest } from '$lib/engine/defaults';

/** A sample request: an identifier and the full request the engine grades. */
export interface SampleRequest {
	id: string;
	patientName: string;
	referralDate: string;
	request: SleepStudyRequest;
}

/**
 * A routine, appropriate request: suspected OSA referred for a home sleep
 * apnoea test, fully completed. Grades to accept / routine, low priority.
 */
function routineRequest(): SleepStudyRequest {
	return {
		...createDefaultRequest(),
		clinician: {
			clinicianName: 'Dr Sarah Owen',
			clinicianRole: 'respiratory-physician',
			registrationBody: 'GMC',
			registrationNumber: '7012345',
			requesterContact: 'sarah.owen@nhs.net · 01865 000000',
			supervisingConsultant: '',
			siteName: 'Headington Sleep Clinic',
			referralDate: '2026-06-10'
		},
		patient: {
			firstName: 'Margaret',
			lastName: 'Hughes',
			dateOfBirth: '1958-03-14',
			nhsNumber: '485 777 3456',
			bodyMassIndex: 31.2,
			interpreterRequired: false
		},
		request: {
			studyType: 'home-sleep-apnoea-test',
			primaryIndication: 'suspected-osa',
			clinicalQuestion: 'Confirm or exclude obstructive sleep apnoea and grade severity.',
			relevantHistory: 'Snoring and witnessed pauses reported by partner over six months.'
		},
		scores: { epworthScore: 8, stopBangScore: 4, neckCircumferenceCm: 41 },
		symptoms: { witnessedApnoeas: true, occupationalDriver: false, cardiovascularDisease: false },
		triage: { urgency: 'routine', requestedByDate: '', setting: 'outpatient', notes: '' }
	};
}

/**
 * An urgent request: a vocational driver with severe daytime sleepiness and a
 * high STOP-BANG. Auto-escalates priority to high and triage to urgent (DVLA).
 */
function driverRequest(): SleepStudyRequest {
	return {
		...createDefaultRequest(),
		clinician: {
			clinicianName: 'Dr James Carter',
			clinicianRole: 'sleep-physician',
			registrationBody: 'GMC',
			registrationNumber: '7099887',
			requesterContact: 'james.carter@nhs.net · 0121 000000',
			supervisingConsultant: '',
			siteName: 'Selly Oak Sleep Service',
			referralDate: '2026-06-12'
		},
		patient: {
			firstName: 'Derek',
			lastName: 'Mensah',
			dateOfBirth: '1971-11-02',
			nhsNumber: '402 118 9921',
			bodyMassIndex: 36.4,
			interpreterRequired: false
		},
		request: {
			studyType: 'polysomnography',
			primaryIndication: 'driver-assessment',
			clinicalQuestion:
				'HGV driver with severe sleepiness — confirm OSA and advise on fitness to drive.',
			relevantHistory: 'Falling asleep at the wheel; loud snoring and witnessed apnoeas.'
		},
		scores: { epworthScore: 18, stopBangScore: 6, neckCircumferenceCm: 45 },
		symptoms: { witnessedApnoeas: true, occupationalDriver: true, cardiovascularDisease: true },
		triage: { urgency: 'urgent', requestedByDate: '2026-06-26', setting: 'outpatient', notes: '' }
	};
}

/**
 * A suspected-narcolepsy request routed to MSLT. Moderate priority, routine
 * triage, with a suspected-narcolepsy safety flag.
 */
function narcolepsyRequest(): SleepStudyRequest {
	return {
		...createDefaultRequest(),
		clinician: {
			clinicianName: 'Dr Priya Nair',
			clinicianRole: 'neurologist',
			registrationBody: 'GMC',
			registrationNumber: '7456120',
			requesterContact: 'priya.nair@nhs.net',
			supervisingConsultant: '',
			siteName: 'City Neurology Centre',
			referralDate: '2026-06-13'
		},
		patient: {
			firstName: 'Anthony',
			lastName: 'Brooks',
			dateOfBirth: '1996-07-21',
			nhsNumber: '309 552 0148',
			bodyMassIndex: 24.1,
			interpreterRequired: false
		},
		request: {
			studyType: 'multiple-sleep-latency-test',
			primaryIndication: 'suspected-narcolepsy',
			clinicalQuestion: 'Investigate hypersomnolence and possible cataplexy; assess for narcolepsy.',
			relevantHistory: 'Daytime sleep attacks and possible cataplexy on laughing.'
		},
		scores: { epworthScore: 14, stopBangScore: 1, neckCircumferenceCm: 38 },
		symptoms: { witnessedApnoeas: false, occupationalDriver: false, cardiovascularDisease: false },
		triage: { urgency: 'routine', requestedByDate: '', setting: 'outpatient', notes: '' }
	};
}

/**
 * A mismatched, incomplete request: insomnia referred for a home sleep apnoea
 * test, with no Epworth and no clinical question. Usually-not-appropriate →
 * query-referrer.
 */
function incompleteRequest(): SleepStudyRequest {
	return {
		...createDefaultRequest(),
		clinician: {
			clinicianName: 'Dr Helen Page',
			clinicianRole: 'gp',
			registrationBody: 'GMC',
			registrationNumber: '7321004',
			requesterContact: 'helen.page@nhs.net',
			supervisingConsultant: '',
			siteName: 'Riverside Surgery',
			referralDate: '2026-06-14'
		},
		patient: {
			firstName: 'Joanne',
			lastName: 'Reid',
			dateOfBirth: '1983-02-09',
			nhsNumber: '',
			bodyMassIndex: null,
			interpreterRequired: false
		},
		request: {
			studyType: 'home-sleep-apnoea-test',
			primaryIndication: 'insomnia',
			clinicalQuestion: '',
			relevantHistory: 'Difficulty initiating sleep.'
		},
		scores: { epworthScore: null, stopBangScore: null, neckCircumferenceCm: null },
		symptoms: { witnessedApnoeas: false, occupationalDriver: false, cardiovascularDisease: false },
		triage: { urgency: '', requestedByDate: '', setting: 'community', notes: '' }
	};
}

/** The sample requests used by the dashboard. */
export const sampleRequests: SampleRequest[] = [
	{ id: 'SS-2026-0001', patientName: 'Margaret Hughes', referralDate: '2026-06-10', request: routineRequest() },
	{ id: 'SS-2026-0002', patientName: 'Derek Mensah', referralDate: '2026-06-12', request: driverRequest() },
	{ id: 'SS-2026-0003', patientName: 'Anthony Brooks', referralDate: '2026-06-13', request: narcolepsyRequest() },
	{ id: 'SS-2026-0004', patientName: 'Joanne Reid', referralDate: '2026-06-14', request: incompleteRequest() }
];

/** Grades each sample request with the live engine for the dashboard table. */
export const sampleRequestRows: RequestRow[] = sampleRequests.map((s) => {
	const g = calculateGrade(s.request);
	return {
		id: s.id,
		patientName: s.patientName,
		studyType: s.request.request.studyType,
		primaryIndication: s.request.request.primaryIndication,
		referralDate: s.referralDate,
		appropriatenessScore: g.appropriatenessScore,
		appropriatenessBand: g.appropriatenessBand,
		priorityBand: g.priorityBand,
		completenessPercent: g.completenessPercent,
		triageTier: g.triageTier,
		recommendation: g.recommendation,
		flagCount: g.flags.length
	};
});
