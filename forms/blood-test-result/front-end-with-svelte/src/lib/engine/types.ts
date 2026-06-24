// ──────────────────────────────────────────────
// Blood Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_blood_test_result.sql and
// sql/05_create_table_blood_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Specimen type analysed. */
export type SpecimenType = 'serum' | 'plasma' | 'whole-blood' | '';

/** Specimen condition / quality. */
export type SpecimenCondition =
	| 'satisfactory'
	| 'haemolysed'
	| 'lipaemic'
	| 'clotted'
	| 'insufficient'
	| '';

/** Overall result status summarised by the reporter. */
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
	| 'repeat-test'
	| 'specialist-referral'
	| 'urgent-review'
	| '';

// ─── The result/report record (sql/04) ───

/**
 * The blood / pathology test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from. Analyte values are nullable
 * `number` (null when the analyte was not measured).
 */
export interface BloodTestResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Specimen
	specimenType: SpecimenType;
	specimenCondition: SpecimenCondition;

	// Clinical context
	clinicalHistory: string;

	// Result values — full blood count (FBC)
	haemoglobinGL: number | null;
	whiteCellCount: number | null;
	platelets: number | null;
	neutrophils: number | null;

	// Result values — urea and electrolytes (U&E) / renal
	sodiumMmolL: number | null;
	potassiumMmolL: number | null;
	ureaMmolL: number | null;
	creatinineUmolL: number | null;
	egfr: number | null;

	// Result values — liver function tests (LFT)
	altUL: number | null;
	alkalinePhosphatase: number | null;
	bilirubinUmolL: number | null;
	albuminGL: number | null;

	// Result values — inflammation, glycaemic, endocrine, haematinics, coagulation
	cReactiveProtein: number | null;
	hba1cMmolMol: number | null;
	glucoseMmolL: number | null;
	tsh: number | null;
	ferritin: number | null;
	inr: number | null;

	// Overall interpretation summary
	overallResultStatus: OverallResultStatus;
	abnormalResultsPresent: boolean;
	criticalValuePresent: boolean;
	criticalValueDetail: string;
	findingsNarrative: string;
	comparisonWithPrevious: string;
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
	| 'inadequate-specimen'
	| 'unexpected-finding'
	| 'missing-impression'
	| 'missing-result-value'
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
 * sql/05_create_table_blood_test_result_grade.sql.
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
	overallResultStatus: OverallResultStatus;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
