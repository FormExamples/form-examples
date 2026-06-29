import { browser } from '$app/environment';
import type { CasualtyCardData, GradingResult } from '$lib/engine/types';

/** localStorage draft key for a given casualty card id (defaults to `new`). */
function storageKey(id: string): string {
	return `casualty-card-form.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank casualty card with all fields at their unanswered defaults. */
export function createDefaultAssessment(): CasualtyCardData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsNumber: '',
			address: '',
			postcode: '',
			phone: '',
			email: '',
			ethnicity: '',
			preferredLanguage: '',
			interpreterRequired: ''
		},
		nextOfKinGP: {
			nextOfKin: {
				name: '',
				relationship: '',
				phone: '',
				notified: ''
			},
			gp: {
				name: '',
				practiceName: '',
				practiceAddress: '',
				practicePhone: ''
			}
		},
		arrivalTriage: {
			attendanceDate: '',
			arrivalTime: '',
			attendanceCategory: '',
			arrivalMode: '',
			referralSource: '',
			ambulanceIncidentNumber: '',
			triageTime: '',
			triageNurse: '',
			mtsFlowchart: '',
			mtsCategory: '',
			mtsDiscriminator: ''
		},
		presentingComplaint: {
			chiefComplaint: '',
			historyOfPresentingComplaint: '',
			onset: '',
			duration: '',
			character: '',
			severity: '',
			location: '',
			radiation: '',
			aggravatingFactors: '',
			relievingFactors: '',
			associatedSymptoms: '',
			previousEpisodes: '',
			treatmentPriorToArrival: ''
		},
		painAssessment: {
			painPresent: '',
			painScore: null,
			painLocation: '',
			painCharacter: '',
			painOnset: '',
			painSeverityCategory: ''
		},
		medicalHistory: {
			pastMedicalHistory: '',
			pastSurgicalHistory: '',
			medications: [],
			allergies: [],
			tetanusStatus: '',
			smokingStatus: '',
			alcoholConsumption: '',
			recreationalDrugUse: '',
			lastOralIntake: ''
		},
		vitalSigns: {
			heartRate: null,
			systolicBP: null,
			diastolicBP: null,
			respiratoryRate: null,
			oxygenSaturation: null,
			supplementalOxygen: '',
			oxygenFlowRate: null,
			temperature: null,
			bloodGlucose: null,
			consciousnessLevel: '',
			pupilLeftSize: null,
			pupilLeftReactive: '',
			pupilRightSize: null,
			pupilRightReactive: '',
			capillaryRefillTime: null,
			weight: null
		},
		primarySurvey: {
			airway: {
				status: '',
				adjuncts: '',
				cSpineImmobilised: ''
			},
			breathing: {
				effort: '',
				chestMovement: '',
				breathSounds: '',
				tracheaPosition: ''
			},
			circulation: {
				pulseCharacter: '',
				skinColour: '',
				skinTemperature: '',
				capillaryRefill: '',
				haemorrhage: '',
				ivAccess: ''
			},
			disability: {
				gcsEye: null,
				gcsVerbal: null,
				gcsMotor: null,
				gcsTotal: null,
				pupils: '',
				bloodGlucose: '',
				limbMovements: ''
			},
			exposure: {
				skinExamination: '',
				injuriesIdentified: '',
				logRollFindings: ''
			}
		},
		clinicalExamination: {
			generalAppearance: '',
			headAndFace: '',
			neck: '',
			chestCardiovascular: '',
			chestRespiratory: '',
			abdomen: '',
			pelvis: '',
			musculoskeletalLimbs: '',
			neurological: '',
			skin: '',
			mentalState: '',
			bodyDiagramNotes: ''
		},
		investigations: {
			bloodTests: [],
			urinalysis: '',
			pregnancyTest: '',
			imaging: [],
			ecgPerformed: '',
			ecgFindings: '',
			otherInvestigations: ''
		},
		treatment: {
			medicationsAdministered: [],
			fluidTherapy: [],
			procedures: [],
			oxygenTherapyDevice: '',
			oxygenTherapyFlowRate: '',
			tetanusProphylaxis: ''
		},
		assessmentPlan: {
			workingDiagnosis: '',
			differentialDiagnoses: '',
			clinicalImpression: '',
			riskStratification: ''
		},
		disposition: {
			disposition: '',
			admittingSpecialty: '',
			admittingConsultant: '',
			ward: '',
			levelOfCare: '',
			dischargeDiagnosis: '',
			dischargeMedications: '',
			dischargeInstructions: '',
			followUp: '',
			returnPrecautions: '',
			receivingHospital: '',
			reasonForTransfer: '',
			modeOfTransfer: '',
			dischargeTime: '',
			totalTimeInDepartment: ''
		},
		safeguardingConsent: {
			safeguardingConcern: '',
			safeguardingType: '',
			referralMade: '',
			mentalCapacityAssessment: '',
			mentalHealthActStatus: '',
			consentForTreatment: '',
			completedByName: '',
			completedByRole: '',
			completedByGmcNumber: '',
			seniorReviewingClinician: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the casualty card, with localStorage persistence
 * so an in-progress card survives a page reload. Drafts are keyed by card id so
 * each record edits independently.
 */
class AssessmentStore {
	data = $state<CasualtyCardData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	/** The id of the card currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the casualty card for `id` into the store. A saved draft for that id
	 * (in localStorage) takes precedence; otherwise the `seed` card is used (e.g.
	 * a sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.demographics`) stay bound to live state.
	 */
	loadForId(id: string, seed?: CasualtyCardData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
		this.currentStep = 1;

		let draft: CasualtyCardData | null = null;
		if (browser) {
			const raw = localStorage.getItem(storageKey(key));
			if (raw) {
				try {
					draft = JSON.parse(raw) as CasualtyCardData;
				} catch {
					// Ignore corrupt storage.
				}
			}
		}
		deepAssign(this.data as unknown as Record<string, unknown>, (draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>);
	}

	reset() {
		deepAssign(this.data as unknown as Record<string, unknown>, createDefaultAssessment() as unknown as Record<string, unknown>);
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
 * them — reactive when a new card is loaded.
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
