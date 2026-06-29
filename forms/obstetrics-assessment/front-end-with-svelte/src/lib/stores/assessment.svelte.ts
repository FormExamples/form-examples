import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given assessment id (defaults to `new`). */
function storageKey(id: string): string {
	return `obstetrics-assessment.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank antenatal assessment with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		maternalDemographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			ageAtBooking: null,
			ethnicity: '',
			weight: null,
			height: null,
			bmi: null,
			occupation: '',
			partnerStatus: ''
		},
		obstetricHistory: {
			gravidity: null,
			parity: null,
			previousMiscarriages: null,
			previousTerminations: null,
			previousStillbirths: null,
			previousNeonatalDeaths: null,
			previousPretermBirth: '',
			previousPreEclampsia: '',
			previousGestationalDiabetes: '',
			previousCaesarean: '',
			previousCaesareanCount: null,
			previousShoulderDystocia: '',
			previousPostpartumHaemorrhage: '',
			previousLargeBaby: '',
			previousSmallBaby: '',
			previousCongenitalAnomaly: '',
			obstetricNotes: ''
		},
		medicalHistory: {
			chronicHypertension: '',
			cardiacDisease: '',
			preExistingDiabetes: '',
			thyroidDisease: '',
			renalDisease: '',
			epilepsy: '',
			asthma: '',
			autoimmuneDisease: '',
			hivPositive: '',
			hepatitis: '',
			previousVte: '',
			thrombophilia: '',
			mentalHealthHistory: '',
			bariatricSurgery: '',
			otherMedicalConditions: '',
			currentMedications: ''
		},
		currentPregnancy: {
			lastMenstrualPeriod: '',
			estimatedDueDate: '',
			datingScanDate: '',
			gestationWeeks: null,
			gestationDays: null,
			multiplePregnancy: '',
			chorionicity: '',
			ivfConception: '',
			folicAcidPreconception: '',
			firstAntenatalContact: '',
			bookingDate: ''
		},
		lifestyleSocialFactors: {
			smokingStatus: '',
			cigarettesPerDay: null,
			alcoholUse: '',
			substanceUse: '',
			domesticAbuse: '',
			safeguardingConcerns: '',
			housingInsecurity: '',
			financialDifficulty: '',
			requiresInterpreter: '',
			interpreterLanguage: '',
			asylumOrRefugee: '',
			femaleGenitalMutilation: '',
			socialNotes: ''
		},
		screeningResults: {
			combinedTestResult: '',
			combinedTestRisk: '',
			anomalyScanCompleted: '',
			anomalyScanFindings: '',
			gttResult: '',
			gttFasting: null,
			gttTwoHour: null,
			bloodGroup: '',
			rhesusStatus: '',
			antibodyScreenPositive: '',
			infectionScreenAbnormal: '',
			infectionScreenDetails: '',
			haemoglobin: '',
			screeningNotes: ''
		},
		mentalHealthAssessment: {
			whooley1: '',
			whooley2: '',
			gad2Q1: '',
			gad2Q2: '',
			previousPostnatalDepression: '',
			previousSevereMentalIllness: '',
			currentlyOnPsychotropicMeds: '',
			selfHarmIdeation: '',
			mentalHealthNotes: ''
		},
		fetalAssessment: {
			fundalHeight: null,
			fetalLie: '',
			fetalPresentation: '',
			engaged: '',
			fetalMovementsReported: '',
			fetalHeartRate: null,
			reducedFetalMovements: '',
			growthConcern: '',
			growthConcernDetails: '',
			fetalNotes: ''
		},
		birthPreferences: {
			preferredBirthSetting: '',
			preferredAnalgesia: '',
			birthPartnerPlanned: '',
			birthPlanCompleted: '',
			feedingChoiceBreast: '',
			feedingChoiceFormula: '',
			vbacRequested: '',
			birthPreferenceNotes: ''
		},
		carePlanFollowup: {
			recommendedCarePathway: '',
			consultantReferralRequired: '',
			mentalHealthReferralRequired: '',
			safeguardingReferralRequired: '',
			aspirinProphylaxisIndicated: '',
			vteProphylaxisIndicated: '',
			nextAppointmentDate: '',
			carePlanNotes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the obstetrics assessment, with localStorage
 * persistence so an in-progress assessment survives a page reload. Drafts are
 * keyed by assessment id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
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
	 * (e.g. `const d = assessment.data.maternalDemographics`) stay bound to live
	 * state.
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
