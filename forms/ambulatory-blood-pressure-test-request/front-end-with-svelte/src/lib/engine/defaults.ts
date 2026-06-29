import type { AbpmRequest } from './types';

/**
 * Build a fresh, fully-blank ABPM request. Strings default to `''`; numeric and
 * date fields default to `null`; boolean symptom / accuracy / medication fields
 * default to `false`. Kept as a plain (non-reactive) factory so it can be used
 * by the engine, the sample data, and the reactive store alike.
 */
export function createDefaultRequest(): AbpmRequest {
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
			testType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		bloodPressure: {
			clinicBpSystolic: null,
			clinicBpDiastolic: null,
			onAntihypertensives: false,
			currentMedications: ''
		},
		symptoms: {
			symptomDizziness: false,
			symptomHeadache: false,
			atrialFibrillation: false,
			pregnant: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
