import { browser } from '$app/env';
import type { NuclearMedicineResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'nuclear-medicine-test-result.front-end-with-svelte.v1';

/** A blank nuclear medicine result with all fields at their unanswered defaults. */
export function createDefaultResult(): NuclearMedicineResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		scanType: '',
		radiopharmaceutical: '',
		injectedActivityMbq: null,
		examinationAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		findingsNarrative: '',
		abnormalUptake: false,
		metastaticPattern: false,
		perfusionDefect: false,
		photopenicArea: false,
		noSignificantAbnormality: false,
		incidentalFinding: false,
		ejectionFractionPercent: null,
		splitFunctionLeftPercent: null,
		splitFunctionRightPercent: null,
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
 * Svelte 5 reactive store for the nuclear medicine result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<NuclearMedicineResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<NuclearMedicineResult>;
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
