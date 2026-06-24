import { browser } from '$app/environment';
import type { DexaBoneDensityResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'dexa-bone-density-test-result.front-end-with-svelte.v1';

/** A blank DEXA result with all fields at their unanswered defaults. */
export function createDefaultResult(): DexaBoneDensityResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		scanRegion: '',
		examinationAdequacy: '',
		clinicalHistory: '',
		lumbarSpineTScore: null,
		lumbarSpineZScore: null,
		femoralNeckTScore: null,
		femoralNeckZScore: null,
		totalHipTScore: null,
		lowestTScore: null,
		boneMineralDensityGCm2: null,
		whoClassification: '',
		fraxMajorFracturePercent: null,
		fraxHipFracturePercent: null,
		vertebralFractureIdentified: false,
		comparisonWithPrevious: '',
		percentChangeSincePrevious: null,
		impression: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the DEXA result, with localStorage persistence
 * so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<DexaBoneDensityResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<DexaBoneDensityResult>;
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
