import { browser } from '$app/env';
import type { NeurodiversityAdjustmentReview, GradingResult } from '#lib/engine/types.js';

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
	/**
	 * The id of the record currently loaded into the store (`new`
	 * for a fresh draft). Starts as `''`, not `'new'`: the wizard
	 * page only calls loadForId() when `store.id !== id`, so if this
	 * defaulted to the literal string `'new'` the very first visit
	 * to the (very common) `/new` route would never call
	 * loadForId() at all -- any saved draft for `new` would be
	 * silently ignored on every fresh page load. `''` never
	 * collides with a real route id.
	 */
	id = $state('');

	/**
	 * True once a saved draft was found for the current id/store on
	 * load -- read by RestoreBanner.svelte to tell the user their
	 * progress was restored rather than silently repopulating fields
	 * with no explanation. Mirrors the HTML front-end's
	 * window.__FORM_STATE__.hadDraftAtLoad.
	 */
	hadDraftAtLoad = $state(false);
	// True once loadForId() has run for the first time. Guards the
	// persistence effect below: without it, the effect's very first
	// (immediate) run persists the *blank* initial data before
	// loadForId() ever gets a chance to read a previously-saved draft
	// from localStorage -- silently clobbering it with blank data on
	// every fresh page load.
	#loaded = false;

	constructor() {
		if (browser) {
			// Persist on every change to the draft for the active id.
			$effect.root(() => {
				$effect(() => {
					const key = storageKey(this.id);
					const snapshot = JSON.stringify(this.data);
					if (!this.#loaded) return;
					localStorage.setItem(key, snapshot);
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
		let next = { ...createDefaultReview(), ...seed ?? {} };
		if (browser) {
			const raw = localStorage.getItem(storageKey(this.id));
			this.hadDraftAtLoad = raw !== null;
			this.#loaded = true;
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
		this.hadDraftAtLoad = false;
		this.data = createDefaultReview();
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

export const resultStore = new ReviewStore();
