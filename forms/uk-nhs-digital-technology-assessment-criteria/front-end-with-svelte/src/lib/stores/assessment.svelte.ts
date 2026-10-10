import { browser } from '$app/env';
import type { DtacAssessment, GradingResult } from '#lib/engine/types.js';
import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { CRITERIA } from '#lib/engine/criteria.js';
import { STEPS } from '#lib/config/steps.js';

export interface ValidationErrors {
	[fieldId: string]: string;
}

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `uk-nhs-digital-technology-assessment-criteria.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Svelte 5 reactive store for the DTAC assessment, with localStorage
 * persistence so an in-progress assessment survives a page reload.
 */
class AssessmentStore {
	data: DtacAssessment = $state(createDefaultAssessment());
	currentStep = $state(1);

	/**
	 * True once loadForId() has found and restored a saved draft for the
	 * current id -- read by RestoreBanner.svelte.
	 */
	hadDraftAtLoad = $state(false);

	/**
	 * The id of the assessment currently loaded (`new` for a fresh draft).
	 * Starts as `''`, not `'new'`, so the wizard page's `store.id !== id`
	 * guard fires loadForId() on the very first `/new` visit.
	 */
	id = $state('');
	// True once loadForId() has run; guards the persistence effect so the blank
	// initial data never clobbers a saved draft.
	#loaded = false;

	errors: ValidationErrors = $state({});
	errorSummaryHidden = $state(true);
	submitted = $state(false);

	result = $derived<GradingResult>(calculateGrade(this.data));

	/** Share of criteria answered (including not-applicable). */
	percentComplete = $derived(
		Math.round(
			(CRITERIA.filter((c) => this.data.criteria[c.id] !== '').length / CRITERIA.length) * 100
		)
	);

	/** Per-step status for the Lily StepList. */
	steps = $derived(
		STEPS.map((s) => {
			const { filled, total } = countStep(this.data, s.number, s.section);
			let status: 'waiting' | 'in-progress' | 'finished' | 'error' = 'waiting';
			if (total > 0 && filled >= total) status = 'finished';
			else if (filled > 0) status = 'in-progress';
			if (Object.keys(this.errors).some((k) => k.startsWith(`step-${s.number}-`))) {
				status = 'error';
			}
			return { ...s, status, filled, total };
		})
	);

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
	 * Load the assessment for `id`. A saved draft wins; otherwise the `seed`
	 * is used, falling back to a blank draft. Merged in place so step
	 * components bound to nested objects stay reactive.
	 */
	loadForId(id: string, seed?: DtacAssessment) {
		const key = id || 'new';
		this.id = key;
		this.currentStep = 1;
		this.errors = {};
		this.errorSummaryHidden = true;
		this.submitted = false;

		let draft: DtacAssessment | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			this.hadDraftAtLoad = raw !== null;
			if (raw) {
				try {
					draft = JSON.parse(raw) as DtacAssessment;
				} catch {
					// Ignore corrupt storage.
					this.hadDraftAtLoad = false;
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>
		);
		this.#loaded = true;
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>
		);
		this.currentStep = 1;
		this.errors = {};
		this.errorSummaryHidden = true;
		this.submitted = false;
		this.hadDraftAtLoad = false;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}

	goto(n: number) {
		if (n >= 1 && n <= STEPS.length) this.currentStep = n;
	}

	/** Required-field checks; keyed by the HTML id of the offending control. */
	validate(): ValidationErrors {
		const e: ValidationErrors = {};
		if (!this.data.supplier.name) e['step-1-supplier-name'] = 'Enter the supplier name';
		if (!this.data.product.name) e['step-2-product-name'] = 'Enter the product name';
		if (!this.data.assessor.name) e['step-3-assessor-name'] = 'Enter the assessor name';
		if (!this.data.assessment.assessmentDate)
			e['step-3-assessment-date'] = 'Enter the assessment date';
		const fo = this.data.assessment.finalOutcome;
		if (fo && fo !== this.result.outcome && !this.data.assessment.assessorOverrideReason.trim()) {
			e['step-11-override-reason'] =
				'Document the reason for overriding the computed outcome';
		}
		return e;
	}
}

function countStep(
	d: DtacAssessment,
	n: number,
	section?: string
): { filled: number; total: number } {
	if (section) {
		const items = CRITERIA.filter((c) => c.section === section);
		return {
			filled: items.filter((c) => d.criteria[c.id] !== '').length,
			total: items.length
		};
	}
	const pick: Record<number, unknown> = { 1: d.supplier, 2: d.product, 3: d.assessor };
	const obj = pick[n];
	if (!obj) return { filled: 0, total: 1 };
	let filled = 0;
	for (const v of Object.values(obj as Record<string, unknown>)) {
		if (v !== null && v !== '') filled++;
	}
	return { filled, total: 1 };
}

/** Deep-merge `source` into `target`, preserving nested object identities. */
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

export const store = new AssessmentStore();
