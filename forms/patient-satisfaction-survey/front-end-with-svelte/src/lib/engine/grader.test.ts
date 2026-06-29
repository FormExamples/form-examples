import { describe, it, expect } from 'vitest';
import { calculateSatisfactionGrade } from './grader';
import { detectAdditionalFlags } from './flagged-issues';
import { satisfactionRules } from './rules';
import { normalizeLikertScores, categorizeScore } from './utils';
import type { AssessmentData } from './types';

/** A fully-blank survey: strings '', numerics null. */
function emptySurvey(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			ageRange: '',
			ethnicity: '',
			preferredLanguage: '',
			interpreterRequired: ''
		},
		visitDetails: {
			visitDate: '',
			visitType: '',
			department: '',
			hospitalSite: '',
			lengthOfStayDays: null,
			referralSource: '',
			isFirstVisit: ''
		},
		accessWaitingTimes: {
			easeOfBooking: null,
			waitingTimeForAppointment: null,
			waitingTimeOnDay: null,
			receptionService: null,
			signageWayfinding: null,
			parkingTransport: null,
			actualWaitMinutes: null
		},
		communicationInformation: {
			explanationOfCondition: null,
			explanationOfTreatment: null,
			opportunityToAskQuestions: null,
			listenedTo: null,
			informedAboutMedication: null,
			writtenInformationQuality: null
		},
		clinicalCareQuality: {
			confidenceInClinician: null,
			thoroughnessOfExamination: null,
			painManagement: null,
			involvementInDecisions: null,
			privacyDuringExamination: null,
			coordinationOfCare: null
		},
		staffAttitude: {
			doctorCourtesy: null,
			nurseCourtesy: null,
			receptionCourtesy: null,
			respectForDignity: null,
			culturalSensitivity: null,
			emotionalSupport: null
		},
		environmentFacilities: {
			cleanliness: null,
			comfort: null,
			noiseLevels: null,
			foodQuality: null,
			toiletFacilities: null,
			temperatureComfort: null
		},
		dischargeFollowUp: {
			dischargeInformation: null,
			medicationExplanation: null,
			followUpArrangements: null,
			knewWhoToContact: null,
			recoveryInformation: null,
			carePlanClarity: null
		},
		overallExperience: {
			overallSatisfaction: null,
			wouldRecommend: null,
			metExpectations: null,
			feltSafe: null,
			wouldReturn: null,
			nhsRating: null
		},
		commentsSuggestions: {
			whatWentWell: '',
			whatCouldImprove: '',
			specificStaffPraise: '',
			complaintRaised: '',
			complaintDetails: '',
			additionalComments: '',
			consentToContact: '',
			contactEmail: '',
			contactPhone: ''
		}
	};
}

/** Set every Likert item in every rated domain to a single value. */
function setAllLikert(data: AssessmentData, score: number): AssessmentData {
	const domains = [
		'accessWaitingTimes',
		'communicationInformation',
		'clinicalCareQuality',
		'staffAttitude',
		'environmentFacilities',
		'dischargeFollowUp',
		'overallExperience'
	] as const;
	for (const dom of domains) {
		const section = data[dom] as unknown as Record<string, number | null>;
		for (const key of Object.keys(section)) {
			if (key === 'actualWaitMinutes' || key === 'nhsRating') continue;
			section[key] = score;
		}
	}
	return data;
}

describe('normalizeLikertScores', () => {
	it('returns null when there are no valid scores', () => {
		expect(normalizeLikertScores([null, null])).toBeNull();
	});

	it('normalizes a perfect set to 100', () => {
		expect(normalizeLikertScores([5, 5, 5])).toBe(100);
	});

	it('normalizes a worst-case set to 20', () => {
		expect(normalizeLikertScores([1, 1, 1])).toBe(20);
	});
});

describe('categorizeScore', () => {
	it('maps score bands to categories', () => {
		expect(categorizeScore(95)).toBe('excellent');
		expect(categorizeScore(75)).toBe('good');
		expect(categorizeScore(55)).toBe('satisfactory');
		expect(categorizeScore(30)).toBe('poor');
		expect(categorizeScore(10)).toBe('very-poor');
	});
});

describe('Patient Satisfaction Grading Engine', () => {
	it('grades a fully-satisfied survey as excellent with no fired rules', () => {
		const data = setAllLikert(emptySurvey(), 5);
		const result = calculateSatisfactionGrade(data);
		expect(result.normalizedScore).toBe(100);
		expect(result.satisfactionCategory).toBe('excellent');
		expect(result.firedRules).toHaveLength(0);
	});

	it('grades a fully-dissatisfied survey as very-poor with fired rules', () => {
		const data = setAllLikert(emptySurvey(), 1);
		const result = calculateSatisfactionGrade(data);
		expect(result.normalizedScore).toBe(20);
		expect(result.satisfactionCategory).toBe('very-poor');
		expect(result.firedRules.length).toBeGreaterThan(0);
	});

	it('computes domain scores per care domain', () => {
		const data = setAllLikert(emptySurvey(), 4);
		const result = calculateSatisfactionGrade(data);
		expect(result.domainScores.access).toBe(80);
		expect(result.domainScores.staff).toBe(80);
	});

	it('detects all rule IDs are unique', () => {
		const ids = satisfactionRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Patient Satisfaction Flagged Issues Detection', () => {
	it('returns no flags for a blank survey', () => {
		const flags = detectAdditionalFlags(emptySurvey());
		expect(flags).toHaveLength(0);
	});

	it('flags a patient who did not feel safe', () => {
		const data = emptySurvey();
		data.overallExperience.feltSafe = 1;
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-SAFETY-001')).toBe(true);
	});

	it('flags a formal complaint', () => {
		const data = emptySurvey();
		data.commentsSuggestions.complaintRaised = 'yes';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-COMPLAINT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const data = emptySurvey();
		data.overallExperience.feltSafe = 1;
		data.accessWaitingTimes.actualWaitMinutes = 120;
		const flags = detectAdditionalFlags(data);
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
