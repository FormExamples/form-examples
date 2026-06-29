import type { GeneticTestRequest } from './types';

/**
 * Build a fresh, fully-blank clinical genetics / genomic test request with every
 * field at its unanswered default. Strings and enums default to `''`; date
 * fields default to `''`; boolean fields default to `false`.
 *
 * This is the single source of the empty shape: the store re-exports it, and
 * the sample fixtures spread it.
 */
export function createDefaultRequest(): GeneticTestRequest {
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
			addressLine: ''
		},
		request: {
			testType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			requestedByDate: ''
		},
		clinical: {
			clinicalDetails: '',
			suspectedCondition: '',
			familyHistory: '',
			affectedRelativeTested: false
		},
		consent: {
			consentObtained: false,
			geneticCounsellingOffered: false
		},
		triage: {
			specimenType: '',
			urgency: '',
			setting: '',
			notes: ''
		}
	};
}
