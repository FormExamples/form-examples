// ──────────────────────────────────────────────
// Cardiology Response — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_cardiology_response.sql and
// sql/05_create_table_cardiology_response_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Response lifecycle status. */
export type ResponseStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Type of cardiology consultation. */
export type ConsultationType =
	| 'clinic-review'
	| 'advice-and-guidance'
	| 'telephone'
	| 'inpatient-review'
	| 'virtual'
	| '';

/** Primary diagnosis category. */
export type PrimaryDiagnosisCategory =
	| 'coronary-artery-disease'
	| 'heart-failure'
	| 'arrhythmia'
	| 'valve-disease'
	| 'hypertension'
	| 'cardiomyopathy'
	| 'non-cardiac'
	| 'no-abnormality'
	| 'other'
	| '';

// ─── Axis enumerations (grade) ───

/** Axis A — overall response classification. */
export type ResponseClassification =
	| 'no-abnormality'
	| 'cardiac-condition'
	| 'critical'
	| 'inconclusive'
	| '';

/** Axis B — condition severity. */
export type Severity = 'none' | 'minor' | 'moderate' | 'major' | '';

/** Axis D — follow-up urgency. */
export type FollowUpUrgency = 'routine' | 'recommended' | 'urgent' | 'critical-alert' | '';

/** Overall recommendation. */
export type Recommendation =
	| 'no-action'
	| 'routine-follow-up'
	| 'further-investigation'
	| 'specialist-management'
	| 'urgent-review'
	| '';

// ─── Structured findings ───

/**
 * Boolean structured findings captured alongside the narrative; they drive
 * classification, severity, and flags.
 */
export interface StructuredFindings {
	ischaemiaOrCad: boolean;
	significantArrhythmia: boolean;
	reducedEjectionFraction: boolean;
	significantValveDisease: boolean;
	structuralAbnormality: boolean;
	uncontrolledHypertension: boolean;
	nonCardiacCause: boolean;
}

// ─── The response record (sql/04) ───

/**
 * The cardiology response (consult reply) — the source-of-truth record the
 * four-axis interpretation grade is computed from.
 */
export interface CardiologyResponse {
	// Response identification
	respondingClinician: string;
	originatingRequestReference: string;
	responseStatus: ResponseStatus;
	consultationType: ConsultationType;
	assessedDate: string;
	respondedDate: string;

	// Patient identification (captured on the wizard; persisted to the patient table)
	patientName: string;
	patientNhsNumber: string;
	patientBirthDate: string;

	// Clinical assessment
	clinicalSummary: string;
	examinationFindings: string;
	investigationsPerformed: string;

	// Structured findings
	ischaemiaOrCad: boolean;
	significantArrhythmia: boolean;
	reducedEjectionFraction: boolean;
	significantValveDisease: boolean;
	structuralAbnormality: boolean;
	uncontrolledHypertension: boolean;
	nonCardiacCause: boolean;

	// Diagnosis
	primaryDiagnosisCategory: PrimaryDiagnosisCategory;
	diagnosisNarrative: string;

	// Key measurement
	lvEjectionFractionPercent: number | null;

	// Management and follow-up
	managementPlan: string;
	medicationChanges: string;
	recommendedFollowUp: string;

	// Critical-result communication and sign-off
	criticalResult: boolean;
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
	| 'critical-finding'
	| 'severe-valve-disease'
	| 'significant-arrhythmia'
	| 'reduced-ejection-fraction'
	| 'incomplete-response'
	| 'missing-diagnosis'
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
 * sql/05_create_table_cardiology_response_grade.sql.
 */
export interface GradingResult {
	// Axis A
	responseClassification: ResponseClassification;
	// Axis B
	severity: Severity;
	severityCategory: string;
	// Axis C
	completenessPercent: number;
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

/** A graded response row for the dashboard table. */
export interface ResponseRow {
	id: string;
	patientName: string;
	consultationType: ConsultationType;
	responseStatus: ResponseStatus;
	respondedDate: string;
	responseClassification: ResponseClassification;
	severity: Severity;
	followUpUrgency: FollowUpUrgency;
	completenessPercent: number;
	flagCount: number;
}
