import { browser } from '$app/env';
import { emptyLpaApplication } from '#lib/engine/factory.js';
import { calculateLpaValidity } from '#lib/engine/composite-validator.js';
import type { LpaApplication, LpaValidityResult } from '#lib/engine/types.js';

/** localStorage draft key for a given LPA id (defaults to `new`). */
function storageKey(id: string): string {
	return `united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank LP1H application with every field at its unanswered default. */
export function createDefaultApplication(): LpaApplication {
	return emptyLpaApplication();
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new application is loaded.
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

/**
 * Svelte 5 reactive store for the LP1H application, with localStorage
 * persistence so an in-progress application survives a page reload. Drafts are
 * keyed by application id so each record edits independently. The computed
 * statutory validity is kept live via `recompute()`.
 */
class LpaStore {
	application = $state<LpaApplication>(createDefaultApplication());
	validity = $state<LpaValidityResult>(calculateLpaValidity(createDefaultApplication()));
	/** The id of the application currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.application));
				});
			});
		}
	}

	/** Recompute the statutory validity for the current application. */
	recompute() {
		this.validity = calculateLpaValidity(this.application);
	}

	/**
	 * Load the application for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` application is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state.
	 */
	loadForId(id: string, seed?: LpaApplication) {
		const key = id || 'new';
		this.id = key;

		let draft: LpaApplication | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as LpaApplication;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.application as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultApplication()) as unknown as Record<string, unknown>
		);
		this.recompute();
	}

	reset() {
		deepAssign(
			this.application as unknown as Record<string, unknown>,
			createDefaultApplication() as unknown as Record<string, unknown>
		);
		this.recompute();
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const lpaStore = new LpaStore();
