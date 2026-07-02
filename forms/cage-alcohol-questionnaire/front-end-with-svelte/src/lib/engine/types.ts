// ──────────────────────────────────────────────
// Core assessment data types (CAGE Alcohol Questionnaire)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_cage_alcohol_questionnaire.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'midwife' | 'other' | '';
export type CareSetting =
	| 'primary-care'
	| 'ward'
	| 'emergency-department'
	| 'antenatal'
	| 'other'
	| '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type ResultBand = 'negative' | 'low' | 'positive';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/**
 * Steps 3-6 — the four lifetime CAGE criterion inputs. Each is a yes/no
 * question scoring 1 point for 'yes' and 0 otherwise.
 */
export interface Criteria {
	/** C: felt you should cut down on drinking. */
	cutDown: YesNo;
	/** A: people annoyed you by criticising your drinking. */
	annoyed: YesNo;
	/** G: felt bad or guilty about your drinking. */
	guilty: YesNo;
	/** E: morning drink to steady nerves or cure a hangover. */
	eyeOpener: YesNo;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full CAGE assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	criteria: Criteria;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-EYE-OPENER-1POINT-01. */
	id: string;
	/** cut-down | annoyed | guilty | eye-opener | total */
	criterion: string;
	/** Points contributed (0 or 1). */
	points: number;
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

/** A CAGE grading rule. */
export interface CageRule {
	id: string;
	/** cut-down | annoyed | guilty | eye-opener */
	criterion: string;
	/** Points contributed when the rule fires (1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	cutDownPoint: 0 | 1;
	annoyedPoint: 0 | 1;
	guiltyPoint: 0 | 1;
	eyeOpenerPoint: 0 | 1;
	cageScore: 0 | 1 | 2 | 3 | 4;
	resultBand: ResultBand;
	thresholdMet: 'yes' | 'no';
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
