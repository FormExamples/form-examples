import type { EyeVisionRequest } from './types';

/**
 * Build a fresh, fully-blank eye vision test request. Strings default to `''`;
 * boolean red-flag / risk fields default to `false`. Mirrors the canonical
 * empty shape so newly-added fields default correctly when older saved state is
 * rehydrated from localStorage.
 */
export function createDefaultRequest(): EyeVisionRequest {
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
			reducedVision: false,
			suddenLoss: false,
			flashesFloaters: false,
			eyePain: false,
			redEye: false
		},
		riskFactors: {
			diabetes: false,
			knownGlaucoma: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
