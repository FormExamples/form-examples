import type { AssessmentData, ValidationResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			address: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				gpName: '',
				surgeryName: '',
				address: '',
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
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		diagnosisConfirmation: {
			hasMentalHealthDiagnosis: ''
		},
		mentalHealthConditions: {
			anxietyDepressionWithoutImpairment: '',
			anxietyDepressionWithImpairment: '',
			bipolarAffectiveDisorder: '',
			eatingDisorder: '',
			ocdOrPtsd: '',
			personalityDisorder: '',
			schizophreniaOrPsychosis: '',
			other: '',
			otherDetails: ''
		},
		recentContact: {
			hadRecentContact: '',
			doctorLastDate: '',
			consultantLastDate: '',
			communityPsychiatricNurseLastDate: ''
		},
		authorisation: {
			declarationConfirmed: '',
			signatoryName: '',
			signatureText: '',
			signatureDate: '',
			electronicCorrespondenceConsent: '',
			dvlaContactPreference: '',
			healthcareProfessionalContactPreference: ''
		}
	};
}

class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<ValidationResult | null>(null);
	currentStep = $state(1);

	reset() {
		this.data = createDefaultAssessment();
		this.result = null;
		this.currentStep = 1;
	}
}

export const assessment = new AssessmentStore();
