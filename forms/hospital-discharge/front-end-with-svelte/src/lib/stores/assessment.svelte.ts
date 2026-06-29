import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given discharge id (defaults to `new`). */
function storageKey(id: string): string {
	return `hospital-discharge.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank hospital discharge summary with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientDetails: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsNumber: '',
			hospitalNumber: '',
			address: '',
			postcode: '',
			phone: '',
			gpName: '',
			gpPractice: '',
			nextOfKinName: '',
			nextOfKinPhone: ''
		},
		admissionSummary: {
			admissionDate: '',
			dischargeDate: '',
			ward: '',
			consultant: '',
			specialty: '',
			reasonForAdmission: '',
			presentingComplaint: '',
			clinicalNarrative: ''
		},
		diagnoses: {
			diagnoses: []
		},
		proceduresPerformed: {
			procedures: [],
			noProceduresPerformed: ''
		},
		dischargeMedications: {
			medications: [],
			reconciliationCompleted: '',
			reconciliationNotes: '',
			allergiesReviewed: '',
			allergyNotes: ''
		},
		followupArrangements: {
			appointments: [],
			gpFollowupRequired: '',
			gpFollowupTimeframe: '',
			outpatientFollowupRequired: '',
			investigationsPending: '',
			pendingInvestigationDetails: '',
			resultsToBeChasedByGp: ''
		},
		communityCareInstructions: {
			dischargeDestination: '',
			otherDestinationDetails: '',
			careResponsibility: '',
			transportMode: '',
			districtNurseReferral: '',
			socialServicesReferral: '',
			physiotherapyReferral: '',
			occupationalTherapyReferral: '',
			packageOfCareInPlace: '',
			mobilityStatus: '',
			dietaryRequirements: '',
			woundCareInstructions: '',
			equipmentProvided: ''
		},
		warningSigns: {
			redFlagSymptoms: [],
			whenToSeekHelp: '',
			emergencyContactNumber: '',
			safetyNetingProvided: '',
			writtenInfoGiven: ''
		},
		clinicianSignoff: {
			clinicianName: '',
			clinicianRole: '',
			gmcNumber: '',
			signoffDate: '',
			bleepOrContact: '',
			responsibleConsultantInformed: '',
			additionalNotes: ''
		},
		patientAcknowledgement: {
			patientUnderstandsPlan: '',
			carerInformed: '',
			carerName: '',
			medicationsExplained: '',
			writtenSummaryProvided: '',
			questionsAnswered: '',
			acknowledgementDate: '',
			signedBy: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the hospital discharge summary, with
 * localStorage persistence so an in-progress summary survives a page reload.
 * Drafts are keyed by discharge id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the discharge currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the discharge summary for `id` into the store. A saved draft for that id
	 * (in localStorage) takes precedence; otherwise the `seed` summary is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather than
	 * reassigned, so step components that captured a section reference (e.g.
	 * `const d = assessment.data.patientDetails`) stay bound to live state.
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
 * them — reactive when a new discharge summary is loaded.
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
