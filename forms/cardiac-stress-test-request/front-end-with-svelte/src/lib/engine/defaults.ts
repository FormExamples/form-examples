import type { StressTestRequest } from './types';

/**
 * Build a fresh, fully-blank cardiac stress test request. Strings default to
 * `''`; numeric / date fields default to `null` / `''`; boolean symptom and
 * risk fields default to `false`. New fields default correctly here so older
 * saved state rehydrated from localStorage merges cleanly.
 */
export function createDefaultRequest(): StressTestRequest {
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
			bodyMassIndex: null
		},
		request: {
			testType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			symptomChestPain: false,
			symptomBreathlessness: false,
			symptomPalpitations: false,
			ableToExercise: false,
			restingEcgFindings: ''
		},
		safety: {
			knownCoronaryArteryDisease: false,
			recentAcuteCoronarySyndrome: false,
			aorticStenosis: '',
			uncontrolledHypertension: false,
			betaBlocker: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
