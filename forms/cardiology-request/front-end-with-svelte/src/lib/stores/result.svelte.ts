import { browser } from '$app/environment';
import type { CardiologyRequest, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given referral id (defaults to `new`). */
function storageKey(id: string): string {
	return `cardiology-request.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank cardiology request with all fields at their unanswered defaults. */
export function createDefaultRequest(): CardiologyRequest {
	return {
		// Referring clinician
		referringClinician: '',
		referrerRole: '',
		registrationBody: '',
		registrationNumber: '',
		supervisingConsultant: '',
		requesterContact: '',
		referralDate: '',

		// Patient identification
		nhsNumber: '',
		patientName: '',
		dateOfBirth: '',

		// Referral lifecycle / setting
		status: 'draft',
		siteName: '',
		setting: '',
		requestedByDate: '',

		// Requested service and reason
		requestedService: '',
		referralReason: '',
		clinicalQuestion: '',
		relevantHistory: '',

		// Symptoms
		symptomChestPain: false,
		chestPainCharacter: '',
		symptomBreathlessness: false,
		nyhaClass: '',
		symptomPalpitations: false,
		symptomSyncope: false,
		symptomOedema: false,

		// Red flags / acuity
		suspectedAcs: false,
		exertionalSyncope: false,
		newOnsetHeartFailure: false,

		// Investigations already performed
		ecgDone: false,
		ecgFindings: '',
		troponinStatus: '',
		bnpStatus: '',

		// Cardiac history and risk factors
		knownCoronaryArteryDisease: false,
		previousMi: false,
		heartFailure: false,
		valveDisease: false,
		arrhythmia: false,
		hypertension: false,
		diabetes: false,
		currentMedications: '',

		// Triage
		urgency: 'routine',
		notes: ''
	};
}

/**
 * Svelte 5 reactive store for the cardiology request, with localStorage
 * persistence so an in-progress referral survives a page reload.
 */
class RequestStore {
	data = $state<CardiologyRequest>(createDefaultRequest());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the referral currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			// Persist on every change, keyed by the current referral id.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the referral for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` request is used (e.g. a
	 * sample referral for an existing id), falling back to a blank draft for `new`.
	 */
	loadForId(id: string, seed?: CardiologyRequest) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: Partial<CardiologyRequest> | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as Partial<CardiologyRequest>;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}

		const base = seed ?? createDefaultRequest();
		this.data = draft ? { ...base, ...draft } : { ...base };
	}

	reset() {
		this.data = createDefaultRequest();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const requestStore = new RequestStore();
