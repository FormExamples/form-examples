import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given survey id (defaults to `new`). */
function storageKey(id: string): string {
	return `patient-satisfaction-survey.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank patient satisfaction survey with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			ageRange: '',
			ethnicity: '',
			preferredLanguage: '',
			interpreterRequired: ''
		},
		visitDetails: {
			visitDate: '',
			visitType: '',
			department: '',
			hospitalSite: '',
			lengthOfStayDays: null,
			referralSource: '',
			isFirstVisit: ''
		},
		accessWaitingTimes: {
			easeOfBooking: null,
			waitingTimeForAppointment: null,
			waitingTimeOnDay: null,
			receptionService: null,
			signageWayfinding: null,
			parkingTransport: null,
			actualWaitMinutes: null
		},
		communicationInformation: {
			explanationOfCondition: null,
			explanationOfTreatment: null,
			opportunityToAskQuestions: null,
			listenedTo: null,
			informedAboutMedication: null,
			writtenInformationQuality: null
		},
		clinicalCareQuality: {
			confidenceInClinician: null,
			thoroughnessOfExamination: null,
			painManagement: null,
			involvementInDecisions: null,
			privacyDuringExamination: null,
			coordinationOfCare: null
		},
		staffAttitude: {
			doctorCourtesy: null,
			nurseCourtesy: null,
			receptionCourtesy: null,
			respectForDignity: null,
			culturalSensitivity: null,
			emotionalSupport: null
		},
		environmentFacilities: {
			cleanliness: null,
			comfort: null,
			noiseLevels: null,
			foodQuality: null,
			toiletFacilities: null,
			temperatureComfort: null
		},
		dischargeFollowUp: {
			dischargeInformation: null,
			medicationExplanation: null,
			followUpArrangements: null,
			knewWhoToContact: null,
			recoveryInformation: null,
			carePlanClarity: null
		},
		overallExperience: {
			overallSatisfaction: null,
			wouldRecommend: null,
			metExpectations: null,
			feltSafe: null,
			wouldReturn: null,
			nhsRating: null
		},
		commentsSuggestions: {
			whatWentWell: '',
			whatCouldImprove: '',
			specificStaffPraise: '',
			complaintRaised: '',
			complaintDetails: '',
			additionalComments: '',
			consentToContact: '',
			contactEmail: '',
			contactPhone: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the patient satisfaction survey, with localStorage
 * persistence so an in-progress survey survives a page reload. Drafts are keyed
 * by survey id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the survey currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the survey for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` survey is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.demographics`) stay bound to live state.
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
 * them — reactive when a new survey is loaded.
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
