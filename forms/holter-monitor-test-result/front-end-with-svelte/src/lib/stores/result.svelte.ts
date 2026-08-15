import { browser } from '$app/env';
import type { HolterMonitorResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'holter-monitor-test-result.front-end-with-svelte.v1';

/** A blank Holter monitor result with all fields at their unanswered defaults. */
export function createDefaultResult(): HolterMonitorResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		monitorType: '',
		performedDate: '',
		reportedDate: '',
		recordingDurationHours: null,
		analysedPercent: null,
		clinicalHistory: '',
		comparisonWithPrevious: '',
		predominantRhythm: '',
		meanHeartRateBpm: null,
		minimumHeartRateBpm: null,
		maximumHeartRateBpm: null,
		longestPauseSeconds: null,
		ventricularEctopicPercent: null,
		supraventricularEctopicPercent: null,
		atrialFibrillationDetected: false,
		significantPauses: false,
		ventricularTachycardia: false,
		supraventricularTachycardia: false,
		highGradeAvBlock: false,
		symptomRhythmCorrelation: false,
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
 * Svelte 5 reactive store for the Holter monitor result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<HolterMonitorResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<HolterMonitorResult>;
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
