import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given referral id (defaults to `new`). */
function storageKey(id: string): string {
	return `child-safeguarding-referral.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank referral with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		referrer: {
			referrerName: '',
			referrerRole: '',
			referrerOrganisation: '',
			referrerPhone: '',
			referrerEmail: '',
			referredAt: '',
			relationshipToChild: ''
		},
		child: {
			childName: '',
			childDateOfBirth: '',
			childAge: null,
			childSex: '',
			childAddress: '',
			childSetting: '',
			childReference: '',
			childEthnicity: '',
			childFirstLanguage: '',
			childDisability: ''
		},
		family: {
			carers: '',
			householdMembers: '',
			otherChildren: '',
			professionalsInvolved: ''
		},
		concern: {
			concernDescription: '',
			concernOnset: '',
			childDisclosed: '',
			referrerObservations: ''
		},
		category: {
			primaryCategory: '',
			additionalCategories: '',
			presentingEvidence: ''
		},
		risk: {
			immediateDanger: '',
			childWhereabouts: '',
			whoWithChild: '',
			allegedPersonInContact: '',
			otherChildrenAtRisk: ''
		},
		consent: {
			consentSought: '',
			consentStatus: '',
			sharingBasisWithoutConsent: '',
			familyAware: '',
			unsafeToInformReason: ''
		},
		informed: {
			agenciesContacted: '',
			strategyDiscussionHeld: '',
			previousSafeguardingHistory: ''
		},
		action: {
			requestedAction: '',
			referrerDeclaration: '',
			notes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the referral, with localStorage persistence so an
 * in-progress referral survives a page reload. Drafts are keyed by referral id
 * so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the referral currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the referral for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` referral is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const c = assessment.data.referrer`) stay bound to live state.
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
 * them — reactive when a new referral is loaded.
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
