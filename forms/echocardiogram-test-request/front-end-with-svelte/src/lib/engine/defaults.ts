import type { EchoRequest } from './types';

/**
 * Build a fresh, fully-blank echocardiogram request. Strings default to '';
 * numeric / date fields default to null / ''; boolean symptom and red-flag
 * fields default to false. Mirrors the HTML engine's `emptyRequest()`.
 */
export function createDefaultRequest(): EchoRequest {
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
			heightAsCm: null,
			weightAsKg: null,
			bodyMassIndex: null
		},
		request: {
			echoType: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: '',
			relevantMedications: '',
			previousEcho: '',
			previousEchoDate: '',
			ejectionFractionKnown: null
		},
		symptoms: {
			breathlessness: false,
			chestPain: false,
			palpitations: false,
			syncope: false,
			oedema: false,
			nyhaClass: ''
		},
		investigations: {
			ecgFindings: '',
			bnpOrNtProbnp: null,
			knownMurmur: false,
			onCardiotoxicChemotherapy: false
		},
		redFlags: {
			suspectedEndocarditis: false,
			severeSymptomaticValve: false,
			acuteHeartFailure: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
