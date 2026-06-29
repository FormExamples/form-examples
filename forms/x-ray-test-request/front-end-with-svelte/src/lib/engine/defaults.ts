import type { XRayRequest } from './types';

/**
 * Build a fresh, fully-blank plain-radiograph (X-ray) request. Strings default
 * to ''; numeric / date fields default to null; boolean fields default to
 * false. Mirrors `emptyRequest()` in the HTML source of truth.
 */
export function createDefaultRequest(): XRayRequest {
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
			bodyMassIndex: null
		},
		request: {
			bodyRegion: '',
			laterality: '',
			primaryIndication: ''
		},
		detail: {
			clinicalQuestion: '',
			relevantHistory: ''
		},
		safety: {
			pregnancyStatus: '',
			recentSimilarXray: false,
			irMeRJustification: ''
		},
		practical: {
			mobility: '',
			setting: '',
			requestedByDate: ''
		},
		triage: {
			urgency: '',
			notes: ''
		}
	};
}
