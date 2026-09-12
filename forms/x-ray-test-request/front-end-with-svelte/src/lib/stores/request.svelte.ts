import { browser } from '$app/env';
import type { XRayRequest, GradingResult } from '#lib/engine/types.js';
import { createDefaultRequest } from '#lib/engine/defaults.js';

// Re-export so callers can build a blank request from the store module too.
export { createDefaultRequest };

/** localStorage draft key for a given request id (defaults to `new`). */
function storageKey(id: string): string {
	return `x-ray-test-request.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Recursively merge `source` into `target` in place. The X-ray request is a
 * nested object whose section objects are captured by reference inside the step
 * components (`const d = requestStore.data.<section>`). Merging in place — rather
 * than reassigning `data` — keeps those captured references live so a loaded
 * seed / draft reaches the inputs.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>): void {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (
			sv &&
			typeof sv === 'object' &&
			!Array.isArray(sv) &&
			tv &&
			typeof tv === 'object' &&
			!Array.isArray(tv)
		) {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

/**
 * Svelte 5 reactive store for the X-ray request, with localStorage persistence
 * so an in-progress request survives a page reload.
 */
class RequestStore {
	data = $state<XRayRequest>(createDefaultRequest());
	result = $state<GradingResult | null>(null);
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
			// Persist on every change, keyed by the current request id.
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
	 * Load the request for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` request is used (e.g. a
	 * sample request for an existing id), falling back to a blank draft for `new`.
	 * The merge is in place via `deepAssign` so captured section references stay
	 * live.
	 */
	loadForId(id: string, seed?: XRayRequest) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: Partial<XRayRequest> | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			this.hadDraftAtLoad = raw !== null;
			this.#loaded = true;
			if (raw) {
				try {
					draft = JSON.parse(raw) as Partial<XRayRequest>;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}

		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultRequest() as unknown as Record<string, unknown>
		);
		if (seed) {
			deepAssign(
				this.data as unknown as Record<string, unknown>,
				seed as unknown as Record<string, unknown>
			);
		}
		if (draft) {
			deepAssign(
				this.data as unknown as Record<string, unknown>,
				draft as unknown as Record<string, unknown>
			);
		}
	}

	reset() {
		this.hadDraftAtLoad = false;
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

export const requestStore = new RequestStore();
