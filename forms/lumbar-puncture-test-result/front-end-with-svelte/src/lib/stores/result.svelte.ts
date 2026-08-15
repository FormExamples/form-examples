import { browser } from '$app/env';
import type { LumbarPunctureResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'lumbar-puncture-test-result.front-end-with-svelte.v1';

/** A blank lumbar puncture / CSF result with all fields at unanswered defaults. */
export function createDefaultResult(): LumbarPunctureResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		clinicalHistory: '',
		openingPressureCmh2o: null,
		csfAppearance: '',
		csfWhiteCellCount: null,
		csfRedCellCount: null,
		csfProteinGL: null,
		csfGlucoseMmolL: null,
		csfSerumGlucoseRatio: null,
		csfLactateMmolL: null,
		gramStainResult: '',
		cultureResult: '',
		pcrResult: '',
		oligoclonalBands: '',
		xanthochromia: '',
		raisedProtein: false,
		pleocytosis: false,
		lowGlucose: false,
		bacterialMeningitisPattern: false,
		viralPattern: false,
		subarachnoidHaemorrhageSuggested: false,
		normalCsf: false,
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
 * Svelte 5 reactive store for the lumbar puncture result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<LumbarPunctureResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<LumbarPunctureResult>;
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
