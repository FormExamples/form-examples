import { browser } from '$app/env';
import type { FluoroscopyResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'fluoroscopy-test-result.front-end-with-svelte.v1';

/** A blank fluoroscopy result with all fields at their unanswered defaults. */
export function createDefaultResult(): FluoroscopyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		studyType: '',
		contrastUsed: '',
		examinationAdequacy: '',
		screeningTimeMinutes: null,
		clinicalHistory: '',
		comparisonWithPrevious: '',
		findingsNarrative: '',
		stricture: false,
		reflux: false,
		obstruction: false,
		perforationOrLeak: false,
		fistula: false,
		fillingDefect: false,
		dysmotility: false,
		normalStudy: false,
		incidentalFinding: false,
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
 * Svelte 5 reactive store for the fluoroscopy result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<FluoroscopyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<FluoroscopyResult>;
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
