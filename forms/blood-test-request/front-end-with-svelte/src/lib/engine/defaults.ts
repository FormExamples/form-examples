import type { BloodTestRequest, PanelsSection } from './types';
import { PANELS } from './panels';

/** Build a fresh `panels` section with every panel unselected. */
function emptyPanels(): PanelsSection {
	const panels = {} as PanelsSection;
	for (const p of PANELS) panels[p.field] = false;
	return panels;
}

/**
 * Build a fresh, fully-blank blood-test request. Strings default to `''`;
 * date / time fields default to `''`; boolean panel / safety fields default to
 * `false`. Newly-added fields therefore default correctly when older saved
 * state is rehydrated from localStorage.
 */
export function createDefaultRequest(): BloodTestRequest {
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
		panels: emptyPanels(),
		clinical: {
			primaryIndication: '',
			clinicalDetails: '',
			relevantMedications: ''
		},
		preanalytical: {
			fastingRequired: false,
			fastingStatus: '',
			specimenCollected: '',
			collectionDate: '',
			collectionTime: ''
		},
		safety: {
			knownBloodBorneVirus: false,
			difficultVenousAccess: false
		},
		triage: {
			urgency: '',
			setting: '',
			notes: ''
		}
	};
}
