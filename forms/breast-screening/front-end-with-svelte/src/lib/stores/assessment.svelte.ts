import { browser } from '$app/environment';
import type { ScreeningData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given screening-record id (defaults to `new`). */
function storageKey(id: string): string {
	return `breast-screening.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank screening record with all fields at their unanswered defaults. */
export function createDefaultAssessment(): ScreeningData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reportedAt: '',
			screeningUnit: '',
			episodeType: ''
		},
		identification: {
			patientIdentifier: '',
			ageYears: null,
			lastScreenedDate: '',
			higherRiskSurveillance: ''
		},
		eligibility: {
			symptomatic: '',
			consentGiven: ''
		},
		mammogram: {
			viewsTaken: '',
			imageAdequacy: ''
		},
		reading: {
			firstReadOpinion: '',
			secondReadOpinion: '',
			arbitrationOutcome: '',
			readingOutcome: ''
		},
		assessment: {
			assessmentPerformed: '',
			assessmentModalities: [],
			imagingClassification: null
		},
		note: {
			clinicalContext: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the breast-screening record, with localStorage
 * persistence so an in-progress record survives a page reload. Drafts are keyed
 * by record id so each record edits independently.
 */
class AssessmentStore {
	data = $state<ScreeningData>(createDefaultAssessment());
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
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const c = assessment.data.context`) stay bound to live state.
	 */
	loadForId(id: string, seed?: ScreeningData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: ScreeningData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as ScreeningData;
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
 * them — reactive when a new record is loaded.
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
