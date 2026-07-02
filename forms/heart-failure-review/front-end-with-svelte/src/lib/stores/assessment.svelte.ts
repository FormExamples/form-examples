import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given review id (defaults to `new`). */
function storageKey(id: string): string {
	return `heart-failure-review.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank heart-failure review with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reviewDate: '',
			careSetting: '',
			reviewType: '',
			lastReviewDate: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: ''
		},
		diagnosis: {
			yearOfDiagnosis: null,
			heartFailureType: '',
			latestLvef: null,
			lastEchoDate: '',
			aetiology: ''
		},
		functional: {
			nyhaClass: null,
			breathlessness: '',
			orthopnoea: '',
			paroxysmalNocturnalDyspnoea: '',
			fatigue: '',
			changeSinceLastReview: '',
			decompensation: ''
		},
		fluid: {
			weightKg: null,
			weightChangeKg: null,
			peripheralOedema: '',
			raisedJvp: '',
			lungCrackles: '',
			systolicBloodPressure: null,
			diastolicBloodPressure: null,
			heartRate: null,
			heartRhythm: ''
		},
		investigations: {
			ntProBnp: null,
			sodium: null,
			potassium: null,
			urea: null,
			creatinine: null,
			egfr: null,
			haemoglobin: null,
			ferritin: null,
			transferrinSaturation: null,
			hba1c: null,
			bloodsDate: ''
		},
		medication: {
			raasInhibitorStatus: '',
			raasInhibitorAgent: '',
			raasInhibitorDose: '',
			raasInhibitorAtTargetDose: '',
			raasInhibitorAdherence: '',
			betaBlockerStatus: '',
			betaBlockerAgent: '',
			betaBlockerDose: '',
			betaBlockerAtTargetDose: '',
			betaBlockerAdherence: '',
			mraStatus: '',
			mraAgent: '',
			mraDose: '',
			mraAtTargetDose: '',
			mraAdherence: '',
			sglt2InhibitorStatus: '',
			sglt2InhibitorAgent: '',
			sglt2InhibitorDose: '',
			sglt2InhibitorAtTargetDose: '',
			sglt2InhibitorAdherence: '',
			loopDiureticAgent: '',
			loopDiureticDose: '',
			otherMedications: ''
		},
		devices: {
			icd: '',
			crt: '',
			pacemaker: '',
			deviceCheckStatus: ''
		},
		vaccinations: {
			influenzaVaccination: '',
			pneumococcalVaccination: '',
			covidVaccination: '',
			smokingStatus: '',
			alcoholStatus: '',
			dailyWeights: '',
			selfManagementPlan: '',
			cardiacRehab: ''
		},
		summary: {
			reviewContext: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the heart-failure review, with localStorage
 * persistence so an in-progress review survives a page reload. Drafts are keyed
 * by review id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the review currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the review for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` review is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather than
	 * reassigned, so step components that captured a section reference stay bound
	 * to live state.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: AssessmentData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as AssessmentData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>
		);
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new review is loaded.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object') {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

export const assessment = new AssessmentStore();
