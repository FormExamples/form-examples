import type { AssessmentData } from './types';

/** A blank learning-disability assessment with all fields at unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			nhsNumber: '',
			gpPractice: '',
			preferredName: '',
			ethnicity: ''
		},
		carerSupport: {
			primaryCarerName: '',
			primaryCarerRelationship: '',
			primaryCarerPhone: '',
			livesWithCarer: '',
			livingArrangement: '',
			hasSupportPlan: '',
			hasSocialWorker: '',
			socialWorkerName: '',
			otherSupports: ''
		},
		communicationNeeds: {
			usesEasyRead: '',
			usesMakaton: '',
			usesAac: '',
			aacDetails: '',
			usesPictures: '',
			needsInterpreter: '',
			interpreterLanguage: '',
			verbalAbility: '',
			preferredCommunicationMethod: '',
			communicationNotes: ''
		},
		medicalReview: {
			hasEpilepsy: '',
			lastSeizureDate: '',
			seizuresPerMonth: null,
			hasMentalHealthDiagnosis: '',
			mentalHealthDetails: '',
			takesPsychotropic: '',
			stompReviewDone: '',
			currentMedications: '',
			hasDysphagia: '',
			hasConstipation: '',
			hasIncontinence: '',
			hasSleepProblems: '',
			otherMedicalIssues: ''
		},
		physicalExamination: {
			weight: null,
			height: null,
			bmi: null,
			bloodPressureSystolic: null,
			bloodPressureDiastolic: null,
			pulse: null,
			visionChecked: '',
			visionDate: '',
			hearingChecked: '',
			hearingDate: '',
			dentalChecked: '',
			dentalDate: '',
			vaccinationsUpToDate: '',
			cervicalScreening: '',
			breastScreening: '',
			bowelScreening: ''
		},
		adaptiveFunctioning: {
			conceptualLanguage: '',
			conceptualReadingWriting: '',
			conceptualMoneyTime: '',
			socialFriendships: '',
			socialEmpathy: '',
			socialCommunication: '',
			practicalSelfCare: '',
			practicalHomeLiving: '',
			practicalCommunity: '',
			practicalWorkSchool: ''
		},
		behaviouralConcerns: {
			selfInjurious: '',
			aggression: '',
			propertyDamage: '',
			absconding: '',
			sexualisedBehaviour: '',
			knownTriggers: '',
			calmingStrategies: '',
			hasBehaviourSupportPlan: '',
			usesPrn: '',
			prnDetails: ''
		},
		mentalCapacityConsent: {
			canConsentToHealthCheck: '',
			canConsentToMedication: '',
			canConsentToFinances: '',
			hasLpa: '',
			lpaDetails: '',
			hasDols: '',
			bestInterestsRequired: '',
			bestInterestsNotes: ''
		},
		reasonableAdjustments: {
			needsLongerAppointments: '',
			needsQuietRoom: '',
			needsFamiliarStaff: '',
			needsEasyReadLetters: '',
			needsHomeVisits: '',
			needsDoubleAppointment: '',
			flagOnRecord: '',
			otherAdjustments: ''
		},
		healthActionPlan: {
			actions: [],
			nextReviewDate: '',
			sharedWith: '',
			planNotes: ''
		}
	};
}
