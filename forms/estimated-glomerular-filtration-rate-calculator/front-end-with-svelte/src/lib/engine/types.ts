// ──────────────────────────────────────────────
// Core assessment data types (Estimated Glomerular Filtration Rate Calculator)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_estimated_glomerular_filtration_rate_calculator.sql`
// (`serum_creatinine_umol_l` -> `serumCreatinine`, `age_years` -> `ageYears`,
// `sex` -> `sex`, `steady_state` -> `steadyState`, `equation` -> `equation`).
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'pharmacist' | 'laboratory' | 'other' | '';
export type CareSetting =
	| 'primary-care'
	| 'secondary-care'
	| 'laboratory'
	| 'pharmacy'
	| 'other'
	| '';
export type Equation = 'ckd-epi-2021-creatinine' | 'ckd-epi-2021-cystatin-c' | 'mdrd' | '';
export type Sex = 'female' | 'male' | '';
export type YesNo = 'yes' | 'no' | '';
export type GStage = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null;
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	/** Estimating equation; the engine computes CKD-EPI 2021 creatinine. */
	equation: Equation;
}

/** Step 2 — patient identification (also holds the sex/age calculation inputs). */
export interface Identification {
	patientIdentifier: string;
	/** Patient age in whole years; drives the age-decay term. */
	ageYears: number | null;
	/** Drives kappa, alpha, and the female multiplier. */
	sex: Sex;
}

/** Step 3 — serum creatinine (the single laboratory calculation input). */
export interface Creatinine {
	/** Standardised (IDMS-traceable) serum creatinine in µmol/L. */
	serumCreatinine: number | null;
	/** ISO date string; '' when unset. */
	specimenDate: string;
	/** Whether renal function is at steady state. */
	steadyState: YesNo;
}

/** Step 4 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full eGFR assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	creatinine: Creatinine;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-STAGE-G3A-01. */
	id: string;
	/** conversion | equation | staging. */
	instrument: string;
	/** G1 | G2 | G3a | G3b | G4 | G5 | unknown. */
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

/** A CKD G-stage banding rule, evaluated against the unrounded eGFR. */
export interface StageRule {
	id: string;
	/** staging. */
	instrument: string;
	/** G1 | G2 | G3a | G3b | G4 | G5. */
	band: string;
	category: string;
	/** Short human-readable stage description. */
	label: string;
	description: string;
	evaluate: (egfr: number) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** Derived serum creatinine in mg/dL, rounded to 3 dp for display. */
	serumCreatinineMgDl: number | null;
	/** eGFR (mL/min/1.73 m²), rounded to a whole number for display. */
	egfr: number | null;
	/** Unrounded eGFR; drives banding and flag thresholds. */
	egfrRaw: number | null;
	egfrStage: GStage;
	egfrStageLabel: string;
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
