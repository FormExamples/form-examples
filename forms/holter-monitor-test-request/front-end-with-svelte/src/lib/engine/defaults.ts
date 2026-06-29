import type { HolterRequest } from './types';

/**
 * Build a fresh, fully-blank ambulatory ECG (Holter) monitoring request.
 * Strings default to `''`; numeric fields default to `null`; boolean symptom /
 * red-flag fields default to `false`.
 */
export function createDefaultRequest(): HolterRequest {
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
			monitorType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			palpitations: false,
			syncope: false,
			presyncope: false,
			breathlessness: false,
			symptomFrequency: ''
		},
		cardiac: {
			knownArrhythmia: '',
			recentStrokeTia: false,
			relevantMedications: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
