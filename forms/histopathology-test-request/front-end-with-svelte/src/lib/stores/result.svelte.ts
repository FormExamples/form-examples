import { browser } from '$app/environment';
import type { HistopathologyRequest, GradingResult } from '$lib/engine/types';
import { createDefaultRequest } from '$lib/engine/defaults';

// Re-export the default factory so consumers can import it from the store.
export { createDefaultRequest };

/** localStorage draft key for a given request id (defaults to `new`). */
function storageKey(id: string): string {
	return `histopathology-test-request.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any section references captured
 * from them — reactive when a new request is loaded.
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
 * Svelte 5 reactive store for the histopathology request, with localStorage
 * persistence so an in-progress request survives a page reload. Drafts are
 * keyed by request id so each record edits independently.
 */
class RequestStore {
	data = $state<HistopathologyRequest>(createDefaultRequest());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the request currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			// Persist on every change, keyed by the current request id.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the request for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` request is used (e.g. a
	 * sample for an existing id), falling back to a blank draft for `new`.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = request.data.specimen`) stay bound to live state.
	 */
	loadForId(id: string, seed?: HistopathologyRequest) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: HistopathologyRequest | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as HistopathologyRequest;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}

		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultRequest()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultRequest() as unknown as Record<string, unknown>
		);
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const request = new RequestStore();
