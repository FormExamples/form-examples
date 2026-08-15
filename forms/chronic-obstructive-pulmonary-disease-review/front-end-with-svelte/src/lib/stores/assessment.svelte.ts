import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given review id (defaults to `new`). */
function storageKey(id: string): string {
	return `chronic-obstructive-pulmonary-disease-review.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank COPD review with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reviewedAt: '',
			reviewType: '',
			patientIdentifier: '',
			ageBand: '',
			sex: ''
		},
		diagnosis: {
			diagnosisYear: null,
			spirometryConfirmed: '',
			exposureNotes: ''
		},
		spirometry: {
			fev1Litres: null,
			fev1PercentPredicted: null,
			fvcLitres: null,
			fev1FvcRatio: null,
			spirometryDate: ''
		},
		symptoms: {
			mrcGrade: null,
			mmrcGrade: null,
			catScore: null
		},
		exacerbations: {
			exacerbationsLast12m: null,
			hospitalisationsLast12m: null,
			lastExacerbationDate: '',
			rescuePackCourses: null
		},
		smoking: {
			smokingStatus: '',
			packYears: null,
			cessationSupportOffered: ''
		},
		inhaler: {
			inhaledTherapy: '',
			deviceType: '',
			inhalerTechniqueChecked: '',
			inhalerTechniqueAdequate: '',
			adherence: ''
		},
		vaccinations: {
			influenzaVaccine: '',
			pneumococcalVaccine: '',
			covidVaccine: ''
		},
		rehab: {
			pulmonaryRehabStatus: '',
			oxygenUse: '',
			restingSpo2: null
		},
		selfManagement: {
			comorbidities: '',
			selfManagementPlan: '',
			rescuePackSupplied: '',
			nextReviewInterval: ''
		},
		note: {
			clinicianNote: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the COPD review, with localStorage persistence so
 * an in-progress review survives a page reload. Drafts are keyed by review id
 * so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the review currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the review for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` review is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state.
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
 * them — reactive when a new review is loaded.
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
