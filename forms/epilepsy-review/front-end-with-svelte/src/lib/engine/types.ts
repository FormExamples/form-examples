// ──────────────────────────────────────────────
// Core assessment data types (Epilepsy Annual Review — NICE NG217)
//
// This is NOT a numeric-score form. The engine classifies seizure CONTROL
// (seizure-free / controlled / uncontrolled), grades REVIEW completeness
// (complete / partial / incomplete) over the required documentation domains,
// and — independently — raises safety FLAGS (specialist review, valproate /
// PPP, status epilepticus, DVLA driving, mental health, SUDEP, adherence, side
// effects, folic acid, incomplete). It is a documentation and decision-support
// tool, not a diagnostic or prescribing instrument. camelCase property names
// mirror the snake_case SQL columns in `sql/04_create_table_epilepsy_review.sql`.
// ──────────────────────────────────────────────

export type ReviewerRole = 'gp' | 'practice-nurse' | 'epilepsy-nurse' | 'neurologist' | 'other' | '';
export type CareSetting = 'general-practice' | 'epilepsy-clinic' | 'community' | 'other' | '';
export type ReviewType = 'annual' | 'interim' | '';
export type AgeBand = '18-39' | '40-59' | '60-79' | '>=80' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type EpilepsyType = 'focal' | 'generalised' | 'combined' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type YesNoNa = 'yes' | 'no' | 'not-applicable' | '';
export type SeizureFrequency = 'none' | 'less-than-monthly' | 'monthly' | 'weekly' | 'daily' | '';
export type SeizureTrend = 'seizure-free' | 'decreasing' | 'stable' | 'increasing' | '';
export type Adherence = 'good' | 'partial' | 'poor' | '';
export type SideEffects = 'none' | 'mild' | 'significant' | '';
export type DvlaEligible = 'eligible' | 'not-eligible' | 'not-applicable' | '';
export type PppStatus = 'in-place' | 'not-in-place' | 'not-applicable' | '';
export type MentalHealthConcern =
	| 'none'
	| 'low-mood'
	| 'anxiety'
	| 'depression'
	| 'suicidality'
	| '';

export type SeizureControl = 'seizure-free' | 'controlled' | 'uncontrolled';
export type ReviewStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — review context. */
export interface Context {
	reviewerName: string;
	reviewerRole: ReviewerRole;
	/** ISO date string; '' when unset. */
	reviewedAt: string;
	careSetting: CareSetting;
	reviewType: ReviewType;
	monthsSinceLastReview: number | null;
}

/** Step 2 — patient and epilepsy profile. */
export interface Profile {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	epilepsyType: EpilepsyType;
	ageAtOnset: number | null;
	yearsSinceDiagnosis: number | null;
	learningDisability: YesNo;
}

/** Step 3 — seizure type and frequency. */
export interface Seizures {
	seizureTypes: string;
	seizureFrequency: SeizureFrequency;
	/** ISO date string; '' when unset. */
	lastSeizureDate: string;
	seizureFreeMonths: number | null;
	seizureTrend: SeizureTrend;
}

/** Step 4 — anti-seizure medication. */
export interface Medication {
	currentAsms: string;
	asmAdherence: Adherence;
	asmSideEffects: SideEffects;
	drugLevel: number | null;
}

/** Step 5 — triggers. */
export interface Triggers {
	triggers: string;
}

/** Step 6 — SUDEP risk discussion. */
export interface Sudep {
	sudepDiscussed: YesNo;
}

/** Step 7 — injuries and status epilepticus. */
export interface Injuries {
	statusEpilepticus: YesNo;
	seizureInjury: YesNo;
}

/** Step 8 — safety. */
export interface Safety {
	dvlaEligible: DvlaEligible;
	currentlyDriving: YesNo;
	bathingAdviceGiven: YesNo;
}

/** Step 9 — women of childbearing potential. */
export interface Childbearing {
	womanOfChildbearingPotential: YesNoNa;
	onValproate: YesNo;
	pregnancyPreventionProgramme: PppStatus;
	folicAcid: YesNoNa;
	contraceptionInteractionReviewed: YesNoNa;
}

/** Step 10 — mental health. */
export interface MentalHealth {
	mentalHealthConcern: MentalHealthConcern;
}

/** Step 11 — summary and care plan. */
export interface Summary {
	specialistReviewNeeded: YesNo;
	/** ISO date string; '' when unset. */
	nextReviewDue: string;
	carePlan: string;
	reviewContext: string;
}

/** The full epilepsy-annual-review data model. */
export interface AssessmentData {
	context: Context;
	profile: Profile;
	seizures: Seizures;
	medication: Medication;
	triggers: Triggers;
	sudep: Sudep;
	injuries: Injuries;
	safety: Safety;
	childbearing: Childbearing;
	mentalHealth: MentalHealth;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** Per-component completeness status row (review completeness table). */
export interface ComponentStatus {
	/** Stable component key. */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** True when the component is recorded. */
	documented: boolean;
	/** True when a missing value forces the review incomplete. */
	gate: boolean;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	id: string;
	/** seizure-control | completeness */
	section: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** specialist-review | valproate-ppp | status-epilepticus-history | … */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A review-completeness domain rule. */
export interface ComponentRule {
	/** Stable component key, e.g. seizure. */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** True for a gate component (seizure or medication). */
	gate?: boolean;
	/** When present, the component is required only when this returns true. */
	applicable?: (data: AssessmentData) => boolean;
	satisfied: (data: AssessmentData) => boolean;
}

/** The full seizure-control + completeness result for one review. */
export interface GradingResult {
	seizureControl: SeizureControl;
	reviewStatus: ReviewStatus;
	completenessScore: number;
	componentStatuses: ComponentStatus[];
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
