import type { SleepStudyRequest } from './types';

/**
 * Build a fresh, fully-blank sleep-study request with every field at its
 * unanswered default: empty string for text / enum fields, `null` for numeric
 * fields, and `false` for boolean symptom / risk fields.
 */
export function createDefaultRequest(): SleepStudyRequest {
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
			bodyMassIndex: null,
			interpreterRequired: false
		},
		request: {
			studyType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		scores: {
			epworthScore: null,
			stopBangScore: null,
			neckCircumferenceCm: null
		},
		symptoms: {
			witnessedApnoeas: false,
			occupationalDriver: false,
			cardiovascularDisease: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
