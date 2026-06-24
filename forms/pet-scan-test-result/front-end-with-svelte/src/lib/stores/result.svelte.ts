import { browser } from '$app/environment';
import type { PetScanResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'pet-scan-test-result.front-end-with-svelte.v1';

/** A blank PET scan result with all fields at their unanswered defaults. */
export function createDefaultResult(): PetScanResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		scanType: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		clinicalHistory: '',
		bloodGlucoseMmolL: null,
		injectedActivityMbq: null,
		examinationAdequacy: '',
		findingsNarrative: '',
		hypermetabolicLesion: false,
		nodalUptake: false,
		distantMetastasis: false,
		noAbnormalUptake: false,
		physiologicalUptakeOnly: false,
		incidentalFinding: false,
		suvMax: null,
		largestLesionSizeMm: null,
		comparisonWithPrevious: '',
		treatmentResponse: '',
		impression: '',
		reportingCategory: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the PET scan result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<PetScanResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<PetScanResult>;
					this.data = { ...createDefaultResult(), ...parsed };
				} catch {
					// Ignore corrupt storage and start fresh.
				}
			}

			// Persist on every change.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
				});
			});
		}
	}

	reset() {
		this.data = createDefaultResult();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(STORAGE_KEY);
		}
	}
}

export const resultStore = new ResultStore();
