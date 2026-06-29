import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given examination id (defaults to `new`). */
function storageKey(id: string): string {
	return `emergency-medical-technician-psychomotor-examination.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank examination with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		candidateExaminerScenario: {
			candidateFirstName: '',
			candidateLastName: '',
			candidateId: '',
			attempt: '',
			examinerName: '',
			sessionDate: '',
			stationLocation: '',
			scenarioSummary: '',
			chiefComplaintGiven: ''
		},
		sceneSizeUp: {
			ppePrecautions: '',
			sceneSafe: '',
			mechanismOrNature: '',
			numberOfPatients: '',
			additionalResources: '',
			considersCspine: ''
		},
		primarySurvey: {
			generalImpression: '',
			mentalStatus: '',
			airway: '',
			breathing: '',
			oxygenTherapy: '',
			circulation: '',
			transportPriority: ''
		},
		historySecondaryAssessment: {
			chiefComplaint: '',
			historyOnsetOpqrst: '',
			sampleSignsSymptoms: '',
			sampleAllergies: '',
			sampleMedications: '',
			samplePastHistory: '',
			sampleLastIntake: '',
			sampleEvents: '',
			focusedExam: '',
			baselineVitalsBp: '',
			baselineVitalsPulse: '',
			baselineVitalsRespirations: '',
			fieldImpression: '',
			interventions: ''
		},
		reassessment: {
			repeatsMentalStatus: '',
			repeatsAirway: '',
			repeatsBreathing: '',
			repeatsCirculation: '',
			repeatsVitals: '',
			repeatsFocusedExam: '',
			evaluatesInterventions: '',
			transportInterventions: '',
			fifteenMinuteCall: ''
		},
		criticalCriteriaReview: {
			dangerousIntervention: '',
			spinalProtection: '',
			examinerNotes: '',
			debriefNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the psychomotor examination, with localStorage
 * persistence so an in-progress examination survives a page reload. Drafts are
 * keyed by examination id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the examination currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the examination for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` examination is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.sceneSizeUp`) stay bound to live state.
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
 * them — reactive when a new examination is loaded.
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
