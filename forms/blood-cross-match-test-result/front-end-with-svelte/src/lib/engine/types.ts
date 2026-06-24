// ──────────────────────────────────────────────
// Blood Cross-Match Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_blood_cross_match_test_result.sql and
// sql/05_create_table_blood_cross_match_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Test the result reports against. */
export type RequestType =
	| 'group-and-save'
	| 'crossmatch'
	| 'antibody-screen'
	| 'emergency-issue'
	| '';

/** Determined ABO group. */
export type AboGroup = 'a' | 'b' | 'o' | 'ab' | '';

/** Determined RhD group. */
export type RhdGroup = 'positive' | 'negative' | '';

/** Antibody screen result. */
export type AntibodyScreenResult = 'negative' | 'positive' | '';

/** Crossmatch / compatibility outcome. */
export type CrossmatchResult =
	| 'compatible'
	| 'incompatible'
	| 'electronic-issue'
	| 'not-performed'
	| '';

/** Blood component the result relates to. */
export type Component =
	| 'red-cells'
	| 'platelets'
	| 'fresh-frozen-plasma'
	| 'cryoprecipitate'
	| 'none'
	| '';

/** Overall result status. */
export type OverallResultStatus = 'normal' | 'abnormal' | 'critical' | '';

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
	| 'further-testing'
	| 'specialist-referral'
	| 'urgent-review'
	| '';

// ─── The result/report record (sql/04) ───

/**
 * The blood cross-match / transfusion compatibility result (report) — the
 * source-of-truth record the four-axis interpretation grade is computed from.
 */
export interface BloodCrossMatchResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Test requested / context
	requestType: RequestType;
	clinicalHistory: string;

	// ABO / Rh grouping
	aboGroup: AboGroup;
	rhdGroup: RhdGroup;
	historicalGroupConcordant: boolean;

	// Antibody screen / identification
	antibodyScreenResult: AntibodyScreenResult;
	antibodiesIdentified: string;

	// Crossmatch / compatibility
	crossmatchResult: CrossmatchResult;
	component: Component;
	unitsCrossmatched: number | null;
	unitsAvailable: number | null;
	specialRequirements: string;

	// Identity / sample safety
	twoSampleRuleMet: boolean;

	// Overall result and interpretation
	overallResultStatus: OverallResultStatus;
	findingsNarrative: string;
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
 * sql/05_create_table_blood_cross_match_test_result_grade.sql.
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
	requestType: RequestType;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
