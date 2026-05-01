import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			sex: '',
			patientContact: '',
			emergencyContact: { name: '', contactInformation: '' }
		},
		facilityDetails: {
			initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
			referralDate: '',
			referralReason: '',
			acuity: '',
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			communication: {
				discussedWithPrimaryCareProvider: false,
				discussedWithInitiatingFacility: false
			},
			primaryCareFacility: { name: '', focalPoint: '', phoneNumber: '' },
			followUpTimeframe: ''
		},
		situation: {
			chiefComplaint: '',
			primaryDiagnosis: '',
			pregnant: '',
			treatmentsInitiated: '',
			icuStay: false,
			surgery: false,
			hospitalized: false
		},
		background: {
			historyOfPresentIllness: '',
			pastMedicalHistory: '',
			significantEvents: ''
		},
		assessment: {
			finalDiagnoses: '',
			prognosisAndGoalsOfCare: '',
			patientFamilyInformed: '',
			informedExplanation: ''
		},
		recommendations: {
			followUpPlan: '',
			pendingInvestigations: '',
			followUpArrangements: '',
			deteriorationInstructions: '',
			contactName: '',
			contactInformation: '',
			statusFlags: {
				cognitiveImpairment: false,
				carerDependent: false,
				spinalPrecautions: false,
				weightBearingRestrictions: false,
				palliativeCare: false
			}
		},
		providerSignOff: {
			providerName: '',
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
