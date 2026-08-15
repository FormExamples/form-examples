import { browser } from '$app/env';
import type { UrinalysisResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'urinalysis-test-result.front-end-with-svelte.v1';

/** A blank urinalysis result with all fields at their unanswered defaults. */
export function createDefaultResult(): UrinalysisResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		specimenType: '',
		specimenCondition: '',
		clinicalHistory: '',
		pregnant: false,
		leucocytes: '',
		nitrites: '',
		protein: '',
		blood: '',
		glucose: '',
		ketones: '',
		bilirubin: '',
		ph: null,
		specificGravity: null,
		redCellCount: '',
		whiteCellCount: '',
		epithelialCells: '',
		casts: '',
		organismsSeen: false,
		crystals: '',
		cultureResult: '',
		organismIsolated: '',
		colonyCountCfuMl: '',
		antibioticSensitivities: '',
		overallResultStatus: '',
		findingsNarrative: '',
		impression: '',
		reportingCategory: '',
		recommendedFollowUp: '',
		visibleHaematuria: false,
		suspectedUrosepsis: false,
		criticalOrganism: false,
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the urinalysis result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<UrinalysisResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<UrinalysisResult>;
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
