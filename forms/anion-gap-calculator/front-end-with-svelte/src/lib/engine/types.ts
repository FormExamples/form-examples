// ──────────────────────────────────────────────
// Core assessment data types (Anion Gap Calculator)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_anion_gap_calculator.sql`
// (`sodium_mmol_l` -> `sodium`, `potassium_mmol_l` -> `potassium`,
// `chloride_mmol_l` -> `chloride`, `bicarbonate_mmol_l` -> `bicarbonate`,
// `albumin_g_l` -> `albumin`). Whether potassium is included in the formula
// (`includesPotassium`) is *derived* from whether a potassium value is
// entered, per spec §4, so the wizard exposes no separate toggle.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'scientist' | 'pharmacist' | 'other' | '';
export type CareSetting =
	| 'emergency-department'
	| 'ward'
	| 'intensive-care'
	| 'laboratory'
	| 'other'
	| '';
export type AgeBand = '18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type Classification = 'low' | 'normal' | 'high' | 'very-high' | 'unknown';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	calculatedAt: string;
	careSetting: CareSetting;
	clinicalContext: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/**
 * Step 3 — electrolyte panel (calculation inputs). Sodium, chloride, and
 * bicarbonate are required; potassium is optional and selects the
 * potassium-inclusive formula and reference range.
 */
export interface Electrolytes {
	/** Serum sodium in mmol/L. */
	sodium: number | null;
	/** Serum potassium in mmol/L (optional). */
	potassium: number | null;
	/** Serum chloride in mmol/L. */
	chloride: number | null;
	/** Serum bicarbonate (HCO3-) in mmol/L. */
	bicarbonate: number | null;
}

/** Step 4 — serum albumin (optional; enables the albumin correction). */
export interface Albumin {
	/** Serum albumin in g/L. */
	albumin: number | null;
}

/** Step 5 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full anion-gap assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	electrolytes: Electrolytes;
	albumin: Albumin;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-CLASSIFY-HIGH-01. */
	id: string;
	/** formula | correction | classification. */
	instrument: string;
	/** low | normal | high | very-high | ''. */
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
	/** low | normal | high | very-high. */
	band: string;
	category: string;
	description: string;
	evaluate: (value: number, normalLow: number, normalHigh: number) => boolean;
}

/**
 * A snapshot of the numeric grader output that flagged-issue detection reads.
 * Kept separate from the full result so `detectFlaggedIssues` has no cyclic
 * dependency on `GradingResult`.
 */
export interface GradeSnapshot {
	anionGapRaw: number | null;
	correctedAnionGapRaw: number | null;
	classificationValue: number | null;
	normalLow: number;
	normalHigh: number;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** True when a serum potassium was entered (potassium-inclusive formula). */
	includesPotassium: boolean;
	/** mmol/L, rounded to 1 dp for display. */
	anionGap: number | null;
	/** Unrounded raw anion gap. */
	anionGapRaw: number | null;
	/** mmol/L, rounded to 1 dp for display. */
	correctedAnionGap: number | null;
	/** Unrounded albumin-corrected gap. */
	correctedAnionGapRaw: number | null;
	normalLow: number;
	normalHigh: number;
	/** Unrounded value driving the band (corrected when available, else raw). */
	classificationValue: number | null;
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
