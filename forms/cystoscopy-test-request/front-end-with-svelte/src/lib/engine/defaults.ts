import type { CystoscopyRequest } from './types';

/**
 * Build a fresh, fully-blank cystoscopy request.
 *
 * Strings default to `''`; numeric fields default to `null`; boolean red-flag /
 * risk fields default to `false`. Mirrors the canonical `emptyRequest()` shape
 * from the HTML front-end so older saved drafts rehydrate correctly.
 */
export function createDefaultRequest(): CystoscopyRequest {
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
			age: null,
			nhsNumber: ''
		},
		request: {
			procedure: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			symptomHaematuria: false,
			symptomDysuria: false,
			symptomFrequency: false,
			symptomRetention: false,
			visibleHaematuria: false,
			currentUti: false
		},
		bleeding: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			previousBladderCancer: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
