import type { LumbarPunctureRequest } from './types';

/**
 * Build a fresh, fully-blank lumbar puncture request. Strings default to `''`;
 * numeric fields default to `null`; boolean safety fields default to `false`.
 */
export function createDefaultRequest(): LumbarPunctureRequest {
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
			nhsNumber: ''
		},
		procedure: {
			procedureIntent: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		neuroSafety: {
			suspectedRaisedIntracranialPressure: false,
			focalNeurologicalSigns: false,
			reducedConsciousness: false,
			ctHeadStatus: ''
		},
		bleeding: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			antiplateletAgent: '',
			inr: null,
			plateletCount: null,
			bleedingDisorder: false,
			localSkinInfection: false
		},
		triage: {
			openingPressureRequired: false,
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
