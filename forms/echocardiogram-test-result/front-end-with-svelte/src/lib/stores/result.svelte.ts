import { browser } from '$app/environment';
import type { EchocardiogramResult, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'echocardiogram-test-result.front-end-with-svelte.v1';

/** A blank echocardiogram result with all fields at their unanswered defaults. */
export function createDefaultResult(): EchocardiogramResult {
	return {
		reportingClinician: '',
		originatingRequestReference: '',
		echoType: '',
		reportStatus: '',
		studyQuality: '',
		performedDate: '',
		reportedDate: '',
		clinicalHistory: '',
		lvEjectionFractionPercent: null,
		lvFunction: '',
		lvInternalDiameterDiastoleMm: null,
		lvHypertrophy: false,
		regionalWallMotionAbnormality: false,
		aorticStenosis: '',
		aorticRegurgitation: '',
		mitralStenosis: '',
		mitralRegurgitation: '',
		pulmonaryArterySystolicPressureMmhg: null,
		pericardialEffusion: false,
		vegetation: false,
		intracardiacThrombus: false,
		normalStudy: false,
		findingsNarrative: '',
		comparisonWithPrevious: '',
		impression: '',
		recommendedFollowUp: '',
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the echocardiogram result, with localStorage
 * persistence so an in-progress report survives a page reload.
 */
class ResultStore {
	data = $state<EchocardiogramResult>(createDefaultResult());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	constructor() {
		if (browser) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<EchocardiogramResult>;
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
