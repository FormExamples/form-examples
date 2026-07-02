// ──────────────────────────────────────────────
// Core assessment data types (Pulmonary Embolism Rule-out Criteria — PERC)
//
// PERC is a status / classification instrument, not a numeric-score form: the
// engine emits a binary classification (perc-negative / perc-positive) from a
// boolean conjunction of the eight criteria and the pre-test-probability gate —
// it does not sum a total. camelCase property names mirror the snake_case SQL
// columns in `sql/04_create_table_pulmonary_embolism_rule_out_criteria.sql`
// (age, heart_rate, oxygen_saturation, pretest_probability, and the eight
// criterion inputs). Criteria 1-3 are derived from the objective numeric values
// (age, heart rate, SpO2); criteria 4-8 are yes/no clinical findings, each
// satisfied only in its reassuring 'no' state.
// ──────────────────────────────────────────────

export type ClinicianRole = 'physician' | 'advanced-practitioner' | 'nurse' | 'other' | '';
export type CareSetting = 'emergency-department' | 'acute-ambulatory' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type PretestProbability = 'low' | 'not-low' | '';
export type YesNo = 'yes' | 'no' | '';
export type Classification = 'perc-negative' | 'perc-positive' | '';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	presentingComplaint: string;
}

/** Step 2 — patient identification. `age` drives criterion 1 (age < 50). */
export interface Identification {
	patientIdentifier: string;
	/** Years; objective value behind criterion 1. */
	age: number | null;
	sex: Sex;
}

/**
 * Step 3 — applicability gate. PERC applies only when the gestalt pre-test
 * probability of PE is 'low'.
 */
export interface Pretest {
	pretestProbability: PretestProbability;
}

/** Step 4 — vital signs. Objective values behind criteria 2 and 3. */
export interface Vitals {
	/** Beats/min; criterion 2 (< 100). */
	heartRate: number | null;
	/** SpO2 %; criterion 3 (>= 95). */
	oxygenSaturation: number | null;
}

/**
 * Step 5 — clinical criteria 4-8. Each is a yes/no clinical finding, satisfied
 * only when 'no' (the reassuring state is positively documented).
 */
export interface Criteria {
	/** Criterion 4. */
	unilateralLegSwelling: YesNo;
	/** Criterion 5. */
	haemoptysis: YesNo;
	/** Criterion 6. */
	recentSurgeryOrTrauma: YesNo;
	/** Criterion 7. */
	priorVenousThromboembolism: YesNo;
	/** Criterion 8. */
	oestrogenUse: YesNo;
}

/** Step 6 — summary and result. */
export interface ResultNotes {
	clinicalNote: string;
}

/** The full PERC assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	pretest: Pretest;
	vitals: Vitals;
	criteria: Criteria;
	result: ResultNotes;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The evaluated state of a single PERC criterion. */
export interface CriterionResult {
	/** 1..8. */
	number: number;
	/** kebab-case criterion key mirroring SQL. */
	criterion: string;
	/** true when the reassuring state holds. */
	satisfied: boolean;
	/** Short human label. */
	label: string;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-AGE-UNDER-50-01. */
	id: string;
	/** criterion | gate | composite */
	instrument: string;
	/** Criterion satisfied (null for gate / composite rows). */
	satisfied: boolean | null;
	/** satisfied | failed | applicable | not-applicable | perc-negative | perc-positive */
	outcome: string;
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

/** A PERC criterion rule. */
export interface PercRule {
	id: string;
	/** 1..8. */
	number: number;
	/** kebab-case criterion key mirroring SQL. */
	criterion: string;
	/** Short human label. */
	label: string;
	category: string;
	/** Reassuring-state description. */
	description: string;
	/** true when the criterion is SATISFIED. */
	evaluate: (data: AssessmentData) => boolean;
}

/** The full classification result for one assessment. */
export interface GradingResult {
	classification: Classification;
	allCriteriaSatisfied: boolean;
	/** pretestProbability === 'low'. */
	applicable: boolean;
	/** One per criterion. */
	criterionResults: CriterionResult[];
	/** Subset of [1..8] that failed. */
	failedCriteria: number[];
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
