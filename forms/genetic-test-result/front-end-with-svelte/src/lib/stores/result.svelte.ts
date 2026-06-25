import { browser } from '$app/environment';
import type { GeneticResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'genetic-test-result.front-end-with-svelte.v1';

/** A blank genetic test result with all fields at their unanswered defaults. */
export function createDefaultResult(): GeneticResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		testType: '',
		genesTested: '',
		sampleType: '',
		clinicalHistory: '',
		inheritancePattern: '',
		variantsDetected: '',
		variantClassification: '',
		zygosity: '',
		pathogenicVariantFound: false,
		vusFound: false,
		carrierStatusPositive: false,
		secondaryFinding: false,
		noClinicallySignificantVariant: false,
		interpretation: '',
		impression: '',
		reportingCategory: '',
		recommendedCascadeTesting: false,
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the genetic test result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<GeneticResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<GeneticResult>;
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
