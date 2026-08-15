import { browser } from '$app/env';
import type { CoagulationResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'coagulation-test-result.front-end-with-svelte.v1';

/** A blank coagulation result with all fields at their unanswered defaults. */
export function createDefaultResult(): CoagulationResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		specimenCondition: '',
		clinicalHistory: '',
		onAnticoagulant: false,
		anticoagulantAgent: '',
		prothrombinTimeSeconds: null,
		inr: null,
		activatedPartialThromboplastinTimeSeconds: null,
		apttRatio: null,
		fibrinogenGL: null,
		dDimer: null,
		thrombinTimeSeconds: null,
		factorAssays: '',
		findingsNarrative: '',
		overallResultStatus: '',
		criticalValuePresent: false,
		criticalValueDetail: '',
		comparisonWithPrevious: '',
		reportingCategory: '',
		impression: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the coagulation result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<CoagulationResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<CoagulationResult>;
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
