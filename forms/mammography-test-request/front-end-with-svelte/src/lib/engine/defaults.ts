import type { MammographyRequest } from './types';

/** A blank mammography request with all fields at their unanswered defaults. */
export function createDefaultRequest(): MammographyRequest {
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
			examType: '',
			primaryIndication: '',
			laterality: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			symptomLump: false,
			symptomPain: false,
			symptomNippleDischarge: false,
			symptomSkinChange: false,
			symptomNippleInversion: false
		},
		history: {
			previousMammogram: '',
			previousMammogramDate: '',
			familyHistoryBreastCancer: false,
			breastImplants: false,
			pregnancyOrLactating: '',
			hormoneReplacementTherapy: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			siteName: '',
			notes: ''
		}
	};
}
