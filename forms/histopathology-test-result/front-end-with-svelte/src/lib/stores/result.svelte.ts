import { browser } from '$app/env';
import type { HistopathologyResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'histopathology-test-result.front-end-with-svelte.v1';

/** A blank histopathology result with all fields at their unanswered defaults. */
export function createDefaultResult(): HistopathologyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		specimenType: '',
		specimenSite: '',
		specimenAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		macroscopicDescription: '',
		microscopicDescription: '',
		diagnosis: '',
		malignancyPresent: false,
		tumourType: '',
		histologicalGrade: '',
		tnmPt: '',
		tnmPn: '',
		tnmPm: '',
		resectionMargins: '',
		lymphovascularInvasion: false,
		immunohistochemistry: '',
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
 * Svelte 5 reactive store for the histopathology result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<HistopathologyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<HistopathologyResult>;
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
