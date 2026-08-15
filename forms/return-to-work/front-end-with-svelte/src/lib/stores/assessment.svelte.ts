import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given record id (defaults to `new`). */
function storageKey(id: string): string {
	return `return-to-work.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank return-to-work record with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		clinician: {
			name: '',
			role: '',
			registrationNumber: '',
			site: '',
			signature: '',
			date: ''
		},
		patient: {
			nhsNumber: '',
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			phone: '',
			email: '',
			employerName: '',
			employerOhContact: ''
		},
		job: {
			jobTitle: '',
			roleDescription: '',
			contractedHours: null,
			shiftPattern: '',
			safetyCritical: '',
			dvlaNotifiableRole: '',
			industrySector: ''
		},
		absence: {
			firstDayOfAbsence: '',
			totalDaysAbsent: null,
			priorMed3Ref: '',
			previousSelfCertification: ''
		},
		diagnosis: {
			primaryDiagnosis: '',
			diagnosisCode: '',
			comorbidConditions: '',
			mechanism: '',
			workplaceCause: '',
			riddorReference: ''
		},
		treatment: {
			currentMedications: '',
			ongoingTherapy: '',
			lastConsultationDate: '',
			recoveryTrajectory: ''
		},
		functional: {
			mobility: '',
			manualHandling: '',
			cognition: '',
			mood: '',
			sleep: '',
			pain: null,
			drivingCapacity: '',
			standingTolerance: '',
			sittingTolerance: '',
			screenTolerance: '',
			adlIndependence: ''
		},
		fitness: {
			outcome: '',
			clinicianConfidence: '',
			validFrom: '',
			validTo: '',
			validWeeks: null,
			reassessmentRequired: ''
		},
		phasedReturn: {
			applicable: '',
			startHoursPerWeek: null,
			targetFullHoursDate: '',
			daysPerWeek: null,
			supportContact: ''
		},
		adjustments: {
			alteredHours: false,
			amendedDuties: false,
			workplaceAdaptations: false,
			noHeavyLifting: false,
			liftingKgLimit: null,
			noDriving: false,
			noOperatingMachinery: false,
			noWorkingAtHeight: false,
			noLoneWorking: false,
			noNightShifts: false,
			noPatientContact: false,
			sedentaryOnly: false,
			noExposure: '',
			screenBreakFrequency: '',
			workstationReviewRequired: '',
			additionalAdjustments: ''
		},
		followUp: {
			reviewClinic: '',
			reviewDate: '',
			ohReferralMade: '',
			dvlaNotificationRequired: '',
			employerOhNotified: ''
		},
		signOff: {
			clinicianOverride: '',
			overrideOutcome: '',
			overrideReason: '',
			finalNotes: '',
			signature: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the return-to-work record, with localStorage
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
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.patient`) stay bound to live state.
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
 * them — reactive when a new record is loaded.
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
