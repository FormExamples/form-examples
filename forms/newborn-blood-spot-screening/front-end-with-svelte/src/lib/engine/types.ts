// ──────────────────────────────────────────────
// Core data types — Newborn Blood Spot Screening (NBS)
//
// NBS is a documentation and result-classification form, NOT a numeric-score
// instrument: each of the nine screened conditions carries one result class,
// and a pure engine derives the overall screening outcome (by precedence) and
// the referral status. camelCase property names mirror the snake_case SQL
// columns in `sql/04_create_table_newborn_blood_spot_screening.sql`.
// ──────────────────────────────────────────────

export type ResultClass =
	| 'not-suspected'
	| 'suspected'
	| 'carrier'
	| 'repeat-required'
	| 'declined'
	| 'pending'
	| '';

export type OverallOutcome =
	| 'all-not-suspected'
	| 'referral-required'
	| 'repeat-required'
	| 'incomplete'
	| 'declined-only-outstanding';

export type ReferralStatus = 'routine' | 'repeat' | 'urgent';

export type SampleTakerRole =
	| 'midwife'
	| 'health-visitor'
	| 'neonatal-nurse'
	| 'laboratory'
	| 'other'
	| '';
export type CareSetting = 'community' | 'home' | 'neonatal-unit' | 'hospital' | 'other' | '';
export type Sex = 'female' | 'male' | 'indeterminate' | 'not-recorded' | '';
export type PreviouslyScreened = 'yes' | 'no' | 'unknown' | '';
export type ConsentGiven = 'yes' | 'no' | 'partial' | '';
export type SamplingSite = 'heel' | 'other' | '';
export type SampleAdequacy = 'adequate' | 'inadequate' | '';
export type SpotQualityIssue =
	| 'none'
	| 'insufficient'
	| 'compressed'
	| 'layered'
	| 'contaminated'
	| 'incomplete-circles'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type RepeatReason =
	| 'not-applicable'
	| 'borderline-result'
	| 'inadequate-sample'
	| 'too-early'
	| 'technical'
	| 'other'
	| '';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

/** Step 1 — sample-taker and setting. */
export interface SampleTaker {
	sampleTakerName: string;
	sampleTakerRole: SampleTakerRole;
	careSetting: CareSetting;
	/** ISO date string; '' when unset. */
	recordDate: string;
}

/** Step 2 — baby identification. */
export interface BabyId {
	nhsNumber: string;
	babyName: string;
	/** ISO date string; '' when unset. */
	dateOfBirth: string;
	/** HH:MM string; '' when unset. */
	timeOfBirth: string;
	sex: Sex;
	gestationWeeks: number | null;
}

/** Step 3 — eligibility and consent. */
export interface Eligibility {
	previouslyScreened: PreviouslyScreened;
	consentGiven: ConsentGiven;
	declineReason: string;
}

/** Step 4 — sample event. */
export interface SampleEvent {
	/** ISO date string; '' when unset. */
	sampleDate: string;
	/** HH:MM string; '' when unset. */
	sampleTime: string;
	/** Derived and stored for audit; recomputed by the engine. */
	ageAtSampleDays: number | null;
	samplingSite: SamplingSite;
	sampleNotes: string;
}

/** Step 5 — sample quality. */
export interface SampleQualityInput {
	sampleAdequacy: SampleAdequacy;
	spotQualityIssue: SpotQualityIssue;
	isRepeat: YesNo;
	repeatReason: RepeatReason;
}

/** Step 6 — per-condition results (one result class per condition). */
export interface Conditions {
	scdResult: ResultClass;
	cfResult: ResultClass;
	chtResult: ResultClass;
	pkuResult: ResultClass;
	mcaddResult: ResultClass;
	msudResult: ResultClass;
	ivaResult: ResultClass;
	ga1Result: ResultClass;
	hcuResult: ResultClass;
}

/** Step 7 — summary: free-text clinical context. */
export interface Summary {
	clinicalContext: string;
}

/** The full newborn blood spot screening data model. */
export interface BloodspotScreening {
	sampleTaker: SampleTaker;
	babyId: BabyId;
	eligibility: Eligibility;
	sampleEvent: SampleEvent;
	sampleQuality: SampleQualityInput;
	conditions: Conditions;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The static metadata for one of the nine screened conditions. */
export interface ConditionMeta {
	code: string;
	label: string;
	short: string;
	field: keyof Conditions;
	service: string;
	/** true only for sickle cell disease; a carrier on any other is invalid. */
	carrierValid: boolean;
}

/** A normalised per-condition classification row. */
export interface ConditionResult {
	code: string;
	label: string;
	short: string;
	result: ResultClass;
	/** Result used for outcome derivation ('' and invalid carrier → 'pending'). */
	effectiveResult: ResultClass;
	referralTarget: string;
	/** carrier recorded on a non-SCD condition. */
	invalidCarrier: boolean;
}

/** An onward specialist referral, one per 'suspected' condition. */
export interface Referral {
	code: string;
	service: string;
	urgency: 'urgent';
}

/** Derived sample-quality object. */
export interface SampleQualityResult {
	adequate: boolean;
	withinWindow: boolean;
	avoidableRepeat: boolean;
}

/** A clinician-facing safety flag. */
export interface FlaggedIssue {
	id: string;
	category: string;
	message: string;
	priority: Priority;
}

/** The full classification result for one screening record. */
export interface GradingResult {
	ageAtSampleDays: number | null;
	conditionResults: ConditionResult[];
	referrals: Referral[];
	overallOutcome: OverallOutcome;
	referralStatus: ReferralStatus;
	sampleQuality: SampleQualityResult;
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
	section: keyof BloodspotScreening;
}
