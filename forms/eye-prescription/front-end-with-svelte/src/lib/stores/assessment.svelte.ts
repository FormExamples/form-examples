import { browser } from '$app/environment';
import type { EyePrescription, ClassificationResult } from '$lib/engine/types';
import { createEmptyPrescription } from '$lib/engine/factory';
import { classify } from '$lib/engine/composite';
import { suggestExpiry } from '$lib/engine/utils';

/** localStorage draft key for a given prescription id (defaults to `new`). */
function storageKey(id: string): string {
	return `eye-prescription.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank eye prescription with all fields at their unanswered defaults. */
export function createDefaultAssessment(): EyePrescription {
	return createEmptyPrescription();
}

/**
 * Svelte 5 reactive store for the eye prescription, with localStorage
 * persistence so an in-progress prescription survives a page reload. Drafts are
 * keyed by prescription id so each record edits independently.
 */
class PrescriptionStore {
	data = $state<EyePrescription>(createDefaultAssessment());
	/** Live refractive classification, recomputed whenever `data` changes. */
	result = $derived<ClassificationResult>(classify(this.data));
	/** The id of the prescription currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the prescription for `id` into the store. A saved draft for that id
	 * (in localStorage) takes precedence; otherwise the `seed` prescription is
	 * used (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.prescriber`) stay bound to live state.
	 */
	loadForId(id: string, seed?: EyePrescription) {
		const key = id || 'new';
		this.id = key;

		let draft: EyePrescription | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as EyePrescription;
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
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}

	/** Auto-suggest expiry when issue date and birth date are both set
	 *  and the prescriber has not yet entered an expiry by hand. */
	maybeSuggestExpiry(): void {
		const { issueDate, expiryDate } = this.data.examination;
		const { birthDate } = this.data.patient;
		if (issueDate && birthDate && !expiryDate) {
			this.data.examination.expiryDate = suggestExpiry(birthDate, issueDate);
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new prescription is loaded.
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

export const assessment = new PrescriptionStore();
