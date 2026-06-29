import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given report id (defaults to `new`). */
function storageKey(id: string): string {
	return `post-operative-report.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank post-operative report with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientDetails: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			mrn: '',
			sex: '',
			weight: null,
			height: null,
			asaGrade: '',
			allergies: ''
		},
		procedureDetails: {
			procedureName: '',
			procedureCode: '',
			indication: '',
			priority: '',
			surgicalApproach: '',
			laterality: '',
			dateOfSurgery: '',
			startTime: '',
			endTime: '',
			durationMinutes: null,
			operatingRoom: ''
		},
		surgicalTeam: {
			primarySurgeon: '',
			primarySurgeonGrade: '',
			primaryAnaesthetist: '',
			primaryAnaesthetistGrade: '',
			additionalMembers: [],
			scrubNurse: '',
			circulator: ''
		},
		intraoperativeFindings: {
			findings: '',
			procedurePerformed: '',
			unexpectedFindings: '',
			conversionToOpen: '',
			conversionReason: ''
		},
		anaesthesiaSummary: {
			anaesthesiaType: '',
			airwayManagement: '',
			difficultIntubation: '',
			airwayNotes: '',
			medicationsAdministered: '',
			reversalAgents: '',
			anaesthesiaNotes: ''
		},
		bloodLossFluidBalance: {
			estimatedBloodLossMl: null,
			crystalloidsMl: null,
			colloidsMl: null,
			bloodProductsMl: null,
			bloodProductDetails: '',
			urineOutputMl: null,
			otherDrainsMl: null,
			fluidNotes: ''
		},
		specimensImplants: {
			specimens: [],
			implants: [],
			prosthesisUsed: '',
			drainsPlaced: '',
			cathetersPlaced: ''
		},
		immediatePostopStatus: {
			consciousLevel: '',
			systolicBp: null,
			diastolicBp: null,
			heartRate: null,
			respiratoryRate: null,
			oxygenSaturation: null,
			temperature: null,
			painScore: null,
			painNotes: '',
			disposition: ''
		},
		complicationsAssessment: {
			complicationsOccurred: '',
			complications: [],
			narrative: ''
		},
		postopPlanInstructions: {
			medicationsPrescribed: '',
			antibioticPlan: '',
			thromboprophylaxis: '',
			analgesiaPlan: '',
			dietPlan: '',
			mobilisationPlan: '',
			woundCareInstructions: '',
			followUpPlan: '',
			dischargeCriteria: '',
			alertsAndEscalation: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the post-operative report, with localStorage
 * persistence so an in-progress report survives a page reload. Drafts are keyed
 * by report id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the report currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the report for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` report is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.patientDetails`) stay bound to live state.
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
 * them — reactive when a new report is loaded.
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
