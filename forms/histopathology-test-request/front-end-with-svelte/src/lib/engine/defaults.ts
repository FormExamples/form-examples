import type { HistopathologyRequest } from './types';

/**
 * Build a fresh, fully-blank tissue histopathology request.
 *
 * Strings default to `''`; numeric fields default to `null`; boolean red-flag
 * fields default to `false`. Mirrors the source-of-truth `emptyRequest()` in
 * the HTML front-end so saved drafts rehydrate with the correct shape.
 */
export function createDefaultRequest(): HistopathologyRequest {
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
		specimen: {
			specimenType: '',
			specimenSite: '',
			numberOfSpecimens: null,
			fixative: '',
			specimenLabelled: false
		},
		indication: {
			primaryIndication: '',
			clinicalQuestion: '',
			clinicalDetails: '',
			provisionalDiagnosis: '',
			previousHistology: ''
		},
		urgency: {
			urgentFrozenSection: false,
			twoWeekWait: false,
			urgency: ''
		},
		triage: {
			setting: '',
			requestedByDate: '',
			notes: ''
		}
	};
}
