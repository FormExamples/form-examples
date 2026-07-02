import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given clerking id (defaults to `new`). */
function storageKey(id: string): string {
	return `history-and-physical-examination.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank H&P clerking with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		encounter: {
			clinicianName: '',
			clinicianRole: '',
			registrationNumber: '',
			clerkedAt: '',
			careSetting: '',
			admissionSource: ''
		},
		identification: {
			patientIdentifier: '',
			ageBand: '',
			sex: ''
		},
		history: {
			presentingComplaint: '',
			historyOfPresentingComplaint: '',
			pastMedicalSurgicalHistory: '',
			drugHistory: '',
			allergyStatus: '',
			allergyDetail: '',
			familyHistory: '',
			socialHistory: '',
			systemsReview: ''
		},
		vitals: {
			temperature: null,
			heartRate: null,
			respiratoryRate: null,
			systolicBloodPressure: null,
			oxygenSaturation: null,
			consciousnessLevel: ''
		},
		examination: {
			examCardiovascular: '',
			examRespiratory: '',
			examAbdominal: '',
			examNeurological: '',
			examOther: '',
			investigations: ''
		},
		assessment: {
			impression: '',
			redFlagFindings: '',
			managementPlan: '',
			clinicalNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the H&P clerking, with localStorage persistence so
 * an in-progress clerking survives a page reload. Drafts are keyed by clerking
 * id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the clerking currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the clerking for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` clerking is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference (e.g.
	 * `const h = assessment.data.history`) stay bound to live state.
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
 * reactive when a new clerking is loaded.
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
