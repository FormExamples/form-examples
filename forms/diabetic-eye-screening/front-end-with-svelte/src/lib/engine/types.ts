// ──────────────────────────────────────────────
// Core screening data types (Diabetic Eye Screening record)
//
// Diabetic eye screening is a *classification* pathway, not a numeric-score
// form. For each eye a human grader records the retinopathy (R) grade,
// maculopathy (M) grade, photocoagulation (P) marker, and ungradable (U)
// marker. The engine derives a worst-eye summary across both eyes then routes
// to exactly one recall / referral outcome via a gated, first-match cascade
// ordered by clinical urgency (most urgent wins). It does not sum a total.
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_diabetic_eye_screening.sql`.
// ──────────────────────────────────────────────

export type GraderRole =
	| 'screener'
	| 'primary-grader'
	| 'secondary-grader'
	| 'ophthalmologist'
	| 'other'
	| '';
export type ImagingMedia =
	| 'digital-fundus'
	| 'mydriatic'
	| 'non-mydriatic'
	| 'oct'
	| 'other'
	| '';
export type AgeBand = 'under-12' | '12-17' | '18-64' | '65-plus' | '';
export type DiabetesType = 'type-1' | 'type-2' | 'other' | 'unknown' | '';
export type PreviousScreenResult =
	| 'r0m0'
	| 'background'
	| 'referable'
	| 'none'
	| 'unknown'
	| '';
export type RetinopathyGrade = 'R0' | 'R1' | 'R2' | 'R3A' | 'R3S' | '';
export type MaculopathyGrade = 'M0' | 'M1' | '';
export type YesNo = 'yes' | 'no' | '';
export type Priority = 'high' | 'medium' | 'low';

/** The recall / referral outcome the classification cascade resolves to. */
export type Outcome =
	| 'refer-hes-urgent'
	| 'refer-hes'
	| 'refer-slit-lamp'
	| 'surveillance-6-month'
	| 'routine-12-month'
	| 'routine-24-month'
	| '';

/** The referral destination derived from the outcome. */
export type Referral = 'none' | 'hes-routine' | 'hes-urgent' | 'slit-lamp' | '';

export type Status = 'complete' | 'incomplete';

/** Worst retinopathy grade across both eyes (never '', defaults 'R0'). */
export type WorstRetinopathy = 'R0' | 'R1' | 'R2' | 'R3S' | 'R3A';
/** Worst maculopathy grade across both eyes. */
export type WorstMaculopathy = 'M0' | 'M1';

/** Step 1 — grading context. */
export interface Context {
	graderName: string;
	graderRole: GraderRole;
	/** date string; '' when unset. */
	gradedAt: string;
	/** date string; '' when unset. */
	imageCapturedAt: string;
	imagingMedia: ImagingMedia;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	diabetesType: DiabetesType;
	yearsSinceDiagnosis: number | null;
	/** date string; '' when unset. */
	previousScreenDate: string;
	previousScreenResult: PreviousScreenResult;
}

/** Steps 3 / 4 — per-eye grading block (right eye and left eye). */
export interface EyeGrade {
	retinopathy: RetinopathyGrade;
	maculopathy: MaculopathyGrade;
	photocoagulation: YesNo;
	ungradable: YesNo;
	visualAcuity: string;
}

/** Step 5 — clinician free-text note. */
export interface Note {
	clinicalContext: string;
}

/** The full diabetic-eye-screening data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	rightEye: EyeGrade;
	leftEye: EyeGrade;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The worst-eye summary context the classification cascade evaluates. */
export interface WorstEyeContext {
	worstRetinopathy: WorstRetinopathy;
	worstMaculopathy: WorstMaculopathy;
	anyUngradable: boolean;
	lowRiskEligible: boolean;
}

/** A single evaluated / fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-RECALL-R3A-01. */
	id: string;
	stage: string;
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

/** A diabetic-eye-screening classification rule (gated, first-match). */
export interface ClassificationRule {
	id: string;
	stage: string;
	category: string;
	outcome: Outcome;
	referral: Referral;
	intervalMonths: 6 | 12 | 24 | null;
	description: string;
	/** true when this rule's gated condition matches. */
	evaluate: (ctx: WorstEyeContext) => boolean;
}

/** The full classification result for one screening record. */
export interface GradingResult {
	rightEyeGrade: EyeGrade;
	leftEyeGrade: EyeGrade;
	worstRetinopathy: WorstRetinopathy;
	worstMaculopathy: WorstMaculopathy;
	anyUngradable: boolean;
	recallPathway: Outcome;
	recallIntervalMonths: 6 | 12 | 24 | null;
	referral: Referral;
	status: Status;
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
