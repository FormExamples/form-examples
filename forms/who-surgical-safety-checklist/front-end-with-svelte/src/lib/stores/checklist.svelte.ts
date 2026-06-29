import { browser } from '$app/environment';
import { computeSafetyFlags } from '$lib/checklist/flags.js';
import { computeStatus } from '$lib/checklist/completion.js';
import { createEmptyChecklist } from '$lib/checklist/factory.js';
import type {
	ChecklistStatus,
	SafetyFlag,
	WhoSurgicalSafetyChecklist
} from '$lib/checklist/types.js';

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
	return `who-surgical-safety-checklist.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank WHO Surgical Safety Checklist with every field at its unanswered default. */
export function createDefaultChecklist(): WhoSurgicalSafetyChecklist {
	return createEmptyChecklist();
}

/** A computed snapshot taken when the wizard is submitted, used to guard the report route. */
export interface ChecklistResult {
	status: ChecklistStatus;
	flags: SafetyFlag[];
	generatedAt: string;
}

/**
 * Svelte 5 reactive store for the WHO Surgical Safety Checklist, with
 * localStorage persistence so an in-progress checklist survives a page reload.
 * Drafts are keyed by checklist id so each record edits independently.
 */
class ChecklistStore {
	data = $state<WhoSurgicalSafetyChecklist>(createEmptyChecklist());
	result = $state<ChecklistResult | null>(null);
	/** The id of the checklist currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	/** Live safety flags computed by the shared engine. */
	flags = $derived<SafetyFlag[]>(computeSafetyFlags(this.data));
	/** Live lifecycle status computed by the shared engine. */
	status = $derived<ChecklistStatus>(computeStatus(this.data));

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
	 * Load the checklist for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` checklist is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state.
	 */
	loadForId(id: string, seed?: WhoSurgicalSafetyChecklist) {
		const key = id || 'new';
		this.id = key;
		this.result = null;

		let draft: WhoSurgicalSafetyChecklist | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as WhoSurgicalSafetyChecklist;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createEmptyChecklist()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createEmptyChecklist() as unknown as Record<string, unknown>
		);
		this.result = null;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new checklist is loaded.
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

export const store = new ChecklistStore();
