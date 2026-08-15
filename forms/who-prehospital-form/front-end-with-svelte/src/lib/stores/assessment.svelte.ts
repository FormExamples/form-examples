import { browser } from '$app/env';
import type {
	AssessmentData,
	FlaggedIssue,
	PeEntry,
	PrehospitalResult,
	Reassessment,
	ValidationResult
} from '#lib/engine/types.js';

/** localStorage draft key for a given encounter id (defaults to `new`). */
function storageKey(id: string): string {
	return `who-prehospital-form.front-end-with-svelte.${id || 'new'}.v1`;
}

function emptyPe(): PeEntry {
	return { normal: false, notes: '' };
}

export function emptyReassessment(): Reassessment {
	return {
		time: '',
		hr: null,
		rr: null,
		tempC: null,
		spo2: null,
		spo2OnOxygen: '',
		rbs: null,
		pain: null,
		unchanged: false
	};
}

export function createDefaultAssessment(): AssessmentData {
	return {
		callerAndScene: {
			massCasualty: false,
			callerName: '',
			callerPhone: '',
			patientName: '',
			dateOfBirthOrAge: '',
			sex: '',
			patientAddress: '',
			occupation: '',
			date: '',
			sceneCallType: '',
			runNumber: '',
			sceneLocationType: '',
			sceneLocationOther: '',
			timeCallReceived: '',
			timeEnRouteToScene: '',
			timeArrivedAtScene: '',
			timeTransporting: '',
			timeAtFacility: '',
			timeInService: ''
		},
		chiefComplaintAndVitals: {
			chiefComplaint: '',
			injury: false,
			initialVitals: {
				time: '',
				hr: null,
				rr: null,
				bp: '',
				tempC: null,
				rbs: null,
				spo2: null,
				spo2OnOxygen: ''
			},
			careInProgressOnArrival: '',
			pregnant: '',
			painScore: null
		},
		highRiskSigns: {
			stridor: false,
			cyanosis: false,
			respiratoryDistress: false,
			poorPerfusion: false,
			weakFastPulse: false,
			capillaryRefillOver3s: false,
			heavyBleeding: false,
			childLethargy: false,
			childSunkenEyes: false,
			childSlowSkinPinch: false,
			childPoorDrinking: false,
			adultHrUnder50OrOver150: false,
			unresponsive: false,
			acuteConvulsions: false,
			hypoglycaemia: false,
			acuteFocalNeurologicDeficit: false,
			alteredMentalStatusWithFeverHypothermiaStiffNeckHeadache: false,
			highRiskTrauma: false,
			threatenedLimb: false,
			snakeBite: false,
			poisoningIngestionChemicalExposure: false,
			violentOrAggressive: false,
			tempOver39OrUnder36: false,
			acuteTesticularPainOrPriapism: false,
			pregnantWithHighRiskFindings: false,
			adultSevereChestOrAbdominalPainOrEcgIschaemia: false,
			infantUnder8Days: false,
			infantUnder2MonthsWithTempOver39OrUnder36: false
		},
		triage: {
			category: '',
			triagedFor: ''
		},
		airway: {
			normal: false,
			voiceChanges: false,
			stridor: false,
			oralAirwayBurns: false,
			angioedema: false,
			obstructedByTongue: false,
			obstructedByBlood: false,
			obstructedBySecretions: false,
			obstructedByVomit: false,
			obstructedByForeignBody: false,
			interventionRepositioning: false,
			interventionSuction: false,
			interventionOpa: false,
			interventionNpa: false,
			interventionLma: false,
			interventionBvm: false,
			interventionEtt: false,
			cSpineNotNeeded: false,
			cSpineDone: false,
			notes: ''
		},
		breathing: {
			normal: false,
			spontaneousRespiration: '',
			chestRiseShallow: false,
			chestRiseRetractions: false,
			chestRiseParadoxical: false,
			tracheaMidline: false,
			tracheaDeviatedLeft: false,
			tracheaDeviatedRight: false,
			breathSoundsNormal: false,
			breathSoundsNotes: '',
			oxygenLitres: null,
			oxygenNasalCannula: false,
			oxygenFaceMask: false,
			oxygenNonRebreather: false,
			oxygenBvm: false,
			oxygenBipapCpap: false,
			oxygenOther: '',
			notes: ''
		},
		circulation: {
			normal: false,
			skinWarm: false,
			skinDry: false,
			skinPale: false,
			skinCyanotic: false,
			skinMoist: false,
			skinCool: false,
			capillaryRefillUnder3: false,
			capillaryRefill3OrMore: false,
			pulsesWeak: false,
			pulsesAsymmetric: false,
			jvd: '',
			activeBleedingSite: '',
			bleedingControlledBandage: false,
			bleedingControlledTourniquet: false,
			bleedingControlledDirectPressure: false,
			bleedingControlTime: '',
			accessIvSite: '',
			accessIvSize: '',
			accessIoSite: '',
			accessIoSize: '',
			ivfMls: null,
			ivfNs: false,
			ivfLr: false,
			ivfOther: '',
			pelvisStabilized: false,
			femurFractureStabilized: false,
			notes: ''
		},
		disability: {
			normal: false,
			bloodGlucose: null,
			avpu: '',
			gcsEye: null,
			gcsVerbal: null,
			gcsMotor: null,
			movesLeftArm: false,
			movesRightArm: false,
			movesLeftLeg: false,
			movesRightLeg: false,
			pupilSizeLeft: null,
			pupilSizeRight: null,
			pupilReactivityLeft: '',
			pupilReactivityRight: '',
			interventionGlucoseChecked: false,
			interventionGlucoseGiven: false,
			interventionNaloxoneGiven: false,
			notes: ''
		},
		exposure: {
			normal: false,
			exposedCompletely: false,
			notes: ''
		},
		sampleHistory: {
			signsSymptoms: '',
			signsSymptomsUnknown: false,
			allergies: '',
			allergiesUnknown: false,
			medications: '',
			medicationsUnknown: false,
			pastMedical: '',
			pastMedicalUnknown: false,
			pastSurgeries: '',
			pastSurgeriesUnknown: false,
			lastAteHours: null,
			lastAteUnknown: false,
			events: '',
			eventsUnknown: false
		},
		injuryDetails: {
			intent: '',
			mechanismFall: false,
			mechanismHitByFallingObject: false,
			mechanismStabCut: false,
			mechanismGunshot: false,
			mechanismSexualAssault: false,
			mechanismOtherBluntForce: false,
			mechanismSuffocationChokingHanging: false,
			mechanismDrowning: false,
			mechanismDrowningLifeVest: '',
			mechanismBurnCausedBy: '',
			mechanismPoisoningToxicExposure: false,
			mechanismUnknown: false,
			mechanismOther: '',
			roadTrafficDriver: false,
			roadTrafficPassenger: false,
			roadTrafficPedestrian: false,
			roadTrafficEjected: false,
			roadTrafficExtricated: false,
			vehicleType: '',
			vehicleOther: '',
			safetyAirbag: false,
			safetySeatbelt: false,
			safetyHelmet: false,
			safetyOtherRestraint: ''
		},
		physicalExam: {
			general: emptyPe(),
			heent: emptyPe(),
			respiratory: emptyPe(),
			cardiac: emptyPe(),
			abdominal: emptyPe(),
			pelvisGu: emptyPe(),
			neurologic: emptyPe(),
			psychiatric: emptyPe(),
			musculoskeletal: emptyPe(),
			skin: emptyPe()
		},
		additionalInterventions: {
			medsBronchodilators: false,
			medsEpinephrine: false,
			medsAspirin: false,
			medsSeizureMedication: false,
			medsAnalgesia: false,
			medsIvFluidInfusion: false,
			medsOther: '',
			procWoundBandaging: false,
			procBurnDressing: false,
			procSplintingReduction: false,
			procPelvicStabilization: false,
			procEcg: false,
			procOther: ''
		},
		assessmentAndPlan: {
			summary: '',
			differential: '',
			presumptiveDiagnoses: ''
		},
		reassessments: [],
		disposition: {
			disposition: '',
			handoverTime: '',
			handoverToName: '',
			handoverToCadre: '',
			handoverToSignature: '',
			finalVitals: {
				time: '',
				hr: null,
				rr: null,
				tempC: null,
				bp: '',
				spo2: null,
				spo2OnOxygen: ''
			},
			planDiscussedWithPatient: '',
			providerName: '',
			providerSignature: '',
			providerSignatureDate: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the WHO Prehospital Form encounter, with
 * localStorage persistence so an in-progress run sheet survives a page reload.
 * Drafts are keyed by encounter id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<PrehospitalResult | null>(null);
	validation = $state<ValidationResult | null>(null);
	flags = $state<FlaggedIssue[]>([]);
	currentStep = $state(1);
	/** The id of the encounter currently loaded into the store (`new` for a fresh draft). */
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
	 * Load the encounter for `id` into the store. A saved draft for that id (in
	 * localStorage) takes precedence; otherwise the `seed` record is used (e.g. a
	 * sample for an existing id), falling back to a blank draft.
	 *
	 * The data is merged in place (nested object identities preserved) rather
	 * than reassigned, so step components that captured a section reference
	 * (e.g. `const d = assessment.data.airway`) stay bound to live state.
	 */
	loadForId(id: string, seed?: AssessmentData) {
		const key = id || 'new';
		this.id = key;
		this.result = null;
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
		this.result = null;
		this.validation = null;
		this.flags = [];
		this.currentStep = 1;
		if (browser) {
			localStorage.removeItem(storageKey(this.id));
		}
	}

	addReassessment() {
		if (this.data.reassessments.length < 3) {
			this.data.reassessments.push(emptyReassessment());
		}
	}

	removeReassessment(index: number) {
		if (index >= 0 && index < this.data.reassessments.length) {
			this.data.reassessments.splice(index, 1);
		}
	}
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new encounter is loaded.
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
