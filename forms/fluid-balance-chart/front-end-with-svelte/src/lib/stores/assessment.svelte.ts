import { browser } from '$app/environment';
import type { ChartData, Entry, GradingResult } from '$lib/engine/types';

/** Default charting period in hours (spec §4). */
export const DEFAULT_CHART_PERIOD_HOURS = 24;

/** localStorage draft key for a given chart id (defaults to `new`). */
function storageKey(id: string): string {
	return `fluid-balance-chart.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A fresh, fully-blank intake / output entry row. */
export function createDefaultEntry(): Entry {
	return {
		entryAt: '',
		category: '',
		description: '',
		volumeMl: null
	};
}

/**
 * A blank fluid-balance chart with all fields at their unanswered defaults and
 * the two child lists (intake, output) initialised to empty arrays. The
 * charting period pre-fills the conventional 24-hour default.
 */
export function createDefaultAssessment(): ChartData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			patientIdentifier: '',
			wardOrUnit: '',
			chartStartAt: '',
			chartPeriodHours: DEFAULT_CHART_PERIOD_HOURS
		},
		patient: {
			weightKg: null
		},
		intake: [],
		output: [],
		note: {
			clinicalNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the fluid-balance chart, with localStorage
 * persistence so an in-progress chart survives a page reload. Drafts are keyed
 * by chart id so each chart edits independently.
 */
class AssessmentStore {
	data = $state<ChartData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the chart currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the chart for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` chart is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object and array identities preserved)
	 * rather than reassigned, so step components that captured a section or child
	 * list reference stay bound to live state — the seeded intake/output rows
	 * reach the repeating-row editors.
	 */
	loadForId(id: string, seed?: ChartData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: ChartData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as ChartData;
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
 * Deep-merge `source` into `target`, recursing into plain objects and mutating
 * arrays in place (clear + repopulate) so nested object AND array identities are
 * preserved. This keeps Svelte's deep `$state` proxies — and any references
 * captured from them (including a child list bound by an `{#each}`) — reactive
 * when a new chart is loaded, so its seeded intake/output rows reach the editors.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (Array.isArray(sv)) {
			const arr = Array.isArray(tv) ? (tv as unknown[]) : (target[key] = [] as unknown[]);
			arr.splice(0, arr.length, ...(sv as unknown[]));
		} else if (sv && typeof sv === 'object' && tv && typeof tv === 'object' && !Array.isArray(tv)) {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

export const assessment = new AssessmentStore();
