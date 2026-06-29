import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `diabetes-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank diabetes assessment with all fields at their unanswered defaults. */
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
		diabetesHistory: {
			diabetesType: '',
			ageAtDiagnosis: null,
			yearsDuration: null,
			diagnosisMethod: '',
			familyHistory: '',
			autoantibodiesTested: ''
		},
		glycaemicControl: {
			hba1cValue: null,
			hba1cUnit: '',
			hba1cTarget: null,
			fastingGlucose: null,
			postprandialGlucose: null,
			glucoseMonitoringType: '',
			hypoglycaemiaFrequency: '',
			severeHypoglycaemia: '',
			timeInRange: null
		},
		medications: {
			metformin: '',
			sulfonylurea: '',
			sglt2Inhibitor: '',
			glp1Agonist: '',
			dpp4Inhibitor: '',
			insulin: '',
			insulinRegimen: '',
			insulinDailyDose: null,
			medicationAdherence: null,
			otherMedications: ''
		},
		complicationsScreening: {
			retinopathyStatus: '',
			lastEyeScreening: '',
			nephropathyStatus: '',
			egfr: null,
			urineAcr: null,
			neuropathySymptoms: '',
			autonomicNeuropathy: '',
			erectileDysfunction: ''
		},
		cardiovascularRisk: {
			systolicBp: null,
			diastolicBp: null,
			onAntihypertensive: '',
			totalCholesterol: null,
			ldlCholesterol: null,
			onStatin: '',
			smokingStatus: '',
			previousCvdEvent: '',
			qriskScore: null
		},
		selfCareLifestyle: {
			dietAdherence: null,
			carbCounting: '',
			physicalActivity: '',
			bmi: null,
			weightChange: '',
			alcoholConsumption: '',
			smokingCessation: ''
		},
		psychologicalWellbeing: {
			diabetesDistress: null,
			depressionScreening: null,
			anxietyScreening: null,
			eatingDisorder: '',
			fearOfHypoglycaemia: null,
			copingAbility: null,
			needsSupport: ''
		},
		footAssessment: {
			footPulses: '',
			monofilamentTest: '',
			vibrationSense: '',
			footDeformity: '',
			callusPresent: '',
			ulcerPresent: '',
			previousAmputation: '',
			footRiskCategory: ''
		},
		reviewCarePlan: {
			clinicianName: '',
			reviewDate: '',
			hba1cTargetAgreed: null,
			carePlanUpdated: '',
			clinicalNotes: '',
			referrals: '',
			nextReviewDate: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the diabetes assessment, with localStorage
 * persistence keyed by assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the assessment currently loaded (`new` for a fresh draft). */
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
	 * Load the assessment for `id`. A saved draft wins; otherwise `seed` or a
	 * blank draft. Merged in place (nested identities preserved) so step
	 * components that captured a section reference stay bound.
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
					/* ignore corrupt storage */
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
		if (browser) localStorage.removeItem(storageKey(this.id));
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays replaced).
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
