import { browser } from '$app/environment';
import type { AssessmentData, EuTraumaResult, PeEntry } from '$lib/engine/types';

function emptyPe(): PeEntry {
	return { normal: false, notes: '' };
}

/** localStorage draft key for a given encounter id (defaults to `new`). */
function storageKey(id: string): string {
	return `who-emergency-unit-trauma-form.front-end-with-svelte.${id || 'new'}.v1`;
}

export function createDefaultAssessment(): AssessmentData {
	return {
		patientRegistration: {
			hospitalRegistrationNumber: '',
			surname: '',
			firstName: '',
			dateOfBirth: '',
			age: null,
			ageCategory: '',
			sex: '',
			racialAndEthnicIdentity: '',
			racialAndEthnicIdentityUnknown: false,
			interpreterRequired: '',
			occupation: '',
			contactPerson: '',
			contactPhone: '',
			contactRelation: '',
			dateOfArrival: '',
			timeOfArrival: '',
			arrivalMode: '',
			patientResidence: '',
			patientResidenceUnknown: false,
			injuryLocation: '',
			injuryLocationUnknown: false,
			priorFacilitiesCount: null,
			referredFrom: '',
			safeAtHome: '',
			weightKg: null,
			vaccinationsStatus: '',
			vaccinationsDate: '',
			pregnant: '',
			pregnancyReported: false,
			pregnancyTestingDone: false,
			lastMenstrualCycle: '',
			gravida: null,
			para: null,
			lmpUnknown: false,
			tobaccoUse: false,
			alcoholUse: false,
			drugUse: false,
			ivDrugUse: false,
			substanceUseUnknown: false
		},
		chiefComplaintAndVitals: {
			chiefComplaint: '',
			allergies: '',
			allergiesUnknown: false,
			initialVitals: {
				time: '',
				tempC: null,
				bpSystolic: null,
				bpDiastolic: null,
				pulse: null,
				respiratoryRate: null,
				spo2: null,
				spo2OnOxygen: '',
				painScore: null
			},
			deadOnArrival: false,
			timeOfDeath: ''
		},
		highRiskSigns: {
			redStridor: false,
			redCyanosis: false,
			redRespiratoryDistress: false,
			redPoorPerfusion: false,
			redWeakFastPulse: false,
			redCapRefillOver3: false,
			redHeavyBleeding: false,
			redAdultHrAbnormal: false,
			redChildLethargy: false,
			redChildSunkenEyes: false,
			redChildSlowSkinPinch: false,
			redChildPoorDrinking: false,
			redUnresponsive: false,
			redAcuteConvulsions: false,
			redHypoglycaemia: false,
			redAcuteFocalNeuroDeficit: false,
			redAlteredMentalStatusWithFeverEtc: false,
			redThreatenedLimb: false,
			redSnakeBite: false,
			redPoisoningChemicalExposure: false,
			redViolentOrAggressive: false,
			redAcuteTesticularPainOrPriapism: false,
			redAdultSevereChestOrAbdoPain: false,
			redPregnantWithHighRiskFindings: false,
			redInfantUnder8Days: false,
			redInfantUnder2MonthsAbnormalTemp: false,
			traumaFallTwiceHeight: false,
			traumaAllPenetrating: false,
			traumaPenetratingDistalUncontrolledBleeding: false,
			traumaCrushInjury: false,
			traumaPolytrauma: false,
			traumaBleedingDisorderOrAnticoag: false,
			traumaPregnant: false,
			rtHighSpeedCrash: false,
			rtPedestrianOrCyclistHit: false,
			rtOtherInVehicleDied: false,
			rtNoSeatbelt: false,
			rtTrappedOrThrown: false,
			rtDeadOnArrival: false
		},
		triage: {
			category: '',
			triagedFor: '',
			providerAssessmentDate: '',
			providerAssessmentTime: ''
		},
		airway: {
			normal: false,
			swelling: false,
			stridor: false,
			voiceChanges: false,
			burns: false,
			obstructedByTongue: false,
			obstructedByBlood: false,
			obstructedBySecretion: false,
			obstructedByVomit: false,
			obstructedByForeignBody: false,
			interventionRepositioning: false,
			interventionSuction: false,
			interventionOpa: false,
			interventionNpa: false,
			interventionLma: false,
			interventionBvm: false,
			interventionEtt: false,
			spineStabilized: '',
			notes: ''
		},
		breathing: {
			normal: false,
			spontaneousRespiratoryRate: null,
			chestRiseShallow: false,
			chestRiseRetractions: false,
			chestRiseParadoxical: false,
			tracheaMidline: false,
			tracheaDeviatedLeft: false,
			tracheaDeviatedRight: false,
			breathSoundsLeft: '',
			breathSoundsRight: '',
			cyanosis: false,
			oxygenLitres: null,
			oxygenNasalCannula: false,
			oxygenMask: false,
			oxygenNonRebreather: false,
			oxygenBvm: false,
			oxygenCpapBipap: false,
			oxygenVentilator: false,
			chestTubeLeftSize: '',
			chestTubeLeftDepth: '',
			chestTubeRightSize: '',
			chestTubeRightDepth: '',
			notes: ''
		},
		circulation: {
			normal: false,
			skinWarm: false,
			skinDry: false,
			skinCool: false,
			skinMoist: false,
			skinPale: false,
			capillaryRefillUnder3: false,
			capillaryRefillSeconds: null,
			pulsesWeak: false,
			pulsesAsymmetric: false,
			jvd: '',
			unstablePelvis: '',
			bleedingControlDirectPressure: false,
			bleedingControlBandage: false,
			bleedingControlTourniquet: false,
			accessIvLocation: '',
			accessIvSize: '',
			accessCentralLocation: '',
			accessCentralSize: '',
			accessIoLocation: '',
			accessIoSize: '',
			accessLine2Location: '',
			accessLine2Size: '',
			ivfMls: null,
			ivfNs: false,
			ivfLr: false,
			ivfOther: '',
			bloodOrdered: false,
			bloodGiven: false,
			bloodTypeAmount: '',
			pelvisStabilized: '',
			notes: ''
		},
		disability: {
			normal: false,
			avpu: '',
			gcsTotal: null,
			gcsEye: null,
			gcsVerbal: null,
			gcsMotor: null,
			gcsQualified: false,
			movesRue: false,
			movesLue: false,
			movesRle: false,
			movesLle: false,
			pupilSizeLeft: null,
			pupilSizeRight: null,
			pupilReactivityLeft: '',
			pupilReactivityRight: '',
			bloodGlucose: null,
			interventionGlucose: false,
			interventionAntidote: false,
			interventionAntiepileptic: false,
			interventionRaiseHeadOfBed: false,
			interventionOther: '',
			notes: ''
		},
		exposureAndFast: {
			exposedCompletely: false,
			exposureNotes: '',
			fastNormal: false,
			fastNotIndicated: false,
			fastNotAvailable: false,
			fastPeritoneum: '',
			fastChest: '',
			fastChestPneumothoraxSide: '',
			fastChestPleuralFluidSide: '',
			fastNotes: ''
		},
		injuryHistory: {
			placeOfInjury: '',
			placeOfInjuryUnknown: false,
			activityAtTimeOfInjury: '',
			activityAtTimeOfInjuryUnknown: false,
			mechRoadTrafficIncident: false,
			mechRoadRole: '',
			mechPatientVehicle: '',
			mechImpactedWith: '',
			mechAirbag: false,
			mechSeatbelt: false,
			mechHelmet: false,
			mechExtricated: false,
			mechEjected: false,
			mechFallFrom: '',
			mechHitByFallingObject: false,
			mechStabCut: false,
			mechGunshot: false,
			mechSexualAssault: false,
			mechOtherBluntForce: false,
			mechSuffocationChokingHanging: false,
			mechDrowning: false,
			mechDrowningLifeVest: '',
			mechBurnCausedBy: '',
			mechPoisoningToxicExposure: false,
			mechUnknown: false,
			firstCareSought: '',
			prehospitalCareProvider: '',
			prehospitalCareGiven: '',
			dateOfInjury: '',
			timeOfInjury: '',
			lossOfConsciousnessDuration: '',
			headTrauma: false,
			neckTrauma: false,
			otherTraumaDetails: '',
			intent: '',
			assaultedBy: '',
			hoursSinceLastMeal: null,
			hoursSinceLastMealUnknown: false,
			substanceUseStatus: '',
			substanceAlcohol: false,
			substanceOther: ''
		},
		pastHistories: {
			pmhNone: false,
			pmhUnknown: false,
			pmhHtn: false,
			pmhDm: false,
			pmhCopd: false,
			pmhPsych: false,
			pmhRenalDisease: false,
			pmhOther: '',
			medicationsNone: false,
			medicationsUnknown: false,
			medications: '',
			pastSurgeriesNone: false,
			pastSurgeriesUnknown: false,
			pastSurgeries: '',
			familyHistoryNone: false,
			familyHistoryUnknown: false,
			familyHistory: ''
		},
		physicalExam: {
			general: emptyPe(),
			neuroPsych: emptyPe(),
			heent: emptyPe(),
			neck: emptyPe(),
			respiratory: emptyPe(),
			cardiac: emptyPe(),
			abdominal: emptyPe(),
			pelvis: emptyPe(),
			guRectal: emptyPe(),
			musculoskeletal: emptyPe(),
			skin: emptyPe(),
			areaOfInjuryDetail: ''
		},
		assessmentAndPlan: {
			narrative: ''
		},
		diagnostics: {
			labHgb: { ordered: false, result: '' },
			labBloodType: { ordered: false, result: '' },
			labChemistry: { ordered: false, result: '' },
			labHepatic: { ordered: false, result: '' },
			labUpt: { ordered: false, result: '' },
			labOther: { ordered: false, result: '' },
			imgChestRadiograph: { ordered: false, result: '' },
			imgPelvicRadiograph: { ordered: false, result: '' },
			imgHeadCt: { ordered: false, result: '' },
			imgCspine: { ordered: false, result: '' },
			imgChestAbdomenCt: { ordered: false, result: '' },
			imgExtremityRadiograph: { ordered: false, result: '' },
			imgOther: { ordered: false, result: '' }
		},
		medicationsAndProcedures: {
			ivfMls: null,
			ivfType: '',
			bloodUnits: '',
			analgesia: '',
			antimicrobials: '',
			tetanus: '',
			medications: [
				{ medicationAndDose: '', timeGiven: '', initials: '' },
				{ medicationAndDose: '', timeGiven: '', initials: '' },
				{ medicationAndDose: '', timeGiven: '', initials: '' },
				{ medicationAndDose: '', timeGiven: '', initials: '' },
				{ medicationAndDose: '', timeGiven: '', initials: '' }
			],
			procIntubation: false,
			procThoracostomy: false,
			procSplintingReduction: false,
			procLacerationRepair: false,
			procOther: '',
			procedures: [
				{ procedure: '', timeGiven: '', initials: '' },
				{ procedure: '', timeGiven: '', initials: '' },
				{ procedure: '', timeGiven: '', initials: '' },
				{ procedure: '', timeGiven: '', initials: '' },
				{ procedure: '', timeGiven: '', initials: '' }
			]
		},
		reassessment: {
			time: '',
			tempC: null,
			pulse: null,
			bpSystolic: null,
			bpDiastolic: null,
			respiratoryRate: null,
			spo2: null,
			spo2OnOxygen: '',
			conditionSame: false,
			conditionChanges: ''
		},
		disposition: {
			checklistCompleted: '',
			edDepartureDate: '',
			edDepartureTime: '',
			finalVitals: {
				tempC: null,
				pulse: null,
				bpSystolic: null,
				bpDiastolic: null,
				respiratoryRate: null,
				spo2: null,
				spo2OnOxygen: ''
			},
			diagnosesImpressions: '',
			disposition: '',
			admitWard: '',
			transferTo: '',
			dischargePlanDiscussed: '',
			leftWithoutBeingSeen: false,
			diedCause: '',
			acceptingProvider: '',
			emergencyUnitProvider: '',
			signature: '',
			signatureDate: ''
		}
	};
}

/**
 * Svelte 5 reactive store for the WHO Emergency Unit (Trauma) encounter, with
 * localStorage persistence so an in-progress record survives a page reload.
 * Drafts are keyed by encounter id so each record edits independently.
 */
class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<EuTraumaResult | null>(null);
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
	 * (e.g. `const p = assessment.data.patientRegistration`) stay bound to live
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
