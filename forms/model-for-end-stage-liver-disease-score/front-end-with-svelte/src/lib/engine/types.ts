// ──────────────────────────────────────────────
// Core assessment data types (MELD — Model for End-Stage Liver Disease Score)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_model_for_end_stage_liver_disease_score.sql`
// (`bilirubin_unit` -> `bilirubinUnit`, `dialysis_sessions_past_week` ->
// `dialysisSessionsPastWeek`, `cvvhd_24h` -> `cvvhd24h`, `meld_variant` ->
// `meldVariant`).
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'hepatologist'
	| 'gastroenterologist'
	| 'transplant-coordinator'
	| 'intensivist'
	| 'other'
	| '';
export type CareSetting =
	| 'hepatology-clinic'
	| 'transplant-unit'
	| 'intensive-care'
	| 'ward'
	| 'other'
	| '';
/** The chosen instrument; drives which laboratory inputs are required. */
export type MeldVariant = 'meld' | 'meld-na' | 'meld-3' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type LabUnit = 'mg/dL' | 'umol/L' | '';
export type YesNo = 'yes' | 'no' | '';
export type MortalityBand = 'low' | 'moderate' | 'high' | 'very-high' | 'extreme' | '';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	/** Chosen instrument (drives required inputs). */
	meldVariant: MeldVariant;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	/** Female indicator used by MELD 3.0. */
	sex: Sex;
}

/** Step 3 — total bilirubin (calculation input 1). */
export interface Bilirubin {
	bilirubin: number | null;
	bilirubinUnit: LabUnit;
}

/** Step 4 — INR (calculation input 2). */
export interface Inr {
	inr: number | null;
}

/** Step 5 — serum creatinine and dialysis (calculation input 3 + dialysis rule). */
export interface Renal {
	creatinine: number | null;
	creatinineUnit: LabUnit;
	dialysisSessionsPastWeek: number | null;
	cvvhd24h: YesNo;
}

/** Step 6 — serum sodium (MELD-Na and MELD 3.0). */
export interface Sodium {
	sodium: number | null;
}

/** Step 7 — serum albumin (MELD 3.0). */
export interface Albumin {
	albumin: number | null;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full MELD assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	bilirubin: Bilirubin;
	inr: Inr;
	renal: Renal;
	sodium: Sodium;
	albumin: Albumin;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-BAND-HIGH-01. */
	id: string;
	/** conversion | dialysis | formula | band. */
	instrument: string;
	/** low | moderate | high | very-high | extreme | ''. */
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

/** A mortality-band classification rule, evaluated against the final clamped score. */
export interface BandRule {
	id: string;
	/** band. */
	instrument: string;
	/** low | moderate | high | very-high | extreme. */
	band: MortalityBand;
	category: string;
	description: string;
	/** Representative 3-month mortality estimate (%). */
	percent: number;
	evaluate: (score: number) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	bilirubinMgDl: number | null;
	creatinineMgDl: number | null;
	creatinineAdjusted: number | null;
	dialysisRuleApplied: boolean;
	/** 6..40 when computable; null when a required input is missing. */
	meldScore: number | null;
	mortalityBand: MortalityBand;
	estimatedMortalityPercent: number | null;
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
