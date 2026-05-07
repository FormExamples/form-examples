import type { AssessmentData, GradingResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		patientDetails: {
			givenName: '',
			familyName: '',
			dateOfBirth: '',
			nhsNumber: '',
			sex: ''
		},
		encounterDetails: {
			clinicDate: '',
			specialty: '',
			clinicianName: '',
			modality: '',
			appointmentType: ''
		},
		operationalEfficiency: {
			referralDate: '',
			appointmentDate: '',
			waitTimeDays: null,
			serviceTargetDays: null,
			nhsAttendanceOutcome: ''
		},
		clinicalOutcome: {
			presentingComplaint: '',
			diagnosis: '',
			treatmentDelivered: '',
			outcomeClassification: ''
		},
		promEq5d5l: {
			beforeMobility: null,
			beforeSelfCare: null,
			beforeUsualActivities: null,
			beforePainDiscomfort: null,
			beforeAnxietyDepression: null,
			beforeVas: null,
			afterMobility: null,
			afterSelfCare: null,
			afterUsualActivities: null,
			afterPainDiscomfort: null,
			afterAnxietyDepression: null,
			afterVas: null
		},
		promGrc: {
			globalRatingOfChange: null,
			selfRatedHealth: ''
		},
		promPromis: {
			item1GeneralHealth: null,
			item2QualityOfLife: null,
			item3PhysicalHealth: null,
			item4MentalHealth: null,
			item5Satisfaction: null,
			item6FatigueFrequency: null,
			item7EmotionalProblems: null,
			item8SocialActivities: null,
			item9Pain: null,
			item10EverydayActivities: null,
			globalPhysicalHealthTScore: null,
			globalMentalHealthTScore: null
		},
		premFft: {
			fftResponse: '',
			fftComment: ''
		},
		followupPlan: {
			disposition: '',
			nextAppointmentDate: '',
			onwardReferralSpecialty: '',
			followupNotes: ''
		},
		signOff: {
			reportingClinicianName: '',
			reportingClinicianRole: '',
			signedOffAt: ''
		}
	};
}

class AssessmentStore {
	data = $state<AssessmentData>(createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);

	reset() {
		this.data = createDefaultAssessment();
		this.result = null;
		this.currentStep = 1;
	}
}

export const assessment = new AssessmentStore();
