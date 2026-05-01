import type {
	AssessmentData,
	FlaggedIssue,
	PeEntry,
	Reassessment,
	ValidationResult
} from '$lib/engine/types';

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

class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	validation = $state<ValidationResult | null>(null);
	flags = $state<FlaggedIssue[]>([]);
	currentStep = $state(1);

	reset() {
		this.data = createDefaultAssessment();
		this.validation = null;
		this.flags = [];
		this.currentStep = 1;
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

export const assessment = new AssessmentStore();
