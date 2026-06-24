// ──────────────────────────────────────────────
// Mammography Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_mammography_test_result.sql and
// sql/05_create_table_mammography_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Type of mammography performed. */
export type ExamType = 'screening' | 'diagnostic' | 'symptomatic' | 'surveillance' | 'other' | '';

/** Examined side. */
export type Laterality = 'left' | 'right' | 'bilateral' | '';

/** Diagnostic adequacy of the examination. */
export type ExaminationAdequacy = 'adequate' | 'limited' | 'non-diagnostic' | '';

/**
 * ACR BI-RADS breast composition / density.
 * a = almost entirely fatty, b = scattered fibroglandular,
 * c = heterogeneously dense, d = extremely dense.
 */
export type BreastDensity = 'a' | 'b' | 'c' | 'd' | '';

/**
 * ACR BI-RADS final assessment category (the key structured score):
 * 0 = incomplete; 1 = negative; 2 = benign; 3 = probably benign;
 * 4a/4b/4c = suspicious (low / intermediate / moderate);
 * 5 = highly suggestive of malignancy; 6 = known biopsy-proven malignancy.
 */
export type BiRadsCategory = '0' | '1' | '2' | '3' | '4a' | '4b' | '4c' | '5' | '6' | '';

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
	mass: boolean;
	calcifications: boolean;
	architecturalDistortion: boolean;
	asymmetry: boolean;
	skinOrNippleChange: boolean;
	lymphadenopathy: boolean;
	incidentalFinding: boolean;
}

// ─── The result/report record (sql/04) ───

/**
 * The mammography result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from.
 */
export interface MammographyResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Examination
	examType: ExamType;
	laterality: Laterality;
	examinationAdequacy: ExaminationAdequacy;
	breastDensity: BreastDensity;

	// Clinical context
	clinicalHistory: string;
	comparisonWithPrevious: string;

	// Findings
	findingsNarrative: string;
	mass: boolean;
	calcifications: boolean;
	architecturalDistortion: boolean;
	asymmetry: boolean;
	skinOrNippleChange: boolean;
	lymphadenopathy: boolean;
	incidentalFinding: boolean;

	// Measurements
	largestLesionSizeMm: number | null;

	// Impression and structured score
	impression: string;
	biRadsCategory: BiRadsCategory;
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
 * sql/05_create_table_mammography_test_result_grade.sql.
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
	examType: ExamType;
	laterality: Laterality;
	biRadsCategory: BiRadsCategory;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
