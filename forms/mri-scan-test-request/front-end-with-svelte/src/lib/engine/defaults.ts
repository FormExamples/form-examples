import type { MriRequest } from './types';

/**
 * Build a fresh, fully-blank MRI scan request.
 *
 * Strings default to `''`; numeric fields default to `null`; the boolean
 * MRI-safety implant-screen fields default to `false`. Ported from the HTML
 * front-end's `emptyRequest()` so newly-added fields default correctly when
 * older saved state is rehydrated from localStorage.
 */
export function createDefault(): MriRequest {
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
			weightKg: null,
			interpreterRequired: false
		},
		request: {
			bodyRegion: '',
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		contrast: {
			contrastRequired: '',
			egfr: null,
			previousGadoliniumReaction: '',
			pregnancyStatus: ''
		},
		// MRI safety screen — full ferromagnetic / electronic implant checklist.
		safety: {
			pacemakerOrIcd: false,
			cochlearImplant: false,
			aneurysmClip: false,
			metallicForeignBodyEye: false,
			shrapnelOrMetalFragments: false,
			programmableShunt: false,
			neurostimulator: false,
			metalImplantOrProsthesis: false,
			insulinPump: false,
			claustrophobia: false,
			mriSafetyStatus: ''
		},
		priorImaging: {
			relevantPreviousImaging: ''
		},
		logistics: {
			weightVersusBoreLimit: '',
			setting: '',
			siteName: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			notes: ''
		}
	};
}
