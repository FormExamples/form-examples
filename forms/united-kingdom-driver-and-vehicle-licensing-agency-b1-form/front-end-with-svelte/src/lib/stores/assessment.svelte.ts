import { browser } from '$app/environment';
import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';

/** localStorage draft key for a given B1 form id (defaults to `new`). */
function storageKey(id: string): string {
	return `united-kingdom-driver-and-vehicle-licensing-agency-b1-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank DVLA B1 form with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			addressLine1: '',
			addressLine2: '',
			addressLine3: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				gpName: '',
				surgeryName: '',
				addressLine1: '',
				addressLine2: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			},
			consultant: {
				consultantName: '',
				speciality: '',
				department: '',
				hospitalName: '',
				addressLine1: '',
				addressLine2: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		conditionHistory: {
			brainHaemorrhage: false,
			brainHaemorrhageDate: '',
			brainHaemorrhageDetails: '',
			severeHeadInjury: false,
			severeHeadInjuryDate: '',
			severeHeadInjuryDetails: '',
			otherCondition: false,
			otherConditionDate: '',
			otherConditionDetails: '',
			brainSurgeryDate: '',
			brainSurgeryNotApplicable: false
		},
		treatmentProvider: {
			lastSeen: '',
			gpLastContactDate: '',
			gpNextContactDate: '',
			consultantLastContactDate: '',
			consultantNextContactDate: ''
		},
		blackouts: {
			hadBlackouts: '',
			blackoutDate: ''
		},
		seizures: {
			hadSeizures: '',
			diagnosis: '',
			firstEver: { date: '', details: '' },
			multiple: {
				twoOrMoreWithinFiveYears: '',
				firstAwakeSeizureDate: '',
				firstAsleepSeizureDate: '',
				lastTwoAwakeSeizureDate1: '',
				lastTwoAwakeSeizureDate2: '',
				lastTwoAsleepSeizureDate1: '',
				lastTwoAsleepSeizureDate2: '',
				firstSleepAttackAfterLastAwakeAttackDate: '',
				affectedConsciousness: '',
				wouldHaveAffectedDriving: '',
				attackDescription: '',
				resultOfMedicationAdvice: '',
				dateMedicationStartedToReduce: '',
				previousMedicationRestarted: '',
				datePreviousMedicationRestarted: '',
				dateOfLastSeizurePriorToWithdrawal: '',
				provokedSeizureDetails: ''
			},
			epilepsyDeclaration: {
				declarationAccepted: false,
				signedName: '',
				signatureDate: ''
			}
		},
		medication: {
			noMedicationTaken: false,
			entries: [
				{ name: '', startDate: '', endDate: '' },
				{ name: '', startDate: '', endDate: '' },
				{ name: '', startDate: '', endDate: '' },
				{ name: '', startDate: '', endDate: '' }
			],
			makesDrowsyOrConfused: ''
		},
		vpShunt: {
			hadVpShuntOrDrain: '',
			procedureDate: ''
		},
		dailyLiving: {
			needsHelp: '',
			helpDetails: ''
		},
		doubleVision: {
			hasDoubleVision: '',
			suppressedOrControlled: '',
			correctionMethod: '',
			correctionMethodOther: ''
		},
		eyesight: {
			hasEyesightProblems: '',
			details: ''
		},
		vehicleAdaptations: {
			needsAdaptations: '',
			previouslyDeclared: '',
			additionalControlsFitted: ''
		},
		authorisation: {
			declarationAccepted: false,
			name: '',
			signatureDate: '',
			electronicCorrespondenceConsent: '',
			dvlaContactPreference: '',
			healthcareContactPreference: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the DVLA B1 form, with localStorage persistence
 * so an in-progress form survives a page reload. Drafts are keyed by form id so
 * each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	validation = $state<ValidationResult | null>(null);
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
	 * (e.g. `const d = assessment.data.personalDetails`) stay bound to live state.
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
