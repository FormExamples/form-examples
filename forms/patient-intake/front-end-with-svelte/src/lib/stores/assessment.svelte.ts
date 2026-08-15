import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given intake id (defaults to `new`). */
function storageKey(id: string): string {
	return `patient-intake.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank patient intake with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		personalInformation: {
			fullName: '',
			dateOfBirth: '',
			sex: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			postcode: '',
			phone: '',
			email: '',
			emergencyContactName: '',
			emergencyContactPhone: '',
			emergencyContactRelationship: ''
		},
		insuranceAndId: {
			insuranceProvider: '',
			policyNumber: '',
			nhsNumber: '',
			gpName: '',
			gpPracticeName: '',
			gpPhone: ''
		},
		reasonForVisit: {
			primaryReason: '',
			urgencyLevel: '',
			referringProvider: '',
			symptomDuration: '',
			additionalDetails: ''
		},
		medicalHistory: {
			chronicConditions: [],
			previousSurgeries: '',
			previousHospitalizations: '',
			ongoingTreatments: ''
		},
		medications: [],
		allergies: [],
		familyHistory: {
			heartDisease: '',
			heartDiseaseDetails: '',
			cancer: '',
			cancerDetails: '',
			diabetes: '',
			diabetesDetails: '',
			stroke: '',
			strokeDetails: '',
			mentalIllness: '',
			mentalIllnessDetails: '',
			geneticConditions: '',
			geneticConditionsDetails: ''
		},
		socialHistory: {
			smokingStatus: '',
			smokingPackYears: null,
			alcoholFrequency: '',
			alcoholUnitsPerWeek: null,
			drugUse: '',
			drugDetails: '',
			occupation: '',
			exerciseFrequency: '',
			dietQuality: ''
		},
		reviewOfSystems: {
			constitutional: '',
			heent: '',
			cardiovascular: '',
			respiratory: '',
			gastrointestinal: '',
			genitourinary: '',
			musculoskeletal: '',
			neurological: '',
			psychiatric: '',
			skin: ''
		},
		consentAndPreferences: {
			consentToTreatment: '',
			privacyAcknowledgement: '',
			communicationPreference: '',
			advanceDirectives: '',
			advanceDirectiveDetails: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the patient intake, with localStorage
 * persistence so an in-progress intake survives a page reload. Drafts are
 * keyed by intake id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the intake currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the intake for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` intake is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const p = assessment.data.personalInformation`) stay bound to live
	 * state.
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
 * them — reactive when a new intake is loaded.
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
