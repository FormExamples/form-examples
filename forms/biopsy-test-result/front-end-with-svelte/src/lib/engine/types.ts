// ──────────────────────────────────────────────
// Biopsy Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_biopsy_test_result.sql and
// sql/05_create_table_biopsy_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus =
	| 'preliminary'
	| 'final'
	| 'amended'
	| 'supplementary'
	| 'cancelled'
	| '';

/** Anatomical biopsy site. */
export type BiopsySite =
	| 'skin'
	| 'breast'
	| 'lymph-node'
	| 'liver'
	| 'kidney'
	| 'prostate'
	| 'lung'
	| 'bone-marrow'
	| 'gi-tract'
	| 'thyroid'
	| 'soft-tissue'
	| 'other'
	| '';

/** Biopsy method / procedure. */
export type BiopsyMethod =
	| 'punch'
	| 'excision'
	| 'incision'
	| 'core-needle'
	| 'fine-needle-aspiration'
	| 'image-guided'
	| 'endoscopic'
	| 'other'
	| '';

/** Diagnostic adequacy of the specimen. */
export type SpecimenAdequacy = 'adequate' | 'suboptimal' | 'inadequate' | '';

/** Histological differentiation grade. */
export type HistologicalGrade =
	| 'well-differentiated'
	| 'moderately-differentiated'
	| 'poorly-differentiated'
	| 'undifferentiated'
	| 'not-applicable'
	| '';

/** Resection-margin status. */
export type ResectionMargins = 'clear' | 'involved' | 'close' | 'not-applicable' | '';

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
	| 'urgent-mdt'
	| '';

// ─── The result/report record (sql/04) ───

/**
 * The biopsy histopathology result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from.
 */
export interface BiopsyResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Specimen / procedure
	biopsySite: BiopsySite;
	biopsyMethod: BiopsyMethod;
	specimenAdequacy: SpecimenAdequacy;

	// Clinical context
	clinicalHistory: string;
	comparisonWithPrevious: string;

	// Macroscopic and microscopic description
	macroscopicDescription: string;
	microscopicDescription: string;

	// Diagnosis and grading
	diagnosis: string;
	malignancyPresent: boolean;
	tumourType: string;
	histologicalGrade: HistologicalGrade;
	resectionMargins: ResectionMargins;
	lymphovascularInvasion: boolean;

	// Ancillary tests
	immunohistochemistry: string;
	molecularResults: string;
	snomedCode: string;

	// Conclusion and follow-up
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
 * sql/05_create_table_biopsy_test_result_grade.sql.
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
	biopsySite: BiopsySite;
	reportStatus: ReportStatus;
	reportedDate: string;
	resultClassification: ResultClassification;
	abnormalitySeverity: AbnormalitySeverity;
	followUpUrgency: FollowUpUrgency;
	reportCompletenessPercent: number;
	flagCount: number;
}
