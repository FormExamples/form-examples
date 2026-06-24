// ──────────────────────────────────────────────
// Urinalysis Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_urinalysis_test_result.sql and
// sql/05_create_table_urinalysis_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Specimen type. */
export type SpecimenType = 'midstream' | 'catheter' | 'clean-catch' | '24h' | 'random' | '';

/** Specimen condition on receipt / analysis. */
export type SpecimenCondition = 'satisfactory' | 'contaminated' | 'insufficient' | 'delayed' | '';

/** Dipstick semi-quantitative reagent grade (leucocytes / protein / blood / glucose / ketones / bilirubin). */
export type DipstickGrade = 'negative' | 'trace' | 'plus-one' | 'plus-two' | 'plus-three' | '';

/** Dipstick nitrite result. */
export type NitriteResult = 'negative' | 'positive' | '';

/** Culture outcome. */
export type CultureResult =
	| 'no-growth'
	| 'mixed-growth-likely-contaminant'
	| 'significant-growth'
	| '';

// ─── Axis enumerations (grade) ───

/** Axis A — overall result classification. */
export type ResultClassification = 'normal' | 'abnormal' | 'critical' | 'inconclusive' | '';

/** Axis B — abnormality severity. */
export type AbnormalitySeverity = 'none' | 'minor' | 'moderate' | 'major' | '';

/** Axis D — follow-up urgency. */
export type FollowUpUrgency = 'routine' | 'recommended' | 'urgent' | 'critical-alert' | '';

/** Overall result status recorded by the reporting clinician (sql/04). */
export type OverallResultStatus = 'normal' | 'abnormal' | 'critical' | '';

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
 * The urinalysis result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from.
 */
export interface UrinalysisResult {
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
	pregnant: boolean;

	// Dipstick (reagent strip) results
	leucocytes: DipstickGrade;
	nitrites: NitriteResult;
	protein: DipstickGrade;
	blood: DipstickGrade;
	glucose: DipstickGrade;
	ketones: DipstickGrade;
	bilirubin: DipstickGrade;
	ph: number | null;
	specificGravity: number | null;

	// Microscopy
	redCellCount: string;
	whiteCellCount: string;
	epithelialCells: string;
	casts: string;
	organismsSeen: boolean;
	crystals: string;

	// Culture
	cultureResult: CultureResult;
	organismIsolated: string;
	colonyCountCfuMl: string;
	antibioticSensitivities: string;

	// Interpretation
	overallResultStatus: OverallResultStatus;
	findingsNarrative: string;
	impression: string;
	reportingCategory: string;
	recommendedFollowUp: string;

	// Structured critical-finding flags (drive auto-escalation)
	visibleHaematuria: boolean;
	suspectedUrosepsis: boolean;
	criticalOrganism: boolean;

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
 * sql/05_create_table_urinalysis_test_result_grade.sql.
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
	specimenType: SpecimenType;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
