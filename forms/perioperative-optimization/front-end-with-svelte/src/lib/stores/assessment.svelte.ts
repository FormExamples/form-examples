import { browser } from '$app/environment';
import { createDefaultAssessment } from '$lib/engine/defaults';
import { calculateOptimization } from '$lib/engine/grader';
import type { GradingResult, PerioperativeOptimization } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `perioperative-optimization.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Reactive assessment store, backed by localStorage.
 *
 * `data` is a `$state` rune, so binding a field in a step component updates the
 * derived grading result and the persisted draft.
 */
class AssessmentStore {
	data = $state<PerioperativeOptimization>(createDefaultAssessment());
	id = $state<string>('new');
	submitted = $state<boolean>(false);

	/** The live grading result, recomputed whenever any field changes. */
	get result(): GradingResult {
		return calculateOptimization(this.data);
	}

	/**
	 * Load a draft for the given id, merging it over a fresh default.
	 *
	 * The section objects are mutated **in place** rather than reassigned. Step
	 * components capture `assessmentStore.data` during their own init, which
	 * happens before this runs from the page's `$effect`; replacing the object
	 * would leave every `bind:value` writing to an orphaned copy, so nothing the
	 * user typed would reach the engine.
	 */
	load(id: string): void {
		this.id = id || 'new';
		this.submitted = false;
		const fresh = createDefaultAssessment();

		if (browser) {
			try {
				const raw = localStorage.getItem(storageKey(this.id));
				if (raw) {
					const parsed = JSON.parse(raw) as Partial<PerioperativeOptimization>;
					for (const key of Object.keys(fresh) as Array<keyof PerioperativeOptimization>) {
						const stored = parsed[key];
						if (stored && typeof stored === 'object') {
							Object.assign(fresh[key] as object, stored);
						}
					}
				}
			} catch {
				// Corrupt draft; fall through with the pristine default.
			}
		}

		this.assign(fresh);
	}

	/** Copy every section of `next` into the live state, preserving identity. */
	private assign(next: PerioperativeOptimization): void {
		for (const key of Object.keys(next) as Array<keyof PerioperativeOptimization>) {
			Object.assign(this.data[key] as object, next[key] as object);
		}
	}

	/** Persist the current draft. */
	save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
		} catch {
			// Storage full or blocked; the in-memory draft is still usable.
		}
	}

	/** Clear the draft and start fresh. */
	reset(): void {
		this.assign(createDefaultAssessment());
		this.submitted = false;
		if (!browser) return;
		try {
			localStorage.removeItem(storageKey(this.id));
		} catch {
			// Nothing to do.
		}
	}
}

export const assessmentStore = new AssessmentStore();
export { createDefaultAssessment };
