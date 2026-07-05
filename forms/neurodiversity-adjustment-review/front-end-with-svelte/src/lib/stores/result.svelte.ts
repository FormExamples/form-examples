import { browser } from '$app/environment';
import type { NeurodiversityAdjustmentReview, GradingResult } from '$lib/engine/types';

/** Per-id localStorage draft key (default id `new`). */
function storageKey(id: string): string {
	return `neurodiversity-adjustment-review.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank review with all fields at their unanswered defaults. */
export function createDefaultReview(): NeurodiversityAdjustmentReview {
	return {
		managerName: '',
		managerRole: '',
		managerJobTitle: '',
		managerDepartment: '',
		managerEmail: '',
		managerPhone: '',
		responseReference: '',
		reviewStatus: '',
		reviewMethod: '',
		reviewDate: '',
		nextReviewDate: '',
		workerName: '',
		workerJobTitle: '',
		workerDepartment: '',
		employeeReference: '',
		workerEmail: '',
		workerPhone: '',
		effectivenessWorkingEnvironment: '',
		effectivenessEquipmentTechnology: '',
		effectivenessWorkingArrangements: '',
		effectivenessCommunication: '',
		effectivenessSupportMentoring: '',
		effectivenessRecruitmentProcess: '',
		effectivenessPolicyDress: '',
		effectivenessOther: '',
		workerFeedback: '',
		workerSatisfied: '',
		wellbeingChange: '',
		barriersDetail: '',
		changesNeeded: false,
		changesDetail: '',
		updatedAdjustmentsDetail: '',
		occupationalHealthRereferral: false,
		escalated: false,
		escalationDetail: '',
		notes: '',
		signed: false
	};
}

/**
 * Svelte 5 reactive store for the neurodiversity adjustment review, with
 * localStorage persistence so an in-progress review survives a page reload.
 */
class ReviewStore {
	data = $state<NeurodiversityAdjustmentReview>(createDefaultReview());
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
	loadForId(id: string, seed?: Partial<NeurodiversityAdjustmentReview>) {
		this.id = id || 'new';
		this.result = null;
		this.currentStep = 1;
		let next = { ...createDefaultReview(), ...(seed ?? {}) };
		if (browser) {
			const raw = localStorage.getItem(storageKey(this.id));
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as Partial<NeurodiversityAdjustmentReview>;
					next = { ...next, ...parsed };
				} catch {
					// Ignore corrupt storage and start fresh.
				}
			}
		}
		this.data = next;
	}

	reset() {
		this.data = createDefaultReview();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const resultStore = new ReviewStore();
