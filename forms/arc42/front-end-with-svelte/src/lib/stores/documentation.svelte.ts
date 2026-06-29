import { browser } from '$app/environment';
import { createEmptyDocumentation } from '$lib/grading/factory.js';
import type { Arc42Documentation, MaturityResult } from '$lib/grading/types.js';

/** localStorage draft key for a given document id (defaults to `new`). */
function storageKey(id: string): string {
	return `arc42.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank arc42 documentation record with all fields at their unanswered defaults. */
export function createDefaultDocumentation(): Arc42Documentation {
	return createEmptyDocumentation();
}

/**
 * Svelte 5 reactive store for the arc42 architecture documentation, with
 * localStorage persistence so an in-progress document survives a page reload.
 * Drafts are keyed by document id so each record edits independently.
 *
 * The public export name is `store` (the step components capture
 * `store.data.<section>`); only the internals are the gold id-keyed pattern.
 */
class DocumentationStore {
	data = $state<Arc42Documentation>(createDefaultDocumentation());
	result = $state<MaturityResult | null>(null);
	currentStep = $state(1);
	/** The id of the document currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the document for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` document is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = store.data.architecture`) stay bound to live state.
	 */
	loadForId(id: string, seed?: Arc42Documentation) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: Arc42Documentation | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as Arc42Documentation;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultDocumentation()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultDocumentation() as unknown as Record<string, unknown>
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
 * them — reactive when a new document is loaded.
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

export const store = new DocumentationStore();
