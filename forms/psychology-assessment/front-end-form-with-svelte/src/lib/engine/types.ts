// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'other' | 'prefer-not-to-say' | '';
export type YesNo = 'yes' | 'no' | '';

/** DASS-21 item response: 0=Did not apply, 1=Some/sometimes, 2=Considerable/often, 3=Very much/most. */
export type DassItem = 0 | 1 | 2 | 3 | null;

/** DASS-21 severity category for a subscale. */
export type DassSeverity =
	| 'normal'
	| 'mild'
	| 'moderate'
	| 'severe'
	| 'extremely-severe';

/** Reason for assessment selector. */
export type AssessmentReason =
	| 'self-referral'
	| 'gp-referral'
	| 'employer-referral'
	| 'follow-up'
	| 'screening'
	| 'other'
	| '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	occupation: string;
}

export interface ReasonForAssessment {
	reason: AssessmentReason;
	reasonDetails: string;
	primaryConcern: string;
	symptomDurationWeeks: number | null;
}

/** DASS-21 Depression subscale items (3, 5, 10, 13, 16, 17, 21). */
export interface DassDepression {
	item3CouldNotExperiencePositive: DassItem;
	item5DifficultInitiating: DassItem;
	item10NothingToLookForwardTo: DassItem;
	item13DownheartedBlue: DassItem;
	item16UnableToBecomeEnthusiastic: DassItem;
	item17NotWorthMuch: DassItem;
	item21LifeMeaningless: DassItem;
}

/** DASS-21 Anxiety subscale items (2, 4, 7, 9, 15, 19, 20). */
export interface DassAnxiety {
	item2DrynessOfMouth: DassItem;
	item4BreathingDifficulty: DassItem;
	item7Trembling: DassItem;
	item9PanicWorry: DassItem;
	item15ClosedToPanic: DassItem;
	item19HeartActionAware: DassItem;
	item20ScaredWithoutReason: DassItem;
}

/** DASS-21 Stress subscale items (1, 6, 8, 11, 12, 14, 18). */
export interface DassStress {
	item1HardToWindDown: DassItem;
	item6OverReact: DassItem;
	item8NervousEnergy: DassItem;
	item11AgitatedEasily: DassItem;
	item12DifficultToRelax: DassItem;
	item14Intolerant: DassItem;
	item18TouchyEasily: DassItem;
}

export interface FunctionalImpact {
	workImpact: 'none' | 'mild' | 'moderate' | 'severe' | '';
	relationshipImpact: 'none' | 'mild' | 'moderate' | 'severe' | '';
	dailyActivitiesImpact: 'none' | 'mild' | 'moderate' | 'severe' | '';
	sleepImpact: 'none' | 'mild' | 'moderate' | 'severe' | '';
	notes: string;
}

export interface RiskScreen {
	suicidalIdeation: YesNo;
	suicidalIdeationDetails: string;
	selfHarm: YesNo;
	harmToOthers: YesNo;
	psychiatricEmergencyHistory: YesNo;
	hasSafetyPlan: YesNo;
}

export interface SupportAndHistory {
	previousMentalHealthCare: YesNo;
	previousMentalHealthDetails: string;
	currentlyInTreatment: YesNo;
	currentTreatmentDetails: string;
	currentMedications: string;
	familyMentalHealthHistory: YesNo;
	familyMentalHealthDetails: string;
	socialSupport: 'strong' | 'adequate' | 'limited' | 'isolated' | '';
	substanceUseConcern: YesNo;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	reasonForAssessment: ReasonForAssessment;
	dassDepression: DassDepression;
	dassAnxiety: DassAnxiety;
	dassStress: DassStress;
	functionalImpact: FunctionalImpact;
	riskScreen: RiskScreen;
	supportAndHistory: SupportAndHistory;
}

// ──────────────────────────────────────────────
// DASS-21 scoring types
// ──────────────────────────────────────────────

export interface SubscaleScore {
	/** Sum of the 7 raw item scores (0–21). */
	raw: number;
	/** Doubled raw score, aligning with DASS-42 norms (0–42). */
	scaled: number;
	/** Severity category derived from `scaled`. */
	severity: DassSeverity;
	/** Number of items answered out of 7. */
	answered: number;
}

export interface DassRule {
	id: string;
	subscale: 'depression' | 'anxiety' | 'stress';
	itemNumber: number;
	description: string;
	evaluate: (data: AssessmentData) => DassItem;
}

export interface FiredRule {
	id: string;
	subscale: 'depression' | 'anxiety' | 'stress';
	itemNumber: number;
	description: string;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	depression: SubscaleScore;
	anxiety: SubscaleScore;
	stress: SubscaleScore;
	firedRules: FiredRule[];
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
