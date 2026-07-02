// ──────────────────────────────────────────────
// Core assessment data types (Apgar Score)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_apgar_score.sql` (parent context + identification) and
// `sql/05_create_table_apgar_score_timepoint.sql` (the repeated per-timepoint
// five-sign scores).
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'midwife'
	| 'obstetrician'
	| 'neonatologist'
	| 'neonatal-nurse'
	| 'paediatrician'
	| 'other'
	| '';
export type CareSetting =
	| 'delivery-room'
	| 'theatre'
	| 'birth-centre'
	| 'home'
	| 'neonatal-unit'
	| 'other'
	| '';
export type ModeOfDelivery = 'vaginal' | 'assisted' | 'caesarean' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
/** A single 0/1/2 sign selection; '' when unanswered. */
export type SignScore = '0' | '1' | '2' | '';
export type Band = 'reassuring' | 'moderately-low' | 'low';
export type Trend = 'improving' | 'static' | 'falling' | 'insufficient';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — birth context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	bornAt: string;
	careSetting: CareSetting;
	/** Completed weeks of gestation; null when unset. */
	gestationalAgeWeeks: number | null;
	modeOfDelivery: ModeOfDelivery;
}

/** Step 2 — newborn identification. */
export interface Identification {
	newbornIdentifier: string;
	sex: Sex;
	/** Birth order for multiple births (1 for a singleton); null when unset. */
	birthOrder: number | null;
}

/**
 * One repeated timepoint (mirrors an apgar_score_timepoint row). The five
 * signs are each an explicit 0/1/2 selection; `total` and `band` are derived
 * by the grader and never stored as input here.
 */
export interface Timepoint {
	/** Minutes after birth: 1, 5, 10, 15, 20, ...; null when unset. */
	timepointMinutes: number | null;
	/** Sign A — appearance (skin colour). */
	appearance: SignScore;
	/** Sign P — pulse (heart rate). */
	pulse: SignScore;
	/** Sign G — grimace (reflex irritability). */
	grimace: SignScore;
	/** Sign A — activity (muscle tone). */
	activity: SignScore;
	/** Sign R — respiration. */
	respiration: SignScore;
}

/** The five sign fields on a timepoint (everything except the minutes). */
export type SignField = 'appearance' | 'pulse' | 'grimace' | 'activity' | 'respiration';

/** Step 4 — resuscitation measures and clinician note. */
export interface Summary {
	resuscitationMeasures: string;
	clinicianNote: string;
}

/** The full Apgar-score assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	/** Repeated per-timepoint five-sign scores. */
	timepoints: Timepoint[];
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The derived per-timepoint result (0-10 total + band). */
export interface GradedTimepoint {
	timepointMinutes: number | null;
	/** 0-10 — the sum of the five signs. */
	total: number;
	/** reassuring | moderately-low | low. */
	band: Band;
	/** How many of the five signs were answered. */
	answeredCount: number;
	/** True when at least one sign was answered. */
	scored: boolean;
}

/** A sign that scored below 2 at a scored timepoint (surfaced in the report). */
export interface FiredSign {
	/** Stable rule id, e.g. R-APPEARANCE-01. */
	id: string;
	timepointMinutes: number | null;
	/** appearance | pulse | grimace | activity | respiration. */
	sign: string;
	/** The 0/1/2 selection for this sign. */
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

/** An Apgar sign-scoring rule. */
export interface ApgarRule {
	id: string;
	/** appearance | pulse | grimace | activity | respiration. */
	sign: SignField;
	/** A | P | G | A | R. */
	letter: string;
	category: string;
	description: string;
	/** The selected 0/1/2 for this sign (0 when unanswered). */
	score: (t: Timepoint) => number;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	timepoints: GradedTimepoint[];
	trend: Trend;
	firedSigns: FiredSign[];
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

/** One of the five Apgar signs, with its per-score descriptions. */
export interface SignDefinition {
	field: SignField;
	letter: string;
	label: string;
	scores: Record<'0' | '1' | '2', string>;
}
