import type { AssessmentData, GradingResult } from '$lib/engine/types';

function createDefaultAssessment(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			occupation: ''
		},
		reasonForAssessment: {
			reason: '',
			reasonDetails: '',
			primaryConcern: '',
			symptomDurationWeeks: null
		},
		dassDepression: {
			item3CouldNotExperiencePositive: null,
			item5DifficultInitiating: null,
			item10NothingToLookForwardTo: null,
			item13DownheartedBlue: null,
			item16UnableToBecomeEnthusiastic: null,
			item17NotWorthMuch: null,
			item21LifeMeaningless: null
		},
		dassAnxiety: {
			item2DrynessOfMouth: null,
			item4BreathingDifficulty: null,
			item7Trembling: null,
			item9PanicWorry: null,
			item15ClosedToPanic: null,
			item19HeartActionAware: null,
			item20ScaredWithoutReason: null
		},
		dassStress: {
			item1HardToWindDown: null,
			item6OverReact: null,
			item8NervousEnergy: null,
			item11AgitatedEasily: null,
			item12DifficultToRelax: null,
			item14Intolerant: null,
			item18TouchyEasily: null
		},
		functionalImpact: {
			workImpact: '',
			relationshipImpact: '',
			dailyActivitiesImpact: '',
			sleepImpact: '',
			notes: ''
		},
		riskScreen: {
			suicidalIdeation: '',
			suicidalIdeationDetails: '',
			selfHarm: '',
			harmToOthers: '',
			psychiatricEmergencyHistory: '',
			hasSafetyPlan: ''
		},
		supportAndHistory: {
			previousMentalHealthCare: '',
			previousMentalHealthDetails: '',
			currentlyInTreatment: '',
			currentTreatmentDetails: '',
			currentMedications: '',
			familyMentalHealthHistory: '',
			familyMentalHealthDetails: '',
			socialSupport: '',
			substanceUseConcern: ''
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
