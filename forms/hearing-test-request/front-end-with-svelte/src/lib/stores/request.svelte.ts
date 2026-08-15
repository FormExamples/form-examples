import { browser } from '$app/env';
import type { HearingRequest, GradingResult } from '#lib/engine/types.js';
import { createDefault } from '#lib/engine/defaults.js';

/** Re-exported blank-request factory (the engine owns the canonical shape). */
export { createDefault };

/** localStorage draft key for a given request id (defaults to `new`). */
function storageKey(id: string): string {
	return `hearing-test-request.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Svelte 5 reactive store for the hearing test request, with localStorage
 * persistence so an in-progress request survives a page reload. Drafts are
 * keyed by request id so each record edits independently.
 */
class RequestStore {
	data = $state<HearingRequest>(createDefault());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the request currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the request for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` request is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = request.data.symptoms`) stay bound to live state.
	 */
	loadForId(id: string, seed?: HearingRequest) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: HearingRequest | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as HearingRequest;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefault()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefault() as unknown as Record<string, unknown>
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
 * them — reactive when a new request is loaded.
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

export const request = new RequestStore();
