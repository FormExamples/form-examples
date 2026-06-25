import { browser } from '$app/environment';
import type { EyeVisionResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'eye-vision-test-result.front-end-with-svelte.v1';

/** A blank eye vision result with all fields at their unanswered defaults. */
export function createDefaultResult(): EyeVisionResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		testType: '',
		performedDate: '',
		reportedDate: '',
		clinicalHistory: '',
		visualAcuityRight: '',
		visualAcuityLeft: '',
		intraocularPressureRightMmhg: null,
		intraocularPressureLeftMmhg: null,
		visualFieldResult: '',
		reducedVisualAcuity: false,
		visualFieldDefect: false,
		raisedIntraocularPressure: false,
		diabeticRetinopathy: false,
		opticDiscAbnormality: false,
		macularAbnormality: false,
		normalExamination: false,
		retinopathyGrade: '',
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
 * Svelte 5 reactive store for the eye vision result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<EyeVisionResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<EyeVisionResult>;
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
