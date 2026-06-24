// ──────────────────────────────────────────────
// Holter Monitor Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_holter_monitor_test_result.sql and
// sql/05_create_table_holter_monitor_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Ambulatory monitor type actually used. */
export type MonitorType =
	| '24-hour'
	| '48-hour'
	| '7-day'
	| '14-day'
	| 'event-recorder'
	| 'implantable-loop-recorder'
	| 'other'
	| '';

/** Predominant underlying rhythm. */
export type PredominantRhythm = 'sinus' | 'atrial-fibrillation' | 'paced' | 'other' | '';

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
	| 'further-monitoring'
	| 'specialist-referral'
	| 'urgent-review'
	| '';

// ─── Structured findings ───

/**
 * Boolean structured findings captured alongside the narrative; they drive
 * classification, severity, and flags.
 */
export interface StructuredFindings {
	atrialFibrillationDetected: boolean;
	significantPauses: boolean;
	ventricularTachycardia: boolean;
	supraventricularTachycardia: boolean;
	highGradeAvBlock: boolean;
	symptomRhythmCorrelation: boolean;
	normalStudy: boolean;
}

// ─── The result/report record (sql/04) ───

/**
 * The Holter monitor result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from.
 */
export interface HolterMonitorResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	monitorType: MonitorType;
	performedDate: string;
	reportedDate: string;

	// Recording quality
	recordingDurationHours: number | null;
	analysedPercent: number | null;

	// Clinical context
	clinicalHistory: string;
	comparisonWithPrevious: string;

	// Rhythm and rate summary
	predominantRhythm: PredominantRhythm;
	meanHeartRateBpm: number | null;
	minimumHeartRateBpm: number | null;
	maximumHeartRateBpm: number | null;
	longestPauseSeconds: number | null;
	ventricularEctopicPercent: number | null;
	supraventricularEctopicPercent: number | null;

	// Structured findings
	atrialFibrillationDetected: boolean;
	significantPauses: boolean;
	ventricularTachycardia: boolean;
	supraventricularTachycardia: boolean;
	highGradeAvBlock: boolean;
	symptomRhythmCorrelation: boolean;
	normalStudy: boolean;

	// Findings, impression and follow-up
	findingsNarrative: string;
	impression: string;
	reportingCategory: string;
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
	| 'inadequate-recording'
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
 * sql/05_create_table_holter_monitor_test_result_grade.sql.
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
	monitorType: MonitorType;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
