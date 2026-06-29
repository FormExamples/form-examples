import { browser } from '$app/environment';
import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';

/** localStorage draft key for a given referral id (defaults to `new`). */
function storageKey(id: string): string {
	return `who-acute-referral-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank WHO acute referral form with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientLastName: '',
			patientFirstName: '',
			dateOfBirth: '',
			sex: '',
			patientContactInformation: '',
			emergencyContact: { name: '', contactInformation: '' }
		},
		facilityAndTransport: {
			initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
			reasonForReferral: '',
			referralFacilityContacted: false,
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			ambulance: { name: '', focalPoint: '', phoneNumber: '' },
			transferDecisionDateTime: '',
			departureDateTime: '',
			modeOfTransfer: ''
		},
		situation: {
			chiefComplaint: '',
			primaryDiagnosis: '',
			pregnant: '',
			otherAcuteDiagnoses: '',
			treatmentsInitiated: ''
		},
		background: {
			historyOfPresentIllness: '',
			pastMedicalAndSurgicalHistory: '',
			airway: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			breathing: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			circulation: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			disability: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			exposure: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			otherSignificantTreatments: ''
		},
		assessment: {
			clinicalAssessment: '',
			vitalSigns: {
				heartRate: null,
				respiratoryRate: null,
				systolicBloodPressure: null,
				diastolicBloodPressure: null,
				temperatureCelsius: null,
				oxygenSaturation: null,
				glasgowComaScale: null
			}
		},
		recommendations: {
			treatmentPlanDuringTransport: '',
			potentialWorseningOfCondition: '',
			cautionsRegardingPriorTherapies: '',
			precautions: {
				highlyInfectiousDisease: false,
				spinalPrecautions: false,
				weightBearingRestrictions: false,
				fallRisk: false,
				aspirationRisk: false,
				other: false,
				otherDetails: ''
			}
		},
		initiatingProviderSignoff: {
			providerName: '',
			signature: '',
			signatureDate: ''
		},
		referralFacilityReceipt: {
			patientArrivalDateTime: '',
			receivingProviderName: '',
			receivingProviderSignature: '',
			feedbackProvidedToInitiatingFacility: false
		}
	};
}

/**
 * Svelte 5 reactive store for the WHO acute referral form, with localStorage
 * persistence so an in-progress referral survives a page reload. Drafts are
 * keyed by referral id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	validation = $state<ValidationResult | null>(null);
	flags = $state<FlaggedIssue[]>([]);
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
	 * (e.g. `const p = assessment.data.patientIdentification`) stay bound to
	 * live state.
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
