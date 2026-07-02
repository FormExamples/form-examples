// ──────────────────────────────────────────────
// Core assessment data types (Columbia Suicide Severity Rating Scale — C-SSRS)
//
// C-SSRS is a status- and severity-classification instrument, not a
// numeric-score form: the engine derives the highest affirmative ideation level
// (0-5), whether suicidal behaviour is present and recent, and lethality, then
// classifies the patient into a Low / Moderate / High risk tier. It does NOT
// sum a total. camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_columbia_suicide_severity_rating_scale.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'clinician'
	| 'nurse'
	| 'mental-health-practitioner'
	| 'crisis-worker'
	| 'other'
	| '';
export type CareSetting =
	| 'mental-health'
	| 'emergency-department'
	| 'primary-care'
	| 'crisis-service'
	| 'inpatient'
	| 'other'
	| '';
export type ScaleVersion = 'screener' | 'full' | '';
export type AgeBand = 'adolescent' | 'adult' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type IdeationTimeframe = 'past-month' | 'lifetime-worst' | '';
export type BehaviourRecency = 'within-3-months' | 'over-3-months' | '';
export type AccessToMeans = 'yes' | 'no' | 'unknown' | '';
export type IdeationLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type RiskTier = 'low' | 'moderate' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	scaleVersion: ScaleVersion;
	reasonForAssessment: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — suicidal ideation (Q1-Q5, each yes/no; highest affirmative sets the level). */
export interface Ideation {
	wishToBeDead: YesNo;
	nonSpecificActiveThoughts: YesNo;
	activeIdeationMethods: YesNo;
	activeIdeationIntent: YesNo;
	activeIdeationPlan: YesNo;
	ideationTimeframe: IdeationTimeframe;
}

/** Step 4 — ideation intensity (optional; full version only) — ordinals 0-5. */
export interface Intensity {
	ideationFrequency: number | null;
	ideationDuration: number | null;
	ideationControllability: number | null;
	ideationDeterrents: number | null;
	ideationReasons: number | null;
}

/** Step 5 — suicidal behaviour. */
export interface Behaviour {
	actualAttempt: YesNo;
	interruptedAttempt: YesNo;
	abortedAttempt: YesNo;
	preparatoryActs: YesNo;
	/** NSSI; tracked separately, not suicidal behaviour. */
	nonSuicidalSelfInjury: YesNo;
	behaviourRecency: BehaviourRecency;
	lifetimeAttemptCount: number | null;
	/** ISO date string; '' when unset. */
	mostRecentAttemptDate: string;
}

/** Step 6 — lethality (for actual attempts). */
export interface Lethality {
	/** 0-5 medical damage. */
	actualLethality: number | null;
	/** 0-2; coded only when actualLethality is 0. */
	potentialLethality: number | null;
}

/** Step 7 — means and protective factors. */
export interface Means {
	accessToLethalMeans: AccessToMeans;
	protectiveFactors: string;
}

/** Step 8 — clinician free-text note. */
export interface Summary {
	clinicalNote: string;
}

/** The full C-SSRS assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	ideation: Ideation;
	intensity: Intensity;
	behaviour: Behaviour;
	lethality: Lethality;
	means: Means;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-IDEATION-05. */
	id: string;
	/** ideation | behaviour | lethality | tier */
	criterion: string;
	/** Ordinal contribution (ideation level 1-5, or 0). */
	level: number;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A declarative C-SSRS classification rule. */
export interface CssrsRule {
	id: string;
	/** ideation | behaviour | lethality */
	criterion: string;
	/** Ordinal ideation level (1-5), or 0 for non-ideation rows. */
	level: number;
	category: string;
	description: string;
	/** true when the criterion fired. */
	evaluate: (data: AssessmentData) => boolean;
}

/** The lean grade summary consumed by the flag detector. */
export interface GradeSummary {
	ideationLevel: IdeationLevel;
	suicidalBehaviourPresent: boolean;
	recentBehaviour: boolean;
	highLethality: boolean;
	riskTier: RiskTier;
}

/** The full classification result for one assessment. */
export interface GradingResult {
	ideationLevel: IdeationLevel;
	suicidalBehaviourPresent: boolean;
	recentBehaviour: boolean;
	highLethality: boolean;
	riskTier: RiskTier;
	managementRecommendation: string;
	firedCriteria: FiredCriterion[];
	flaggedIssues: FlaggedIssue[];
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
