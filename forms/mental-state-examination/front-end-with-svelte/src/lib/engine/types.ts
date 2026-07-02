// ──────────────────────────────────────────────
// Core assessment data types (Mental State Examination — MSE)
//
// The MSE is a DOCUMENTATION and COMPLETENESS instrument, not a numeric-score
// form: the engine classifies the record as Complete or Partial across the
// seven ASEPTIC domains, reports a completeness percentage, and — independently
// — derives a risk indicator (none / low / moderate / high) from the highest
// priority among the safety flags raised. It never sums a total. camelCase
// property names mirror the snake_case SQL columns in
// `sql/04_create_table_mental_state_examination.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'psychiatrist'
	| 'mental-health-nurse'
	| 'gp'
	| 'liaison'
	| 'other'
	| '';
export type CareSetting =
	| 'outpatient'
	| 'inpatient'
	| 'liaison'
	| 'crisis'
	| 'primary-care'
	| 'other'
	| '';
export type AgeBand = 'under-18' | '18-25' | '26-39' | '40-64' | '65-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';

export type CompletenessStatus = 'complete' | 'partial';
export type RiskLevel = 'none' | 'low' | 'moderate' | 'high';
export type Priority = 'high' | 'moderate' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	assessmentReason: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Domain 1 (A) — appearance and behaviour. */
export interface Appearance {
	appearanceGrooming: string;
	appearanceEyeContact: string;
	appearanceRapport: string;
	appearancePsychomotor: string;
	appearanceAbnormalMovements: string;
	appearanceNotes: string;
}

/** Domain 2 (S) — speech. */
export interface Speech {
	speechRate: string;
	speechVolume: string;
	speechQuantity: string;
	speechFluency: string;
	speechNotes: string;
}

/** Domain 3 (E) — emotion (mood and affect). */
export interface Emotion {
	moodSubjective: string;
	moodDescriptor: string;
	affectRange: string;
	affectCongruence: string;
	affectReactivity: string;
	emotionNotes: string;
}

/** Domain 4 (P) — perception. */
export interface Perception {
	hallucinationsPresent: string;
	commandHallucinations: string;
	illusions: string;
	depersonalisation: string;
	derealisation: string;
	perceptionNotes: string;
}

/** Domain 5 (T) — thought (form and content). */
export interface Thought {
	thoughtForm: string;
	delusions: string;
	obsessions: string;
	suicidalIdeation: string;
	homicidalIdeation: string;
	selfHarmThoughts: string;
	thoughtNotes: string;
}

/** Domain 6 (I) — insight and judgement. */
export interface Insight {
	insightLevel: string;
	treatmentUnderstanding: string;
	judgement: string;
	insightNotes: string;
}

/** Domain 7 (C) — cognition. */
export interface Cognition {
	orientation: string;
	attention: string;
	memory: string;
	cognitiveImpression: string;
	cognitionNotes: string;
}

/** Step 10 — summary and formulation. */
export interface Summary {
	clinicalFormulation: string;
}

/** The full MSE assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	appearance: Appearance;
	speech: Speech;
	emotion: Emotion;
	perception: Perception;
	thought: Thought;
	insight: Insight;
	cognition: Cognition;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** Per-domain documentation status row. */
export interface DomainStatus {
	/** Stable domain key, e.g. appearance-behaviour. */
	domain: string;
	/** Human-readable domain name. */
	label: string;
	/** True when any finding in the domain is recorded. */
	documented: boolean;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-DOMAIN-05-THOUGHT. */
	id: string;
	/** appearance-behaviour | ... | completeness | risk */
	domain: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** suicidal-ideation | homicidal-ideation | command-hallucinations | ... */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A domain-documentation rule: satisfied when any finding in the domain is set. */
export interface DomainRule {
	id: string;
	/** The AssessmentData section this domain reads. */
	section: keyof AssessmentData;
	/** Stable domain key (appearance-behaviour, speech, …). */
	domain: string;
	category: string;
	/** Human-readable domain name. */
	label: string;
	description: string;
	satisfied: (data: AssessmentData) => boolean;
}

/** The full completeness + risk result for one assessment. */
export interface GradingResult {
	status: CompletenessStatus;
	riskLevel: RiskLevel;
	/** 0..100. */
	completenessPercent: number;
	domainStatuses: DomainStatus[];
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
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
