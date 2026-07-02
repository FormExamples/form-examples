// ──────────────────────────────────────────────
// Core assessment data types (Edinburgh Postnatal Depression Scale, EPDS)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_edinburgh_postnatal_depression_scale.sql`.
//
// Item responses store the RAW selected option index 0..3 (the printed
// top-to-bottom order shown on the questionnaire), or `null` when unanswered.
// Reverse scoring for items 3, 5, 6, 7, 8, 9 and 10 is applied in the grader
// (`epds-grader.ts` via `epds-rules.ts`), which converts the raw option index
// into the 0..3 symptom score (higher = more symptomatic).
// ──────────────────────────────────────────────

export type ClinicianRole = 'midwife' | 'health-visitor' | 'gp' | 'perinatal-mh' | 'other' | '';
export type CareSetting =
	| 'maternity'
	| 'community'
	| 'general-practice'
	| 'perinatal-mh'
	| 'other'
	| '';
export type PerinatalStage = 'antenatal' | 'postnatal' | '';
export type AgeBand = 'under-20' | '20-29' | '30-39' | '40-plus' | '';
export type AssistanceNeeded = 'none' | 'interpreter' | 'clinician-read' | 'other' | '';
export type Band = 'lower' | 'possible' | 'likely';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	careSetting: CareSetting;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	perinatalStage: PerinatalStage;
	/** Gestational week (antenatal) or postnatal week; null when unset. */
	perinatalWeek: number | null;
}

/** Step 2 — respondent identification. */
export interface Identification {
	respondentIdentifier: string;
	ageBand: AgeBand;
	preferredLanguage: string;
	assistanceNeeded: AssistanceNeeded;
}

/**
 * Steps 3-5 — the ten item responses. Each value is the RAW selected option
 * index 0..3 (printed order), or null when unanswered.
 */
export interface Items {
	item1: number | null;
	item2: number | null;
	item3: number | null;
	item4: number | null;
	item5: number | null;
	item6: number | null;
	item7: number | null;
	item8: number | null;
	item9: number | null;
	item10: number | null;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full EPDS assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	items: Items;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived audit row (mirrors the grade_rule SQL table). */
export interface FiredItem {
	/** Stable rule id, e.g. R-ITEM-10-SCORE. */
	id: string;
	/** item | total | band | self-harm | anxiety-subscale */
	parameter: string;
	/** Points contributed (0..3), where applicable. */
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

/** A single EPDS item definition. */
export interface EpdsItem {
	/** 1..10 */
	number: number;
	/** State key: 'item1' .. 'item10'. */
	field: keyof Items;
	/** The item statement (past 7 days). */
	statement: string;
	direction: 'normal' | 'reverse';
	/** Four option labels in printed order (index 0..3). */
	options: string[];
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** Ten entries, each 0..3 (reverse-corrected; missing → 0). */
	itemScores: number[];
	/** 0..30 */
	totalScore: number;
	band: Band;
	/** Item 10 reverse-corrected score 0..3. */
	item10Score: number;
	/** Item 10 score > 0 (independent of the total). */
	selfHarmFlag: boolean;
	/** Anxiety subscale (EPDS-3A): items 3, 4 and 5, 0..9. */
	anxietySubscale: number;
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
