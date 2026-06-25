import { browser } from '$app/environment';
import type { CystoscopyResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'cystoscopy-test-result.front-end-with-svelte.v1';

/** A blank cystoscopy result with all fields at their unanswered defaults. */
export function createDefaultResult(): CystoscopyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		procedure: '',
		anaesthesia: '',
		clinicalHistory: '',
		findingsNarrative: '',
		bladderTumour: false,
		inflammationCystitis: false,
		bladderStones: false,
		urethralStricture: false,
		trabeculation: false,
		prostaticEnlargement: false,
		normalExamination: false,
		tumourSizeMm: null,
		tumourAppearance: '',
		biopsyTaken: false,
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
 * Svelte 5 reactive store for the cystoscopy result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<CystoscopyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<CystoscopyResult>;
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
