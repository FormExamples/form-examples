import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `asthma-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank asthma assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			weight: null,
			height: null,
			bmi: null
		},
		symptomFrequency: {
			daytimeSymptoms: '',
			nighttimeAwakening: '',
			rescueInhalerUse: '',
			activityLimitation: '',
			selfRatedControl: ''
		},
		lungFunction: {
			fev1Percent: null,
			fev1Fvc: null,
			peakFlowBest: null,
			peakFlowCurrent: null,
			peakFlowPercent: null,
			spirometryDate: '',
			spirometryNotes: ''
		},
		triggers: {
			allergens: '',
			allergenDetails: '',
			exercise: '',
			weather: '',
			weatherDetails: '',
			occupational: '',
			occupationalDetails: '',
			infections: '',
			smoke: '',
			stress: '',
			medications: '',
			medicationDetails: '',
			otherTriggers: ''
		},
		currentMedications: {
			controllerMedications: [],
			rescueInhalers: [],
			biologics: [],
			oralSteroids: '',
			oralSteroidDetails: '',
			inhalerTechniqueReviewed: '',
			medicationAdherence: ''
		},
		allergies: {
			drugAllergies: [],
			environmentalAllergies: [],
			allergyTestingDone: '',
			allergyTestResults: ''
		},
		exacerbationHistory: {
			exacerbationsLastYear: null,
			edVisitsLastYear: null,
			hospitalisationsLastYear: null,
			icuAdmissions: '',
			icuAdmissionCount: null,
			intubationHistory: '',
			oralSteroidCoursesLastYear: null,
			lastExacerbationDate: ''
		},
		comorbidities: {
			allergicRhinitis: '',
			sinusitis: '',
			nasalPolyps: '',
			gord: '',
			obesity: '',
			anxiety: '',
			depression: '',
			eczema: '',
			sleepApnoea: '',
			vocalCordDysfunction: '',
			otherComorbidities: ''
		},
		socialHistory: {
			smoking: '',
			smokingPackYears: null,
			vaping: '',
			occupationalExposures: '',
			occupationalExposureDetails: '',
			homeEnvironment: '',
			pets: '',
			petDetails: '',
			carpetInBedroom: '',
			moldExposure: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the asthma assessment, with localStorage
 * persistence keyed by assessment id so each record edits independently.
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
	 * Load the assessment for `id`. A saved draft wins; otherwise `seed` or a
	 * blank draft. Merged in place (nested identities preserved) so step
	 * components that captured a section reference stay bound.
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
					/* ignore corrupt storage */
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
		if (browser) localStorage.removeItem(storageKey(this.id));
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays replaced).
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
