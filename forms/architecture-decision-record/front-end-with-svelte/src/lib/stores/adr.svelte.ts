import { browser } from '$app/environment';
import { emptyAdrFormData, type AdrFormData } from '$lib/types.js';
import { evaluateAdr } from '$lib/engine/adr-engine';
import type { AdrEvaluation } from '$lib/engine/types';

/** A blank ADR draft with every field at its unanswered default. */
export function createDefaultAdrFormData(): AdrFormData {
	return emptyAdrFormData();
}

/** localStorage draft key for a given ADR id (defaults to `new`). */
function storageKey(id: string): string {
	return `architecture-decision-record.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new ADR is loaded.
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
 * Svelte 5 reactive store for the Architecture Decision Record, with
 * localStorage persistence so an in-progress ADR survives a page reload.
 * Drafts are keyed by ADR id so each record edits independently.
 */
class AdrStore {
	data = $state<AdrFormData>(createDefaultAdrFormData());
	result = $state<AdrEvaluation | null>(null);
	/** The id of the ADR currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the ADR for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` ADR is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state.
	 */
	loadForId(id: string, seed?: AdrFormData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;

		let draft: AdrFormData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as AdrFormData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAdrFormData()) as unknown as Record<string, unknown>
		);
		// A loaded draft may have zero positions; keep at least one editable row.
		if (this.data.positions.length === 0) this.addPosition();
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAdrFormData() as unknown as Record<string, unknown>
		);
		this.result = null;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}

	/** Re-run the completeness/status engine over the current draft. */
	evaluate(): AdrEvaluation {
		this.result = evaluateAdr(this.data);
		return this.result;
	}

	/** Replace the entire draft with the given data (used by Markdown import). */
	replace(data: AdrFormData) {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			data as unknown as Record<string, unknown>
		);
		this.result = null;
	}

	addPosition() {
		this.data.positions.push({
			name: '', description: '', modelOrDiagramUrl: '',
			isChosen: false, pros: '', cons: ''
		});
	}

	removePosition(index: number) {
		this.data.positions.splice(index, 1);
		if (this.data.positions.length === 0) this.addPosition();
	}

	chooseExclusive(index: number) {
		for (let i = 0; i < this.data.positions.length; i++) {
			this.data.positions[i].isChosen = i === index;
		}
	}

	addNote(notedBy: string, body: string) {
		if (!body.trim()) return;
		this.data.notes.push({
			notedAt: new Date().toISOString(),
			notedBy,
			body
		});
	}

	removeNote(index: number) {
		this.data.notes.splice(index, 1);
	}
}

export const store = new AdrStore();
