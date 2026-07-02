// ──────────────────────────────────────────────
// Core assessment data types (Body Mass Index and Body Surface Area Calculator)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_body_mass_index_and_body_surface_area_calculator.sql`
// (`height_cm` -> `heightCm`, `weight_kg` -> `weightKg`, `bsa_formula` ->
// `bsaFormula`).
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'pharmacist' | 'dietitian' | 'other' | '';
export type CareSetting =
	| 'primary-care'
	| 'outpatient'
	| 'inpatient'
	| 'oncology'
	| 'pre-operative'
	| 'other'
	| '';
export type Purpose = 'screening' | 'drug-dosing' | 'monitoring' | 'other' | '';
export type AgeBand = '18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type Ancestry = 'asian' | 'other' | 'unspecified' | '';
export type BsaFormula = 'mosteller' | 'du-bois' | '';
export type BmiCategory =
	| 'underweight'
	| 'normal'
	| 'overweight'
	| 'obese-class-1'
	| 'obese-class-2'
	| 'obese-class-3'
	| '';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	purpose: Purpose;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	/** Drives the Asian lower-threshold action-point flags. */
	ancestry: Ancestry;
}

/** Step 3 — measured height (calculation input 1). */
export interface Height {
	/** Measured height in centimetres. */
	heightCm: number | null;
}

/** Step 4 — measured weight (calculation input 2). */
export interface Weight {
	/** Measured weight in kilograms. */
	weightKg: number | null;
}

/** Step 5 — results: preferred BSA formula and clinician free-text note. */
export interface Results {
	/** Which BSA value to show as primary. */
	bsaFormula: BsaFormula;
	clinicalNote: string;
}

/** The full BMI/BSA assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	height: Height;
	weight: Weight;
	results: Results;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired threshold row (mirrors the grade_rule SQL table). */
export interface FiredThreshold {
	/** Stable threshold id, e.g. T-WHO-OVERWEIGHT-01. */
	id: string;
	/** bmi-category | asian-threshold. */
	instrument: string;
	/** WHO category or Asian action point. */
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

/** A WHO adult weight-status band rule. */
export interface CategoryRule {
	id: string;
	/** bmi-category. */
	instrument: string;
	/** underweight | normal | overweight | obese-class-1 | obese-class-2 | obese-class-3. */
	band: string;
	category: string;
	description: string;
	evaluate: (bmi: number) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** kg/m², rounded to 1 dp for display. */
	bmi: number | null;
	/** Unrounded; drives banding and every flag threshold. */
	bmiRaw: number | null;
	bmiCategory: BmiCategory;
	/** m², rounded to 2 dp for display. */
	bsaMosteller: number | null;
	/** m², rounded to 2 dp for display. */
	bsaDuBois: number | null;
	firedThresholds: FiredThreshold[];
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
