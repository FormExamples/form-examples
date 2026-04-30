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
				name: '',
				surgeryName: '',
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			},
			consultant: {
				name: '',
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
		eyesightStandards: { meetsStandard: '' },
		visionInBothEyes: {
			hasVisionInBothEyes: '',
			whichEye: '',
			duration: '',
			adaptation: '',
			monocularDeclarationConfirmed: false
		},
		fieldOfVision: {
			hasProblem: '',
			causedSolelyByEyeCondition: '',
			cause: '',
			causeOtherDetails: ''
		},
		glaucoma: { hasCondition: '', whichEyes: '' },
		retinitisPigmentosa: { hasCondition: '', whichEyes: '' },
		laserTreatment: {
			hasHadTreatment: '',
			leftEyeFirstDate: '',
			rightEyeFirstDate: '',
			leftEyeLastDate: '',
			rightEyeLastDate: ''
		},
		blepharospasm: {
			hasCondition: '',
			whichEyes: '',
			hasHadTreatment: '',
			adequatelyControlled: ''
		},
		nightBlindness: { hasCondition: '', whichEyes: '' },
		doubleVision: {
			hasCondition: '',
			controlled: '',
			sameForSixMonthsOrMore: '',
			doubleVisionDeclarationConfirmed: false,
			declarationSignatureName: '',
			declarationDate: ''
		},
		otherVisionConditions: { hasOther: '', details: '' },
		recentContact: { hadContact: '', dateOfContact: '' },
		authorisation: {
			declarationConfirmed: false,
			name: '',
			signature: '',
			date: '',
			authoriseElectronicCorrespondence: '',
			contactPreferenceFromHealthcareProfessional: '',
			contactPreferenceFromDvla: ''
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
