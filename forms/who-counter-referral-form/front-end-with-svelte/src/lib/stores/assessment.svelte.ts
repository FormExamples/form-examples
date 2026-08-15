import { browser } from '$app/env';
import type { AssessmentData, FlaggedIssue, ValidationResult } from '#lib/engine/types.js';

/** localStorage draft key for a given counter-referral id (defaults to `new`). */
function storageKey(id: string): string {
	return `who-counter-referral-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank WHO counter-referral form with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			sex: '',
			patientContact: '',
			emergencyContact: { name: '', contactInformation: '' }
		},
		facilityDetails: {
			initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
			referralDate: '',
			referralReason: '',
			acuity: '',
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			communication: {
				discussedWithPrimaryCareProvider: false,
				discussedWithInitiatingFacility: false
			},
			primaryCareFacility: { name: '', focalPoint: '', phoneNumber: '' },
			followUpTimeframe: ''
		},
		situation: {
			chiefComplaint: '',
			primaryDiagnosis: '',
			pregnant: '',
			treatmentsInitiated: '',
			icuStay: false,
			surgery: false,
			hospitalized: false
		},
		background: {
			historyOfPresentIllness: '',
			pastMedicalHistory: '',
			significantEvents: ''
		},
		assessment: {
			finalDiagnoses: '',
			prognosisAndGoalsOfCare: '',
			patientFamilyInformed: '',
			informedExplanation: ''
		},
		recommendations: {
			followUpPlan: '',
			pendingInvestigations: '',
			followUpArrangements: '',
			deteriorationInstructions: '',
			contactName: '',
			contactInformation: '',
			statusFlags: {
				cognitiveImpairment: false,
				carerDependent: false,
				spinalPrecautions: false,
				weightBearingRestrictions: false,
				palliativeCare: false
			}
		},
		providerSignOff: {
			providerName: '',
			signature: '',
			signatureDate: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the WHO counter-referral form, with localStorage
 * persistence so an in-progress form survives a page reload. Drafts are keyed by
 * counter-referral id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	validation = $state<ValidationResult | null>(null);
	flags = $state<FlaggedIssue[]>([]);
	currentStep = $state(1);
	/** The id of the counter-referral currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the counter-referral for `id` into the store. A saved draft for that id
	 * (in localStorage) takes precedence; otherwise the `seed` form is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather than
	 * reassigned, so step components that captured a section reference (e.g.
	 * `const p = assessment.data.patientIdentification`) stay bound to live state.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.validation = null;
		this.flags = [];
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
		this.validation = null;
		this.flags = [];
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
 * them — reactive when a new counter-referral is loaded.
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
