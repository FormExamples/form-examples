import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
	return `first-aid-training-checklist.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank First Aid at Work checklist with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		traineeDetails: {
			firstName: '',
			lastName: '',
			traineeId: '',
			role: '',
			priorCertificationExpiry: '',
			sessionDate: '',
			examinerName: '',
			venue: ''
		},
		sceneAssessmentSafety: {
			sceneSafe: '',
			ppeApplied: '',
			hazardsIdentified: '',
			bystandersControlled: ''
		},
		primarySurveyDRABC: {
			dangerCheck: '',
			responseCheck: '',
			airwayManagement: '',
			breathingCheck: '',
			circulationAssessment: '',
			recoveryPositionWhenAppropriate: ''
		},
		cprAed: {
			effectiveCompressions: '',
			effectiveVentilations: '',
			ratio30to2: '',
			aedPowerOnPromptly: '',
			aedPadPlacement: '',
			aedSafeShockDelivery: ''
		},
		chokingManagement: {
			encouragedCoughing: '',
			fiveBackBlows: '',
			fiveAbdominalThrusts: '',
			alternatesUntilDislodged: '',
			unconsciousChokingCpr: ''
		},
		bleedingWoundCare: {
			directPressureApplied: '',
			elevatedAndImmobilised: '',
			appliedDressingCorrectly: '',
			tourniquetWhenIndicated: '',
			haemostaticDressingApplied: '',
			treatedForShock: ''
		},
		burnsScalds: {
			cooledForTwentyMinutes: '',
			removedJewelleryAndLooseClothing: '',
			coveredWithClingFilmOrSterileDressing: '',
			avoidedCreamsOrIce: '',
			referredAppropriately: ''
		},
		fracturesSprainsSpinal: {
			immobilisedInjuredLimb: '',
			appliedRiceForSprains: '',
			suspectedSpinalManualSupport: '',
			performedLogRollWithTeam: '',
			avoidedUnnecessaryMovement: ''
		},
		medicalEmergencies: {
			recognisedAnaphylaxis: '',
			administeredEpiPenSafely: '',
			assistedAsthmaInhaler: '',
			managedHypoglycaemia: '',
			managedSeizureSafely: '',
			recognisedStrokeFAST: '',
			recognisedChestPain: ''
		},
		recordingReportingHandover: {
			accidentBookEntry: '',
			riddorAwareness: '',
			structuredHandoffSbar: '',
			confidentialityMaintained: '',
			examinerNotes: '',
			traineeFeedback: '',
			debriefNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the First Aid at Work checklist, with localStorage
 * persistence so an in-progress assessment survives a page reload. Drafts are
 * keyed by checklist id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the checklist currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the checklist for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` checklist is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.cprAed`) stay bound to live state.
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
 * them — reactive when a new checklist is loaded.
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
