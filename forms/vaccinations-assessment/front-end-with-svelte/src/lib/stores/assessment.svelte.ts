import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `vaccinations-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank vaccinations assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientInformation: {
			patientName: '',
			dateOfBirth: '',
			patientSex: '',
			patientAge: '',
			nhsNumber: '',
			gpPractice: '',
			contactPhone: '',
			contactEmail: ''
		},
		immunizationHistory: {
			hasVaccinationRecord: '',
			recordSource: '',
			lastReviewDate: '',
			previousAdverseReactions: '',
			adverseReactionDetails: '',
			immunocompromised: '',
			immunocompromisedDetails: ''
		},
		childhoodVaccinations: {
			dtapIpvHibHepb: null,
			pneumococcal: null,
			rotavirus: null,
			meningitisB: null,
			mmr: null,
			hibMenc: null,
			preschoolBooster: null
		},
		adultVaccinations: {
			tdIpvBooster: null,
			hpv: null,
			meningitisAcwy: null,
			influenzaAnnual: null,
			covid19: null,
			shingles: null,
			pneumococcalPpv: null
		},
		travelVaccinations: {
			travelPlanned: '',
			travelDestination: '',
			hepatitisA: null,
			hepatitisB: null,
			typhoid: null,
			yellowFever: null,
			rabies: null,
			japaneseEncephalitis: null
		},
		occupationalVaccinations: {
			occupation: '',
			healthcareWorker: '',
			hepatitisBOccupational: null,
			influenzaOccupational: null,
			varicella: null,
			bcgTuberculosis: null
		},
		contraindicationsAllergies: {
			eggAllergy: '',
			gelatinAllergy: '',
			latexAllergy: '',
			neomycinAllergy: '',
			pregnant: '',
			pregnancyWeeks: '',
			severeIllness: '',
			previousAnaphylaxis: '',
			anaphylaxisDetails: ''
		},
		consentInformation: {
			informationProvided: null,
			risksExplained: null,
			benefitsExplained: null,
			questionsAnswered: null,
			consentGiven: '',
			consentDate: '',
			guardianConsent: ''
		},
		administrationRecord: {
			vaccineName: '',
			batchNumber: '',
			expiryDate: '',
			administrationSite: '',
			administrationRoute: '',
			doseNumber: '',
			administeredBy: '',
			administrationDate: ''
		},
		clinicalReview: {
			postVaccinationObservation: null,
			immediateReaction: '',
			reactionDetails: '',
			nextDoseDue: '',
			catchUpScheduleNeeded: '',
			referralNeeded: '',
			clinicianNotes: '',
			reviewingClinician: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the vaccinations assessment, with localStorage
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
	 * (e.g. `const p = assessment.data.patientInformation`) stay bound to live state.
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
