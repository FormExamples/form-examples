// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | 'prefer-not-to-say' | '';

/** Combined SAD severity classification (no numeric overall score). */
export type CombinedSeverity = 'no-sad' | 'mild' | 'moderate' | 'severe' | 'critical';

/** SPAQ Global Seasonality Score band. */
export type SpaqBand = 'no-sad' | 'subsyndromal' | 'sad-likely';

/** PHQ-9 depression-severity band. */
export type Phq9Band = 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	/** e.g. '54.5N' (free-text, optional). */
	latitude: string;
	country: string;
	yearsAtCurrentLatitude: number | null;
}

export interface SeasonalPatternHistory {
	symptomsRecurAnnually: YesNo;
	worstMonths: string;
	bestMonths: string;
	yearsAffected: number | null;
	familyHistorySad: YesNo;
	firstOnsetAge: string;
}

export interface PHQ9Items {
	q1: number | null;
	q2: number | null;
	q3: number | null;
	q4: number | null;
	q5: number | null;
	q6: number | null;
	q7: number | null;
	q8: number | null;
	q9: number | null;
}

export interface CurrentMood {
	phq9: PHQ9Items;
	/** PHQ-9 functional-impact item. */
	difficultyLevel: 'not-difficult' | 'somewhat' | 'very' | 'extremely' | '';
}

export interface SPAQSleep {
	/** SPAQ item: change in sleep length (0-4). */
	sleepLength: number | null;
	/** SPAQ item: change in energy level (0-4). */
	energyLevel: number | null;
}

export interface SleepEnergy {
	spaq: SPAQSleep;
	hoursSleptWinter: number | null;
	hoursSleptSummer: number | null;
	hypersomnia: YesNo;
	morningFatigue: YesNo;
	energyNotes: string;
}

export interface SPAQAppetite {
	/** SPAQ item: change in appetite (0-4). */
	appetite: number | null;
	/** SPAQ item: change in weight (0-4). */
	weight: number | null;
}

export interface AppetiteWeight {
	spaq: SPAQAppetite;
	carbohydrateCraving: YesNo;
	winterWeightChangeKg: number | null;
	eatingPatternChanges: string;
}

export interface SPAQSocial {
	/** SPAQ item: change in mood (0-4). */
	mood: number | null;
	/** SPAQ item: change in social activity (0-4). */
	socialActivity: number | null;
}

export interface SocialOccupational {
	spaq: SPAQSocial;
	workImpaired: YesNo;
	relationshipsImpaired: YesNo;
	socialWithdrawal: YesNo;
	occupationalNotes: string;
}

export interface LightExposure {
	dailyOutdoorMinutes: number | null;
	workIndoors: YesNo;
	curtainsClosedDaytime: YesNo;
	sunriseExposure: YesNo;
	usesLightTherapyBox: YesNo;
	lightTherapyDetails: string;
	/** Has access to a light box if needed. */
	lightTherapyAccess: YesNo;
}

export interface PreviousTreatments {
	antidepressants: YesNo;
	antidepressantDetails: string;
	psychotherapy: YesNo;
	psychotherapyDetails: string;
	lightTherapyHistory: YesNo;
	lightTherapyHistoryDetails: string;
	currentTreatment: YesNo;
	currentTreatmentDetails: string;
}

export interface RiskAssessment {
	suicidalIdeation: YesNo;
	suicidalIntent: YesNo;
	suicidalPlan: string;
	selfHarm: YesNo;
	selfHarmDetails: string;
	previousAttempt: YesNo;
	protectiveFactors: string;
	safetyPlanInPlace: YesNo;
}

export interface TreatmentPlan {
	planLightTherapy: YesNo;
	planAntidepressant: YesNo;
	planPsychotherapy: YesNo;
	planLifestyle: YesNo;
	planCrisisReferral: YesNo;
	/** e.g. '2-weeks' | '4-weeks' | '8-weeks' | ''. */
	followUpInterval: '2-weeks' | '4-weeks' | '8-weeks' | '12-weeks' | '';
	clinicianNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	seasonalPatternHistory: SeasonalPatternHistory;
	currentMood: CurrentMood;
	sleepEnergy: SleepEnergy;
	appetiteWeight: AppetiteWeight;
	socialOccupational: SocialOccupational;
	lightExposure: LightExposure;
	previousTreatments: PreviousTreatments;
	riskAssessment: RiskAssessment;
	treatmentPlan: TreatmentPlan;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

export interface ScaleOption {
	value: number;
	label: string;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	spaqScore: number;
	spaqBand: SpaqBand;
	phq9Score: number;
	phq9Band: Phq9Band;
	combinedSeverity: CombinedSeverity;
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
