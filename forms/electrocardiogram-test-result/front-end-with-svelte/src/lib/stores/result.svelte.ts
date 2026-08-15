import { browser } from '$app/env';
import type { ElectrocardiogramResult, GradingResult } from '#lib/engine/types.js';

const STORAGE_KEY = 'electrocardiogram-test-result.front-end-with-svelte.v1';

/** A blank ECG result with all fields at their unanswered defaults. */
export function createDefaultResult(): ElectrocardiogramResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		reportStatus: '',
		ecgType: '',
		performedDate: '',
		reportedDate: '',
		recordingQuality: '',
		clinicalHistory: '',
		comparisonWithPrevious: '',
		ventricularRateBpm: null,
		rhythm: '',
		prIntervalMs: null,
		qrsDurationMs: null,
		qtIntervalMs: null,
		qtcMs: null,
		cardiacAxis: '',
		stElevation: false,
		stDepression: false,
		tWaveInversion: false,
		pathologicalQWaves: false,
		leftVentricularHypertrophy: false,
		bundleBranchBlock: false,
		ischaemia: false,
		normalEcg: false,
		interpretation: '',
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
 * Svelte 5 reactive store for the ECG result, with localStorage persistence so
 * an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<ElectrocardiogramResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<ElectrocardiogramResult>;
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
