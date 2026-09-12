import { browser } from '$app/env';
import type {
	AgileConsultingScorecardAssessment,
	ChecklistItem,
	GradeResult,
} from '#lib/engine/types.js';
import { gradeScorecard } from '#lib/engine/score-grader.js';

/** localStorage draft key for a given scorecard id (defaults to `new`). */
function storageKey(id: string): string {
	return `agile-consulting-scorecard-for-hiring-help.front-end-with-svelte.${id || 'new'}.v1`;
}

function blankItem(): ChecklistItem {
	return { done: null, evidence: '' };
}

/** A blank scorecard with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AgileConsultingScorecardAssessment {
	return {
		organization: {
			organizationName: '',
			legalName: '',
			sector: '',
			sizeBand: '',
			headcount: null,
			country: '',
			region: '',
			website: '',
		},
		respondent: {
			respondentName: '',
			respondentEmail: '',
			respondentPhone: '',
			role: '',
			department: '',
			seniority: '',
			timezone: '',
			preferredContact: '',
		},
		assessment: {
			assessmentDate: '',
			status: 'draft',
		},
		manifesto: {
			m1: blankItem(),
			m2: blankItem(),
			m3: blankItem(),
			m4: blankItem(),
		},
		principles: {
			p1: blankItem(), p2: blankItem(), p3: blankItem(), p4: blankItem(),
			p5: blankItem(), p6: blankItem(), p7: blankItem(), p8: blankItem(),
			p9: blankItem(), p10: blankItem(), p11: blankItem(), p12: blankItem(),
		},
	};
}

/** Number of wizard sections. */
export const TOTAL_STEPS = 6;

/**
 * Svelte 5 reactive store for the agile-consulting scorecard, with
 * localStorage persistence so an in-progress scorecard survives a page
 * reload. Drafts are keyed by scorecard id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AgileConsultingScorecardAssessment>(createDefaultAssessment());
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
	/** The live grade, recomputed from `data` by the shared scoring engine. */
	grade: GradeResult = $derived(gradeScorecard(this.data));

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
	 * Load the scorecard for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` scorecard is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference stay
	 * bound to live state.
	 */
	loadForId(id: string, seed?: AgileConsultingScorecardAssessment) {
		const key = id || 'new';
		this.id = key;
		this.currentStep = 1;

		let draft: AgileConsultingScorecardAssessment | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			this.hadDraftAtLoad = raw !== null;
			this.#loaded = true;
			if (raw) {
				try {
					draft = JSON.parse(raw) as AgileConsultingScorecardAssessment;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>,
		);
	}

	reset() {
		this.hadDraftAtLoad = false;
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>,
		);
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
 * them — reactive when a new scorecard is loaded.
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
