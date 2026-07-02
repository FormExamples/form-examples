// ──────────────────────────────────────────────
// Core data types (Breast Screening Record — NHS Breast Screening Programme)
//
// Breast screening is a result-CLASSIFICATION instrument, not a numeric-score
// form: the engine derives an eligibility status, maps the radiological reading
// outcome (and, after a recall, the five-point imaging classification) to a
// screening outcome and next action, and raises safety flags — it does not sum
// a total. camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_breast_screening.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'mammographer'
	| 'advanced-practitioner'
	| 'breast-radiologist'
	| 'screening-office'
	| 'other'
	| '';
export type EpisodeType =
	| 'routine-recall'
	| 'very-first-call'
	| 'self-referral'
	| 'higher-risk-surveillance'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type Consent = 'yes' | 'no' | 'declined' | '';
export type ViewsTaken = 'standard-four-view' | 'additional-views' | 'unable-to-image' | '';
export type ImageAdequacy = 'adequate' | 'inadequate' | '';
export type ReadOpinion = 'normal' | 'recall' | 'technical' | '';
export type ArbitrationOutcome = 'normal' | 'recall' | 'technical' | 'not-required' | '';
export type ReadingOutcome =
	| 'normal-routine-recall'
	| 'technical-repeat'
	| 'recall-for-assessment'
	| '';
export type ImagingClassification = 1 | 2 | 3 | 4 | 5 | null;
export type EligibilityStatus =
	| 'eligible'
	| 'outside-age-range'
	| 'higher-risk-surveillance'
	| 'symptomatic-referral'
	| '';
export type ScreeningOutcome =
	| 'routine-recall'
	| 'technical-repeat'
	| 'recall-to-assessment-clinic'
	| 'short-interval-follow-up'
	| 'urgent-breast-clinic'
	| 'symptomatic-pathway-referral'
	| '';
export type OutcomeBand =
	| 'routine'
	| 'repeat'
	| 'assessment'
	| 'urgent'
	| 'referral'
	| 'incomplete';
export type Completeness = 'complete' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — screening context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	reportedAt: string;
	screeningUnit: string;
	episodeType: EpisodeType;
}

/** Step 2 — identification and eligibility inputs. */
export interface Identification {
	patientIdentifier: string;
	ageYears: number | null;
	/** ISO date string; '' when unset. */
	lastScreenedDate: string;
	higherRiskSurveillance: YesNo;
}

/** Step 3 — symptom and consent check. */
export interface Eligibility {
	symptomatic: YesNo;
	consentGiven: Consent;
}

/** Step 4 — mammogram. */
export interface Mammogram {
	viewsTaken: ViewsTaken;
	imageAdequacy: ImageAdequacy;
}

/** Step 5 — reading outcome (double reading + arbitration). */
export interface Reading {
	firstReadOpinion: ReadOpinion;
	secondReadOpinion: ReadOpinion;
	arbitrationOutcome: ArbitrationOutcome;
	readingOutcome: ReadingOutcome;
}

/** Step 6 — assessment result (only when recalled for assessment). */
export interface Assessment {
	assessmentPerformed: YesNo;
	/** Subset of mammography | ultrasound | biopsy. */
	assessmentModalities: string[];
	imagingClassification: ImagingClassification;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalContext: string;
}

/** The full breast-screening record data model. */
export interface ScreeningData {
	context: Context;
	identification: Identification;
	eligibility: Eligibility;
	mammogram: Mammogram;
	reading: Reading;
	assessment: Assessment;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-RECALL-ASSESSMENT-01. */
	id: string;
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

/** An ordered first-match pathway rule. */
export interface OutcomeRule {
	id: string;
	category: string;
	screeningOutcome: ScreeningOutcome;
	outcomeBand: OutcomeBand;
	description: string;
	/** true when this pathway fixes the outcome. */
	evaluate: (data: ScreeningData) => boolean;
}

/** The full classification result for one screening record. */
export interface GradingResult {
	eligibilityStatus: EligibilityStatus;
	readingOutcome: ReadingOutcome;
	imagingClassification: ImagingClassification;
	screeningOutcome: ScreeningOutcome;
	outcomeBand: OutcomeBand;
	status: Completeness;
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
	section: keyof ScreeningData;
}
