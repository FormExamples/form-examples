import type { AssessmentData, ProviderDetails } from './types';

/** Empty provider-details block with all fields at their unanswered defaults. */
export function emptyProviderDetails(): ProviderDetails {
	return {
		clinicianName: '',
		clinicianRole: '',
		organisation: '',
		ward: '',
		phone: '',
		email: '',
		registrationBody: '',
		registrationNumber: ''
	};
}

/**
 * A blank provider transfer request with all fields at their unanswered
 * defaults. Kept in a pure (runes-free) module so it can be imported by the
 * store, the sample data, and the Vitest unit tests alike.
 */
export function createDefaultAssessment(): AssessmentData {
	return {
		requestingProvider: emptyProviderDetails(),
		receivingProvider: emptyProviderDetails(),
		patientDemographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsNumber: '',
			hospitalNumber: '',
			addressLine: '',
			postcode: '',
			nextOfKinName: '',
			nextOfKinPhone: ''
		},
		situation: {
			reasonForTransfer: '',
			primaryDiagnosis: '',
			urgency: '',
			transferType: '',
			requestedDateTime: ''
		},
		background: {
			presentingComplaint: '',
			relevantHistory: '',
			pastMedicalHistory: '',
			currentMedications: '',
			allergies: '',
			recentInvestigations: '',
			infectionStatus: ''
		},
		assessment: {
			currentClinicalStatus: '',
			consciousLevel: '',
			vitalSigns: {
				heartRate: null,
				respiratoryRate: null,
				systolicBloodPressure: null,
				diastolicBloodPressure: null,
				temperatureCelsius: null,
				oxygenSaturation: null,
				newsScore: null
			},
			clinicallyStable: '',
			stabilityNotes: ''
		},
		recommendation: {
			requestedAction: '',
			expectedOutcomes: '',
			ongoingCarePlan: '',
			pendingResults: ''
		},
		transferLogistics: {
			transportMode: '',
			departureDateTime: '',
			estimatedArrivalDateTime: '',
			escortRequired: false,
			escortDetails: '',
			oxygenRequired: false,
			cardiacMonitoringRequired: false,
			infectiousPrecautions: false,
			infectiousPrecautionsDetails: '',
			fallsRisk: false,
			mentalCapacityConcerns: false,
			equipmentRequired: ''
		},
		signoffAcknowledgement: {
			requestingProviderSignature: '',
			requestingProviderSignatureDate: '',
			receivingProviderName: '',
			receivingProviderSignature: '',
			receivingProviderSignatureDate: '',
			acknowledgementReceived: false,
			acknowledgementNotes: ''
		}
	};
}
