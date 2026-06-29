import type { MicrobiologyRequest } from './types';

/**
 * Build a fresh, fully-blank microbiology culture request. Strings and enum
 * fields default to ''; boolean test and clinical-factor fields default to
 * false. So newly-added fields default correctly when older saved state is
 * rehydrated from localStorage.
 */
export function createDefaultRequest(): MicrobiologyRequest {
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
		specimen: {
			specimenType: '',
			specimenSiteDetail: '',
			specimenCollected: '',
			collectionDatetime: ''
		},
		tests: {
			cultureAndSensitivity: false,
			gramStain: false,
			acidFastBacilliTb: false,
			fungalCulture: false,
			pcrMolecular: false,
			cDifficileToxin: false,
			mrsaScreen: false
		},
		clinical: {
			primaryIndication: '',
			clinicalDetails: '',
			fever: false,
			currentAntibiotics: false,
			antibioticName: '',
			recentTravel: false,
			immunocompromised: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
