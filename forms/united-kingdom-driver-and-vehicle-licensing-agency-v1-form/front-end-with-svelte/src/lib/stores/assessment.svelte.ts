import { browser } from '$app/environment';
import type { AssessmentData, FlaggedIssue } from '$lib/engine/types';
import type { validateV1 } from '$lib/engine/v1-validator';

/** Result shape produced by the V1 completeness validator. */
export type V1ValidationResult = ReturnType<typeof validateV1>;

/** localStorage draft key for a given V1 form id (defaults to `new`). */
function storageKey(id: string): string {
	return `united-kingdom-driver-and-vehicle-licensing-agency-v1-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank DVLA V1 form with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			address: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				name: '',
				surgeryName: '',
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			},
			consultant: {
				name: '',
				speciality: '',
				department: '',
				hospitalName: '',
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		eyesightStandards: { meetsStandard: '' },
		visionInBothEyes: {
			hasVisionInBothEyes: '',
			whichEye: '',
			duration: '',
			adaptation: '',
			monocularDeclarationConfirmed: false
		},
		fieldOfVision: {
			hasProblem: '',
			causedSolelyByEyeCondition: '',
			cause: '',
			causeOtherDetails: ''
		},
		glaucoma: { hasCondition: '', whichEyes: '' },
		retinitisPigmentosa: { hasCondition: '', whichEyes: '' },
		laserTreatment: {
			hasHadTreatment: '',
			leftEyeFirstDate: '',
			rightEyeFirstDate: '',
			leftEyeLastDate: '',
			rightEyeLastDate: ''
		},
		blepharospasm: {
			hasCondition: '',
			whichEyes: '',
			hasHadTreatment: '',
			adequatelyControlled: ''
		},
		nightBlindness: { hasCondition: '', whichEyes: '' },
		doubleVision: {
			hasCondition: '',
			controlled: '',
			sameForSixMonthsOrMore: '',
			doubleVisionDeclarationConfirmed: false,
			declarationSignatureName: '',
			declarationDate: ''
		},
		otherVisionConditions: { hasOther: '', details: '' },
		recentContact: { hadContact: '', dateOfContact: '' },
		authorisation: {
			declarationConfirmed: false,
			name: '',
			signature: '',
			date: '',
			authoriseElectronicCorrespondence: '',
			contactPreferenceFromHealthcareProfessional: '',
			contactPreferenceFromDvla: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the DVLA V1 form, with localStorage persistence
 * so an in-progress form survives a page reload. Drafts are keyed by form id so
 * each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	validation = $state<V1ValidationResult | null>(null);
	flags = $state<FlaggedIssue[]>([]);
	currentStep = $state(1);
	/** The id of the form currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the form for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` form is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const p = assessment.data.personalDetails`) stay bound to live state.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.validation = null;
		this.flags = [];
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
		this.validation = null;
		this.flags = [];
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
 * them — reactive when a new form is loaded.
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
