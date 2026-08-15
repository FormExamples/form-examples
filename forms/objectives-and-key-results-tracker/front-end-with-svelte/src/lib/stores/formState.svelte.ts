import { browser } from '$app/env';
import type { ObjectiveAssessment, RawScores, KeyResult, GradeResult } from '$engine/types';

/** localStorage draft key for a given objective id (defaults to `new`). */
function storageKey(id: string): string {
	return `objectives-and-key-results-tracker.front-end-with-svelte.${id || 'new'}.v1`;
}

const blankScores: RawScores = {
	progressPercent: null,
	confidenceDecile: null,
	stretchTier: null,
	alignmentGrade: null,
	impactTier: null,
	smartQuality: null,
	paceDeviationPercent: null
};

/** A blank Key Result at the given 1-indexed position. */
export function blankKeyResult(position: number): KeyResult {
	return {
		position,
		title: '',
		krType: '',
		startValue: null,
		currentValue: null,
		targetValue: null,
		milestonesJson: null,
		binaryDone: null,
		progressFraction: null
	};
}

/** The complete OKR tracker questionnaire response. */
export interface FormData {
	reporter: { name: string; email: string; role: string };
	cycle: {
		level: 'individual' | 'team' | 'department' | 'company' | '';
		cycle: 'monthly' | 'quarterly' | 'half-yearly' | 'annual' | 'custom' | '';
		cycleStartDate: string;
		cycleEndDate: string;
	};
	objective: {
		obj_title: string;
		obj_long_description: string;
		strategic_theme: string;
		parent_objective_id: string;
	};
	participants: { dri: string; contributors: string; reviewers: string; stakeholders: string };
	alignment: { sa_parent_summary: string; sa_business_value_statement: string };
	keyResults: KeyResult[];
	initiatives: { in_initiatives: string; in_supporting_links: string };
	risks: {
		rk_known_risks: string;
		rk_dependencies: string;
		rk_blockers: string;
		rk_mitigation_plans: string;
	};
	checkIn: { narrative: string; since_last_changes: string; blockers: string; asks: string };
	forecast: { fc_expected_end_state: string; fc_residual_risk: string };
	scores: RawScores;
	signature: { signed_by: string; override_reason: string; recommendation: string };
}

/** A blank OKR tracker form with every field at its unanswered default. */
export function createDefaultFormState(): FormData {
	return {
		reporter: { name: '', email: '', role: '' },
		cycle: { level: '', cycle: '', cycleStartDate: '', cycleEndDate: '' },
		objective: {
			obj_title: '',
			obj_long_description: '',
			strategic_theme: '',
			parent_objective_id: ''
		},
		participants: { dri: '', contributors: '', reviewers: '', stakeholders: '' },
		alignment: { sa_parent_summary: '', sa_business_value_statement: '' },
		keyResults: [blankKeyResult(1)],
		initiatives: { in_initiatives: '', in_supporting_links: '' },
		risks: { rk_known_risks: '', rk_dependencies: '', rk_blockers: '', rk_mitigation_plans: '' },
		checkIn: { narrative: '', since_last_changes: '', blockers: '', asks: '' },
		forecast: { fc_expected_end_state: '', fc_residual_risk: '' },
		scores: { ...blankScores },
		signature: { signed_by: '', override_reason: '', recommendation: '' }
	};
}

/**
 * Svelte 5 reactive store for the OKR tracker, with localStorage persistence so
 * an in-progress objective survives a page reload. Drafts are keyed by objective
 * id so each record edits independently.
 */
class FormState {
	data = $state<FormData>(createDefaultFormState());
	result = $state<GradeResult | null>(null);
	currentStep = $state(1);
	/** The id of the objective currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the objective for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` objective is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather than
	 * reassigned, so step components that captured a section reference (e.g.
	 * `const d = formState.data.objective`) stay bound to live state.
	 */
	loadForId(id: string, seed?: FormData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: FormData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as FormData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			(draft ?? seed ?? createDefaultFormState()) as unknown as Record<string, unknown>
		);
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultFormState() as unknown as Record<string, unknown>
		);
		this.result = null;
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}

	addKr() {
		if (this.data.keyResults.length < 5) {
			this.data.keyResults.push(blankKeyResult(this.data.keyResults.length + 1));
		}
	}

	removeKr(i: number) {
		this.data.keyResults.splice(i, 1);
		this.data.keyResults.forEach((k, idx) => k.position = idx + 1);
	}

	buildAssessment(): ObjectiveAssessment {
		const d = this.data;
		return {
			scores: d.scores,
			keyResults: d.keyResults,
			context: {
				level: d.cycle.level,
				parentObjectiveId: d.objective.parent_objective_id || null,
				parentObjectiveStatus: null,
				driPresent: !!d.participants.dri,
				cycleStartDate: d.cycle.cycleStartDate || null,
				cycleEndDate: d.cycle.cycleEndDate || null,
				checkedInAt: d.checkIn.narrative ? new Date().toISOString() : null,
				previousConfidenceDecile: null
			},
			now: new Date().toISOString()
		};
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from them —
 * reactive when a new objective is loaded.
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

export const formState = new FormState();
