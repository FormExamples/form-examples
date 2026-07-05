import { browser } from '$app/environment';
import type { NeurodiversityAdjustmentRequest, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given request id (defaults to `new`). */
function storageKey(id: string): string {
	return `neurodiversity-adjustment-request.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank request with all fields at their unanswered defaults. */
export function createDefaultRequest(): NeurodiversityAdjustmentRequest {
	return {
		// Worker & role
		workerName: '',
		workerJobTitle: '',
		workerDepartment: '',
		employmentType: '',
		workPattern: '',
		workLocation: '',
		employmentStartDate: '',
		employeeReference: '',
		workerEmail: '',
		workerPhone: '',

		// Handler
		managerName: '',
		managerRole: '',
		managerJobTitle: '',
		managerDepartment: '',
		managerEmail: '',
		managerPhone: '',

		// Request lifecycle
		status: 'draft',
		requestedBy: 'worker',
		requestDate: '',
		requestedStartDate: '',

		// Neurodivergent profile
		conditionAdhd: false,
		conditionAutism: false,
		conditionDyslexia: false,
		conditionDyspraxia: false,
		conditionDyscalculia: false,
		conditionTourettes: false,
		conditionOther: false,
		conditionOtherDetail: '',
		diagnosisStatus: '',
		considersDisability: '',
		substantialLongTermImpact: false,
		disclosureConsent: false,

		// Functional difficulties
		difficultyConcentration: false,
		difficultyWrittenCommunication: false,
		difficultyOrganisationTime: false,
		difficultySensoryOverload: false,
		difficultyBalanceCoordination: false,
		difficultySocialCommunication: false,
		difficultyMemory: false,
		difficultyBurnoutWellbeing: false,
		tasksSituationsAffected: '',
		workerStrengths: '',

		// Requested adjustments
		adjustmentWorkingEnvironment: false,
		adjustmentEquipmentTechnology: false,
		adjustmentWorkingArrangements: false,
		adjustmentCommunication: false,
		adjustmentSupportMentoring: false,
		adjustmentRecruitmentProcess: false,
		adjustmentPolicyDress: false,
		adjustmentOther: false,
		adjustmentsRequestedDetail: '',

		// Supporting evidence
		supportingEvidenceType: '',
		occupationalHealthInvolved: false,
		accessToWorkInvolved: false,

		// Impact and urgency
		currentImpact: '',
		atRiskOfAbsence: false,
		urgency: 'routine',
		notes: ''
	};
}

/**
 * Svelte 5 reactive store for the neurodiversity adjustment request, with
 * localStorage persistence so an in-progress request survives a page reload.
 */
class RequestStore {
	data = $state<NeurodiversityAdjustmentRequest>(createDefaultRequest());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the request currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			// Persist on every change, keyed by the current request id.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the request for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` request is used (e.g. a
	 * sample request for an existing id), falling back to a blank draft for `new`.
	 */
	loadForId(id: string, seed?: NeurodiversityAdjustmentRequest) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: Partial<NeurodiversityAdjustmentRequest> | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as Partial<NeurodiversityAdjustmentRequest>;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}

		const base = seed ?? createDefaultRequest();
		this.data = draft ? { ...base, ...draft } : { ...base };
	}

	reset() {
		this.data = createDefaultRequest();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const requestStore = new RequestStore();
