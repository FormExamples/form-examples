import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			addressLine1: '',
			addressLine2: '',
			addressLine3: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				gpName: '',
				surgeryName: '',
				addressLine1: '',
				addressLine2: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			},
			consultant: {
				consultantName: '',
				speciality: '',
				department: '',
				hospitalName: '',
				addressLine1: '',
				addressLine2: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		conditionHistory: {
			brainHaemorrhage: false,
			brainHaemorrhageDate: '',
			brainHaemorrhageDetails: '',
			severeHeadInjury: false,
			severeHeadInjuryDate: '',
			severeHeadInjuryDetails: '',
			otherCondition: false,
			otherConditionDate: '',
			otherConditionDetails: '',
			brainSurgeryDate: '',
			brainSurgeryNotApplicable: false
		},
		treatmentProvider: {
			lastSeen: '',
			gpLastContactDate: '',
			gpNextContactDate: '',
			consultantLastContactDate: '',
			consultantNextContactDate: ''
		},
		blackouts: {
			hadBlackouts: '',
			blackoutDate: ''
		},
		seizures: {
			hadSeizures: '',
			diagnosis: '',
			firstEver: { date: '', details: '' },
			multiple: {
				twoOrMoreWithinFiveYears: '',
				firstAwakeSeizureDate: '',
				firstAsleepSeizureDate: '',
				lastTwoAwakeSeizureDate1: '',
				lastTwoAwakeSeizureDate2: '',
				lastTwoAsleepSeizureDate1: '',
				lastTwoAsleepSeizureDate2: '',
				firstSleepAttackAfterLastAwakeAttackDate: '',
				affectedConsciousness: '',
				wouldHaveAffectedDriving: '',
				attackDescription: '',
				resultOfMedicationAdvice: '',
				dateMedicationStartedToReduce: '',
				previousMedicationRestarted: '',
				datePreviousMedicationRestarted: '',
				dateOfLastSeizurePriorToWithdrawal: '',
				provokedSeizureDetails: ''
			},
			epilepsyDeclaration: {
				declarationAccepted: false,
				signedName: '',
				signatureDate: ''
			}
		},
		medication: {
			noMedicationTaken: false,
			entries: [
				{ name: '', startDate: '', endDate: '' },
				{ name: '', startDate: '', endDate: '' },
				{ name: '', startDate: '', endDate: '' },
				{ name: '', startDate: '', endDate: '' }
			],
			makesDrowsyOrConfused: ''
		},
		vpShunt: {
			hadVpShuntOrDrain: '',
			procedureDate: ''
		},
		dailyLiving: {
			needsHelp: '',
			helpDetails: ''
		},
		doubleVision: {
			hasDoubleVision: '',
			suppressedOrControlled: '',
			correctionMethod: '',
			correctionMethodOther: ''
		},
		eyesight: {
			hasEyesightProblems: '',
			details: ''
		},
		vehicleAdaptations: {
			needsAdaptations: '',
			previouslyDeclared: '',
			additionalControlsFitted: ''
		},
		authorisation: {
			declarationAccepted: false,
			name: '',
			signatureDate: '',
			electronicCorrespondenceConsent: '',
			dvlaContactPreference: '',
			healthcareContactPreference: ''
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
