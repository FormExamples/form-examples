import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `endometriosis-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank endometriosis assessment with all fields at their unanswered defaults. */
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
		menstrualHistory: {
			ageAtMenarche: null,
			cycleRegularity: '',
			cycleLengthDays: null,
			periodDurationDays: null,
			flowHeaviness: '',
			clotsPresent: '',
			intermenstrualBleeding: '',
			postcoitalBleeding: '',
			dysmenorrhoeaSeverity: '',
			daysOffWorkPerCycle: null,
			currentContraception: '',
			menstrualNotes: ''
		},
		painAssessment: {
			hasPelvicPain: '',
			pelvicPainSeverity: null,
			pelvicPainCharacter: '',
			pelvicPainLocation: '',
			pelvicPainTiming: '',
			dyspareunia: '',
			dyspareuniaSeverity: null,
			dyschezia: '',
			dyscheziaCyclical: '',
			backPain: '',
			legPain: '',
			painWorseWithActivity: '',
			painNotes: ''
		},
		gastrointestinalSymptoms: {
			hasGiSymptoms: '',
			bloating: '',
			bloatingCyclical: '',
			nausea: '',
			constipation: '',
			diarrhoea: '',
			alternatingBowelHabit: '',
			rectalBleeding: '',
			rectalBleedingCyclical: '',
			bowelObstructionSymptoms: '',
			giNotes: ''
		},
		urinarySymptoms: {
			hasUrinarySymptoms: '',
			frequency: '',
			urgency: '',
			dysuria: '',
			haematuria: '',
			haematuriaCyclical: '',
			flankPain: '',
			urinaryObstructionSymptoms: '',
			recurrentUtis: '',
			urinaryNotes: ''
		},
		fertilityAssessment: {
			tryingToConceive: '',
			durationTryingMonths: null,
			previousPregnancies: null,
			liveBirths: null,
			miscarriages: null,
			ectopicPregnancies: null,
			previousFertilityTreatment: '',
			fertilityTreatmentDetails: '',
			amhLevel: null,
			partnerSemenAnalysis: '',
			futureFertilityConcerns: '',
			fertilityNotes: ''
		},
		previousTreatments: {
			nsaidsTried: '',
			nsaidsEffective: '',
			paracetamolTried: '',
			opioidsTried: '',
			opioidsCurrent: '',
			combinedPillTried: '',
			combinedPillEffective: '',
			progesteroneTried: '',
			progesteroneType: '',
			gnrhAgonistTried: '',
			gnrhAgonistDurationMonths: null,
			mirenaIusTried: '',
			otherTreatments: '',
			treatmentNotes: ''
		},
		surgicalHistory: {
			previousLaparoscopy: '',
			numberOfLaparoscopies: null,
			mostRecentLaparoscopyDate: '',
			endometriosisConfirmedSurgically: '',
			histologicalConfirmation: '',
			asrmStageAtSurgery: '',
			sitesFound: '',
			excisionPerformed: '',
			ablationPerformed: '',
			adhesiolysisPerformed: '',
			endometriomaDrained: '',
			bowelSurgery: '',
			bladderSurgery: '',
			otherPelvicSurgery: '',
			surgicalComplications: '',
			surgicalNotes: ''
		},
		qualityOfLife: {
			painDomainScore: null,
			controlPowerlessnessScore: null,
			emotionalWellbeingScore: null,
			socialSupportScore: null,
			selfImageScore: null,
			workImpact: '',
			relationshipImpact: '',
			sleepImpact: '',
			mentalHealthImpact: '',
			exerciseImpact: '',
			qolNotes: ''
		},
		treatmentPlanning: {
			treatmentGoals: '',
			preferredApproach: '',
			surgeryConsidered: '',
			surgeryTypeConsidered: '',
			fertilityPreservationNeeded: '',
			mdtReferralNeeded: '',
			painManagementReferral: '',
			psychologyReferral: '',
			physiotherapyReferral: '',
			fertilityClinicReferral: '',
			imagingRequested: '',
			followUpInterval: '',
			planningNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the endometriosis assessment, with localStorage
 * persistence so an in-progress assessment survives a page reload. Drafts are
 * keyed by assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the assessment currently loaded into the store (`new` for a fresh draft). */
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
