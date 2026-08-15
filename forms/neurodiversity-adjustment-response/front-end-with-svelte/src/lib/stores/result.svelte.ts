import { browser } from '$app/env';
import type { NeurodiversityAdjustmentResponse, GradingResult } from '#lib/engine/types.js';

/** Per-id localStorage draft key (default id `new`). */
function storageKey(id: string): string {
	return `neurodiversity-adjustment-response.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank response with all fields at their unanswered defaults. */
export function createDefaultResponse(): NeurodiversityAdjustmentResponse {
	return {
		managerName: '',
		managerRole: '',
		managerJobTitle: '',
		managerDepartment: '',
		managerEmail: '',
		managerPhone: '',
		requestReference: '',
		responseStatus: '',
		handlingMethod: '',
		assessedDate: '',
		respondedDate: '',
		effectiveDate: '',
		workerName: '',
		workerJobTitle: '',
		workerDepartment: '',
		employeeReference: '',
		workerEmail: '',
		workerPhone: '',
		overallDecision: '',
		decisionRationale: '',
		declineReasonCategory: '',
		agreedWorkingEnvironment: false,
		agreedEquipmentTechnology: false,
		agreedWorkingArrangements: false,
		agreedCommunication: false,
		agreedSupportMentoring: false,
		agreedRecruitmentProcess: false,
		agreedPolicyDress: false,
		agreedOther: false,
		agreedAdjustmentsDetail: '',
		alternativeAdjustmentsDetail: '',
		trialPeriod: false,
		trialPeriodWeeks: null,
		reviewScheduled: false,
		reviewDate: '',
		occupationalHealthReferred: false,
		accessToWorkReferred: false,
		supportResourcesDetail: '',
		responsibilitiesDetail: '',
		pointOfContact: '',
		escalated: false,
		escalationDetail: '',
		notes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the neurodiversity adjustment response, with
 * localStorage persistence so an in-progress response survives a page reload.
 */
class ResponseStore {
	data = $state<NeurodiversityAdjustmentResponse>(createDefaultResponse());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** Id of the item currently loaded into the store (`new` for a fresh draft). */
	id = $state('new');

	constructor() {
		if (browser) {
			// Persist on every change to the draft for the active id.
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
				});
			});
		}
	}

	/**
	 * Load the draft for `id` into the store. Hydrates from the per-id
	 * localStorage draft when present; otherwise starts from a blank draft.
	 * `seed` lets callers pre-fill a blank draft (e.g. from sample-row data).
	 */
	loadForId(id: string, seed?: Partial<NeurodiversityAdjustmentResponse>) {
		this.id = id || 'new';
		this.result = null;
		this.currentStep = 1;
		let next = { ...createDefaultResponse(), ...seed ?? {} };
		if (browser) {
			const raw = localStorage.getItem(storageKey(this.id));
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<NeurodiversityAdjustmentResponse>;
					next = { ...next, ...parsed };
				} catch {
					// Ignore corrupt storage and start fresh.
				}
			}
		}
		this.data = next;
	}

	reset() {
		this.data = createDefaultResponse();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const resultStore = new ResponseStore();
