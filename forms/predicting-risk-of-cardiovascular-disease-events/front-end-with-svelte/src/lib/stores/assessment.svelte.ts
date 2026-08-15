import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `predicting-risk-of-cardiovascular-disease-events.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank PREVENT CVD risk assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		patientInformation: {
			fullName: '',
			dateOfBirth: '',
			nhsNumber: '',
			address: '',
			telephone: '',
			email: '',
			gpName: '',
			gpPractice: ''
		},
		demographics: {
			age: null,
			sex: '',
			ethnicity: '',
			heightCm: null,
			weightKg: null,
			zipCode: ''
		},
		bloodPressure: {
			systolicBp: null,
			diastolicBp: null,
			onAntihypertensive: '',
			numberOfBpMedications: null,
			bpAtTarget: ''
		},
		cholesterolLipids: {
			totalCholesterol: null,
			hdlCholesterol: null,
			ldlCholesterol: null,
			triglycerides: null,
			nonHdlCholesterol: null,
			onStatin: '',
			statinName: ''
		},
		metabolicHealth: {
			hasDiabetes: '',
			diabetesType: '',
			hba1cValue: null,
			hba1cUnit: '',
			fastingGlucose: null,
			bmi: null,
			waistCircumferenceCm: null
		},
		renalFunction: {
			egfr: null,
			creatinine: null,
			urineAcr: null,
			ckdStage: ''
		},
		smokingHistory: {
			smokingStatus: '',
			cigarettesPerDay: null,
			yearsSmoked: null,
			yearsSinceQuit: null
		},
		medicalHistory: {
			hasKnownCvd: '',
			previousMi: '',
			previousStroke: '',
			heartFailure: '',
			atrialFibrillation: '',
			peripheralArterialDisease: '',
			familyCvdHistory: '',
			familyCvdDetails: ''
		},
		currentMedications: {
			onAntihypertensiveDetail: '',
			onStatinDetail: '',
			onAspirin: '',
			onAnticoagulant: '',
			onDiabetesMedication: '',
			otherMedications: ''
		},
		reviewCalculate: {
			modelType: '',
			clinicianName: '',
			reviewDate: '',
			clinicalNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the PREVENT CVD risk assessment, with
 * localStorage persistence so an in-progress assessment survives a page
 * reload. Drafts are keyed by assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	errors = $state<Record<string, string>>({});
	errorSummaryHidden = $state(true);
	submitted = $state(false);
	/** The id of the assessment currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the assessment for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` assessment is used
	 * (e.g. a sample for an existing id), falling back to a blank draft.
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
		this.errors = {};
		this.errorSummaryHidden = true;
		this.submitted = false;

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

	goto(n: number) {
		if (n >= 1 && n <= 10) this.currentStep = n;
	}

	reset() {
		deepAssign(
			this.data as unknown as Record<string, unknown>,
			createDefaultAssessment() as unknown as Record<string, unknown>
		);
		this.result = null;
		this.currentStep = 1;
		this.errors = {};
		this.errorSummaryHidden = true;
		this.submitted = false;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new assessment is loaded.
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
