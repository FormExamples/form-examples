import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given survey id (defaults to `new`). */
function storageKey(id: string): string {
	return `employee-satisfaction-survey.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank employee satisfaction survey with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			department: '',
			tenureBand: '',
			hoursBand: ''
		},
		roleTenure: {
			roleLevel: '',
			workLocation: '',
			rt1: null,
			rt2: null
		},
		workload: {
			wl1: null,
			wl2: null,
			wl3: null,
			wl4: null,
			wl5: null
		},
		management: {
			mg1: null,
			mg2: null,
			mg3: null,
			mg4: null,
			mg5: null
		},
		growth: {
			gr1: null,
			gr2: null,
			gr3: null,
			gr4: null
		},
		compensation: {
			cb1: null,
			cb2: null,
			cb3: null,
			cb4: null
		},
		culture: {
			cu1: null,
			cu2: null,
			cu3: null,
			cu4: null,
			cu5: null
		},
		environment: {
			en1: null,
			en2: null,
			en3: null,
			en4: null
		},
		recognition: {
			rc1: null,
			rc2: null,
			rc3: null,
			rc4: null
		},
		overall: {
			ov1: null,
			ov2: null,
			ov3: null,
			ov4: null,
			recommendScore: null,
			retentionIntent: '',
			suggestionsForImprovement: '',
			otherComments: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the employee satisfaction survey, with
 * localStorage persistence so an in-progress survey survives a page reload.
 * Drafts are keyed by survey id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the survey currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the survey for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` survey is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.workload`) stay bound to live state.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: AssessmentData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as AssessmentData;
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
 * them — reactive when a new survey is loaded.
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
