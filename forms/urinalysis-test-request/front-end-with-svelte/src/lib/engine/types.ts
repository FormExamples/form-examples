// ──────────────────────────────────────────────
// Urinalysis Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request ORDERS one or more urine
// tests (boolean order lines) and is graded on four orthogonal axes.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requesting-clinician role. */
export type ClinicianRole = 'gp' | 'hospital-doctor' | 'nurse' | 'urologist' | 'other' | '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'NMC' | 'HCPC' | 'other' | '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'suspected-uti'
	| 'haematuria'
	| 'proteinuria'
	| 'diabetes-monitoring'
	| 'renal-monitoring'
	| 'pregnancy-screen'
	| 'pre-operative'
	| 'catheter-related'
	| 'suspected-malignancy'
	| 'drug-monitoring'
	| 'other'
	| '';

/** Specimen type. */
export type SpecimenType = 'midstream' | 'catheter' | 'clean-catch' | '24h' | 'random' | '';

/** Whether the specimen has been collected. */
export type Collected = 'yes' | 'no' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'stat' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — preanalytical specimen-suitability band. */
export type PreanalyticalBand = 'ok' | 'caution' | 'reject-risk' | '';

/** Axis D — triage priority tier. */
export type TriageTier = 'routine' | 'urgent' | 'stat' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record ───

/** Requesting-clinician section. */
export interface ClinicianSection {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	registrationBody: RegistrationBody;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient-identification section. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
}

/** Requested-test panel — each test is a boolean order line. */
export interface TestsSection {
	dipstick: boolean;
	microscopyCultureSensitivity: boolean;
	albuminCreatinineRatio: boolean;
	proteinCreatinineRatio: boolean;
	pregnancyTest: boolean;
	drugScreen: boolean;
	cytology: boolean;
	twentyFourHourCollection: boolean;
}

/** Clinical-context section. */
export interface ContextSection {
	primaryIndication: Indication;
	clinicalDetails: string;
	pregnant: boolean;
	catheterised: boolean;
	currentAntibiotics: boolean;
}

/** Symptoms & red-flags section. */
export interface SymptomsSection {
	symptomDysuria: boolean;
	symptomFrequency: boolean;
	symptomVisibleHaematuria: boolean;
	symptomLoinPain: boolean;
	symptomFever: boolean;
}

/** Specimen section. */
export interface SpecimenSection {
	specimenType: SpecimenType;
	specimenCollected: Collected;
	collectionDatetime: string;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	setting: Setting;
	notes: string;
}

/**
 * The urinalysis test request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface UrinalysisRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	tests: TestsSection;
	context: ContextSection;
	symptoms: SymptomsSection;
	specimen: SpecimenSection;
	triage: TriageSection;
}

/** The camelCase key of a test order line. */
export type TestField = keyof TestsSection;

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'preanalytical' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'visible-haematuria-2ww'
	| 'suspected-pyelonephritis'
	| 'specimen-not-collected'
	| 'missing-clinical-details'
	| 'missing-indication'
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
	preanalyticalBand: PreanalyticalBand;
	specimenNote: string;
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

// ─── Dashboard row ───

/** A graded request row for the vetting dashboard table. */
export interface RequestRow {
	id: string;
	patientName: string;
	referralDate: string;
	indication: Indication;
	appropriatenessBand: AppropriatenessBand;
	preanalyticalBand: PreanalyticalBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
