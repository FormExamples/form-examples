// ──────────────────────────────────────────────
// Angiography Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_angiography_test_result.sql and
// sql/05_create_table_angiography_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Angiography modality performed. */
export type AngiographyType =
	| 'ct-angiography'
	| 'mr-angiography'
	| 'catheter-dsa'
	| 'coronary-angiography'
	| 'peripheral-angiography'
	| 'cerebral-angiography'
	| 'other'
	| '';

/** Examined arterial territory. */
export type BodyRegion =
	| 'coronary'
	| 'cerebral'
	| 'carotid'
	| 'aorta'
	| 'renal'
	| 'peripheral-lower-limb'
	| 'pulmonary'
	| 'mesenteric'
	| 'other'
	| '';

/** Contrast actually administered. */
export type ContrastUsed = 'iodinated' | 'gadolinium' | 'none' | '';

/** Diagnostic adequacy of the examination. */
export type ExaminationAdequacy = 'adequate' | 'limited' | 'non-diagnostic' | '';

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
	significantStenosis: boolean;
	occlusion: boolean;
	aneurysm: boolean;
	dissection: boolean;
	activeExtravasation: boolean;
	thrombus: boolean;
	normalVessels: boolean;
	incidentalFinding: boolean;
}

// ─── The result/report record (sql/04) ───

/**
 * The angiography result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from.
 */
export interface AngiographyResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Examination
	angiographyType: AngiographyType;
	bodyRegion: BodyRegion;
	contrastUsed: ContrastUsed;
	examinationAdequacy: ExaminationAdequacy;

	// Clinical context
	clinicalHistory: string;
	comparisonWithPrevious: string;

	// Findings
	findingsNarrative: string;
	significantStenosis: boolean;
	occlusion: boolean;
	aneurysm: boolean;
	dissection: boolean;
	activeExtravasation: boolean;
	thrombus: boolean;
	normalVessels: boolean;
	incidentalFinding: boolean;

	// Measurements
	maxStenosisPercent: number | null;
	interventionPerformed: boolean;

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
 * sql/05_create_table_angiography_test_result_grade.sql.
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
	bodyRegion: BodyRegion;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
