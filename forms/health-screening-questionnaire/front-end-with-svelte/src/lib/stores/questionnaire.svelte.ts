import { browser } from '$app/environment';
import type { HealthScreeningQuestionnaire, GradingResult } from '$lib/engine/types';
import { calculateHealthScreening } from '$lib/engine/grader';
import { createDefaultQuestionnaire } from '$lib/engine/defaults';

/** localStorage draft key for a given questionnaire id (defaults to `new`). */
function storageKey(id: string): string {
	return `health-screening-questionnaire.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Reactive questionnaire store, backed by localStorage.
 *
 * `data` is a `$state` rune, so binding a field in a step component updates
 * the derived grading result and the persisted draft.
 */
class QuestionnaireStore {
	data = $state<HealthScreeningQuestionnaire>(createDefaultQuestionnaire());
	id = $state<string>('new');
	submitted = $state<boolean>(false);

	/** The live grading result, recomputed whenever any field changes. */
	get result(): GradingResult {
		return calculateHealthScreening(this.data);
	}

	/**
	 * Load a draft for the given id, merging it over a fresh default.
	 *
	 * The section objects are mutated **in place** rather than reassigned. Step
	 * components capture `questionnaireStore.data` during their own init, which
	 * happens before this runs from the page's `$effect`; replacing the object
	 * would leave every `bind:value` writing to an orphaned copy, so nothing the
	 * user typed would reach the engine.
	 */
	load(id: string): void {
		this.id = id || 'new';
		this.submitted = false;
		const fresh = createDefaultQuestionnaire();

		if (browser) {
			try {
				const raw = localStorage.getItem(storageKey(this.id));
				if (raw) {
					const parsed = JSON.parse(raw) as Partial<HealthScreeningQuestionnaire>;
					// Merge stored values over a fresh shape so fields added in a later
					// version do not orphan an existing draft.
					for (const key of Object.keys(fresh) as Array<keyof HealthScreeningQuestionnaire>) {
						const stored = parsed[key];
						if (stored && typeof stored === 'object') {
							Object.assign(fresh[key] as object, stored);
						} else if (typeof stored === 'string' && key === 'status') {
							fresh.status = stored as HealthScreeningQuestionnaire['status'];
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
	private assign(next: HealthScreeningQuestionnaire): void {
		this.data.status = next.status;
		for (const key of Object.keys(next) as Array<keyof HealthScreeningQuestionnaire>) {
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
		this.assign(createDefaultQuestionnaire());
		this.submitted = false;
		if (!browser) return;
		try {
			localStorage.removeItem(storageKey(this.id));
		} catch {
			// Nothing to do.
		}
	}
}

export const questionnaireStore = new QuestionnaireStore();

export { createDefaultQuestionnaire };
