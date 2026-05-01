import type {
	AssessmentData,
	FlaggedIssue,
	PeEntry,
	RosEntry,
	ValidationResult
} from '$lib/engine/types';

function emptyRos(): RosEntry {
	return { normal: false, notes: '' };
}

function emptyPe(): PeEntry {
	return { normal: false, notes: '' };
}

export function createDefaultAssessment(): AssessmentData {
	return {
		patientRegistration: {
			hospitalRegistrationNumber: '',
			surname: '',
			firstName: '',
			sex: '',
			dateOfBirth: '',
			age: null,
			ageCategory: '',
			weightKg: null,
			dateOfArrival: '',
			timeOfArrival: '',
			arrivalMode: '',
			ambulanceLevel: '',
			emergencySystemActivationDate: '',
			emergencySystemActivationTime: '',
			emergencySystemDispatchDate: '',
			emergencySystemDispatchTime: '',
			emergencyPersonnelArrivalDate: '',
			emergencyPersonnelArrivalTime: '',
			occupation: '',
			patientResidence: '',
			patientResidenceUnknown: false,
			racialAndEthnicIdentity: '',
			racialAndEthnicIdentityUnknown: false,
			interpreterRequired: '',
			contactPerson: '',
			contactPhone: '',
			contactRelation: '',
			priorFacilitiesCount: null,
			referredFrom: '',
			ambulatory: false,
			nonAmbulatory: false,
			acute: false,
			chronic: false,
			dailyActivitiesLimited: ''
		},
		chiefComplaintAndVitals: {
			chiefComplaint: '',
			triageCategory: '',
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
			providerAssessmentDate: '',
			providerAssessmentTime: '',
			deadOnArrival: false
		},
		highRiskSigns: {
			abnormalAvpu: false,
			abnormalHeartRate: false,
			stridorOrVoiceChange: false,
			poorPerfusion: false,
			abnormalTemperature: false,
			lowSpo2: false,
			respiratoryDistress: false,
			vomitsEverythingOrCannotFeed: false
		},
		airway: {
			normal: false,
			angioedema: false,
			stridor: false,
			voiceChanges: false,
			oralAirwayBurns: false,
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
			oxygenLitres: null,
			oxygenNasalCannula: false,
			oxygenMask: false,
			oxygenNonRebreather: false,
			oxygenBvm: false,
			oxygenCpapBipap: false,
			oxygenVentilator: false,
			bronchodilator: false,
			chestNeedleLeftSize: '',
			chestNeedleLeftDepth: '',
			chestNeedleRightSize: '',
			chestNeedleRightDepth: '',
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
			capillaryRefillSeconds: null,
			pulsesWeak: false,
			pulsesAsymmetric: false,
			jvd: '',
			accessIvLocation: '',
			accessIvSize: '',
			accessCvlLocation: '',
			accessCvlSize: '',
			accessIoLocation: '',
			accessIoSize: '',
			ivfMls: null,
			ivfNs: false,
			ivfLr: false,
			ivfOther: '',
			bloodOrdered: false,
			epinephrineGiven: false,
			notes: ''
		},
		disability: {
			normal: false,
			avpu: '',
			movesAllExtremities: false,
			deficit: false,
			deficitDescription: '',
			pupilSizeLeft: null,
			pupilSizeRight: null,
			pupilReactivityLeft: '',
			pupilReactivityRight: '',
			bloodGlucoseMmol: null,
			interventionGlucose: false,
			interventionAntiepileptic: false,
			interventionNaloxone: false,
			interventionOthers: '',
			notes: ''
		},
		historyOfPresentIllness: {
			narrative: ''
		},
		reviewOfSystems: {
			general: emptyRos(),
			heent: emptyRos(),
			respiratory: emptyRos(),
			cardiovascular: emptyRos(),
			gastrointestinal: emptyRos(),
			pelvisGuRectal: emptyRos(),
			femaleReproductive: emptyRos(),
			maleReproductive: emptyRos(),
			skin: emptyRos(),
			musculoskeletal: emptyRos(),
			hematologic: emptyRos(),
			neurological: emptyRos(),
			psychiatric: emptyRos(),
			pediatricSpecific: emptyRos()
		},
		pastMedicalHistory: {
			historyObtainedFrom: '',
			medications: '',
			medicationsUnknown: false,
			allergies: '',
			allergiesUnknown: false,
			lastMenstrualCycle: '',
			gravida: null,
			para: null,
			lmpUnknown: false,
			pregnant: '',
			pregnancyReported: false,
			pregnancyTestingDone: false,
			vaccinationsStatus: '',
			vaccinationsDate: '',
			tobaccoUse: false,
			alcoholUse: false,
			drugUse: false,
			ivDrugUse: false,
			substanceUseUnknown: false,
			pmhHtn: false,
			pmhDm: false,
			pmhCopd: false,
			pmhPsych: false,
			pmhRenalDisease: false,
			pmhUnknown: false,
			pmhOther: '',
			familyHistory: '',
			familyHistoryUnknown: false,
			pastSurgeries: '',
			pastSurgeriesUnknown: false,
			safeAtHome: ''
		},
		physicalExam: {
			general: emptyPe(),
			neuroPsych: emptyPe(),
			heent: emptyPe(),
			neck: emptyPe(),
			respiratory: emptyPe(),
			cardiac: emptyPe(),
			abdominal: emptyPe(),
			pelvisGuRectal: emptyPe(),
			lymph: emptyPe(),
			musculoskeletal: emptyPe(),
			skin: emptyPe()
		},
		diagnostics: {
			cbc: { wbc: null, hgb: null, plt: null, hct: null, pending: false },
			lytes: {
				na: null,
				cl: null,
				bun: null,
				k: null,
				hco3: null,
				cr: null,
				glucose: null,
				pending: false
			},
			upt: '',
			malaria: '',
			hivRapid: '',
			bloodType: '',
			urineDip: {
				glucose: false,
				nitrites: false,
				ketones: false,
				leukocytes: false,
				blood: false,
				protein: false
			},
			otherLabsImaging: '',
			ecg: { rate: null, sinusRhythm: '', ischemia: '', interpretation: '' }
		},
		additionalInterventions: {
			medications: {
				time: '',
				ivfMls: null,
				ivfType: '',
				bloodProductsUnits: '',
				opioidAnalgesia: '',
				otherAnalgesia: '',
				sedationParalytics: '',
				antimicrobials: '',
				tetanus: '',
				other: ''
			},
			procedures: {
				intubationTime: '',
				intubationOutcome: '',
				chestTubeTime: '',
				chestTubeOutcome: '',
				lumbarPunctureTime: '',
				lumbarPunctureOutcome: '',
				lacerationRepairTime: '',
				lacerationRepairOutcome: '',
				other: ''
			}
		},
		assessmentAndPlan: {
			narrative: ''
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
			diagnosesImpressions: '',
			disposition: '',
			admitWard: '',
			dischargePlanDiscussed: '',
			transferTo: '',
			leftWithoutBeingSeen: false,
			diedCause: '',
			finalVitals: {
				tempC: null,
				pulse: null,
				bpSystolic: null,
				bpDiastolic: null,
				respiratoryRate: null,
				spo2: null,
				spo2OnOxygen: ''
			},
			acceptingProvider: '',
			emergencyUnitProvider: '',
			signature: '',
			signatureDate: ''
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
}

export const assessment = new AssessmentStore();
