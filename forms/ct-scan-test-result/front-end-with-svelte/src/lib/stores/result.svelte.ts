import { browser } from '$app/environment';
import type { CtScanResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'ct-scan-test-result.front-end-with-svelte.v1';

/** A blank CT scan result with all fields at their unanswered defaults. */
export function createDefaultResult(): CtScanResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		performedDate: '',
		reportedDate: '',
		bodyRegion: '',
		contrastUsed: '',
		technique: '',
		examinationAdequacy: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		findingsNarrative: '',
		acuteFinding: false,
		massOrLesion: false,
		haemorrhage: false,
		infarct: false,
		fracture: false,
		infectionInflammation: false,
		obstruction: false,
		incidentalFinding: false,
		largestLesionSizeMm: null,
		radiationDoseDlp: null,
		impression: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the CT scan result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<CtScanResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<CtScanResult>;
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
