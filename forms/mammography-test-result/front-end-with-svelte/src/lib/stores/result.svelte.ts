import { browser } from '$app/environment';
import type { MammographyResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'mammography-test-result.front-end-with-svelte.v1';

/** A blank mammography result with all fields at their unanswered defaults. */
export function createDefaultResult(): MammographyResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		examType: '',
		laterality: '',
		examinationAdequacy: '',
		breastDensity: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		findingsNarrative: '',
		mass: false,
		calcifications: false,
		architecturalDistortion: false,
		asymmetry: false,
		skinOrNippleChange: false,
		lymphadenopathy: false,
		incidentalFinding: false,
		largestLesionSizeMm: null,
		impression: '',
		biRadsCategory: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the mammography result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<MammographyResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<MammographyResult>;
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
