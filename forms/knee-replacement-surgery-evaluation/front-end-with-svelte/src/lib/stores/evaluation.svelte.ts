import { browser } from '$app/env';
import type { GradingResult, KneeReplacementSurgeryEvaluation } from '#lib/engine/types.js';
import { calculateKneeEvaluation } from '#lib/engine/grader.js';
import { createDefaultEvaluation } from '#lib/engine/defaults.js';

/** localStorage draft key for a given evaluation id (defaults to `new`). */
function storageKey(id: string): string {
	return `knee-replacement-surgery-evaluation.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Reactive evaluation store, backed by localStorage.
 *
 * `data` is a `$state` rune, so binding a field in a step component updates
 * the derived grading result and the persisted draft. The draft survives a
 * reload during the joint-replacement clinic appointment.
 */
class EvaluationStore {
	data = $state<KneeReplacementSurgeryEvaluation>(createDefaultEvaluation());
	id = $state<string>('new');
	submitted = $state<boolean>(false);

	/** The live grading result, recomputed whenever any field changes. */
	get result(): GradingResult {
		return calculateKneeEvaluation(this.data);
	}

	/**
	 * Load a draft for the given id, merging it over a fresh default.
	 *
	 * The section objects are mutated **in place** rather than reassigned. Step
	 * components capture `evaluationStore.data` during their own init, which
	 * happens before this runs from the page's `$effect`; replacing the object
	 * would leave every `bind:value` writing to an orphaned copy, so nothing the
	 * user typed would reach the engine.
	 */
	load(id: string): void {
		this.id = id || 'new';
		this.submitted = false;
		const fresh = createDefaultEvaluation();

		if (browser) {
			try {
				const raw = localStorage.getItem(storageKey(this.id));
				if (raw) {
					const parsed = JSON.parse(raw) as Partial<KneeReplacementSurgeryEvaluation>;
					// Merge stored values over a fresh shape so fields added in a later
					// version do not orphan an existing draft.
					for (const key of Object.keys(fresh) as Array<keyof KneeReplacementSurgeryEvaluation>) {
						const stored = parsed[key];
						if (stored && typeof stored === 'object') {
							Object.assign(fresh[key] as object, stored);
						} else if (typeof stored === 'string' && key === 'status') {
							fresh.status = stored as KneeReplacementSurgeryEvaluation['status'];
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
	private assign(next: KneeReplacementSurgeryEvaluation): void {
		this.data.status = next.status;
		for (const key of Object.keys(next) as Array<keyof KneeReplacementSurgeryEvaluation>) {
			if (key === 'status') continue;
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
		this.assign(createDefaultEvaluation());
		this.submitted = false;
		if (!browser) return;
		try {
			localStorage.removeItem(storageKey(this.id));
		} catch {
			// Nothing to do.
		}
	}
}

export const evaluationStore = new EvaluationStore();

export { createDefaultEvaluation };
