import { browser } from '$app/environment';
import type { CardiologyResponse, GradingResult } from '$lib/engine/types';

/** Per-id localStorage draft key (default id `new`). */
function storageKey(id: string): string {
	return `cardiology-response.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank cardiology response with all fields at their unanswered defaults. */
export function createDefaultResponse(): CardiologyResponse {
	return {
		respondingClinician: '',
		originatingRequestReference: '',
		responseStatus: '',
		consultationType: '',
		assessedDate: '',
		respondedDate: '',
		patientName: '',
		patientNhsNumber: '',
		patientBirthDate: '',
		clinicalSummary: '',
		examinationFindings: '',
		investigationsPerformed: '',
		ischaemiaOrCad: false,
		significantArrhythmia: false,
		reducedEjectionFraction: false,
		significantValveDisease: false,
		structuralAbnormality: false,
		uncontrolledHypertension: false,
		nonCardiacCause: false,
		primaryDiagnosisCategory: '',
		diagnosisNarrative: '',
		lvEjectionFractionPercent: null,
		managementPlan: '',
		medicationChanges: '',
		recommendedFollowUp: '',
		criticalResult: false,
		criticalResultCommunicated: false,
		reportedTo: '',
		clinicianNotes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the cardiology response, with localStorage
 * persistence so an in-progress response survives a page reload.
 */
class ResponseStore {
	data = $state<CardiologyResponse>(createDefaultResponse());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** Id of the item currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			// Persist on every change to the draft for the active id.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the draft for `id` into the store. Hydrates from the per-id
	 * localStorage draft when present; otherwise starts from a blank draft.
	 * `seed` lets callers pre-fill a blank draft (e.g. from sample-row data).
	 */
	loadForId(id: string, seed?: Partial<CardiologyResponse>) {
		this.id = id || 'new';
		this.result = null;
		this.currentStep = 1;
		let next = { ...createDefaultResponse(), ...(seed ?? {}) };
		if (browser) {
			const raw = localStorage.getItem(storageKey(this.id));
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<CardiologyResponse>;
					next = { ...next, ...parsed };
				} catch {
					// Ignore corrupt storage and start fresh.
				}
			}
		}
		this.data = next;
	}

	reset() {
		this.data = createDefaultResponse();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const resultStore = new ResponseStore();
