import { browser } from '$app/env';
import type { DeathCertificate, ValidationResult } from '#lib/engine/types.js';

/** localStorage draft key for a given certificate id (defaults to `new`). */
function storageKey(id: string): string {
	return `medical-certificate-of-cause-of-death.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank Medical Certificate of Cause of Death with all fields at their unanswered defaults. */
export function createDefaultCertificate(): DeathCertificate {
	return {
		certification: {
			certifyingDoctorName: '',
			certifyingDoctorGrade: '',
			gmcReference: '',
			placeOfCertification: '',
			certificationDate: null,
			attendedDeceased: '',
			lastSeenAliveDate: null
		},
		deceased: {
			deceasedName: '',
			sex: '',
			dateOfBirth: null,
			ageYears: null,
			patientIdentifier: ''
		},
		death: {
			dateOfDeath: null,
			timeOfDeath: null,
			placeOfDeath: '',
			seenAfterDeathBy: ''
		},
		partI: {
			causeIaCondition: '',
			causeIaInterval: '',
			causeIbCondition: '',
			causeIbInterval: '',
			causeIcCondition: '',
			causeIcInterval: ''
		},
		partII: {
			partIiConditions: '',
			partIiInterval: ''
		},
		referral: {
			referredToCoroner: '',
			coronerReason: '',
			medicalExaminerStatus: '',
			certifierNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the Medical Certificate of Cause of Death, with
 * localStorage persistence so an in-progress certificate survives a page reload.
 * Drafts are keyed by certificate id so each record edits independently.
 */
class CertificateStore {
	data = $state<DeathCertificate>(createDefaultCertificate());
	result = $state<ValidationResult | null>(null);
	currentStep = $state(1);
	/**
	 * The id of the record currently loaded into the store (`new`
	 * for a fresh draft). Starts as `''`, not `'new'`: the wizard
	 * page only calls loadForId() when `store.id !== id`, so if this
	 * defaulted to the literal string `'new'` the very first visit
	 * to the (very common) `/new` route would never call
	 * loadForId() at all -- any saved draft for `new` would be
	 * silently ignored on every fresh page load. `''` never
	 * collides with a real route id.
	 */
	id = $state('');

	/**
	 * True once a saved draft was found for the current id/store on
	 * load -- read by RestoreBanner.svelte to tell the user their
	 * progress was restored rather than silently repopulating fields
	 * with no explanation. Mirrors the HTML front-end's
	 * window.__FORM_STATE__.hadDraftAtLoad.
	 */
	hadDraftAtLoad = $state(false);
	// True once loadForId() has run for the first time. Guards the
	// persistence effect below: without it, the effect's very first
	// (immediate) run persists the *blank* initial data before
	// loadForId() ever gets a chance to read a previously-saved draft
	// from localStorage -- silently clobbering it with blank data on
	// every fresh page load.
	#loaded = false;

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					const key = storageKey(this.id);
					const snapshot = JSON.stringify(this.data);
					if (!this.#loaded) return;
					localStorage.setItem(key, snapshot);
				});
			});
		}
	}

	/**
	 * Load the certificate for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` certificate is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather than
	 * reassigned, so step components that captured a section reference stay bound
	 * to live state.
	 */
	loadForId(id: string, seed?: DeathCertificate) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: DeathCertificate | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			this.hadDraftAtLoad = raw !== null;
			this.#loaded = true;
			if (raw) {
				try {
					draft = JSON.parse(raw) as DeathCertificate;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultCertificate()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		this.hadDraftAtLoad = false;
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultCertificate() as unknown as Record<string, unknown>
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
 * keeps Svelte's deep `$state` proxies — and any references captured from them —
 * reactive when a new certificate is loaded.
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

export const assessment = new CertificateStore();
