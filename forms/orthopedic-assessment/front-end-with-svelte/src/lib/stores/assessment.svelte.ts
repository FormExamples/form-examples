import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `orthopedic-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank orthopedic assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			occupation: '',
			dominantHand: ''
		},
		chiefComplaint: {
			primaryConcern: '',
			affectedJoint: '',
			side: '',
			duration: '',
			onsetType: '',
			aggravatingFactors: []
		},
		painAssessment: {
			currentPainLevel: null,
			worstPain: null,
			bestPain: null,
			painCharacter: '',
			painFrequency: '',
			nightPain: '',
			painWithWeightBearing: ''
		},
		dashQuestionnaire: {
			q1: null, q2: null, q3: null, q4: null, q5: null,
			q6: null, q7: null, q8: null, q9: null, q10: null,
			q11: null, q12: null, q13: null, q14: null, q15: null,
			q16: null, q17: null, q18: null, q19: null, q20: null,
			q21: null, q22: null, q23: null, q24: null, q25: null,
			q26: null, q27: null, q28: null, q29: null, q30: null
		},
		rangeOfMotion: {
			joint: '',
			flexion: null,
			extension: null,
			abduction: null,
			adduction: null,
			internalRotation: null,
			externalRotation: null,
			notes: ''
		},
		strengthTesting: {
			gripStrengthLeft: null,
			gripStrengthRight: null,
			manualMuscleGrade: '',
			specificWeaknesses: ''
		},
		functionalLimitations: {
			difficultyWithADLs: [],
			mobilityAids: [],
			workRestrictions: '',
			sportRestrictions: ''
		},
		imagingHistory: {
			xRay: { performed: '', date: '', findings: '' },
			mri: { performed: '', date: '', findings: '' },
			ctScan: { performed: '', date: '', findings: '' },
			ultrasound: { performed: '', date: '', findings: '' }
		},
		currentTreatment: {
			medications: [],
			physicalTherapy: '',
			physicalTherapyDetails: '',
			injections: '',
			injectionDetails: '',
			braceOrSplint: '',
			braceDetails: '',
			otherTreatments: '',
			allergies: []
		},
		surgicalHistory: {
			previousOrthopedicSurgery: '',
			surgeries: [],
			anesthesiaComplications: '',
			anesthesiaDetails: '',
			willingToConsiderSurgery: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the orthopedic assessment, with localStorage
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
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.demographics`) stay bound to live state.
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
		deepAssign(this.data as unknown as Record<string, unknown>, (draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>);
	}

	reset() {
		this.hadDraftAtLoad = false;
		deepAssign(this.data as unknown as Record<string, unknown>, createDefaultAssessment() as unknown as Record<string, unknown>);
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
