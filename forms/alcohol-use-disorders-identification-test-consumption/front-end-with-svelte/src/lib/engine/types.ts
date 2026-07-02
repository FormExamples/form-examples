// ──────────────────────────────────────────────
// Core assessment data types (AUDIT-C)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_audit_c.sql` (the short table base `audit_c`):
//   item_1_frequency        -> items.frequencyOfDrinking
//   item_2_quantity         -> items.typicalQuantity
//   item_3_binge_frequency  -> items.heavyEpisodeFrequency
//   context (free-text)     -> note.clinicalNote
// ──────────────────────────────────────────────

export type ClinicianRole = 'gp' | 'nurse' | 'healthcare-assistant' | 'other' | '';
export type CareSetting =
	| 'primary-care'
	| 'emergency-department'
	| 'health-check'
	| 'inpatient'
	| 'other'
	| '';
export type AdministrationMode = 'self-completed' | 'interview' | '';
export type AgeBand = '16-24' | '25-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type ItemScore = 0 | 1 | 2 | 3 | 4 | null;
export type RiskBand = 'lower' | 'increasing' | 'higher' | 'possible-dependence';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	administrationMode: AdministrationMode;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/**
 * Steps 3-5 — the three AUDIT-C consumption items. Each holds the chosen
 * response's point value (integer 0-4), or null when unanswered.
 */
export interface Items {
	/** Q1: how often you drink. */
	frequencyOfDrinking: ItemScore;
	/** Q2: UK units on a typical drinking day. */
	typicalQuantity: ItemScore;
	/** Q3: frequency of >= 6/>= 8 units in one session. */
	heavyEpisodeFrequency: ItemScore;
}

/** Step 6 — clinician free-text note (SQL column `context`). */
export interface Note {
	clinicalNote: string;
}

/** The full AUDIT-C assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	items: Items;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived item row (mirrors the grade_rule SQL table). */
export interface FiredItem {
	/** Stable rule id, e.g. R-ITEM-1-FREQUENCY-01. */
	id: string;
	/** frequency-of-drinking | typical-quantity | heavy-episode-frequency | total */
	item: string;
	/** Points contributed (0-4). */
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

/** An AUDIT-C grading rule (one per consumption item). */
export interface AuditcRule {
	id: string;
	/** frequency-of-drinking | typical-quantity | heavy-episode-frequency */
	item: string;
	/** The AssessmentData.items key this rule reads. */
	field: keyof Items;
	category: string;
	description: string;
	/** 0-4 point value (0 when unanswered). */
	points: (data: AssessmentData) => number;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	frequencyOfDrinkingPoint: 0 | 1 | 2 | 3 | 4;
	typicalQuantityPoint: 0 | 1 | 2 | 3 | 4;
	heavyEpisodeFrequencyPoint: 0 | 1 | 2 | 3 | 4;
	/** Total 0..12. */
	auditcScore: number;
	riskBand: RiskBand;
	/** auditcScore >= 5 (UK default positive-screen cut). */
	positiveScreen: boolean;
	firedItems: FiredItem[];
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

/** A single 0-4 AUDIT-C response option. */
export interface ItemOption {
	value: 0 | 1 | 2 | 3 | 4;
	label: string;
}
