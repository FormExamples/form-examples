import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `workplace-stress-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank workplace stress assessment with all fields at unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			department: '',
			tenureBand: '',
			hoursBand: ''
		},
		demands: {
			dem1: null,
			dem2: null,
			dem3: null,
			dem4: null,
			dem5: null,
			dem6: null,
			dem7: null,
			dem8: null
		},
		control: {
			ctrl1: null,
			ctrl2: null,
			ctrl3: null,
			ctrl4: null,
			ctrl5: null,
			ctrl6: null
		},
		managerSupport: {
			ms1: null,
			ms2: null,
			ms3: null,
			ms4: null,
			ms5: null
		},
		peerSupport: {
			ps1: null,
			ps2: null,
			ps3: null,
			ps4: null
		},
		relationships: {
			rel1: null,
			rel2: null,
			rel3: null,
			rel4: null
		},
		role: {
			role1: null,
			role2: null,
			role3: null,
			role4: null,
			role5: null
		},
		change: {
			chg1: null,
			chg2: null,
			chg3: null
		},
		additionalComments: {
			mostStressfulAspect: '',
			suggestionsForImprovement: '',
			otherComments: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the workplace stress assessment, with localStorage
 * persistence so an in-progress survey survives a page reload. Drafts are keyed
 * by assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the assessment currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the assessment for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` assessment is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.demands`) stay bound to live state.
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
 * keeps Svelte's deep `$state` proxies — and any references captured from them —
 * reactive when a new assessment is loaded.
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
