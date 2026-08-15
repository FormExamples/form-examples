import { browser } from '$app/env';
import type { GradingResult, ReconciliationData } from '#lib/engine/types.js';

/** localStorage draft key for a given reconciliation id (defaults to `new`). */
function storageKey(id: string): string {
	return `medication-reconciliation.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * A blank reconciliation with all fields at their unanswered defaults. Text /
 * enum fields default to `''`, numeric fields to `null`, and the four child
 * lists to `[]`.
 */
export function createDefaultReconciliation(): ReconciliationData {
	return {
		encounter: {
			reconciliationType: '',
			careSetting: '',
			reconciledAt: '',
			clinicianName: '',
			clinicianRole: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: '',
			weightKg: null
		},
		allergyReview: {
			allergyStatus: ''
		},
		informationSources: [],
		allergies: [],
		lineItems: [],
		discrepancies: [],
		note: {
			clinicalNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the medication reconciliation, with localStorage
 * persistence so an in-progress reconciliation survives a page reload. Drafts
 * are keyed by reconciliation id so each record edits independently.
 */
class AssessmentStore {
	data = $state<ReconciliationData>(createDefaultReconciliation());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the reconciliation for `id` into the store. A saved draft for that id
	 * (in localStorage) takes precedence; otherwise the `seed` record is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state. Arrays (the four child lists) are replaced wholesale
	 * by `deepAssign`, so seeded medication rows reach the row editors.
	 */
	loadForId(id: string, seed?: ReconciliationData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: ReconciliationData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as ReconciliationData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultReconciliation()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultReconciliation() as unknown as Record<string, unknown>
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
 * them — reactive when a new reconciliation is loaded. Arrays are replaced
 * wholesale so seeded child lists (medication rows, discrepancies) appear.
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

export const assessment = new AssessmentStore();
