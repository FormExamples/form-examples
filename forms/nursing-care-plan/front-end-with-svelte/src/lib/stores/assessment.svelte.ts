import { browser } from '$app/environment';
import type { CarePlan, GradingResult } from '$lib/engine/types';
import { createDefaultRiskGroup } from '$lib/engine/utils';

/** localStorage draft key for a given care-plan id (defaults to `new`). */
function storageKey(id: string): string {
	return `nursing-care-plan.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * A blank care plan with all fields at their unanswered defaults. Text / enum
 * fields default to `''`, date fields to `''`, and the problems list (and each
 * problem's goal / intervention lists) to `[]`.
 */
export function createDefaultAssessment(): CarePlan {
	return {
		planContext: {
			nurseName: '',
			nurseRole: '',
			nmcNumber: '',
			authoredAt: '',
			careSetting: '',
			planType: '',
			modelUsed: 'Roper–Logan–Tierney'
		},
		patient: {
			patientIdentifier: '',
			patientName: '',
			dateOfBirth: '',
			sex: '',
			wardLocation: ''
		},
		fallsRisk: createDefaultRiskGroup(),
		pressureUlcerRisk: createDefaultRiskGroup(),
		vteRisk: createDefaultRiskGroup(),
		nutritionRisk: createDefaultRiskGroup(),
		problems: [],
		summary: {
			handoverNote: '',
			reviewDate: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the nursing care plan, with localStorage
 * persistence so an in-progress plan survives a page reload. Drafts are keyed
 * by care-plan id so each record edits independently.
 */
class AssessmentStore {
	data = $state<CarePlan>(createDefaultAssessment());
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
	 * Load the care plan for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` record is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state. Arrays (the problems list and each problem's goal /
	 * intervention lists) are replaced wholesale by `deepAssign`, so seeded rows
	 * reach the repeating editors.
	 */
	loadForId(id: string, seed?: CarePlan) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: CarePlan | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as CarePlan;
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
 * them — reactive when a new care plan is loaded. Arrays are replaced wholesale
 * so seeded child lists (problems, goals, interventions) appear in the editors.
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
