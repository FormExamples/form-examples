// The canonical blank evaluation.
//
// Lives in the engine rather than the store so it can be imported by pure
// code and by the Vitest suite without pulling in SvelteKit's $app modules.

import type { CataractDiagnosticEvaluation } from './types';

/**
 * A blank cataract diagnostic evaluation with every field at its unanswered
 * default: '' for text and enum fields, null for numeric, date, and time
 * fields.
 */
export function createDefaultEvaluation(): CataractDiagnosticEvaluation {
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
			firstName: '',
			lastName: '',
			birthDate: '',
			sex: '',
			nhsNumber: '',
			email: '',
			phone: ''
		},
		symptoms: {
			blurredVision: '',
			glareOrHalos: '',
			nightDrivingDifficulty: '',
			fadedColourPerception: '',
			frequentPrescriptionChanges: '',
			symptomDurationMonths: null,
			symptomLaterality: '',
			presentingComplaintNotes: ''
		},
		history: {
			historyDiabetes: '',
			historyPriorEyeSurgery: '',
			historyPriorEyeSurgeryDetail: '',
			historyOcularTrauma: '',
			historyUveitis: '',
			historySteroidUse: '',
			historyFamilyCataract: '',
			historySmokingStatus: '',
			historyHighUvExposure: '',
			historyHighMyopia: '',
			medicalHistoryNotes: ''
		},
		acuity: {
			unaidedVaLogmarRight: null,
			unaidedVaLogmarLeft: null,
			unaidedVaSnellenRight: '',
			unaidedVaSnellenLeft: '',
			bestCorrectedVaLogmarRight: null,
			bestCorrectedVaLogmarLeft: null,
			bestCorrectedVaSnellenRight: '',
			bestCorrectedVaSnellenLeft: '',
			pinholeVaLogmarRight: null,
			pinholeVaLogmarLeft: null,
			pinholeVaSnellenRight: '',
			pinholeVaSnellenLeft: ''
		},
		refraction: {
			refractionSphereRight: null,
			refractionSphereLeft: null,
			refractionCylinderRight: null,
			refractionCylinderLeft: null,
			refractionAxisRight: null,
			refractionAxisLeft: null,
			refractionStability: ''
		},
		slitLamp: {
			locsIiiNoRight: null,
			locsIiiNoLeft: null,
			locsIiiNcRight: null,
			locsIiiNcLeft: null,
			locsIiiCRight: null,
			locsIiiCLeft: null,
			locsIiiPRight: null,
			locsIiiPLeft: null,
			cataractTypeRight: '',
			cataractTypeLeft: '',
			anteriorChamberDepthRight: '',
			anteriorChamberDepthLeft: '',
			cornealClarityRight: '',
			cornealClarityLeft: '',
			pupilReactionRight: '',
			pupilReactionLeft: ''
		},
		glare: {
			glareAcuityResultRight: '',
			glareAcuityResultLeft: '',
			glareFunctionalImpact: ''
		},
		tonometry: {
			intraocularPressureRightMmhg: null,
			intraocularPressureLeftMmhg: null,
			tonometryMethod: ''
		},
		fundus: {
			dilatedFundusExamPerformed: '',
			opticDiscCupDiscRatioRight: null,
			opticDiscCupDiscRatioLeft: null,
			maculaFindingsRight: '',
			maculaFindingsLeft: '',
			retinalFindingsRight: '',
			retinalFindingsLeft: '',
			viewObscuredByCataractRight: '',
			viewObscuredByCataractLeft: ''
		},
		differential: {
			glaucomaSuspected: '',
			glaucomaNotes: '',
			amdSuspected: '',
			amdNotes: '',
			diabeticRetinopathySuspected: '',
			diabeticRetinopathyNotes: ''
		},
		biometry: {
			biometryPerformed: '',
			axialLengthRightMm: null,
			axialLengthLeftMm: null,
			keratometryK1Right: null,
			keratometryK1Left: null,
			keratometryK2Right: null,
			keratometryK2Left: null,
			octPerformed: '',
			octFindings: '',
			calculatedIolPowerRight: null,
			calculatedIolPowerLeft: null
		},
		functional: {
			functionalDifficultyReading: null,
			functionalDifficultyDriving: null,
			functionalDifficultyDailyActivities: null,
			functionalImpactNotes: ''
		},
		management: {
			managementRecommendation: '',
			eyeForSurgery: '',
			risksBenefitsCounselled: '',
			consentDiscussed: '',
			managementNotes: ''
		},
		summary: {
			overrideSurgicalCandidacy: '',
			overrideReason: '',
			clinicianNotes: '',
			signedByName: ''
		}
	};
}
