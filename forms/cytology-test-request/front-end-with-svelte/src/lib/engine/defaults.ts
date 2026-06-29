import type { CytologyRequest } from './types';

/**
 * A blank cytology specimen request with all fields at their unanswered
 * defaults: strings empty, booleans false, dates empty. Re-exported from the
 * store as the canonical factory for a fresh draft.
 */
export function createDefaultRequest(): CytologyRequest {
	return {
		clinician: {
			clinicianName: '',
			clinicianRole: '',
			registrationBody: '',
			registrationNumber: '',
			requesterContact: '',
			supervisingConsultant: '',
			siteName: '',
			referralDate: ''
		},
		patient: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			nhsNumber: '',
			interpreterRequired: false
		},
		request: {
			specimenType: '',
			specimenSite: '',
			primaryIndication: '',
			clinicalQuestion: '',
			clinicalDetails: ''
		},
		context: {
			hpvTestRequested: false,
			previousAbnormalCytology: '',
			lastMenstrualPeriodDate: ''
		},
		collection: {
			specimenCollected: '',
			collectionDatetime: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
