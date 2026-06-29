import type { PulmonaryFunctionTestRequest } from './types';

/**
 * Build a fresh, fully-blank pulmonary function test request. Strings default
 * to `''`; numeric fields default to `null`; boolean symptom / safety fields
 * default to `false`. Mirrors the HTML front-end's `emptyRequest()`.
 */
export function createDefaultRequest(): PulmonaryFunctionTestRequest {
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
			heightCm: null,
			weightKg: null
		},
		request: {
			testType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			breathlessness: false,
			cough: false,
			wheeze: false
		},
		background: {
			smokingStatus: '',
			currentInhalers: ''
		},
		safety: {
			recentRespiratoryInfection: false,
			recentMiOrEyeAbdominalSurgery: false,
			suspectedActiveTuberculosis: false,
			haemoptysis: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
