import type { BronchoscopyRequest } from './types';

/**
 * Build a fresh, fully-blank bronchoscopy request.
 *
 * Strings default to `''`; numeric fields (BMI, platelet count) default to
 * `null`; boolean symptom / risk fields default to `false`. Mirrors
 * `emptyRequest()` in the source-of-truth engine
 * (front-end-form-with-html/js/types.js).
 */
export function createDefaultRequest(): BronchoscopyRequest {
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
			procedure: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			symptomHaemoptysis: false,
			haemoptysisSeverity: '',
			symptomCough: false,
			symptomBreathlessness: false,
			symptomWeightLoss: false,
			imagingFindings: ''
		},
		bleeding: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			antiplateletAgent: '',
			plateletCount: null
		},
		procedural: {
			oxygenDependent: false,
			asaGrade: '',
			sedation: '',
			haemodynamicallyUnstable: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
