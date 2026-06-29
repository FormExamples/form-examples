import type { RequestData } from './types';

/**
 * Build a fresh, fully-blank vascular angiography request. Strings default to
 * `''`; numeric fields default to `null`; boolean safety / risk fields default
 * to `false`. Newly-added fields therefore default correctly when older saved
 * state is rehydrated from localStorage.
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
			bodyMassIndex: null,
			interpreterRequired: false
		},
		request: {
			angiographyType: '',
			bodyRegion: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		contrast: {
			contrastRequired: '',
			egfr: null,
			contrastAllergy: false,
			diabetes: false,
			metformin: false
		},
		bleeding: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			bleedingDisorder: false
		},
		pregnancy: {
			pregnancyStatus: '',
			irMeRJustification: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
