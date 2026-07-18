import type { NuclearMedicineRequest } from './types';

/**
 * Build a fresh, fully-blank nuclear medicine request.
 *
 * Strings default to `''`; numeric fields default to `null`; the boolean
 * radiation-safety fields default to `false`. Ported from the HTML
 * front-end's `emptyRequest()` so newly-added fields default correctly when
 * older saved state is rehydrated from localStorage.
 */
export function createDefault(): NuclearMedicineRequest {
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
			weightKg: null
		},
		request: {
			scanType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		safety: {
			pregnancyStatus: '',
			breastfeeding: false,
			egfr: null,
			recentOtherNuclearScan: false
		},
		justification: {
			irMeRJustification: '',
			supervisingConsultant: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
