// ──────────────────────────────────────────────
// Core data types — Fluid Balance Chart
//
// This is a MULTI-TABLE form: a parent chart header plus TWO one-to-many child
// lists of timed line items — the intake rows and the output rows. Both mirror
// the SQL child table `fluid_balance_chart_entry` (distinguished there by a
// `direction` column); here they are modelled as two separate arrays on the
// store data so each has its own add/remove repeating-row editor.
//
// The engine is NOT a validated named score: it arithmetically reconciles the
// recorded volumes, computes totals, the running/cumulative net balance, and the
// weight-indexed urine-output rate (mL/kg/h), then grades the resulting FLUID
// STATUS (Balanced / Positive / Negative / Oliguria) and — independently —
// raises safety flags.
//
// camelCase property names mirror the snake_case SQL columns in the parent table
// `sql/04_create_table_fluid_balance_chart.sql` and the child table
// `sql/05_create_table_fluid_balance_chart_entry.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'nurse' | 'doctor' | 'healthcare-assistant' | 'other' | '';
export type Direction = 'intake' | 'output';
export type IntakeCategory = 'oral' | 'iv' | 'enteral' | 'blood-products' | 'other-intake';
export type OutputCategory = 'urine' | 'drains' | 'vomit-ng' | 'stool' | 'insensible-other';
export type Category = IntakeCategory | OutputCategory | '';
export type FluidStatus = 'balanced' | 'positive' | 'negative' | 'oliguria';
export type Priority = 'high' | 'medium' | 'low';

/**
 * One timed intake / output line item — mirrors one row of the child table
 * `fluid_balance_chart_entry`. The direction is implied by which array holds it.
 */
export interface Entry {
	/** ISO-ish datetime-local string; '' when unset. */
	entryAt: string;
	category: Category;
	/** Optional route / free-text description. */
	description: string;
	/** Recorded volume in millilitres; null when unset. */
	volumeMl: number | null;
}

/** Step 1 — chart context (mirrors the chart-header context fields). */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	patientIdentifier: string;
	wardOrUnit: string;
	/** ISO-ish datetime-local string; '' when unset. */
	chartStartAt: string;
	/** Charting period in hours (default 24). */
	chartPeriodHours: number | null;
}

/** Step 2 — patient weight. */
export interface Patient {
	/** Patient weight in kilograms; null when unset. */
	weightKg: number | null;
}

/** Step 5 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full fluid-balance chart data model (parent header + two child lists). */
export interface ChartData {
	context: Context;
	patient: Patient;
	intake: Entry[];
	output: Entry[];
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** One point on the time-sorted cumulative-balance trace. */
export interface RunningBalancePoint {
	entryAt: string;
	balanceMl: number;
}

/** One reconciliation-rule firing in the audit trail (mirrors `..._grade_rule`). */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the `..._grade_flag` SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full reconciliation + grading result for one chart. */
export interface GradingResult {
	totalIntakeMl: number;
	totalOutputMl: number;
	/** intake − output; positive = net gain. */
	netBalanceMl: number;
	intakeByCategory: Record<string, number>;
	outputByCategory: Record<string, number>;
	runningBalance: RunningBalancePoint[];
	urineOutputMl: number;
	hoursObserved: number;
	weightKg: number | null;
	urineOutputRateMlPerKgPerHour: number | null;
	positiveThresholdMl: number;
	negativeThresholdMl: number;
	fluidStatus: FluidStatus;
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
	section: keyof ChartData;
}
