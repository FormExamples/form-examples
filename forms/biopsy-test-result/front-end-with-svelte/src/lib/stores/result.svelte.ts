import { browser } from '$app/env';
import type { BiopsyResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'biopsy-test-result.front-end-with-svelte.v1';

/** A blank biopsy result with all fields at their unanswered defaults. */
export function createDefaultResult(): BiopsyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		biopsySite: '',
		biopsyMethod: '',
		specimenAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		macroscopicDescription: '',
		microscopicDescription: '',
		diagnosis: '',
		malignancyPresent: false,
		tumourType: '',
		histologicalGrade: '',
		resectionMargins: '',
		lymphovascularInvasion: false,
		immunohistochemistry: '',
		molecularResults: '',
		snomedCode: '',
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
 * Svelte 5 reactive store for the biopsy result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<BiopsyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<BiopsyResult>;
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
