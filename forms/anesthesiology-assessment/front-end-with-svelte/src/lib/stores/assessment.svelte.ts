import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `anesthesiology-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank anaesthesiology assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsNumber: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			postcode: '',
			phone: '',
			email: '',
			emergencyName: '',
			emergencyPhone: '',
			emergencyRelationship: '',
			gpName: '',
			gpPractice: '',
			gpPhone: ''
		},
		plannedSurgery: {
			procedureName: '',
			surgeonName: '',
			surgeryDate: '',
			surgeryGrade: '',
			proposedAnaesthesia: ''
		},
		medicalHistory: {
			hypertension: '',
			ischaemicHeartDisease: '',
			heartFailure: '',
			valvularDisease: '',
			arrhythmia: '',
			peripheralVascularDisease: '',
			dvtPe: '',
			asthma: '',
			copd: '',
			sleepApnea: '',
			recentUrti: '',
			epilepsy: '',
			strokeTia: '',
			neuromuscularDisease: '',
			diabetesType1: '',
			diabetesType2: '',
			thyroidDisease: '',
			adrenalInsufficiency: '',
			chronicKidneyDisease: '',
			dialysis: '',
			liverDisease: '',
			jaundice: '',
			cirrhosis: '',
			anaemia: '',
			bleedingDisorder: '',
			clottingDisorder: '',
			gord: '',
			pepticUlcer: '',
			rheumatoidArthritis: '',
			limitedMobility: '',
			anxiety: '',
			depression: '',
			otherPsychiatric: '',
			otherDetails: ''
		},
		medications: {
			list: [],
			onAnticoagulants: '',
			onAntiplatelets: '',
			onInsulin: '',
			onSteroids: '',
			onMaois: ''
		},
		allergies: {
			list: [],
			latexAllergy: ''
		},
		previousAnaesthesia: {
			operations: [],
			difficultIntubation: false,
			ponv: false,
			awareness: false,
			slowRecovery: false,
			allergicReaction: false,
			otherComplication: false,
			otherComplicationDetails: '',
			malignantHyperthermia: '',
			familyAnaestheticComplications: '',
			familyAnaestheticDetails: ''
		},
		socialHistory: {
			smoking: '',
			packYears: null,
			alcoholUnitsPerWeek: null,
			recreationalDrugUse: '',
			recreationalDrugDetails: '',
			canClimbTwoFlights: '',
			exerciseTolerance: '',
			occupation: '',
			pregnancyStatus: '',
			snoresLoudly: '',
			tiredDuringDay: '',
			observedApnea: ''
		},
		vitalSigns: {
			systolicBp: null,
			diastolicBp: null,
			heartRate: null,
			respiratoryRate: null,
			spo2: null,
			temperature: null,
			height: null,
			weight: null,
			bmi: null,
			neckCircumference: null
		},
		physicalExam: {
			mallampatiClass: '',
			mouthOpening: null,
			thyromentalDistance: null,
			neckMobility: '',
			dentitionIntact: false,
			dentitionDentures: false,
			dentitionLooseTeeth: false,
			dentitionCrowns: false,
			dentitionProminentIncisors: false,
			jawProtrusion: '',
			heartSounds: '',
			peripheralEdema: '',
			jvp: '',
			breathSounds: '',
			accessoryMuscleUse: ''
		},
		investigationsAndPlan: {
			fbcStatus: '',
			fbcNotes: '',
			ueStatus: '',
			ueNotes: '',
			lftsStatus: '',
			lftsNotes: '',
			coagStatus: '',
			coagNotes: '',
			hba1cStatus: '',
			hba1cNotes: '',
			ecgStatus: '',
			ecgNotes: '',
			cxrStatus: '',
			cxrNotes: '',
			echoStatus: '',
			echoNotes: '',
			otherInvestigation: '',
			otherInvestigationStatus: '',
			rcriIschaemicHeartDisease: '',
			rcriCongestiveHeartFailure: '',
			rcriCerebrovascularDisease: '',
			rcriHighCreatinine: '',
			asaClass: '',
			emergencyCase: '',
			proposedTechnique: '',
			airwayPlan: '',
			postOpDestination: '',
			specialRequirements: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the anaesthesiology assessment, with localStorage
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
