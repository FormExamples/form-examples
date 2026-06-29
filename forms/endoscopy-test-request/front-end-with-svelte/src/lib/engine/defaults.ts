import type { EndoscopyRequest } from './types';

/**
 * Build a fresh, fully-blank GI endoscopy request.
 * Strings default to ''; numeric / date fields default to null; boolean
 * red-flag / risk / infection fields default to false.
 */
export function createDefaultRequest(): EndoscopyRequest {
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
			requestedProcedure: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		redFlags: {
			redFlagDysphagia: false,
			redFlagWeightLoss: false,
			redFlagAnaemia: false,
			redFlagGiBleeding: false,
			redFlagAbdominalMass: false,
			redFlagAgeOver55: false,
			fitResultUgG: null,
			haemoglobinGL: null,
			ferritinUgL: null
		},
		medication: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			antiplateletAgent: '',
			diabetesMedication: '',
			allergies: '',
			latexAllergy: false
		},
		comorbidities: {
			cardiacNyhaClass: '',
			pacemakerIcd: false,
			chronicKidneyDisease: false,
			egfrMlMin: null,
			sleepApnoea: false,
			neutropenia: false,
			asaGrade: ''
		},
		infectionPrep: {
			vcjdRisk: false,
			cpeCarriage: false,
			mrsa: false,
			bloodBorneVirus: false,
			fitForBowelPrep: false,
			bowelPrepAgent: '',
			sedation: '',
			escortAvailable: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
