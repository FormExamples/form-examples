import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientLastName: '',
			patientFirstName: '',
			dateOfBirth: '',
			sex: '',
			patientContactInformation: '',
			emergencyContact: { name: '', contactInformation: '' }
		},
		facilityAndTransport: {
			initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
			reasonForReferral: '',
			referralFacilityContacted: false,
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			ambulance: { name: '', focalPoint: '', phoneNumber: '' },
			transferDecisionDateTime: '',
			departureDateTime: '',
			modeOfTransfer: ''
		},
		situation: {
			chiefComplaint: '',
			primaryDiagnosis: '',
			pregnant: '',
			otherAcuteDiagnoses: '',
			treatmentsInitiated: ''
		},
		background: {
			historyOfPresentIllness: '',
			pastMedicalAndSurgicalHistory: '',
			airway: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			breathing: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			circulation: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			disability: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			exposure: {
				findingNormal: false,
				findingDetails: '',
				interventionNone: false,
				interventionDetails: ''
			},
			otherSignificantTreatments: ''
		},
		assessment: {
			clinicalAssessment: '',
			vitalSigns: {
				heartRate: null,
				respiratoryRate: null,
				systolicBloodPressure: null,
				diastolicBloodPressure: null,
				temperatureCelsius: null,
				oxygenSaturation: null,
				glasgowComaScale: null
			}
		},
		recommendations: {
			treatmentPlanDuringTransport: '',
			potentialWorseningOfCondition: '',
			cautionsRegardingPriorTherapies: '',
			precautions: {
				highlyInfectiousDisease: false,
				spinalPrecautions: false,
				weightBearingRestrictions: false,
				fallRisk: false,
				aspirationRisk: false,
				other: false,
				otherDetails: ''
			}
		},
		initiatingProviderSignoff: {
			providerName: '',
			signature: '',
			signatureDate: ''
		},
		referralFacilityReceipt: {
			patientArrivalDateTime: '',
			receivingProviderName: '',
			receivingProviderSignature: '',
			feedbackProvidedToInitiatingFacility: false
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
