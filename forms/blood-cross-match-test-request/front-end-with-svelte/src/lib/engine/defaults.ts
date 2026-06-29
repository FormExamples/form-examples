import type { CrossMatchRequest } from './types';

/**
 * Build a fresh, fully-blank blood cross-match / transfusion request.
 * Strings default to `''`; numeric / date-time fields default to `null` or
 * `''`; boolean history / red-flag fields default to `false`. Ported verbatim
 * from the HTML front-end's `emptyRequest()` source of truth.
 */
export function createDefaultRequest(): CrossMatchRequest {
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
			positivePatientIdConfirmed: false
		},
		request: {
			requestType: '',
			component: '',
			unitsRequired: null,
			requestedByDate: '',
			requiredByDatetime: ''
		},
		indication: {
			primaryIndication: '',
			clinicalDetails: '',
			currentHaemoglobin: null,
			currentPlatelets: null,
			acuteCoronarySyndrome: false
		},
		history: {
			patientBloodGroup: '',
			knownAntibodies: false,
			antibodyDetail: '',
			previousTransfusion: false,
			previousTransfusionReaction: false,
			pregnant: false
		},
		sample: {
			sampleCollected: '',
			collectionDatetime: '',
			twoSampleRuleMet: false,
			labellingCheckComplete: false
		},
		triage: {
			urgency: '',
			massiveHaemorrhage: false,
			activeUncontrolledBleeding: false,
			haemodynamicallyUnstable: false,
			setting: '',
			notes: ''
		}
	};
}
