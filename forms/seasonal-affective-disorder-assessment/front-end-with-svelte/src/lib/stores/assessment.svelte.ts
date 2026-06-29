import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `seasonal-affective-disorder-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank SAD assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			latitude: '',
			country: '',
			yearsAtCurrentLatitude: null
		},
		seasonalPatternHistory: {
			symptomsRecurAnnually: '',
			worstMonths: '',
			bestMonths: '',
			yearsAffected: null,
			familyHistorySad: '',
			firstOnsetAge: ''
		},
		currentMood: {
			phq9: {
				q1: null,
				q2: null,
				q3: null,
				q4: null,
				q5: null,
				q6: null,
				q7: null,
				q8: null,
				q9: null
			},
			difficultyLevel: ''
		},
		sleepEnergy: {
			spaq: {
				sleepLength: null,
				energyLevel: null
			},
			hoursSleptWinter: null,
			hoursSleptSummer: null,
			hypersomnia: '',
			morningFatigue: '',
			energyNotes: ''
		},
		appetiteWeight: {
			spaq: {
				appetite: null,
				weight: null
			},
			carbohydrateCraving: '',
			winterWeightChangeKg: null,
			eatingPatternChanges: ''
		},
		socialOccupational: {
			spaq: {
				mood: null,
				socialActivity: null
			},
			workImpaired: '',
			relationshipsImpaired: '',
			socialWithdrawal: '',
			occupationalNotes: ''
		},
		lightExposure: {
			dailyOutdoorMinutes: null,
			workIndoors: '',
			curtainsClosedDaytime: '',
			sunriseExposure: '',
			usesLightTherapyBox: '',
			lightTherapyDetails: '',
			lightTherapyAccess: ''
		},
		previousTreatments: {
			antidepressants: '',
			antidepressantDetails: '',
			psychotherapy: '',
			psychotherapyDetails: '',
			lightTherapyHistory: '',
			lightTherapyHistoryDetails: '',
			currentTreatment: '',
			currentTreatmentDetails: ''
		},
		riskAssessment: {
			suicidalIdeation: '',
			suicidalIntent: '',
			suicidalPlan: '',
			selfHarm: '',
			selfHarmDetails: '',
			previousAttempt: '',
			protectiveFactors: '',
			safetyPlanInPlace: ''
		},
		treatmentPlan: {
			planLightTherapy: '',
			planAntidepressant: '',
			planPsychotherapy: '',
			planLifestyle: '',
			planCrisisReferral: '',
			followUpInterval: '',
			clinicianNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the SAD assessment, with localStorage persistence
 * so an in-progress assessment survives a page reload. Drafts are keyed by
 * assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the assessment currently loaded (`new` for a fresh draft). */
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
