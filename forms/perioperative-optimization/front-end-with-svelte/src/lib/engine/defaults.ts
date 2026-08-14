// The canonical blank assessment.
//
// Lives in the engine rather than the store so it can be imported by pure code
// and by the Vitest suite without pulling in SvelteKit's $app modules.

import type { PerioperativeOptimization } from './types';

export function createDefaultAssessment(): PerioperativeOptimization {
	return {
		// Step 1 — assessment context
		assessment: {
			clinicianName: '',
			role: '',
			registrationBody: '',
			registrationNumber: '',
			assessmentDate: '',
			assessmentTime: '',
			siteName: '',
			serviceName: '',
			pathwayStage: '',
			assessmentMode: '',
			referralSource: ''
		},
		// Step 2 — patient and procedural demographics
		patient: {
			firstName: '',
			lastName: '',
			birthDate: '',
			sex: '',
			nhsNumber: '',
			phone: '',
			email: ''
		},
		procedure: {
			plannedProcedure: '',
			surgicalSpecialty: '',
			consultantSurgeon: '',
			plannedSurgeryDate: '',
			urgency: '',
			surgicalSeverity: '',
			laterality: '',
			anticipatedBloodLossMl: null,
			anticipatedLengthOfStayDays: null,
			interpreterRequired: '',
			interpreterLanguage: ''
		},
		// Step 3 — medical and surgical history
		history: {
			conditionCardiac: '',
			conditionRespiratory: '',
			conditionRenal: '',
			conditionHepatic: '',
			conditionStroke: '',
			conditionCancer: '',
			conditionRheumatological: '',
			conditionThyroid: '',
			conditionOther: '',
			previousSurgery: '',
			previousSurgeryDetail: '',
			previousAnaestheticComplication: '',
			previousAnaestheticComplicationDetail: '',
			postoperativeNauseaHistory: '',
			difficultAirwayHistory: '',
			malignantHyperthermiaHistory: '',
			venousThromboembolismHistory: '',
			familyHistory: '',
			pregnancyStatus: ''
		},
		// Step 4 — medications
		medication: {
			takesPrescriptionMedicines: '',
			takesOverTheCounterMedicines: '',
			takesHerbalProducts: '',
			takesAnticoagulant: '',
			takesAntiplatelet: '',
			takesAceInhibitorOrArb: '',
			takesSglt2Inhibitor: '',
			takesGlp1Agonist: '',
			takesCorticosteroid: '',
			takesImmunosuppressant: '',
			takesHormoneTherapy: '',
			medicationHoldPlanAgreed: '',
			medicationHoldPlanAgreedBy: '',
			medicationAdherence: '',
			medicationNotes: ''
		},
		// Step 5 — allergies and intolerances
		allergy: {
			hasDrugAllergy: '',
			drugAllergyDetail: '',
			hasFoodAllergy: '',
			foodAllergyDetail: '',
			hasLatexAllergy: '',
			hasAdhesiveAllergy: '',
			hasContrastAllergy: '',
			allergySeverity: '',
			adrenalineAutoInjector: '',
			allergyNotes: ''
		},
		// Step 6 — anaemia and iron studies
		anaemia: {
			bloodsSampleDate: '',
			haemoglobinGPerL: null,
			meanCellVolumeFl: null,
			ferritinUgPerL: null,
			transferrinSaturationPercent: null,
			vitaminB12NgPerL: null,
			folateUgPerL: null,
			cReactiveProteinMgPerL: null,
			creatinineUmolPerL: null,
			egfrMlPerMin: null,
			anaemiaKnownCause: '',
			anaemiaTreatmentStarted: '',
			anaemiaTreatmentRoute: '',
			anaemiaTreatmentStartDate: '',
			previousTransfusion: '',
			groupAndSaveDone: '',
			anaemiaNotes: ''
		},
		// Step 7 — glycaemic control
		glycaemic: {
			diabetesType: '',
			diabetesDurationYears: null,
			hba1cMmolPerMol: null,
			hba1cSampleDate: '',
			capillaryGlucoseMmolPerL: null,
			diabetesTreatment: '',
			insulinRegimen: '',
			hypoglycaemiaAwareness: '',
			diabetesTeamReview: '',
			diabetesTeamReviewDate: '',
			footCheckDone: '',
			glycaemicNotes: ''
		},
		// Step 8 — smoking and tobacco
		smoking: {
			smokingStatus: '',
			cigarettesPerDay: null,
			packYears: null,
			quitDate: '',
			smokingCessationOffered: '',
			smokingCessationAccepted: '',
			nicotineReplacement: '',
			vaping: '',
			smokingNotes: ''
		},
		// Step 9 — alcohol and other substances
		alcohol: {
			alcoholUnitsPerWeek: null,
			auditCFrequency: null,
			auditCTypicalQuantity: null,
			auditCBingeFrequency: null,
			alcoholDependenceFeatures: '',
			alcoholReductionPlanAgreed: '',
			alcoholServicesReferral: '',
			recreationalDrugUse: '',
			recreationalDrugDetail: '',
			alcoholNotes: ''
		},
		// Step 10 — nutritional screening
		nutrition: {
			heightAsCm: null,
			weightAsKg: null,
			usualWeightAsKg: null,
			weightLossIsIntentional: '',
			acutelyIll: '',
			noNutritionalIntakeOver5Days: '',
			appetite: '',
			oralNutritionalSupplements: '',
			immunonutrition: '',
			dietitianReferral: '',
			nutritionNotes: ''
		},
		// Step 11 — functional capacity and physical fitness
		fitness: {
			usualActivityLevel: '',
			climbsFlightOfStairs: '',
			metabolicEquivalents: null,
			dukeActivityStatusIndex: null,
			sixMinuteWalkMetres: null,
			cpetAnaerobicThreshold: null,
			cpetPeakVo2: null,
			gripStrengthKg: null,
			prehabilitationOffered: '',
			prehabilitationEnrolled: '',
			prehabilitationSessionsPerWeek: null,
			prehabilitationStartDate: '',
			fitnessNotes: ''
		},
		// Step 12 — frailty, cognition, and falls
		frailty: {
			clinicalFrailtyScale: null,
			cognitiveScreenTool: '',
			cognitiveScreenScore: null,
			cognitiveImpairment: '',
			capacityConcern: '',
			fallsInLast12Months: null,
			mobilityAid: '',
			livingSituation: '',
			carePackage: '',
			frailtyNotes: ''
		},
		// Step 13 — cardiorespiratory optimisation
		cardioresp: {
			systolicBp: null,
			diastolicBp: null,
			heartRate: null,
			heartRhythm: '',
			murmurPresent: '',
			exerciseTolerance: '',
			ejectionFractionPercent: null,
			echoDate: '',
			asthmaControl: '',
			copdControl: '',
			inhalerTechniqueChecked: '',
			rescueSteroids: '',
			spirometryFev1Percent: null,
			stopBangScore: null,
			sleepApnoeaDiagnosis: '',
			cpapUse: '',
			oxygenSaturationPercent: null,
			cardiorespiratoryNotes: ''
		},
		// Step 14 — psychological readiness and social support
		social: {
			anxietyLevel: '',
			depressionScreen: '',
			understandsProcedure: '',
			expectationsRealistic: '',
			sharedDecisionMakingDiscussed: '',
			hasCarer: '',
			transportHomeArranged: '',
			supportAfterDischarge: '',
			healthLiteracy: '',
			psychologicalSupportOffered: '',
			socialNotes: ''
		},
		// Step 15 — optimisation plan by domain
		plan: {
			planAnaemia: '',
			referralAnaemia: '',
			planGlycaemicControl: '',
			referralGlycaemicControl: '',
			planSmoking: '',
			referralSmoking: '',
			planAlcohol: '',
			referralAlcohol: '',
			planNutrition: '',
			referralNutrition: '',
			planPhysicalFitness: '',
			referralPhysicalFitness: '',
			planMedication: '',
			referralMedication: '',
			planCardiorespiratory: '',
			referralCardiorespiratory: '',
			responsibleClinician: '',
			planAgreedWithPatient: '',
			planSharedWithPatient: '',
			nextReviewDate: '',
			planNotes: ''
		},
		// Step 16 — readiness summary and sign-off
		signoff: {
			overrideReadiness: '',
			overrideReason: '',
			gateDecision: '',
			additionalNotes: '',
			signedByName: ''
		}
	};
}