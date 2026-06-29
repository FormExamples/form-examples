// ──────────────────────────────────────────────
// Toxicology Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the SQL migrations. The request is a nested record: clinician,
// patient, assays, clinical, specimen, and triage sections.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Primary clinical indication for the toxicology request. */
export type PrimaryIndication =
	| 'suspected-overdose'
	| 'deliberate-self-harm'
	| 'therapeutic-drug-monitoring'
	| 'suspected-poisoning'
	| 'substance-misuse-screen'
	| 'occupational-screen'
	| 'forensic'
	| 'other'
	| '';

/** Specimen-collected status. */
export type SpecimenCollected = 'yes' | 'no' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'stat' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — request appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — ingestion-timing validity band. */
export type TimingBand = 'ok' | 'caution' | 'invalid' | '';

/** Axis D — triage priority tier. */
export type TriageTier = 'routine' | 'urgent' | 'stat' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record sections ───

/** The requesting clinician. */
export interface Clinician {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient identification. */
export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
}

/** The orderable toxicology assays (BOOLEAN columns). */
export interface Assays {
	paracetamolLevel: boolean;
	salicylateLevel: boolean;
	alcoholLevel: boolean;
	drugsOfAbuseScreen: boolean;
	lithiumLevel: boolean;
	digoxinLevel: boolean;
	antiepilepticDrugLevel: boolean;
	carboxyhaemoglobin: boolean;
	heavyMetals: boolean;
	specificDrugLevel: boolean;
}

/** The assay field keys. */
export type AssayField = keyof Assays;

/** Clinical context — the highest-value vetting fields. */
export interface Clinical {
	primaryIndication: PrimaryIndication;
	clinicalDetails: string;
	suspectedAgent: string;
	timeSinceIngestionHours: number | null;
	deliberateOverdose: boolean;
	symptomatic: boolean;
}

/** Specimen collection status. */
export interface Specimen {
	specimenCollected: SpecimenCollected;
	collectionDatetime: string;
}

/** Triage and submission details. */
export interface Triage {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The toxicology test request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface ToxicologyRequest {
	clinician: Clinician;
	patient: Patient;
	assays: Assays;
	clinical: Clinical;
	specimen: Specimen;
	triage: Triage;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'timing' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-overdose-stat'
	| 'paracetamol-timing-critical'
	| 'deliberate-self-harm-safeguarding'
	| 'specimen-not-collected'
	| 'missing-clinical-details'
	| 'no-test-selected'
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

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	timingBand: TimingBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	// Overall
	recommendation: Recommendation;
	recommendationLabel: string;
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

// ─── Assay catalogue entry ───

/** Catalogue metadata for an orderable assay. */
export interface AssayDef {
	field: AssayField;
	label: string;
	note?: string;
	critical?: boolean;
}

// ─── Dashboard row ───

/** A graded request row for the vetting dashboard table. */
export interface RequestRow {
	id: string;
	patientName: string;
	indication: PrimaryIndication;
	assayCount: number;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	timingBand: TimingBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
