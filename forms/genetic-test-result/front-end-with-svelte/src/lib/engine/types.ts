// ──────────────────────────────────────────────
// Genetic Test Result — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_genetic_test_result.sql and
// sql/05_create_table_genetic_test_result_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Report lifecycle status. */
export type ReportStatus = 'preliminary' | 'final' | 'amended' | 'cancelled' | '';

/** Type of genomic test performed. */
export type TestType =
	| 'diagnostic-single-gene'
	| 'gene-panel'
	| 'whole-exome'
	| 'whole-genome'
	| 'chromosomal-microarray'
	| 'karyotype'
	| 'predictive-presymptomatic'
	| 'carrier-testing'
	| 'pharmacogenomic'
	| 'prenatal'
	| 'other'
	| '';

/** Sample type analysed. */
export type SampleType = 'blood' | 'saliva' | 'tissue' | 'prenatal' | '';

/** ACMG/AMP (ACGS) five-tier variant classification (+ no-variant-detected). */
export type VariantClassification =
	| 'pathogenic'
	| 'likely-pathogenic'
	| 'variant-uncertain-significance'
	| 'likely-benign'
	| 'benign'
	| 'no-variant-detected'
	| '';

/** Zygosity of the reported variant. */
export type Zygosity = 'heterozygous' | 'homozygous' | 'hemizygous' | 'not-applicable' | '';

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
	pathogenicVariantFound: boolean;
	vusFound: boolean;
	carrierStatusPositive: boolean;
	secondaryFinding: boolean;
	noClinicallySignificantVariant: boolean;
}

// ─── The result/report record (sql/04) ───

/**
 * The genetic / genomic test result (report) — the source-of-truth record the
 * four-axis interpretation grade is computed from.
 */
export interface GeneticResult {
	// Report identification
	reportingClinician: string;
	originatingRequestReference: string;
	reportStatus: ReportStatus;
	performedDate: string;
	reportedDate: string;

	// Test details
	testType: TestType;
	genesTested: string;
	sampleType: SampleType;

	// Clinical context
	clinicalHistory: string;
	inheritancePattern: string;

	// Findings
	variantsDetected: string;
	variantClassification: VariantClassification;
	zygosity: Zygosity;
	pathogenicVariantFound: boolean;
	vusFound: boolean;
	carrierStatusPositive: boolean;
	secondaryFinding: boolean;
	noClinicallySignificantVariant: boolean;

	// Interpretation
	interpretation: string;
	impression: string;
	reportingCategory: string;

	// Follow-up
	recommendedCascadeTesting: boolean;
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
	| 'pathogenic-variant-found'
	| 'secondary-finding'
	| 'variant-uncertain-significance'
	| 'cascade-testing-recommended'
	| 'discrepancy-with-request'
	| 'abnormal-requiring-action'
	| 'urgent-referral'
	| 'missing-impression'
	| 'missing-classification'
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
 * sql/05_create_table_genetic_test_result_grade.sql.
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
