import { browser } from '$app/environment';
import type { AngiographyResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'angiography-test-result.front-end-with-svelte.v1';

/** A blank angiography result with all fields at their unanswered defaults. */
export function createDefaultResult(): AngiographyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		angiographyType: '',
		bodyRegion: '',
		contrastUsed: '',
		examinationAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		findingsNarrative: '',
		significantStenosis: false,
		occlusion: false,
		aneurysm: false,
		dissection: false,
		activeExtravasation: false,
		thrombus: false,
		normalVessels: false,
		incidentalFinding: false,
		maxStenosisPercent: null,
		interventionPerformed: false,
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
 * Svelte 5 reactive store for the angiography result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<AngiographyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<AngiographyResult>;
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
