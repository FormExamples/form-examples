// ──────────────────────────────────────────────
// Core assessment data types (Bowel Cancer Screening with FIT)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_bowel_cancer_screening_fit.sql`
// (`faecal_haemoglobin_ug_g` -> `faecalHaemoglobinUgG`,
// `threshold_applied` -> `thresholdApplied`,
// `red_flag_symptoms` -> `redFlagSymptoms`).
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'screening-administrator'
	| 'screening-practitioner'
	| 'gp'
	| 'ssp'
	| 'other'
	| '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type WithinAgeRange = 'eligible' | 'over-age-self-request' | 'not-eligible' | '';
export type RecallInterval = 'two-yearly' | 'other' | '';
export type PreviousOutcome =
	| 'first-invitation'
	| 'prior-negative'
	| 'prior-positive'
	| 'unknown'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type SampleAdequacy = 'adequate' | 'spoilt' | 'insufficient' | 'expired' | '';
export type SpoiltReason = 'leaked' | 'undated' | 'unlabelled' | 'too-old' | 'damaged' | '';
export type ResultClass = 'negative' | 'positive' | 'spoilt' | '';
export type ManagementAction = 'routine-recall' | 'refer-colonoscopy' | 'repeat-kit' | '';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	reviewedAt: string;
	screeningHub: string;
}

/** Step 2 — participant identification. */
export interface Identification {
	participantIdentifier: string;
	nhsNumber: string;
	/** Participant age in years. */
	participantAge: number | null;
	sex: Sex;
}

/** Step 3 — eligibility and invitation. */
export interface Eligibility {
	withinAgeRange: WithinAgeRange;
	recallInterval: RecallInterval;
	/** Kit issued date; '' when unset. */
	invitationDate: string;
	previousOutcome: PreviousOutcome;
}

/** Step 4 — kit return and adequacy. */
export interface Kit {
	kitReturned: YesNo;
	/** Sample received date; '' when unset. */
	returnDate: string;
	sampleAdequacy: SampleAdequacy;
	spoiltReason: SpoiltReason;
}

/** Step 5 — FIT result. */
export interface Result {
	/** Measured faecal haemoglobin in µg Hb/g. */
	faecalHaemoglobinUgG: number | null;
	/** Analyser / assay identifier. */
	assay: string;
	/** Programme threshold in µg Hb/g; defaults to 120 (screening). */
	thresholdApplied: number | null;
}

/** Step 6 — symptoms. */
export interface Symptoms {
	/** Supports the symptomatic-suspected-cancer flag. */
	redFlagSymptoms: YesNo;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full bowel-cancer-screening FIT assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	eligibility: Eligibility;
	kit: Kit;
	result: Result;
	symptoms: Symptoms;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-CLASSIFY-POSITIVE-01. */
	id: string;
	/** return | adequacy | classification | symptomatic. */
	instrument: string;
	/** negative | positive | spoilt | unknown. */
	band: string;
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

/** The full grading result for one assessment. */
export interface GradingResult {
	resultClass: ResultClass;
	managementAction: ManagementAction;
	symptomaticPathway: boolean;
	/** complete | incomplete | ''. */
	status: 'complete' | 'incomplete' | '';
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
