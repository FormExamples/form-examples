// ──────────────────────────────────────────────
// Hearing Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_hearing_test_result.sql and
// sql/05_create_table_hearing_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Performed audiology test type. */
export type TestType =
	| 'pure-tone-audiometry'
	| 'tympanometry'
	| 'speech-audiometry'
	| 'otoacoustic-emissions'
	| 'auditory-brainstem-response'
	| 'newborn-hearing-screen'
	| 'other'
	| '';

/** Reliability / validity of the test result. */
export type TestReliability = 'good' | 'fair' | 'poor' | '';

/** Per-ear hearing-loss type. */
export type HearingLossType = 'none' | 'conductive' | 'sensorineural' | 'mixed' | '';

/** Per-ear hearing-loss severity (BSA audiometric descriptors). */
export type HearingLossSeverity =
	| 'normal'
	| 'mild'
	| 'moderate'
	| 'moderately-severe'
	| 'severe'
	| 'profound'
	| '';

/** Per-ear tympanogram type (Jerger classification). */
export type TympanometryType = 'A' | 'As' | 'Ad' | 'B' | 'C' | '';

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
 * Boolean structured findings captured alongside the narrative; they drive
 * classification, severity, and flags.
 */
export interface StructuredFindings {
	hearingLossPresent: boolean;
	asymmetricLoss: boolean;
	suddenSensorineuralLoss: boolean;
	conductiveComponent: boolean;
	normalHearing: boolean;
}

// ─── The result/report record (sql/04) ───

/**
 * The hearing test result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from.
 */
export interface HearingResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Examination
	testType: TestType;
	testReliability: TestReliability;

	// Clinical context
	clinicalHistory: string;

	// Audiometry & interpretation
	pureToneAverageRightDb: number | null;
	pureToneAverageLeftDb: number | null;
	hearingLossTypeRight: HearingLossType;
	hearingLossTypeLeft: HearingLossType;
	hearingLossSeverityRight: HearingLossSeverity;
	hearingLossSeverityLeft: HearingLossSeverity;
	tympanometryTypeRight: TympanometryType;
	tympanometryTypeLeft: TympanometryType;

	// Findings
	findingsNarrative: string;
	hearingLossPresent: boolean;
	asymmetricLoss: boolean;
	suddenSensorineuralLoss: boolean;
	conductiveComponent: boolean;
	normalHearing: boolean;

	// Impression and follow-up
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
	| 'sudden-sensorineural-loss'
	| 'asymmetric-loss-retrocochlear'
	| 'discrepancy-with-request'
	| 'abnormal-requiring-action'
	| 'urgent-referral'
	| 'unreliable-test'
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
 * sql/05_create_table_hearing_test_result_grade.sql.
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
	testType: TestType;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
