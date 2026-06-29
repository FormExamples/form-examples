// ──────────────────────────────────────────────
// Genetic Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request is a nested model
// (clinician / patient / request / clinical / consent / triage) so that step
// components can capture a section reference and stay bound to live state.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints / index.md) ───

/** Requested genomic test type. */
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

/** Primary clinical indication for the test. */
export type PrimaryIndication =
	| 'suspected-genetic-disorder'
	| 'familial-cancer'
	| 'developmental-delay'
	| 'congenital-anomaly'
	| 'cardiomyopathy-arrhythmia'
	| 'neuromuscular'
	| 'predictive-family-history'
	| 'carrier-screening'
	| 'prenatal-diagnosis'
	| 'pharmacogenomics'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | '';

/** Care setting the request originates from. */
export type Setting =
	| 'clinical-genetics'
	| 'oncology'
	| 'paediatrics'
	| 'primary-care'
	| 'other'
	| '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (NHS National Genomic Test Directory). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — consent & counselling band. */
export type ConsentCounsellingBand = 'ok' | 'caution' | 'not-met' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested model) ───

/** Requesting clinician section. */
export interface ClinicianSection {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient identification section. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	addressLine: string;
}

/** Requested-test section. */
export interface RequestSection {
	testType: TestType;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	requestedByDate: string;
}

/** Clinical details / phenotype / family history section. */
export interface ClinicalSection {
	clinicalDetails: string;
	suspectedCondition: string;
	familyHistory: string;
	affectedRelativeTested: boolean;
}

/** Consent & counselling section. */
export interface ConsentSection {
	consentObtained: boolean;
	geneticCounsellingOffered: boolean;
}

/** Specimen & triage section. */
export interface TriageSection {
	specimenType: string;
	urgency: Urgency;
	setting: Setting;
	notes: string;
}

/**
 * The clinical genetics / genomic test request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface GeneticTestRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	clinical: ClinicalSection;
	consent: ConsentSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'consent' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'predictive-test-counselling-required'
	| 'consent-not-obtained'
	| 'prenatal-time-critical'
	| 'missing-family-history'
	| 'missing-indication'
	| 'missing-clinical-details'
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
 * The computed four-axis vetting grade for a genetic test request.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	consentCounsellingBand: ConsentCounsellingBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
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

/** A graded request row for the vetting dashboard table. */
export interface RequestRow {
	id: string;
	patientName: string;
	testType: TestType;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	consentCounsellingBand: ConsentCounsellingBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
