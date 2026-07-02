// ──────────────────────────────────────────────
// Core assessment data types (Corrected Calcium Calculator)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_corrected_calcium_calculator.sql`
// (`total_calcium_mmol_l` -> `totalCalcium`, `albumin_g_l` -> `albumin`,
// `symptomatic` -> `symptomatic`).
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'pharmacist' | 'laboratory-staff' | 'other' | '';
export type CareSetting =
	| 'general-practice'
	| 'ward'
	| 'emergency-department'
	| 'outpatient'
	| 'laboratory'
	| 'other'
	| '';
export type AgeBand = '18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type Classification = 'hypocalcaemia' | 'normal' | 'hypercalcaemia' | 'unknown';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	sampleReference: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — measured total calcium (calculation input 1). */
export interface Calcium {
	/** Measured total serum calcium in mmol/L. */
	totalCalcium: number | null;
}

/** Step 4 — measured serum albumin (calculation input 2). */
export interface Albumin {
	/** Measured serum albumin in g/L. */
	albumin: number | null;
}

/** Step 5 — calcium-related symptoms. */
export interface Symptoms {
	/** Supports the symptomatic-hypercalcaemia flag. */
	symptomatic: YesNo;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full corrected-calcium assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	calcium: Calcium;
	albumin: Albumin;
	symptoms: Symptoms;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-CLASSIFY-NORMAL-01. */
	id: string;
	/** correction | classification. */
	instrument: string;
	/** hypocalcaemia | normal | hypercalcaemia | unknown. */
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

/** A reference-range classification rule. */
export interface ClassificationRule {
	id: string;
	/** classification. */
	instrument: string;
	/** hypocalcaemia | normal | hypercalcaemia. */
	band: string;
	category: string;
	description: string;
	evaluate: (correctedCalcium: number) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** mmol/L, rounded to 2 dp for display. */
	correctedCalcium: number | null;
	/** Unrounded; drives classification and flag thresholds. */
	correctedCalciumRaw: number | null;
	classification: Classification;
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
