import type { UltrasoundRequest } from './types';

/**
 * Build a fresh, fully-blank general ultrasound request. Strings default to '';
 * numeric / date fields default to null / ''; boolean prep / red-flag fields
 * default to false. Newly-added fields default correctly when older saved state
 * is rehydrated from localStorage.
 */
export function createDefaultRequest(): UltrasoundRequest {
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
			bodyMassIndex: null,
			interpreterRequired: false
		},
		request: {
			bodyRegion: '',
			laterality: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: '',
			previousScanFinding: '',
			previousScanDate: ''
		},
		prep: {
			fastingRequired: false,
			fullBladderRequired: false
		},
		redFlags: {
			suspectedDvt: false,
			suspectedTesticularTorsion: false,
			suspectedAaa: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
