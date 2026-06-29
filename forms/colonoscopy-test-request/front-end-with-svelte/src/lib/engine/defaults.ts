import type { ColonoscopyRequest } from './types';

/**
 * Build a fresh, fully-blank colonoscopy request. Strings default to '';
 * numeric fields default to null; boolean red-flag / medication / fitness
 * fields default to false. Mirrors the legacy HTML engine's `emptyRequest()`.
 */
export function createDefaultRequest(): ColonoscopyRequest {
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
			setting: ''
		},
		request: {
			procedure: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		redFlags: {
			weightLoss: false,
			anaemia: false,
			abdominalMass: false,
			rectalBleeding: false,
			fitResultUgG: null,
			haemoglobinGL: null
		},
		medication: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			antiplateletAgent: '',
			diabetesMedication: ''
		},
		fitness: {
			fitForBowelPrep: false,
			bowelPrepAgent: '',
			chronicKidneyDisease: false,
			egfrMlMin: null,
			asaGrade: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			notes: ''
		}
	};
}
