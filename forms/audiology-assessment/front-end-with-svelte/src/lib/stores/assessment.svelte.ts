import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `audiology-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank audiology assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: ''
		},
		chiefComplaint: {
			primaryConcern: '',
			affectedEar: '',
			onset: '',
			duration: '',
			progression: ''
		},
		hearingHistory: {
			noiseExposure: '',
			occupationalNoise: '',
			occupationalNoiseDetails: '',
			recreationalNoise: '',
			recreationalNoiseDetails: '',
			previousHearingTests: '',
			previousTestDetails: '',
			hearingAidUse: '',
			hearingAidDetails: ''
		},
		audiometricResults: {
			pureToneAverageRight: null,
			pureToneAverageLeft: null,
			airConductionRight: '',
			airConductionLeft: '',
			boneConductionRight: '',
			boneConductionLeft: '',
			airBoneGapRight: null,
			airBoneGapLeft: null,
			speechRecognitionThresholdRight: null,
			speechRecognitionThresholdLeft: null,
			wordRecognitionScoreRight: null,
			wordRecognitionScoreLeft: null,
			hearingLossType: ''
		},
		tinnitusAssessment: {
			presence: '',
			affectedEar: '',
			character: '',
			severity: '',
			duration: '',
			impactOnDailyLife: '',
			tinnitusHandicapInventoryScore: null
		},
		vestibularSymptoms: {
			vertigo: '',
			vertigoDetails: '',
			dizziness: '',
			balanceProblems: '',
			dixHallpike: '',
			nystagmus: '',
			fallsHistory: '',
			fallsFrequency: ''
		},
		otoscopicFindings: {
			earCanalRight: '',
			earCanalLeft: '',
			tympanicMembraneRight: '',
			tympanicMembraneLeft: '',
			middleEarRight: '',
			middleEarLeft: '',
			earWaxRight: '',
			earWaxLeft: '',
			dischargeRight: '',
			dischargeLeft: '',
			previousSurgery: '',
			previousSurgeryDetails: ''
		},
		medicalHistory: {
			ototoxicMedications: '',
			ototoxicMedicationDetails: '',
			autoimmune: '',
			autoimmuneDetails: '',
			menieres: '',
			otosclerosis: '',
			acousticNeuroma: '',
			infections: '',
			infectionDetails: ''
		},
		functionalCommunication: {
			communicationDifficulties: '',
			communicationDetails: '',
			hearingAidCandidacy: '',
			assistiveDeviceNeeds: '',
			assistiveDeviceDetails: '',
			workImpact: '',
			socialImpact: '',
			hhieScore: null
		}
	};
}

/**
 * Svelte 5 reactive store for the audiology assessment, with localStorage
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
