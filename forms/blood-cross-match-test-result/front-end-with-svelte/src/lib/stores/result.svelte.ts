import { browser } from '$app/env';
import type { BloodCrossMatchResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'blood-cross-match-test-result.front-end-with-svelte.v1';

/** A blank blood cross-match result with all fields at their unanswered defaults. */
export function createDefaultResult(): BloodCrossMatchResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		requestType: '',
		clinicalHistory: '',
		aboGroup: '',
		rhdGroup: '',
		historicalGroupConcordant: false,
		antibodyScreenResult: '',
		antibodiesIdentified: '',
		crossmatchResult: '',
		component: '',
		unitsCrossmatched: null,
		unitsAvailable: null,
		specialRequirements: '',
		twoSampleRuleMet: false,
		overallResultStatus: '',
		findingsNarrative: '',
		impression: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the blood cross-match result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<BloodCrossMatchResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<BloodCrossMatchResult>;
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
