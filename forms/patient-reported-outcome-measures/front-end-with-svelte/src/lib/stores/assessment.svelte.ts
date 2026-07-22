import { browser } from '$app/environment';
import type { PatientReportedOutcomeMeasures, AllScoresResult } from '$lib/engine/types';
import { createEmptyAssessment } from '$lib/engine/factory';
import { computeAllScores } from '$lib/engine/composite';

/** localStorage draft key for a given visit id (defaults to `new`). */
function storageKey(id: string): string {
	return `patient-reported-outcome-measures.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank PRO-measures battery with all fields at their unanswered defaults. */
export function createDefaultAssessment(): PatientReportedOutcomeMeasures {
	return createEmptyAssessment();
}

/**
 * Svelte 5 reactive store for the PRO-measures battery, with localStorage
 * persistence so an in-progress visit survives a page reload. Drafts are
 * keyed by visit id so each record edits independently.
 */
class AssessmentStore {
	data = $state<PatientReportedOutcomeMeasures>(createDefaultAssessment());
	currentStep = $state(1);

	/** The id of the visit currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	/** The live scores for all 4 instruments, recomputed from `data` on every change. */
	result = $derived<AllScoresResult>(computeAllScores(this.data));

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
	 * Load the visit for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` visit is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.ndi`) stay bound to live state.
	 */
	loadForId(id: string, seed?: PatientReportedOutcomeMeasures) {
		const key = id || 'new';
		this.id = key;
		this.currentStep = 1;

		let draft: PatientReportedOutcomeMeasures | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as PatientReportedOutcomeMeasures;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>
		);
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}

	goto(n: number) {
		if (n >= 1) this.currentStep = n;
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new visit is loaded.
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
