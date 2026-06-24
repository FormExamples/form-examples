import { browser } from '$app/environment';
import type { BloodTestResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'blood-test-result.front-end-with-svelte.v1';

/** A blank blood test result with all fields at their unanswered defaults. */
export function createDefaultResult(): BloodTestResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		specimenType: '',
		specimenCondition: '',
		clinicalHistory: '',
		haemoglobinGL: null,
		whiteCellCount: null,
		platelets: null,
		neutrophils: null,
		sodiumMmolL: null,
		potassiumMmolL: null,
		ureaMmolL: null,
		creatinineUmolL: null,
		egfr: null,
		altUL: null,
		alkalinePhosphatase: null,
		bilirubinUmolL: null,
		albuminGL: null,
		cReactiveProtein: null,
		hba1cMmolMol: null,
		glucoseMmolL: null,
		tsh: null,
		ferritin: null,
		inr: null,
		overallResultStatus: '',
		abnormalResultsPresent: false,
		criticalValuePresent: false,
		criticalValueDetail: '',
		findingsNarrative: '',
		comparisonWithPrevious: '',
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
 * Svelte 5 reactive store for the blood test result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<BloodTestResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<BloodTestResult>;
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
