// ──────────────────────────────────────────────
// Electrocardiogram Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_electrocardiogram_test_result.sql and
// sql/05_create_table_electrocardiogram_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Recorded ECG type. */
export type EcgType =
	| 'resting-12-lead'
	| 'exercise-stress'
	| 'ambulatory-holter-24h'
	| 'ambulatory-48h'
	| 'event-recorder'
	| 'other'
	| '';

/** Technical recording quality of the trace. */
export type RecordingQuality = 'good' | 'adequate' | 'poor' | '';

/** Dominant rhythm. */
export type Rhythm =
	| 'sinus'
	| 'atrial-fibrillation'
	| 'atrial-flutter'
	| 'svt'
	| 'ventricular-tachycardia'
	| 'heart-block'
	| 'paced'
	| 'other'
	| '';

/** Frontal-plane cardiac axis. */
export type CardiacAxis = 'normal' | 'left-deviation' | 'right-deviation' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — overall result classification. */
export type ResultClassification = 'normal' | 'abnormal' | 'critical' | 'inconclusive' | '';

/** Axis B — abnormality severity. */
export type AbnormalitySeverity = 'none' | 'minor' | 'moderate' | 'major' | '';

/** Axis D — follow-up urgency. */
export type FollowUpUrgency = 'routine' | 'recommended' | 'urgent' | 'critical-alert' | '';

/** Overall recommendation. */
export type Recommendation =
	| 'no-action'
	| 'routine-follow-up'
	| 'further-imaging'
	| 'specialist-referral'
	| 'urgent-review'
	| '';

// ─── Structured findings ───

/**
 * Boolean structured electrophysiological findings captured alongside the
 * narrative; they drive classification, severity, and flags.
 */
export interface StructuredFindings {
	stElevation: boolean;
	stDepression: boolean;
	tWaveInversion: boolean;
	pathologicalQWaves: boolean;
	leftVentricularHypertrophy: boolean;
	bundleBranchBlock: boolean;
	ischaemia: boolean;
	normalEcg: boolean;
}

// ─── The result/report record (sql/04) ───

/**
 * The ECG (electrocardiogram) test result (report) — the source-of-truth
 * record the four-axis interpretation grade is computed from.
 */
export interface ElectrocardiogramResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	ecgType: EcgType;
	performedDate: string;
	reportedDate: string;
	recordingQuality: RecordingQuality;

	// Clinical context
	clinicalHistory: string;
	comparisonWithPrevious: string;

	// Rate, rhythm, and intervals
	ventricularRateBpm: number | null;
	rhythm: Rhythm;
	prIntervalMs: number | null;
	qrsDurationMs: number | null;
	qtIntervalMs: number | null;
	qtcMs: number | null;
	cardiacAxis: CardiacAxis;

	// Structured findings
	stElevation: boolean;
	stDepression: boolean;
	tWaveInversion: boolean;
	pathologicalQWaves: boolean;
	leftVentricularHypertrophy: boolean;
	bundleBranchBlock: boolean;
	ischaemia: boolean;
	normalEcg: boolean;

	// Interpretation and conclusion
	interpretation: string;
	reportingCategory: string;
	impression: string;
	recommendedFollowUp: string;

	// Critical-result communication and sign-off
	criticalResultCommunicated: boolean;
	reportedTo: string;
	clinicianNotes: string;
	signed: boolean;
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'classification' | 'severity' | 'completeness' | 'follow-up';

/** Flag category (mirrors the sql/07 CHECK constraint). */
export type FlagCategory =
	| 'critical-result-alert'
	| 'incidental-finding'
	| 'discrepancy-with-request'
	| 'abnormal-requiring-action'
	| 'urgent-referral'
	| 'inadequate-technique'
	| 'unexpected-finding'
	| 'missing-impression'
	| 'missing-measurement'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: Axis;
	category: string;
	description: string;
}

/** A safety-critical flag, independent of the four axes. */
export interface Flag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/**
 * The computed four-axis interpretation grade. Mirrors
 * sql/05_create_table_electrocardiogram_test_result_grade.sql.
 */
export interface GradingResult {
	// Axis A
	resultClassification: ResultClassification;
	// Axis B
	abnormalitySeverity: AbnormalitySeverity;
	reportingCategory: string;
	// Axis C
	reportCompletenessPercent: number;
	// Axis D
	followUpUrgency: FollowUpUrgency;
	targetTimeframe: string;
	recommendedAction: string;
	// Overall
	recommendation: Recommendation;
	firedRules: FiredRule[];
	flags: Flag[];
	gradedAt: string;
}

// ─── Step configuration ───

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

// ─── Dashboard row ───

/** A graded report row for the dashboard table. */
export interface ReportRow {
	id: string;
	patientName: string;
	ecgType: EcgType;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
