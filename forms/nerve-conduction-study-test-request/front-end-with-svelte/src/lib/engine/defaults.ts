import type { NerveConductionStudyRequest } from './types';

/**
 * A blank electrodiagnostic request with all fields at their unanswered
 * defaults: strings `''`, booleans `false`. Newly-added fields default
 * correctly when older saved state is rehydrated from localStorage.
 */
export function createDefaultRequest(): NerveConductionStudyRequest {
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
		study: {
			studyType: '',
			region: '',
			laterality: '',
			requestedByDate: ''
		},
		request: {
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		symptoms: {
			symptomNumbness: false,
			symptomWeakness: false,
			symptomPain: false,
			symptomTingling: false,
			symptomDuration: ''
		},
		safety: {
			diabetes: false,
			takingAnticoagulant: false,
			pacemakerOrIcd: false
		},
		triage: {
			urgency: '',
			setting: '',
			notes: ''
		}
	};
}
