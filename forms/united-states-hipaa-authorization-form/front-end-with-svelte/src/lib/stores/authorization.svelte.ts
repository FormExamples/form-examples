import { browser } from '$app/env';
import type { HipaaAuthorization, ValidationResult } from '#lib/engine/types.js';
import { createDefaultAuthorization } from '#lib/engine/defaults.js';

// Re-exported so consumers can keep importing the factory from the store.
export { createDefaultAuthorization };

/** localStorage draft key for a given authorization id (defaults to `new`). */
function storageKey(id: string): string {
	return `united-states-hipaa-authorization-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Svelte 5 reactive store for the HIPAA authorization, with localStorage
 * persistence so an in-progress authorization survives a page reload. Drafts
 * are keyed by authorization id so each record edits independently.
 */
class AuthorizationStore {
	data = $state<HipaaAuthorization>(createDefaultAuthorization());
	result = $state<ValidationResult | null>(null);
	currentStep = $state(1);
	/** The id of the authorization currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the authorization for `id` into the store. A saved draft for that id
	 * (in localStorage) takes precedence; otherwise the `seed` authorization is
	 * used (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = authorization.data.patient`) stay bound to live state.
	 */
	loadForId(id: string, seed?: HipaaAuthorization) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: HipaaAuthorization | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as HipaaAuthorization;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAuthorization()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAuthorization() as unknown as Record<string, unknown>
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
 * them — reactive when a new authorization is loaded.
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

export const authorization = new AuthorizationStore();
