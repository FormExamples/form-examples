import { browser } from '$app/env';
import type { SleepStudyResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'sleep-study-test-result.front-end-with-svelte.v1';

/** A blank sleep-study result with all fields at their unanswered defaults. */
export function createDefaultResult(): SleepStudyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		studyType: '',
		studyAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		totalRecordingTimeHours: null,
		totalSleepTimeHours: null,
		apnoeaHypopnoeaIndex: null,
		oxygenDesaturationIndex: null,
		minimumSpo2Percent: null,
		timeBelow90PercentSpo2: null,
		meanHeartRateBpm: null,
		osaSeverity: '',
		obstructiveSleepApnoea: false,
		centralSleepApnoea: false,
		periodicLimbMovements: false,
		nocturnalHypoventilation: false,
		significantDesaturation: false,
		normalStudy: false,
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
 * Svelte 5 reactive store for the sleep-study result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<SleepStudyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<SleepStudyResult>;
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
