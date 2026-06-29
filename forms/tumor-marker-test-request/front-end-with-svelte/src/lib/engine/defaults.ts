// ──────────────────────────────────────────────
// Tumor Marker Test Request — blank request factory
//
// Builds the canonical empty `TumorMarkerRequest`. Strings default to '';
// numeric / date fields default to null / ''; boolean marker / context fields
// default to false. Ported from the HTML front-end's js/types.js emptyRequest().
// Re-exported by the store as `createDefaultRequest`.
// ──────────────────────────────────────────────

import type { TumorMarkerRequest } from './types';

/** A blank serum tumour-marker request with all fields at their unanswered defaults. */
export function createDefaultRequest(): TumorMarkerRequest {
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
		markers: {
			psa: false,
			ca125: false,
			ca19_9: false,
			carcinoembryonicAntigenCea: false,
			alphaFetoproteinAfp: false,
			betaHcg: false,
			ca15_3: false,
			lactateDehydrogenaseLdh: false,
			calcitonin: false,
			chromograninA: false
		},
		context: {
			primaryIndication: '',
			clinicalDetails: '',
			knownCancerSite: '',
			onTreatment: false,
			previousMarkerValue: null,
			previousMarkerDate: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
