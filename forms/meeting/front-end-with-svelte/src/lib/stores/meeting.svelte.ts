import { browser } from '$app/env';
import type { MeetingData, ValidationResult } from '#lib/engine/types.js';

/** localStorage draft key for a given meeting id (defaults to `new`). */
function storageKey(id: string): string {
	return `meeting.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank meeting record with all fields at their unanswered defaults. */
export function createDefaultMeeting(): MeetingData {
	return {
		organizer: {
			name: '',
			email: '',
			role: '',
			organisation: '',
			team: '',
			timezone: ''
		},
		meta: {
			status: 'draft',
			title: '',
			purpose: '',
			longDescription: '',
			category: '',
			visibility: ''
		},
		invitation: {
			scheduledStartAt: '',
			scheduledEndAt: '',
			timezone: '',
			location: '',
			videoUrl: '',
			phoneNumber: '',
			dialInCode: '',
			joiningInstructions: '',
			calendarUid: ''
		},
		agenda: [],
		participants: [],
		resources: [],
		recurrence: {
			frequency: 'none',
			intervalCount: 1,
			byDayOfWeek: '',
			byDayOfMonth: '',
			bySetPosition: '',
			byMonthOfYear: '',
			seriesCount: null,
			seriesUntil: ''
		},
		summary: {
			summary: '',
			actualStartAt: '',
			actualEndAt: ''
		},
		results: {
			actionItems: [],
			outputs: [],
			outcomes: []
		},
		signoff: {
			overallResult: '',
			additionalNotes: '',
			signedByName: '',
			signedAt: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the meeting record, with localStorage
 * persistence so an in-progress record survives a page reload. Drafts are
 * keyed by meeting id so each record edits independently.
 */
class MeetingStore {
	data = $state<MeetingData>(createDefaultMeeting());
	result = $state<ValidationResult | null>(null);
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
	 * Load the meeting for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` record is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = meeting.data.invitation`) stay bound to live state.
	 */
	loadForId(id: string, seed?: MeetingData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: MeetingData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			this.hadDraftAtLoad = raw !== null;
			this.#loaded = true;
			if (raw) {
				try {
					draft = JSON.parse(raw) as MeetingData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultMeeting()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		this.hadDraftAtLoad = false;
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultMeeting() as unknown as Record<string, unknown>
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
 * them — reactive when a new meeting is loaded.
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

export const meeting = new MeetingStore();
