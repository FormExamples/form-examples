import type { EcgRequest } from './types';

/**
 * Build a fresh, fully-blank ECG test request.
 *
 * Strings default to ''; date fields default to ''; boolean symptom / red-flag
 * fields default to false. Mirrors the canonical `emptyRequest()` shape from the
 * HTML front-end so older saved state rehydrates with sensible defaults.
 */
export function createDefaultRequest(): EcgRequest {
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
			ecgType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			symptomChestPain: false,
			symptomPalpitations: false,
			symptomSyncope: false,
			symptomBreathlessness: false,
			symptomDizziness: false,
			currentlySymptomatic: false,
			suspectedAcs: false,
			knownArrhythmia: ''
		},
		medications: {
			relevantMedications: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			siteName: '',
			notes: ''
		}
	};
}
