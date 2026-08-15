import { browser } from '$app/env';
import type { TumorMarkerResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'tumor-marker-test-result.front-end-with-svelte.v1';

/** A blank tumour-marker result with all fields at their unanswered defaults. */
export function createDefaultResult(): TumorMarkerResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		specimenCondition: '',
		clinicalHistory: '',
		knownCancerSite: '',
		psa: null,
		ca125: null,
		ca19_9: null,
		carcinoembryonicAntigenCea: null,
		alphaFetoproteinAfp: null,
		betaHcg: null,
		ca15_3: null,
		lactateDehydrogenaseLdh: null,
		calcitonin: null,
		chromograninA: null,
		previousValue: null,
		trend: '',
		comparisonWithPrevious: '',
		overallResultStatus: '',
		markedlyElevated: false,
		findingsNarrative: '',
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
 * Svelte 5 reactive store for the tumour-marker result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<TumorMarkerResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<TumorMarkerResult>;
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
