import type { PetScanRequest } from './types';

/**
 * Build a fresh, fully-blank PET-CT scan request. Strings default to `''`;
 * numeric / date fields default to `null` (numeric) or `''` (date); boolean
 * safety fields default to `false`. The shape is the canonical empty record so
 * newly-added fields default correctly when older saved state is rehydrated.
 */
export function createDefault(): PetScanRequest {
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
			weightKg: null,
			setting: '',
			interpreterRequired: false
		},
		request: {
			scanType: '',
			primaryIndication: '',
			clinicalQuestion: ''
		},
		context: {
			primaryTumourSite: '',
			relevantHistory: '',
			recentChemoRadiotherapy: ''
		},
		preparation: {
			diabetes: false,
			bloodGlucoseMmolL: null,
			pregnancyStatus: '',
			breastfeeding: false,
			egfr: null,
			claustrophobia: false
		},
		justification: {
			irMeRJustification: '',
			urgency: ''
		},
		triage: {
			requestedByDate: '',
			notes: ''
		}
	};
}
