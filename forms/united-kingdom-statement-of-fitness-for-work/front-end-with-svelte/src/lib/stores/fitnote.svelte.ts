import { browser } from '$app/environment';
import { emptyFitNote, type FitNote, type GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given fit-note id (defaults to `new`). */
function storageKey(id: string): string {
	return `united-kingdom-statement-of-fitness-for-work.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank fit note with all fields at their unanswered defaults. */
export function createDefaultFitNote(): FitNote {
	return emptyFitNote();
}

/**
 * Svelte 5 reactive store for the UK fit note, with localStorage persistence so
 * an in-progress fit note survives a page reload. Drafts are keyed by record id
 * so each fit note edits independently.
 */
class FitNoteStore {
	data = $state<FitNote>(createDefaultFitNote());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the fit note currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the fit note for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` fit note is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const c = store.data.clinician`) stay bound to live state.
	 */
	loadForId(id: string, seed?: FitNote) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: FitNote | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as FitNote;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultFitNote()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultFitNote() as unknown as Record<string, unknown>
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
 * them — reactive when a new fit note is loaded.
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

export const store = new FitNoteStore();
