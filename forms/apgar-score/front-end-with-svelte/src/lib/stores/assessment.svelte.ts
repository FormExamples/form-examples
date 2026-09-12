import { browser } from '$app/env';
import type { AssessmentData, GradingResult, Timepoint } from '#lib/engine/types.js';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `apgar-score.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A fresh, blank timepoint at the given minutes after birth. */
export function createTimepoint(minutes: number | null): Timepoint {
	return {
		timepointMinutes: minutes,
		appearance: '',
		pulse: '',
		grimace: '',
		activity: '',
		respiration: ''
	};
}

/**
 * A blank Apgar assessment with all fields at their unanswered defaults. The 1-
 * and 5-minute timepoints are always present; the clinician adds a 10-minute
 * (and later) timepoint when the 5-minute total is below 7.
 */
export function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			bornAt: '',
			careSetting: '',
			gestationalAgeWeeks: null,
			modeOfDelivery: ''
		},
		identification: {
			newbornIdentifier: '',
			sex: '',
			birthOrder: null
		},
		timepoints: [createTimepoint(1), createTimepoint(5)],
		summary: {
			resuscitationMeasures: '',
			clinicianNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the Apgar assessment, with localStorage
 * persistence so an in-progress assessment survives a page reload. Drafts are
 * keyed by assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/**
	 * The id of the record currently loaded into the store (`new`
	 * for a fresh draft). Starts as `''`, not `'new'`: the wizard
	 * page only calls loadForId() when `store.id !== id`, so if this
	 * defaulted to the literal string `'new'` the very first visit
	 * to the (very common) `/new` route would never call
	 * loadForId() at all -- any saved draft for `new` would be
	 * silently ignored on every fresh page load. `''` never
	 * collides with a real route id.
	 */
	id = $state('');

	/**
	 * True once a saved draft was found for the current id/store on
	 * load -- read by RestoreBanner.svelte to tell the user their
	 * progress was restored rather than silently repopulating fields
	 * with no explanation. Mirrors the HTML front-end's
	 * window.__FORM_STATE__.hadDraftAtLoad.
	 */
	hadDraftAtLoad = $state(false);
	// True once loadForId() has run for the first time. Guards the
	// persistence effect below: without it, the effect's very first
	// (immediate) run persists the *blank* initial data before
	// loadForId() ever gets a chance to read a previously-saved draft
	// from localStorage -- silently clobbering it with blank data on
	// every fresh page load.
	#loaded = false;

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					const key = storageKey(this.id);
					const snapshot = JSON.stringify(this.data);
					if (!this.#loaded) return;
					localStorage.setItem(key, snapshot);
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
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state. The repeated `timepoints` array is replaced wholesale.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: AssessmentData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			this.hadDraftAtLoad = raw !== null;
			this.#loaded = true;
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

	/** Append a fresh timepoint, defaulting its minutes to the next unused slot. */
	addTimepoint() {
		const used = new Set(
			this.data.timepoints.map((t) => t.timepointMinutes).filter((m): m is number => m != null)
		);
		let minutes: number | null = null;
		for (const m of [1, 5, 10, 15, 20, 25, 30]) {
			if (!used.has(m)) {
				minutes = m;
				break;
			}
		}
		this.data.timepoints.push(createTimepoint(minutes));
	}

	/** Remove the timepoint at `index`. */
	removeTimepoint(index: number) {
		this.data.timepoints.splice(index, 1);
	}

	reset() {
		this.hadDraftAtLoad = false;
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
 * them — reactive when a new assessment is loaded.
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
