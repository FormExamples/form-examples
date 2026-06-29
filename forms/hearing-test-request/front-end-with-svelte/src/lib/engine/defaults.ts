import type { HearingRequest } from './types';

/**
 * Build a fresh, fully-blank hearing test request.
 *
 * Strings default to `''`; boolean symptom / red-flag fields default to
 * `false`. Mirrors `emptyRequest()` in the HTML front-end's `js/types.js` so
 * newly-added fields default correctly when older saved state is rehydrated.
 */
export function createDefault(): HearingRequest {
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
			testType: '',
			laterality: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			hearingLoss: false,
			tinnitus: false,
			vertigo: false,
			otalgia: false,
			suddenOnset: false,
			onsetWithinDays: '',
			earDischarge: false,
			ototoxicMedication: false
		},
		triage: {
			urgency: 'routine',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
