import { browser } from '$app/env';
import type { StatementData, CompletenessResult } from '#lib/engine/types.js';

/** localStorage draft key for a given statement id (defaults to `new`). */
function storageKey(id: string): string {
	return `advance-statement-about-care.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank advance statement with all fields at their unanswered defaults. */
export function createDefaultAssessment(): StatementData {
	return {
		personalInformation: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			nhsNumber: '',
			address: '',
			postcode: '',
			telephone: '',
			email: '',
			gpName: '',
			gpPractice: '',
			gpTelephone: ''
		},
		statementContext: {
			reasonForStatement: '',
			currentDiagnosis: '',
			understandingOfCondition: '',
			whenStatementShouldApply: '',
			previousAdvanceStatements: '',
			previousStatementDetails: ''
		},
		valuesBeliefs: {
			religiousBeliefs: '',
			spiritualBeliefs: '',
			culturalValues: '',
			qualityOfLifePriorities: '',
			whatMakesLifeMeaningful: '',
			importantTraditions: '',
			viewsOnDying: ''
		},
		carePreferences: {
			preferredPlaceOfCare: '',
			preferredPlaceOfDeath: '',
			personalComfortPreferences: '',
			dailyRoutinePreferences: '',
			dietaryRequirements: '',
			clothingPreferences: '',
			hygienePreferences: '',
			environmentPreferences: ''
		},
		medicalTreatmentWishes: {
			painManagementPreferences: '',
			nutritionHydrationWishes: '',
			ventilationWishes: '',
			resuscitationWishes: '',
			antibioticsWishes: '',
			hospitalisationWishes: '',
			bloodTransfusionWishes: '',
			organDonationWishes: ''
		},
		communicationPreferences: {
			preferredLanguage: '',
			communicationAids: '',
			howToBeAddressed: '',
			informationSharingPreferences: '',
			interpreterNeeded: '',
			interpreterLanguage: ''
		},
		peopleImportantToMe: {
			people: [],
			petsDetails: '',
			petCareArrangements: ''
		},
		practicalMatters: {
			financialArrangements: '',
			propertyMatters: '',
			petCareInstructions: '',
			socialMediaWishes: '',
			personalBelongings: '',
			funeralWishes: '',
			willDetails: '',
			powerOfAttorneyDetails: ''
		},
		signaturesWitnesses: {
			patientSignature: '',
			patientSignatureDate: '',
			witnessName: '',
			witnessAddress: '',
			witnessSignature: '',
			witnessSignatureDate: '',
			reviewDate: '',
			healthcareProfessionalName: '',
			healthcareProfessionalRole: '',
			healthcareProfessionalSignature: '',
			healthcareProfessionalDate: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the advance statement, with localStorage
 * persistence so an in-progress statement survives a page reload. Drafts are
 * keyed by statement id so each record edits independently.
 */
class AssessmentStore {
	data = $state<StatementData>(createDefaultAssessment());
	result = $state<CompletenessResult | null>(null);
	currentStep = $state(1);
	/** The id of the statement currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the statement for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` statement is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const p = assessment.data.personalInformation`) stay bound to live
	 * state.
	 */
	loadForId(id: string, seed?: StatementData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: StatementData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as StatementData;
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
 * them — reactive when a new statement is loaded.
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
