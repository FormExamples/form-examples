import type { TestField, UrinalysisRequest } from './types';

/**
 * Build a fresh, fully-blank urinalysis test request. Strings default to '';
 * boolean test / symptom / modifier fields default to false. Mirrors the
 * canonical empty shape so older saved state rehydrates correctly.
 */
export function createDefaultRequest(): UrinalysisRequest {
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
		tests: {
			dipstick: false,
			microscopyCultureSensitivity: false,
			albuminCreatinineRatio: false,
			proteinCreatinineRatio: false,
			pregnancyTest: false,
			drugScreen: false,
			cytology: false,
			twentyFourHourCollection: false
		},
		context: {
			primaryIndication: '',
			clinicalDetails: '',
			pregnant: false,
			catheterised: false,
			currentAntibiotics: false
		},
		symptoms: {
			symptomDysuria: false,
			symptomFrequency: false,
			symptomVisibleHaematuria: false,
			symptomLoinPain: false,
			symptomFever: false
		},
		specimen: {
			specimenType: '',
			specimenCollected: '',
			collectionDatetime: ''
		},
		triage: {
			urgency: '',
			setting: '',
			notes: ''
		}
	};
}

/** A requested test catalogue entry. */
export interface TestCatalogueEntry {
	field: TestField;
	label: string;
	tag?: 'malignancy' | 'handling';
}

/**
 * Catalogue of requested tests. `field` is the camelCase key on `tests`;
 * `tag`-bearing tests (cytology, 24-hour collection) carry a preanalytical /
 * handling caveat surfaced in the UI.
 */
export const TESTS: TestCatalogueEntry[] = [
	{ field: 'dipstick', label: 'Dipstick (reagent strip)' },
	{ field: 'microscopyCultureSensitivity', label: 'Microscopy, culture & sensitivity (MC&S)' },
	{ field: 'albuminCreatinineRatio', label: 'Albumin-creatinine ratio (ACR)' },
	{ field: 'proteinCreatinineRatio', label: 'Protein-creatinine ratio (PCR)' },
	{ field: 'pregnancyTest', label: 'Pregnancy test (hCG)' },
	{ field: 'drugScreen', label: 'Drug screen / toxicology' },
	{ field: 'cytology', label: 'Cytology', tag: 'malignancy' },
	{ field: 'twentyFourHourCollection', label: '24-hour collection', tag: 'handling' }
];
