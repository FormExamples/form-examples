import { browser } from '$app/env';
import type { HearingResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'hearing-test-result.front-end-with-svelte.v1';

/** A blank hearing test result with all fields at their unanswered defaults. */
export function createDefaultResult(): HearingResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		testType: '',
		testReliability: '',
		clinicalHistory: '',
		pureToneAverageRightDb: null,
		pureToneAverageLeftDb: null,
		hearingLossTypeRight: '',
		hearingLossTypeLeft: '',
		hearingLossSeverityRight: '',
		hearingLossSeverityLeft: '',
		tympanometryTypeRight: '',
		tympanometryTypeLeft: '',
		findingsNarrative: '',
		hearingLossPresent: false,
		asymmetricLoss: false,
		suddenSensorineuralLoss: false,
		conductiveComponent: false,
		normalHearing: false,
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
 * Svelte 5 reactive store for the hearing test result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<HearingResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<HearingResult>;
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
