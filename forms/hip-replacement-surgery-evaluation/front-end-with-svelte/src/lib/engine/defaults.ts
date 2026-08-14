// The canonical blank evaluation.
//
// Lives in the engine rather than the store so it can be imported by pure
// code and by the Vitest suite without pulling in SvelteKit's $app modules.

import type { HipReplacementSurgeryEvaluation } from './types';

/**
 * A blank hip-replacement surgery evaluation with every field at its
 * unanswered default: '' for text and enum fields, null for numeric, date,
 * and time fields.
 */
export function createDefaultEvaluation(): HipReplacementSurgeryEvaluation {
	return {
		status: 'draft',
		clinician: {
			clinicianName: '',
			role: '',
			gmcNumber: '',
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
			weightAsKg: null
		},
		history: {
			affectedSide: '',
			symptomDurationMonths: null,
			painAtRest0To10: null,
			painOnActivity0To10: null,
			nightPain: '',
			priorHipSurgery: '',
			priorHipSurgeryDetail: '',
			priorInjuryOrDysplasiaHistory: '',
			priorInjuryOrDysplasiaDetail: ''
		},
		ohs: {
			painSeverity: null,
			washingAndDrying: null,
			transport: null,
			dressingSocks: null,
			shopping: null,
			walkingPain: null,
			limping: null,
			kneeling: null,
			nightPain: null,
			workInterference: null,
			givingWay: null,
			stairs: null
		},
		function: {
			walkingDistanceBeforePain: '',
			shoesAndSocksDifficulty: '',
			walkingAidUse: ''
		},
		gait: {
			limpPresent: '',
			antalgicGait: '',
			trendelenburgSign: '',
			legLengthDiscrepancyAsCm: null
		},
		rangeOfMotion: {
			flexionDegrees: null,
			internalRotationDegrees: null,
			externalRotationDegrees: null,
			abductionDegrees: null,
			adductionDegrees: null,
			fixedFlexionDeformityPresent: ''
		},
		stability: {
			hipAbductorStrengthMrc: null,
			jointStability: '',
			tendernessSite: ''
		},
		imaging: {
			weightBearingXrayPerformed: '',
			kellgrenLawrenceGrade: null,
			jointSpaceNarrowing: '',
			subchondralSclerosisOrCystsPresent: '',
			mriPerformed: '',
			mriFindings: '',
			ctPerformed: '',
			ctIndication: ''
		},
		conservative: {
			physiotherapyTried: '',
			physiotherapyDurationWeeks: null,
			weightManagementAdviceGiven: '',
			steroidInjectionGiven: '',
			steroidInjectionCount: null,
			steroidInjectionResponse: '',
			analgesicTrialGiven: '',
			analgesicTrialResponse: '',
			walkingAidTrial: '',
			conservativeMeasuresExhausted: ''
		},
		fitness: {
			diabetesControlled: '',
			cardiacDiseasePresent: '',
			bleedingDisorderOrAnticoagulantUse: '',
			smokingStatus: '',
			generalFitnessNote: ''
		},
		baselineTests: {
			fullBloodCountDone: '',
			renalFunctionDone: '',
			clottingOrInrDone: '',
			ecgDone: '',
			mrsaScreenDone: '',
			urinalysisDone: ''
		},
		decisionMaking: {
			risksAndBenefitsDiscussed: '',
			realisticExpectationsDiscussed: '',
			patientDecisionAidGiven: '',
			interpreterRequired: '',
			interpreterLanguage: ''
		},
		plan: {
			recommendation: '',
			targetListDate: '',
			responsibleSurgeon: ''
		},
		summary: {
			overrideCandidacy: '',
			overrideReason: '',
			clinicianNotes: '',
			additionalNotes: '',
			signedByName: ''
		}
	};
}
