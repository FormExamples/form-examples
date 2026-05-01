import type { AssessmentData, ValidationResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			nhsNumber: ''
		},
		certificateType: '',
		preConfinement: {
			expectedDateOfConfinement: '',
			examinationDate: ''
		},
		postConfinement: {
			actualDateOfBirth: '',
			expectedDateOfConfinement: ''
		},
		issuer: {
			issuerType: '',
			doctor: {
				doctorName: '',
				practiceName: '',
				practiceAddress: '',
				stampApplied: ''
			},
			midwife: {
				midwifeName: '',
				nmcPin: '',
				nmcExpiryDate: ''
			},
			certificateNumber: '',
			issueDate: '',
			isDuplicate: '',
			duplicateMarkerApplied: '',
			completedInInk: ''
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
