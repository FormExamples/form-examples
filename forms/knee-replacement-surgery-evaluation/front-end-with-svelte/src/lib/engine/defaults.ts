// The canonical blank evaluation.
//
// Lives in the engine rather than the store so it can be imported by pure
// code and by the Vitest suite without pulling in SvelteKit's $app modules.

import type { KneeReplacementSurgeryEvaluation } from './types';

/**
 * A blank knee-replacement surgery evaluation with every field at its
 * unanswered default: '' for text and enum fields, null for numeric, date,
 * and time fields.
 */
export function createDefaultEvaluation(): KneeReplacementSurgeryEvaluation {
	return {
		status: 'draft',
		clinician: {
			clinicianName: '',
			role: '',
			registrationBody: '',
			registrationNumber: '',
			siteName: '',
			assessmentDate: '',
			assessmentTime: ''
		},
		patient: {
			name: '',
			birthDate: '',
			sex: '',
			nhsNumber: '',
			email: '',
			phone: '',
			heightAsCm: null,
			weightAsKg: null,
			preferredLanguage: ''
		},
		history: {
			kneeSide: '',
			symptomDurationMonths: null,
			painAtRest0To10: null,
			painOnActivity0To10: null,
			nightPain: '',
			priorKneeSurgery: '',
			priorKneeSurgeryType: '',
			priorKneeSurgeryDate: '',
			priorInjury: '',
			priorInjuryDetail: ''
		},
		oks: {
			oksPainSeverity: null,
			oksWashingAndDrying: null,
			oksTransport: null,
			oksWalkingDistance: null,
			oksPainSittingOrLying: null,
			oksLimping: null,
			oksKneeling: null,
			oksNightPainFrequency: null,
			oksPainInterferingWithWork: null,
			oksGivingWay: null,
			oksShopping: null,
			oksStairs: null
		},
		functional: {
			walkingDistanceBeforePain: '',
			stairClimbingAbility: '',
			standFromChairUnaided: '',
			walkingAid: ''
		},
		rangeOfMotion: {
			flexionDegrees: null,
			extensionDeficitDegrees: null,
			fixedFlexionDeformityPresent: '',
			fixedFlexionDeformityDegrees: null
		},
		stability: {
			coronalDeformityType: '',
			coronalDeformitySeverity: '',
			ligamentAcl: '',
			ligamentPcl: '',
			ligamentMcl: '',
			ligamentLcl: '',
			patellarTracking: ''
		},
		strength: {
			quadricepsStrengthMrc: null,
			effusionPresent: '',
			crepitusPresent: ''
		},
		imaging: {
			weightBearingXrayPerformed: '',
			kellgrenLawrenceGradeMedial: null,
			kellgrenLawrenceGradeLateral: null,
			kellgrenLawrenceGradePatellofemoral: null,
			mriPerformed: '',
			mriFindings: '',
			ctPerformed: '',
			ctIndication: ''
		},
		conservative: {
			physiotherapyTried: '',
			physiotherapyDurationWeeks: null,
			weightManagementAdviceGiven: '',
			injectionGiven: '',
			injectionType: '',
			injectionCount: null,
			injectionResponse: '',
			nsaidAnalgesicTrial: '',
			nsaidAnalgesicResponse: '',
			walkingAidTrial: '',
			conservativeMeasuresExhausted: ''
		},
		generalHealth: {
			diabetesControlled: '',
			cardiacDisease: '',
			bleedingDisorderOrAnticoagulant: '',
			smokingStatus: '',
			generalFitnessNote: ''
		},
		preOpBloods: {
			fbcDone: '',
			renalFunctionDone: '',
			clottingDone: '',
			ecgDone: '',
			mrsaScreenDone: '',
			urinalysisDone: ''
		},
		sharedDecision: {
			risksBenefitsDiscussed: '',
			realisticExpectationsDiscussed: '',
			patientDecisionAidGiven: '',
			interpreterRequired: ''
		},
		plan: {
			planRecommendation: '',
			targetListDate: '',
			responsibleSurgeon: ''
		},
		summary: {
			overrideCandidacy: '',
			overrideReason: '',
			clinicianNotes: '',
			signedByName: ''
		}
	};
}
