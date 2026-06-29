import { browser } from '$app/environment';
import type { AssessmentData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
	return `vaccinations-checklist.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank vaccinations checklist with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			weight: null,
			height: null,
			bmi: null,
			occupation: '',
			occupationCategory: '',
			employer: ''
		},
		vaccinationHistory: {
			hasVaccinationRecord: '',
			recordSource: '',
			recordSourceOther: '',
			previousAdverseReaction: '',
			adverseReactionDetails: '',
			adverseReactionVaccine: '',
			adverseReactionSeverity: '',
			immunocompromised: '',
			immunocompromisedDetails: '',
			pregnantOrPlanning: ''
		},
		childhoodImmunisations: {
			mmrDose1: '',
			mmrDose1Date: '',
			mmrDose2: '',
			mmrDose2Date: '',
			dtpPrimaryCourse: '',
			dtpPrimaryDate: '',
			dtpBooster: '',
			dtpBoosterDate: '',
			polioPrimaryCourse: '',
			polioPrimaryDate: '',
			polioBooster: '',
			polioBoosterDate: '',
			hibVaccine: '',
			hibVaccineDate: '',
			menCVaccine: '',
			menCVaccineDate: '',
			menACWYVaccine: '',
			menACWYVaccineDate: '',
			pcvVaccine: '',
			pcvVaccineDate: '',
			notes: ''
		},
		occupationalVaccines: {
			hepatitisBCourse: '',
			hepatitisBCourseDate: '',
			hepatitisBDosesReceived: null,
			hepatitisBAntiBodyLevel: '',
			bcgVaccine: '',
			bcgVaccineDate: '',
			bcgScarPresent: '',
			varicellaVaccine: '',
			varicellaVaccineDate: '',
			varicellaHistory: '',
			hepatitisAVaccine: '',
			hepatitisAVaccineDate: '',
			typhoidVaccine: '',
			typhoidVaccineDate: '',
			rabiesVaccine: '',
			rabiesVaccineDate: '',
			notes: ''
		},
		travelVaccines: {
			travelPlanned: '',
			travelDestination: '',
			travelDepartureDate: '',
			travelReturnDate: '',
			yellowFeverVaccine: '',
			yellowFeverVaccineDate: '',
			yellowFeverCertificate: '',
			japaneseEncephalitisVaccine: '',
			japaneseEncephalitisDate: '',
			tickBorneEncephalitisVaccine: '',
			tickBorneEncephalitisDate: '',
			choleraVaccine: '',
			choleraVaccineDate: '',
			meningococcalACWYTravel: '',
			meningococcalACWYTravelDate: '',
			malariaProphylaxis: '',
			malariaProphylaxisDrug: '',
			notes: ''
		},
		covid19Vaccination: {
			covidPrimaryCourse: '',
			covidPrimaryVaccineType: '',
			covidDose1Date: '',
			covidDose2Date: '',
			covidBooster1: '',
			covidBooster1Date: '',
			covidBooster1Type: '',
			covidBooster2: '',
			covidBooster2Date: '',
			covidBooster2Type: '',
			covidAutumnBooster: '',
			covidAutumnBoosterDate: '',
			totalCovidDoses: null,
			covidAdverseReaction: '',
			covidAdverseReactionDetails: '',
			notes: ''
		},
		influenzaVaccination: {
			fluVaccineCurrentSeason: '',
			fluVaccineCurrentDate: '',
			fluVaccineType: '',
			fluVaccinePreviousSeason: '',
			fluVaccineAnnualRecipient: '',
			fluHighRiskGroup: '',
			fluHighRiskReason: '',
			fluAdverseReaction: '',
			fluAdverseReactionDetails: '',
			notes: ''
		},
		contraindicationsAllergies: {
			eggAllergy: '',
			eggAllergySeverity: '',
			gelatinAllergy: '',
			neomycinAllergy: '',
			latexAllergy: '',
			yeastAllergy: '',
			pegPolysorbateAllergy: '',
			otherVaccineAllergies: '',
			historyOfGBS: '',
			gbsDetails: '',
			onImmunosuppressants: '',
			immunosuppressantDetails: '',
			onBloodProductsRecent: '',
			bloodProductsDetails: '',
			liveVaccineContraindicated: '',
			liveVaccineContraindicationReason: '',
			notes: ''
		},
		serologyImmunityTesting: {
			hepBSurfaceAntibody: '',
			hepBSurfaceAntibodyLevel: null,
			hepBSurfaceAntibodyDate: '',
			varicellaIgG: '',
			varicellaIgGDate: '',
			measlesIgG: '',
			measlesIgGDate: '',
			rubellaIgG: '',
			rubellaIgGDate: '',
			mumpsIgG: '',
			mumpsIgGDate: '',
			hepAIgG: '',
			hepAIgGDate: '',
			tetanusAntibody: '',
			tetanusAntibodyDate: '',
			tbIGRAResult: '',
			tbIGRADate: '',
			mantouxResult: '',
			mantouxIndurationMm: null,
			notes: ''
		},
		scheduleCompliance: {
			complianceStatus: '',
			vaccinesDue: '',
			vaccinesOverdue: '',
			catchUpPlanRequired: '',
			catchUpPlanDetails: '',
			nextVaccinationDate: '',
			nextVaccinationType: '',
			occupationalHealthClearance: '',
			occupationalHealthClearanceDate: '',
			exposureRiskLevel: '',
			activeExposureIncident: '',
			activeExposureDetails: '',
			consentForVaccination: '',
			consentDate: '',
			notes: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the vaccinations checklist, with localStorage
 * persistence so an in-progress checklist survives a page reload. Drafts are
 * keyed by checklist id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the checklist currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the checklist for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` checklist is used
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
 * them — reactive when a new checklist is loaded.
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
