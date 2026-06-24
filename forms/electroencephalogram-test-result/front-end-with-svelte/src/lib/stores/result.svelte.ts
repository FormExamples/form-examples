import { browser } from '$app/environment';
import type { ElectroencephalogramResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'electroencephalogram-test-result.front-end-with-svelte.v1';

/** A blank EEG result with all fields at their unanswered defaults. */
export function createDefaultResult(): ElectroencephalogramResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		eegType: '',
		recordingDurationMinutes: null,
		recordingQuality: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		backgroundRhythm: '',
		epileptiformDischarges: false,
		focalSlowing: false,
		generalisedSlowing: false,
		seizureRecorded: false,
		statusEpilepticus: false,
		photoparoxysmalResponse: false,
		normalEeg: false,
		findingsNarrative: '',
		clinicalCorrelation: '',
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
 * Svelte 5 reactive store for the EEG result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<ElectroencephalogramResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<ElectroencephalogramResult>;
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
