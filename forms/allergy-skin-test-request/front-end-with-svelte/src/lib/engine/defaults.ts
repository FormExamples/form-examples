import type { RequestData } from './types';

/**
 * Build a fresh, fully-blank allergy skin test request.
 *
 * Strings default to `''`; boolean allergen-panel and safety fields default to
 * `false`. Kept in a plain (non-runes) module so it can be imported by the
 * Vitest engine tests and the sample data without pulling in the reactive store.
 */
export function createDefaultRequest(): RequestData {
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
		test: {
			testType: '',
			allergenAeroallergens: false,
			allergenFood: false,
			allergenDrug: false,
			allergenVenom: false,
			allergenLatex: false,
			allergenContact: false
		},
		indication: {
			primaryIndication: '',
			clinicalQuestion: '',
			clinicalDetails: ''
		},
		safety: {
			previousAnaphylaxis: false,
			onAntihistamines: false,
			onBetaBlocker: false,
			currentSkinDisease: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
