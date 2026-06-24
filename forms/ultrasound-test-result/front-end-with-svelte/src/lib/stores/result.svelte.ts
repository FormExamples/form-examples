import { browser } from '$app/environment';
import type { UltrasoundResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'ultrasound-test-result.front-end-with-svelte.v1';

/** A blank ultrasound result with all fields at their unanswered defaults. */
export function createDefaultResult(): UltrasoundResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		bodyRegion: '',
		laterality: '',
		examinationAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		findingsNarrative: '',
		massOrLesion: false,
		cyst: false,
		gallstones: false,
		hydronephrosis: false,
		freeFluid: false,
		dvtPresent: false,
		aneurysm: false,
		organEnlargement: false,
		incidentalFinding: false,
		largestLesionSizeMm: null,
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
 * Svelte 5 reactive store for the ultrasound result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<UltrasoundResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<UltrasoundResult>;
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
