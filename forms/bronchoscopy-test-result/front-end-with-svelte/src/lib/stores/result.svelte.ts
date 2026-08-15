import { browser } from '$app/env';
import type { BronchoscopyResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'bronchoscopy-test-result.front-end-with-svelte.v1';

/** A blank bronchoscopy result with all fields at their unanswered defaults. */
export function createDefaultResult(): BronchoscopyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		procedure: '',
		sedationUsed: '',
		extentExamined: '',
		clinicalHistory: '',
		findingsNarrative: '',
		endobronchialLesion: false,
		mucosalAbnormality: false,
		extrinsicCompression: false,
		bleeding: false,
		foreignBody: false,
		secretionsPurulent: false,
		normalExamination: false,
		lesionLocation: '',
		samplesTaken: '',
		complication: '',
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
 * Svelte 5 reactive store for the bronchoscopy result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<BronchoscopyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<BronchoscopyResult>;
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
