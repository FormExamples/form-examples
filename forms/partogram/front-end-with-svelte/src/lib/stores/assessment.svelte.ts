import { browser } from '$app/env';
import type { AssessmentData, GradingResult, Observation } from '#lib/engine/types.js';

/** localStorage draft key for a given record id (defaults to `new`). */
function storageKey(id: string): string {
	return `partogram.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A fresh, fully-blank timed-observation child row. */
export function createDefaultObservation(): Observation {
	return {
		observedAt: '',
		cervicalDilatationCm: null,
		descentFifths: null,
		contractionsPer10Min: null,
		contractionDurationBand: '',
		contractionStrength: '',
		fetalHeartRate: null,
		liquorState: '',
		moulding: '',
		systolicBloodPressure: null,
		diastolicBloodPressure: null,
		pulse: null,
		temperature: null,
		urineVolumeMl: null,
		urineProtein: '',
		urineKetones: '',
		urineGlucose: '',
		oxytocinRate: null,
		drugsAndFluids: ''
	};
}

/**
 * A blank partogram with all header fields at their unanswered defaults and the
 * timed-observation child list initialised to an empty array.
 */
export function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			careSetting: '',
			activePhaseStartAt: ''
		},
		patient: {
			patientIdentifier: '',
			ageBand: '',
			parity: '',
			gestationWeeks: null
		},
		admission: {
			membranesOnAdmission: '',
			riskFactors: '',
			plannedCare: ''
		},
		observations: []
	};
}

/**
 * Svelte 5 reactive store for the partogram, with localStorage persistence so an
 * in-progress record survives a page reload. Drafts are keyed by record id so
 * each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the record currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the record for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` record is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object and array identities preserved)
	 * rather than reassigned, so step components that captured a section or child
	 * list reference stay bound to live state.
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
 * Deep-merge `source` into `target`, recursing into plain objects and mutating
 * arrays in place (clear + repopulate) so nested object AND array identities are
 * preserved. This keeps Svelte's deep `$state` proxies — and any references
 * captured from them (including a child list bound by an `{#each}`) — reactive
 * when a new record is loaded, so its seeded child rows reach the editors.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (Array.isArray(sv)) {
			// Reuse the existing array instance when present; otherwise create one.
			const arr = Array.isArray(tv) ? tv as unknown[] : target[key] = [] as unknown[];
			arr.splice(0, arr.length, ...sv as unknown[]);
		} else if (sv && typeof sv === 'object' && tv && typeof tv === 'object' && !Array.isArray(tv)) {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

export const assessment = new AssessmentStore();
