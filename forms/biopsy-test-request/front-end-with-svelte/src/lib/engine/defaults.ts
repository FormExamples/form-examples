import type { BiopsyRequestData } from './types';

/**
 * Build a fresh, fully-blank biopsy request. Strings default to '';
 * numeric fields default to null; boolean fields default to false. Mirrors
 * the HTML reference engine's `emptyRequest()` so older saved drafts rehydrate
 * with sensible defaults for newly-added fields.
 *
 * Lives in a plain module (not the Svelte store) so it can be imported by
 * tests and sample data without pulling in `$app` runtime dependencies.
 */
export function createDefaultRequest(): BiopsyRequestData {
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
			bodyMassIndex: null
		},
		procedure: {
			biopsySite: '',
			biopsyMethod: '',
			laterality: '',
			imagingGuidanceRequired: false,
			setting: ''
		},
		indication: {
			primaryIndication: '',
			clinicalQuestion: '',
			relevantHistory: ''
		},
		lesion: {
			lesionDescription: '',
			lesionSize: null,
			lesionLocation: '',
			imagingCorrelate: '',
			previousFinding: ''
		},
		bleeding: {
			takingAnticoagulant: false,
			anticoagulantAgent: '',
			takingAntiplatelet: false,
			antiplateletAgent: '',
			inr: null,
			plateletCount: null,
			bleedingDisorder: false,
			immunosuppressed: false
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			notes: ''
		}
	};
}
