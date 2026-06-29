// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoUnsure = 'yes' | 'no' | 'unsure' | '';
export type Sex = 'male' | 'female' | 'other' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	ageYears: number | null;
	preferredLanguage: string;
	firstLanguage: string;
	handedness: 'right' | 'left' | 'ambidextrous' | '';
	referralSource: string;
	referralReason: string;
}

export interface DevelopmentalHistory {
	pregnancyComplications: YesNoUnsure;
	pregnancyDetails: string;
	birthComplications: YesNoUnsure;
	birthDetails: string;
	earlyMilestones: string;
	speechDelay: YesNoUnsure;
	languageDelay: YesNoUnsure;
	hearingProblems: YesNoUnsure;
	visionProblems: YesNoUnsure;
	familyHistoryDyslexia: YesNoUnsure;
	familyHistoryDetails: string;
	otherDevelopmentalNotes: string;
}

export interface EducationalBackground {
	schoolType:
		| 'state-primary'
		| 'state-secondary'
		| 'independent'
		| 'special'
		| 'home-educated'
		| 'further-education'
		| 'higher-education'
		| 'other'
		| '';
	currentYearGroup: string;
	schoolChanges: YesNoUnsure;
	schoolChangeCount: number | null;
	attendanceIssues: YesNoUnsure;
	attendanceDetails: string;
	eslLearner: YesNoUnsure;
	academicStrengths: string;
	academicWeaknesses: string;
	previousAssessments: YesNoUnsure;
	previousAssessmentDetails: string;
}

export interface ReadingAssessment {
	readingFluencyScore: number | null;
	readingComprehensionScore: number | null;
	difficultyDecoding: YesNo;
	difficultyComprehension: YesNo;
	avoidsReading: YesNo;
	slowReadingSpeed: YesNo;
	losesPlaceWhenReading: YesNo;
	readingNotes: string;
}

export interface WritingSpelling {
	spellingAccuracyScore: number | null;
	writtenExpressionScore: number | null;
	difficultySpelling: YesNo;
	difficultyHandwriting: YesNo;
	difficultyOrganisingIdeas: YesNo;
	omitsLettersOrWords: YesNo;
	reversesLettersOrNumbers: YesNo;
	writingNotes: string;
}

export interface PhonologicalProcessing {
	phonologicalAwarenessScore: number | null;
	phonologicalMemoryScore: number | null;
	rapidNamingScore: number | null;
	difficultyRhyming: YesNo;
	difficultySegmentingSounds: YesNo;
	difficultyBlendingSounds: YesNo;
	difficultyLearningLetterSounds: YesNo;
	phonologicalNotes: string;
}

export interface WorkingMemoryProcessingSpeed {
	workingMemoryScore: number | null;
	processingSpeedScore: number | null;
	difficultyFollowingInstructions: YesNo;
	difficultyRememberingSequences: YesNo;
	slowToCompleteTasks: YesNo;
	difficultyTakingNotes: YesNo;
	memoryNotes: string;
}

export interface EmotionalBehavioural {
	lowSelfEsteem: YesNo;
	anxietyAboutSchool: YesNo;
	avoidanceBehaviour: YesNo;
	frustrationWithLearning: YesNo;
	peerRelationshipDifficulties: YesNo;
	sleepDisturbance: YesNo;
	mentalHealthConcerns: YesNo;
	mentalHealthDetails: string;
	behaviouralNotes: string;
}

export interface PreviousSupport {
	previousIntervention: YesNo;
	interventionTypes: string;
	currentEhcpOrIep: YesNo;
	ehcpDetails: string;
	accessArrangements: YesNo;
	accessArrangementsList: string[];
	tutorialSupport: YesNo;
	assistiveTechnologyUsed: YesNo;
	assistiveTechnologyDetails: string;
	previousSupportNotes: string;
}

export interface RecommendationsSupportPlan {
	recommendedSupports: string[];
	structuredLiteracyRecommended: YesNo;
	assistiveTechRecommended: YesNo;
	extraTimeRecommended: YesNo;
	specialistAssessmentRecommended: YesNo;
	parentTrainingRecommended: YesNo;
	keyGoals: string;
	reviewTimeframe: string;
	additionalRecommendations: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	developmentalHistory: DevelopmentalHistory;
	educationalBackground: EducationalBackground;
	readingAssessment: ReadingAssessment;
	writingSpelling: WritingSpelling;
	phonologicalProcessing: PhonologicalProcessing;
	workingMemoryProcessingSpeed: WorkingMemoryProcessingSpeed;
	emotionalBehavioural: EmotionalBehavioural;
	previousSupport: PreviousSupport;
	recommendationsSupportPlan: RecommendationsSupportPlan;
}

// ──────────────────────────────────────────────
// Dyslexia grading types
// ──────────────────────────────────────────────

/** Severity band derived from a standardised score (mean 100, SD 15). */
export type Severity = 'none' | 'mild' | 'moderate' | 'severe';

/** One domain projected by a rule, plus its classified severity. */
export interface DomainScore {
	id: string;
	category: string;
	description: string;
	score: number | null;
	severity: Severity;
}

export interface DyslexiaRule {
	id: string;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => number | null;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	overallSeverity: Severity;
	lowestScore: number | null;
	answeredCount: number;
	domainScores: DomainScore[];
	additionalFlags: AdditionalFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}
