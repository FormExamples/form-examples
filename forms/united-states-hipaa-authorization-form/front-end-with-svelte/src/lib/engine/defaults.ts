import type { HipaaAuthorization } from './types';

/** A blank HIPAA authorization with all fields at their unanswered defaults. */
export function createDefaultAuthorization(): HipaaAuthorization {
	return {
		patient: {
			name: '',
			birthDate: null,
			socialSecurityNumber: '',
			streetAddress: '',
			city: '',
			state: '',
			zipCode: '',
			phone: '',
			email: ''
		},
		signer: {
			relationship: '',
			representativeName: '',
			representativeAuthorityDescription: '',
			representativeAuthorityProofAttached: ''
		},
		disclosingSource: {
			identificationMode: '',
			specificPersonsOrOrganizations: '',
			classDescription: '',
			isVaFacility: '',
			isPart2Program: ''
		},
		authorizedRecipient: {
			recipientName: '',
			recipientOrganization: '',
			recipientRole: '',
			recipientAddress: '',
			recipientPhone: '',
			recipientEmail: '',
			recipientRelationshipToPatient: ''
		},
		recordsToDisclose: {
			includeMedicalHealth: '',
			medicalHealthInitials: '',
			includeMentalHealth: '',
			mentalHealthInitials: '',
			includeSubstanceUse: '',
			substanceUseInitials: '',
			part2RedisclosureNoticeIncluded: '',
			includeHivAids: '',
			hivAidsInitials: '',
			hivAidsStateConsentIncluded: '',
			includePsychotherapyNotes: '',
			includeGeneticInformation: '',
			includeReproductiveHealth: '',
			section7332NoticeIncluded: '',
			dateRangeSpecified: '',
			dateFrom: null,
			dateTo: null,
			otherDescription: ''
		},
		purposeOfDisclosure: {
			purposes: [],
			primaryPurpose: '',
			otherDetails: ''
		},
		expiration: {
			kind: '',
			expirationDate: null,
			expirationEvent: '',
			durationMonths: null,
			durationLabel: ''
		},
		patientRightsAcknowledgement: {
			acknowledgedRightToRevoke: '',
			acknowledgedRevocationProcedure: '',
			acknowledgedNoConditioning: '',
			acknowledgedRedisclosureWarning: '',
			acknowledgedRightToCopy: '',
			acknowledgedRightToInspectDisclosed: ''
		},
		signatureWitness: {
			individualSignatureConfirmed: '',
			individualSignatureImageUri: '',
			signatureDate: null,
			signedAtLocation: '',
			parentGuardianCoSignatureRequired: '',
			parentGuardianName: '',
			parentGuardianSignatureConfirmed: '',
			parentGuardianSignatureDate: null,
			witnessName: '',
			witnessSignatureConfirmed: '',
			witnessDate: null,
			witnessRole: ''
		}
	};
}
