// The canonical blank evaluation.
//
// Lives in the engine rather than the store so it can be imported by pure
// code and by the Vitest suite without pulling in SvelteKit's $app modules.

import type { HerniaDiagnosticEvaluation } from './types';

/**
 * A blank hernia diagnostic evaluation with every field at its unanswered
 * default: '' for text and enum fields, null for numeric, date, and time
 * fields.
 */
export function createDefaultAssessment(): HerniaDiagnosticEvaluation {
	return {
		status: 'draft',
		clinician: {
			clinicianName: '',
			role: '',
			registrationBody: '',
			registrationNumber: '',
			assessmentDate: '',
			assessmentTime: '',
			siteName: ''
		},
		patient: {
			firstName: '',
			lastName: '',
			birthDate: '',
			sex: '',
			nhsNumber: '',
			email: '',
			phone: ''
		},
		history: {
			durationOfBulge: '',
			painScore0To10: null,
			painOnset: '',
			aggravatedByStraining: '',
			aggravatedByLifting: '',
			aggravatedByCoughing: '',
			priorHerniaHistory: '',
			priorHerniaRepair: '',
			priorHerniaRepairMesh: '',
			priorHerniaRepairSite: '',
			historyNotes: ''
		},
		riskFactors: {
			riskChronicCough: '',
			riskConstipationOrStraining: '',
			riskHeavyLiftingOccupation: '',
			riskObesity: '',
			riskSmoking: '',
			riskFamilyHistory: '',
			riskPriorAbdominalSurgery: '',
			riskPregnancy: '',
			riskConnectiveTissueDisorder: '',
			riskAscites: '',
			riskFactorsNotes: ''
		},
		inspection: {
			inspectionLocation: '',
			inspectionLocationOther: '',
			bulgeVisibleAtRest: '',
			bulgeEnlargesOnStandingOrStraining: '',
			skinChanges: '',
			inspectionNotes: ''
		},
		palpation: {
			palpableMass: '',
			coughImpulsePositive: '',
			tenderness: '',
			massSizeAsCm: null,
			palpationNotes: ''
		},
		reducibility: {
			reducibilityStatus: '',
			reducesSpontaneously: '',
			reducesWithManualPressure: '',
			doesNotReduce: '',
			reducibilityNotes: ''
		},
		redFlags: {
			redFlagSeverePain: '',
			redFlagVomiting: '',
			redFlagFever: '',
			redFlagAbsoluteConstipation: '',
			redFlagErythemaOrDiscolouration: '',
			redFlagPreviouslyReducibleNowIrreducible: '',
			redFlagTachycardia: '',
			redFlagNotes: ''
		},
		classification: {
			herniaType: '',
			herniaTypeOther: '',
			inguinalSubtype: '',
			laterality: '',
			ehsSizeGrade: '',
			classificationNotes: ''
		},
		imaging: {
			ultrasoundPerformed: '',
			ultrasoundFindings: '',
			ctPerformed: '',
			ctFindings: '',
			mriPerformed: '',
			mriFindings: '',
			imagingIndication: '',
			imagingNotes: ''
		},
		differential: {
			differentialLipoma: '',
			differentialLymphadenopathy: '',
			differentialHydrocele: '',
			differentialUndescendedTestis: '',
			differentialFemoralAneurysm: '',
			differentialAbscess: '',
			differentialOther: '',
			differentialNotes: ''
		},
		functionalImpact: {
			painInterferesWithWorkOrActivity: '',
			functionalImpactScale0To10: null,
			activityLimitation: ''
		},
		management: {
			managementPlan: '',
			conservativeDetail: '',
			referralMade: '',
			referralTargetTimeframe: '',
			managementNotes: ''
		},
		summary: {
			overrideUrgency: '',
			overrideReason: '',
			additionalNotes: '',
			signedByName: ''
		}
	};
}
