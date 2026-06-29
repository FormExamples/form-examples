import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given ADRT id (defaults to `new`). */
function storageKey(id: string): string {
	return `advance-decision-to-refuse-treatment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank ADRT with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		personalInformation: {
			fullLegalName: '',
			dateOfBirth: '',
			nhsNumber: '',
			address: '',
			postcode: '',
			telephone: '',
			email: '',
			gpName: '',
			gpPractice: '',
			gpAddress: '',
			gpTelephone: ''
		},
		capacityDeclaration: {
			confirmsCapacity: '',
			understandsConsequences: '',
			noUndueInfluence: '',
			professionalCapacityAssessment: '',
			assessedByName: '',
			assessedByRole: '',
			assessmentDate: '',
			assessmentDetails: ''
		},
		circumstances: {
			specificCircumstances: '',
			medicalConditions: '',
			situationsDescription: ''
		},
		treatmentsRefusedGeneral: {
			antibiotics: { treatment: 'Antibiotics', refused: '', specification: '' },
			bloodTransfusion: { treatment: 'Blood Transfusion', refused: '', specification: '' },
			ivFluids: { treatment: 'IV Fluids', refused: '', specification: '' },
			tubeFeeding: { treatment: 'Tube Feeding', refused: '', specification: '' },
			dialysis: { treatment: 'Dialysis', refused: '', specification: '' },
			ventilation: { treatment: 'Ventilation', refused: '', specification: '' },
			otherTreatments: []
		},
		treatmentsRefusedLifeSustaining: {
			cpr: { treatment: 'CPR', refused: '', evenIfLifeAtRisk: '', specification: '' },
			mechanicalVentilation: { treatment: 'Mechanical Ventilation', refused: '', evenIfLifeAtRisk: '', specification: '' },
			artificialNutritionHydration: { treatment: 'Artificial Nutrition/Hydration', refused: '', evenIfLifeAtRisk: '', specification: '' },
			otherLifeSustaining: []
		},
		exceptionsConditions: {
			hasExceptions: '',
			exceptionsDescription: '',
			hasTimeLimitations: '',
			timeLimitationsDescription: '',
			invalidatingConditions: ''
		},
		otherWishes: {
			preferredCareSetting: '',
			comfortMeasures: '',
			spiritualReligiousWishes: '',
			otherPreferences: ''
		},
		lastingPowerOfAttorney: {
			hasLPA: '',
			lpaType: '',
			lpaRegistered: '',
			lpaRegistrationDate: '',
			doneeNames: '',
			relationshipBetweenADRTAndLPA: ''
		},
		healthcareProfessionalReview: {
			reviewedByClinicianName: '',
			reviewedByClinicianRole: '',
			reviewDate: '',
			clinicalOpinionOnCapacity: '',
			anyConcerns: '',
			concernsDetails: ''
		},
		legalSignatures: {
			patientSignature: '',
			patientStatementOfUnderstanding: '',
			patientSignatureDate: '',
			witnessSignature: '',
			witnessName: '',
			witnessAddress: '',
			witnessSignatureDate: '',
			lifeSustainingWrittenStatement: '',
			lifeSustainingStatementText: '',
			lifeSustainingSignature: '',
			lifeSustainingWitnessSignature: '',
			lifeSustainingWitnessName: '',
			lifeSustainingWitnessAddress: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the ADRT, with localStorage persistence so an
 * in-progress document survives a page reload. Drafts are keyed by id so each
 * record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the ADRT currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the ADRT for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` document is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.personalInformation`) stay bound to live
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
		deepAssign(this.data as unknown as Record<string, unknown>, (draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>);
	}

	reset() {
		deepAssign(this.data as unknown as Record<string, unknown>, createDefaultAssessment() as unknown as Record<string, unknown>);
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
 * them — reactive when a new ADRT is loaded.
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
