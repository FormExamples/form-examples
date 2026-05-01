import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		patientIdentification: {
			patientName: '',
			dateOfBirth: '',
			age: null,
			sex: '',
			patientContactInformation: '',
			contactPerson: { name: '', contactInformation: '' }
		},
		referralTransport: {
			referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
			ambulance: { name: '', focalPoint: '', phoneNumber: '' },
			eventDateTime: '',
			departureDateTime: ''
		},
		situation: {
			medical: false,
			trauma: false,
			pregnant: '',
			whatHappened: ''
		},
		background: {
			pastMedicalAndSurgicalHistory: '',
			currentMedicationsOrAllergies: ''
		},
		majorBleeding: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				directPressure: false,
				deepWoundPacking: false,
				tourniquet: false,
				tourniquetApplicationTime: '',
				uterineMassage: false,
				none: false
			}
		},
		airway: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				neckImmobilization: false,
				headTiltChinLift: false,
				jawThrust: false,
				chokingCare: false,
				none: false
			}
		},
		breathing: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				maintainedPositionOfComfort: false,
				none: false
			}
		},
		circulation: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				pelvicBinder: false,
				controlMinorBleeding: false,
				fractureCare: false,
				oralHydration: false,
				leftLateralPosition: false,
				none: false
			}
		},
		disability: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				spinalImmobilisation: false,
				glucoseGiven: false,
				seizureCare: false,
				highTemperatureCare: false,
				lowTemperatureCare: false,
				none: false
			}
		},
		exposure: {
			assessmentNormal: false,
			assessmentFindings: '',
			interventions: {
				recoveryPosition: false,
				burnCare: false,
				woundCare: false,
				drowningCare: false,
				snakebiteCare: false,
				none: false
			},
			medicationTakenNone: false,
			medicationTakenDetails: ''
		},
		recommendations: {
			transportPlan: '',
			problemsAnticipated: '',
			otherConcerns: '',
			precautions: {
				highlyInfectiousDisease: false,
				spinalImmobilization: false,
				possibleFracture: false,
				fallRisk: false,
				alteredMentalStatus: false,
				other: false,
				otherDetails: ''
			}
		},
		responderDetails: {
			name: '',
			signature: '',
			contactInformation: '',
			cfarOrganization: ''
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
