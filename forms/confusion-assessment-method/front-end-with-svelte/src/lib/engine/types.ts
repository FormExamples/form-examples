// ──────────────────────────────────────────────
// Core assessment data types (Confusion Assessment Method — CAM)
//
// CAM is a status / classification instrument, not a numeric-score form: the
// engine emits a boolean delirium status and a derived classification
// (present / absent / unable-to-assess) plus the set of positive features — it
// does not sum a total. camelCase property names mirror the snake_case SQL
// columns in `sql/04_create_table_confusion_assessment_method.sql`.
// ──────────────────────────────────────────────

export type AssessorRole =
	| 'nurse'
	| 'doctor'
	| 'geriatrician'
	| 'liaison-psychiatrist'
	| 'physiotherapist'
	| 'occupational-therapist'
	| 'researcher'
	| 'other'
	| '';
export type CamVariant = 'cam' | 'cam-icu' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type CognitiveBaseline =
	| 'independent'
	| 'known-dementia'
	| 'mild-cognitive-impairment'
	| 'unknown'
	| '';
export type CollateralSource = 'family' | 'carer' | 'nurse' | 'notes' | 'none' | '';
export type FeatureState = 'present' | 'absent' | '';
export type OnsetTiming = 'hours' | 'days' | 'weeks' | 'unknown' | '';
export type AttentionTest =
	| 'digit-span'
	| 'months-backwards'
	| 'serial-sevens'
	| 'attention-screening-examination'
	| 'not-completable'
	| '';
export type ConsciousnessLevel = 'alert' | 'vigilant' | 'lethargic' | 'stupor' | 'coma' | '';
export type MotoricSubtype = 'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | '';
export type Classification = 'present' | 'absent' | 'unable-to-assess';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessor and encounter. */
export interface Context {
	assessorName: string;
	assessorRole: AssessorRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	wardUnit: string;
	camVariant: CamVariant;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	cognitiveBaseline: CognitiveBaseline;
	collateralSource: CollateralSource;
}

/** Step 3 — feature 1: acute onset and fluctuating course. */
export interface Feature1 {
	acuteOnsetFluctuating: FeatureState;
	onsetTiming: OnsetTiming;
}

/** Step 4 — feature 2: inattention. */
export interface Feature2 {
	inattention: FeatureState;
	attentionTest: AttentionTest;
}

/** Step 5 — feature 3: disorganised thinking. */
export interface Feature3 {
	disorganisedThinking: FeatureState;
}

/** Step 6 — feature 4: altered level of consciousness. */
export interface Feature4 {
	alteredConsciousness: FeatureState;
	consciousnessLevel: ConsciousnessLevel;
	/** Richmond Agitation-Sedation Scale (-5..+4), CAM-ICU only. */
	rassScore: number | null;
}

/** Step 7 — motoric subtype and observations. */
export interface Observations {
	motoricSubtype: MotoricSubtype;
	hallucinations: boolean;
	delusions: boolean;
	sleepWakeDisturbance: boolean;
	deliriogenicMedication: boolean;
	deliriogenicMedicationDetail: string;
}

/** Step 8 — result and disposition. */
export interface ResultNotes {
	suspectedPrecipitants: string;
	recommendedActions: string;
	clinicalNote: string;
}

/** The full CAM assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	feature1: Feature1;
	feature2: Feature2;
	feature3: Feature3;
	feature4: Feature4;
	observations: Observations;
	result: ResultNotes;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-FEATURE-1-POSITIVE-01. */
	id: string;
	/** acute-onset-fluctuating | inattention | disorganised-thinking | altered-consciousness | algorithm | arousal */
	feature: string;
	/** Whether the feature was positive (null for combiner / arousal rows). */
	positive: boolean | null;
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

/** A CAM feature rule. */
export interface CamRule {
	id: string;
	/** 1..4 */
	featureNumber: number;
	/** kebab-case feature key mirroring SQL. */
	feature: string;
	category: string;
	description: string;
	/** true when the feature is positive. */
	evaluate: (data: AssessmentData) => boolean;
}

/** The full classification result for one assessment. */
export interface GradingResult {
	classification: Classification;
	deliriumPresent: boolean | null;
	/** Subset of [1,2,3,4]. */
	positiveFeatures: number[];
	feature1Positive: boolean | null;
	feature2Positive: boolean | null;
	feature3Positive: boolean | null;
	feature4Positive: boolean | null;
	motoricSubtype: MotoricSubtype;
	firedRules: FiredRule[];
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
