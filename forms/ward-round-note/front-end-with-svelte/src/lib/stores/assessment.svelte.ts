import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given note id (defaults to `new`). */
function storageKey(id: string): string {
	return `ward-round-note.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank ward round note with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		header: {
			clinicianName: '',
			clinicianGrade: '',
			reviewedAt: '',
			ward: ''
		},
		identification: {
			patientIdentifier: '',
			admissionDate: '',
			primaryDiagnosis: ''
		},
		overnight: {
			overnightEvents: '',
			noOvernightEvents: ''
		},
		problems: {
			problemList: ''
		},
		examination: {
			examinationSummary: '',
			news2Total: null,
			news2SingleParamThree: '',
			observationTrend: ''
		},
		investigations: {
			investigationsReviewed: '',
			noInvestigationsOutstanding: '',
			abnormalResultFlagged: '',
			abnormalResultActioned: ''
		},
		vte: {
			vteStatus: '',
			vteProphylaxisInPlace: ''
		},
		medication: {
			medicationChanges: '',
			noMedicationChanges: ''
		},
		plan: {
			planAndJobs: ''
		},
		escalation: {
			escalationStatus: '',
			seniorReviewPresent: '',
			estimatedDischargeDate: '',
			dischargeNotEstimable: ''
		},
		summary: {
			clinicalNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the ward round note, with localStorage persistence
 * so an in-progress note survives a page reload. Drafts are keyed by note id so
 * each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the note currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the note for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` note is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const s = assessment.data.problems`) stay bound to live state.
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
 * them — reactive when a new note is loaded.
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
