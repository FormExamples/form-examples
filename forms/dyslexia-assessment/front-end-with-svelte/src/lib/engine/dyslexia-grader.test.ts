import { describe, it, expect } from 'vitest';
import { gradeDyslexia } from './dyslexia-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { dyslexiaRules } from './dyslexia-rules';
import { scoreSeverity, scoreBandLabel } from './utils';
import type { AssessmentData } from './types';

// A fresh, fully-blank assessment built inline. The store's
// createDefaultAssessment() is identical, but importing the store pulls in
// `$app/environment`, which is not resolvable in a plain Vitest run.
function base(): AssessmentData {
	return {
		demographics: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			sex: '',
			ageYears: null,
			preferredLanguage: '',
			firstLanguage: '',
			handedness: '',
			referralSource: '',
			referralReason: ''
		},
		developmentalHistory: {
			pregnancyComplications: '',
			pregnancyDetails: '',
			birthComplications: '',
			birthDetails: '',
			earlyMilestones: '',
			speechDelay: '',
			languageDelay: '',
			hearingProblems: '',
			visionProblems: '',
			familyHistoryDyslexia: '',
			familyHistoryDetails: '',
			otherDevelopmentalNotes: ''
		},
		educationalBackground: {
			schoolType: '',
			currentYearGroup: '',
			schoolChanges: '',
			schoolChangeCount: null,
			attendanceIssues: '',
			attendanceDetails: '',
			eslLearner: '',
			academicStrengths: '',
			academicWeaknesses: '',
			previousAssessments: '',
			previousAssessmentDetails: ''
		},
		readingAssessment: {
			readingFluencyScore: null,
			readingComprehensionScore: null,
			difficultyDecoding: '',
			difficultyComprehension: '',
			avoidsReading: '',
			slowReadingSpeed: '',
			losesPlaceWhenReading: '',
			readingNotes: ''
		},
		writingSpelling: {
			spellingAccuracyScore: null,
			writtenExpressionScore: null,
			difficultySpelling: '',
			difficultyHandwriting: '',
			difficultyOrganisingIdeas: '',
			omitsLettersOrWords: '',
			reversesLettersOrNumbers: '',
			writingNotes: ''
		},
		phonologicalProcessing: {
			phonologicalAwarenessScore: null,
			phonologicalMemoryScore: null,
			rapidNamingScore: null,
			difficultyRhyming: '',
			difficultySegmentingSounds: '',
			difficultyBlendingSounds: '',
			difficultyLearningLetterSounds: '',
			phonologicalNotes: ''
		},
		workingMemoryProcessingSpeed: {
			workingMemoryScore: null,
			processingSpeedScore: null,
			difficultyFollowingInstructions: '',
			difficultyRememberingSequences: '',
			slowToCompleteTasks: '',
			difficultyTakingNotes: '',
			memoryNotes: ''
		},
		emotionalBehavioural: {
			lowSelfEsteem: '',
			anxietyAboutSchool: '',
			avoidanceBehaviour: '',
			frustrationWithLearning: '',
			peerRelationshipDifficulties: '',
			sleepDisturbance: '',
			mentalHealthConcerns: '',
			mentalHealthDetails: '',
			behaviouralNotes: ''
		},
		previousSupport: {
			previousIntervention: '',
			interventionTypes: '',
			currentEhcpOrIep: '',
			ehcpDetails: '',
			accessArrangements: '',
			accessArrangementsList: [],
			tutorialSupport: '',
			assistiveTechnologyUsed: '',
			assistiveTechnologyDetails: '',
			previousSupportNotes: ''
		},
		recommendationsSupportPlan: {
			recommendedSupports: [],
			structuredLiteracyRecommended: '',
			assistiveTechRecommended: '',
			extraTimeRecommended: '',
			specialistAssessmentRecommended: '',
			parentTrainingRecommended: '',
			keyGoals: '',
			reviewTimeframe: '',
			additionalRecommendations: ''
		}
	};
}

describe('scoreSeverity', () => {
	it('classifies standardised scores into bands', () => {
		expect(scoreSeverity(110)).toBe('none');
		expect(scoreSeverity(85)).toBe('none');
		expect(scoreSeverity(84)).toBe('mild');
		expect(scoreSeverity(70)).toBe('mild');
		expect(scoreSeverity(69)).toBe('moderate');
		expect(scoreSeverity(55)).toBe('moderate');
		expect(scoreSeverity(54)).toBe('severe');
		expect(scoreSeverity(null)).toBe('none');
	});

	it('labels score bands', () => {
		expect(scoreBandLabel(120)).toBe('Above average');
		expect(scoreBandLabel(100)).toBe('Average');
		expect(scoreBandLabel(75)).toBe('Below average');
		expect(scoreBandLabel(60)).toBe('Well below average');
		expect(scoreBandLabel(50)).toBe('Significantly below average');
		expect(scoreBandLabel(null)).toBe('');
	});
});

describe('Dyslexia Grading Engine', () => {
	it('returns no dyslexia when no scores are entered', () => {
		const result = gradeDyslexia(base());
		expect(result.overallSeverity).toBe('none');
		expect(result.lowestScore).toBeNull();
		expect(result.answeredCount).toBe(0);
		expect(result.domainScores).toHaveLength(dyslexiaRules.length);
	});

	it('returns no dyslexia for all-average scores', () => {
		const d = base();
		d.readingAssessment.readingFluencyScore = 100;
		d.writingSpelling.spellingAccuracyScore = 95;
		const result = gradeDyslexia(d);
		expect(result.overallSeverity).toBe('none');
		expect(result.answeredCount).toBe(2);
		expect(result.lowestScore).toBe(95);
	});

	it('returns mild for a below-average reading fluency score', () => {
		const d = base();
		d.readingAssessment.readingFluencyScore = 78;
		const result = gradeDyslexia(d);
		expect(result.overallSeverity).toBe('mild');
		expect(result.lowestScore).toBe(78);
	});

	it('returns moderate for a well-below-average score', () => {
		const d = base();
		d.phonologicalProcessing.phonologicalAwarenessScore = 62;
		const result = gradeDyslexia(d);
		expect(result.overallSeverity).toBe('moderate');
		expect(result.lowestScore).toBe(62);
	});

	it('drives overall severity off the lowest (most-impaired) score', () => {
		const d = base();
		d.readingAssessment.readingFluencyScore = 100;
		d.writingSpelling.spellingAccuracyScore = 50;
		const result = gradeDyslexia(d);
		expect(result.overallSeverity).toBe('severe');
		expect(result.lowestScore).toBe(50);
		expect(result.answeredCount).toBe(2);
	});

	it('keeps all rule IDs unique', () => {
		const ids = dyslexiaRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Dyslexia Flagged Issues Detection', () => {
	it('returns no flags for an empty assessment', () => {
		expect(detectAdditionalFlags(base())).toHaveLength(0);
	});

	it('flags a severe reading fluency score', () => {
		const d = base();
		d.readingAssessment.readingFluencyScore = 50;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-READ-001')).toBe(true);
	});

	it('flags reported hearing problems', () => {
		const d = base();
		d.developmentalHistory.hearingProblems = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-DEV-001')).toBe(true);
	});

	it('flags family history of dyslexia', () => {
		const d = base();
		d.developmentalHistory.familyHistoryDyslexia = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-DEV-005')).toBe(true);
	});

	it('flags mental health concerns as high priority', () => {
		const d = base();
		d.emotionalBehavioural.mentalHealthConcerns = 'yes';
		const flags = detectAdditionalFlags(d);
		const flag = flags.find((f) => f.id === 'FLAG-EMOT-004');
		expect(flag?.priority).toBe('high');
	});

	it('sorts flags by priority (high first)', () => {
		const d = base();
		d.readingAssessment.readingFluencyScore = 50; // high
		d.writingSpelling.reversesLettersOrNumbers = 'yes'; // low
		d.developmentalHistory.speechDelay = 'yes'; // medium
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => order[f.priority]);
		const sorted = [...priorities].sort((a, b) => a - b);
		expect(priorities).toEqual(sorted);
	});
});
