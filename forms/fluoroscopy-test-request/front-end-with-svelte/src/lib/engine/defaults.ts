import type { FluoroscopyRequest } from './types';

/**
 * Build a fresh, fully-blank fluoroscopy / contrast-study request. Strings
 * default to ''; numeric / date fields default to null; boolean risk fields
 * default to false. This is the canonical empty shape used by the store, the
 * sample fixtures, and the tests.
 */
export function createDefaultRequest(): FluoroscopyRequest {
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
			studyType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		safety: {
			pregnancyStatus: '',
			contrastAllergy: false,
			aspirationRisk: false,
			diabetes: false,
			irMeRJustification: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
