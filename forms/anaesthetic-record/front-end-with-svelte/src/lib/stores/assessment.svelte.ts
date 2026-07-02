import { browser } from '$app/environment';
import type {
	AssessmentData,
	DrugAdministration,
	GradingResult,
	IntraOperativeEvent,
	TimedObservation
} from '$lib/engine/types';

/** localStorage draft key for a given record id (defaults to `new`). */
function storageKey(id: string): string {
	return `anaesthetic-record.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A fresh, fully-blank drug-administration child row. */
export function createDefaultDrug(): DrugAdministration {
	return {
		drugName: '',
		dose: null,
		doseUnit: '',
		route: '',
		category: '',
		administeredAt: ''
	};
}

/** A fresh, fully-blank timed-observation child row. */
export function createDefaultObservation(): TimedObservation {
	return {
		observedAt: '',
		systolicBloodPressure: null,
		diastolicBloodPressure: null,
		heartRate: null,
		spo2: null,
		endTidalCo2: null,
		temperature: null,
		agentPercent: null,
		freshGasFlowL: null
	};
}

/** A fresh, fully-blank intra-operative-event child row. */
export function createDefaultEvent(): IntraOperativeEvent {
	return {
		eventType: '',
		occurredAt: '',
		management: ''
	};
}

/**
 * A blank anaesthetic record with all fields at their unanswered defaults and
 * the three child lists initialised to empty arrays.
 */
export function createDefaultAssessment(): AssessmentData {
	return {
		identification: {
			patientIdentifier: '',
			patientName: '',
			dateOfBirth: '',
			sex: '',
			weightKg: null,
			heightCm: null,
			theatre: '',
			operationDate: '',
			anaesthetistName: '',
			assistantName: '',
			surgeonName: '',
			plannedProcedure: '',
			urgency: '',
			anaestheticTechnique: ''
		},
		preInduction: {
			machineChecked: '',
			whoSignIn: '',
			whoTimeOut: '',
			consentConfirmed: '',
			fastingConfirmed: '',
			ivAccess: '',
			allergyBandChecked: '',
			documentedAllergies: ''
		},
		asaAirway: {
			asaStatus: '',
			asaEmergencyModifier: '',
			mallampatiClass: null,
			mouthOpeningCm: null,
			thyromentalDistanceCm: null,
			dentition: '',
			anticipatedDifficultAirway: '',
			priorDifficultIntubation: ''
		},
		drugs: [],
		airway: {
			airwayTechnique: '',
			deviceSize: '',
			tubeDepthCm: null,
			cuffed: '',
			cormackLehaneGrade: null,
			intubationAttempts: null,
			capnographyConfirmed: ''
		},
		monitoring: {
			monitoringModalities: []
		},
		observations: [],
		fluids: {
			crystalloidMl: null,
			colloidMl: null,
			bloodProductsMl: null,
			estimatedBloodLossMl: null,
			urineOutputMl: null,
			cellSalvageMl: null
		},
		regional: {
			regionalTechnique: '',
			regionalLevel: '',
			regionalDrug: '',
			regionalDoseMg: null,
			blockHeight: '',
			regionalComplications: ''
		},
		events: [],
		handover: {
			recoveryDestination: '',
			handoverAirwayStatus: '',
			analgesiaPlan: '',
			antiemeticPlan: '',
			oxygenPlan: '',
			outstandingTasks: '',
			handoverAt: '',
			receivingPractitioner: ''
		},
		signoff: {
			anaesthetistSignature: '',
			signedAt: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the anaesthetic record, with localStorage
 * persistence so an in-progress record survives a page reload. Drafts are keyed
 * by record id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the record currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the record for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` record is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object and array identities preserved)
	 * rather than reassigned, so step components that captured a section or child
	 * list reference stay bound to live state.
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
 * Deep-merge `source` into `target`, recursing into plain objects and mutating
 * arrays in place (clear + repopulate) so nested object AND array identities are
 * preserved. This keeps Svelte's deep `$state` proxies — and any references
 * captured from them (including a child list bound by an `{#each}`) — reactive
 * when a new record is loaded, so its seeded child rows reach the editors.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
	for (const key of Object.keys(source)) {
		const sv = source[key];
		const tv = target[key];
		if (Array.isArray(sv)) {
			// Reuse the existing array instance when present; otherwise create one.
			const arr = Array.isArray(tv) ? (tv as unknown[]) : (target[key] = [] as unknown[]);
			arr.splice(0, arr.length, ...(sv as unknown[]));
		} else if (sv && typeof sv === 'object' && tv && typeof tv === 'object' && !Array.isArray(tv)) {
			deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
		} else {
			target[key] = sv;
		}
	}
}

export const assessment = new AssessmentStore();
