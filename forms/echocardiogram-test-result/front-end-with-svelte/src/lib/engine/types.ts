// ──────────────────────────────────────────────
// Echocardiogram Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_echocardiogram_test_result.sql and
// sql/05_create_table_echocardiogram_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Performed echo modality. */
export type EchoType =
	| 'transthoracic-tte'
	| 'transoesophageal-toe'
	| 'stress-echo'
	| 'contrast-echo'
	| 'other'
	| '';

/** Acoustic-window / image quality of the study. */
export type StudyQuality = 'good' | 'adequate' | 'limited' | 'poor' | '';

/** Qualitative left-ventricular systolic function. */
export type LvFunction =
	| 'normal'
	| 'mildly-impaired'
	| 'moderately-impaired'
	| 'severely-impaired'
	| '';

/** Valve stenosis / regurgitation severity grade. */
export type ValveGrade = 'none' | 'mild' | 'moderate' | 'severe' | '';

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

// ─── The result/report record (sql/04) ───

/**
 * The echocardiogram result (report) — the source-of-truth record the four-axis
 * interpretation grade is computed from.
 */
export interface EchocardiogramResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	echoType: EchoType;
	reportStatus: ReportStatus;
	studyQuality: StudyQuality;
	performedDate: string;
	reportedDate: string;

	// Clinical context
	clinicalHistory: string;

	// Left-ventricular function and dimensions
	lvEjectionFractionPercent: number | null;
	lvFunction: LvFunction;
	lvInternalDiameterDiastoleMm: number | null;
	lvHypertrophy: boolean;
	regionalWallMotionAbnormality: boolean;

	// Valves
	aorticStenosis: ValveGrade;
	aorticRegurgitation: ValveGrade;
	mitralStenosis: ValveGrade;
	mitralRegurgitation: ValveGrade;

	// Pulmonary pressures
	pulmonaryArterySystolicPressureMmhg: number | null;

	// Structured findings
	pericardialEffusion: boolean;
	vegetation: boolean;
	intracardiacThrombus: boolean;
	normalStudy: boolean;

	// Findings and impression
	findingsNarrative: string;
	comparisonWithPrevious: string;
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
	| 'severe-valve-disease'
	| 'suspected-endocarditis'
	| 'pericardial-effusion-tamponade'
	| 'severe-lv-impairment'
	| 'intracardiac-thrombus'
	| 'discrepancy-with-request'
	| 'abnormal-requiring-action'
	| 'urgent-referral'
	| 'limited-study-quality'
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
 * sql/05_create_table_echocardiogram_test_result_grade.sql.
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
	echoType: EchoType;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
