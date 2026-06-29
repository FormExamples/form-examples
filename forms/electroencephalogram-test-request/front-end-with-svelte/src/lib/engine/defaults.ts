import type { EegRequest } from './types';

/**
 * Build a fresh, fully-blank EEG test request. Strings default to '', dates to
 * '', numeric fields would be null, and boolean red-flag / context fields to
 * false — matching the form's empty-value conventions and the canonical empty
 * shape used by every other front-end.
 */
export function createDefaultRequest(): EegRequest {
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
			eegType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		context: {
			seizureFrequency: '',
			currentAntiepileptics: '',
			firstSeizure: false,
			knownEpilepsy: false
		},
		redFlags: {
			recentSeizure: false,
			suspectedStatusEpilepticus: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
