// ──────────────────────────────────────────────
// Microbiology Culture Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The request data model is nested by
// section (clinician / patient / specimen / tests / clinical / triage) to match
// the wizard steps.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints / option lists) ───

/** Requesting-clinician role. */
export type ClinicianRole = 'gp' | 'hospital-doctor' | 'nurse' | 'microbiologist' | 'other' | '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'NMC' | 'HCPC' | 'other' | '';

/** Specimen type submitted for culture. */
export type SpecimenType =
	| 'blood-culture'
	| 'urine'
	| 'wound-swab'
	| 'sputum'
	| 'throat-swab'
	| 'stool'
	| 'csf'
	| 'tissue'
	| 'catheter-tip'
	| 'genital-swab'
	| 'other'
	| '';

/** Whether the specimen has been collected. */
export type SpecimenCollected = 'yes' | 'no' | '';

/** Primary clinical indication for the request. */
export type PrimaryIndication =
	| 'suspected-sepsis'
	| 'urinary-tract-infection'
	| 'wound-infection'
	| 'respiratory-infection'
	| 'gastroenteritis'
	| 'meningitis'
	| 'sti-screen'
	| 'pyrexia-unknown-origin'
	| 'infection-screening'
	| 'other'
	| '';

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

/** Axis B — pre-analytical / specimen-safety band. */
export type PreanalyticalBand = 'ok' | 'caution' | 'reject-risk' | '';

/** Axis D — triage priority tier. */
export type TriageTier = 'routine' | 'urgent' | 'stat' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

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

/** Specimen section. */
export interface SpecimenSection {
	specimenType: SpecimenType;
	specimenSiteDetail: string;
	specimenCollected: SpecimenCollected;
	collectionDatetime: string;
}

/** Requested-tests section (boolean per requestable test). */
export interface TestsSection {
	cultureAndSensitivity: boolean;
	gramStain: boolean;
	acidFastBacilliTb: boolean;
	fungalCulture: boolean;
	pcrMolecular: boolean;
	cDifficileToxin: boolean;
	mrsaScreen: boolean;
}

/** Clinical-context section. */
export interface ClinicalSection {
	primaryIndication: PrimaryIndication;
	clinicalDetails: string;
	fever: boolean;
	currentAntibiotics: boolean;
	antibioticName: string;
	recentTravel: boolean;
	immunocompromised: boolean;
}

/** Triage / submit section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The microbiology culture request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface MicrobiologyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	specimen: SpecimenSection;
	tests: TestsSection;
	clinical: ClinicalSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'preanalytical' | 'completeness' | 'triage';

/** Flag category (mirrors the grade-flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-sepsis-stat'
	| 'blood-culture-before-antibiotics'
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
	specimenType: SpecimenType;
	primaryIndication: PrimaryIndication;
	appropriatenessBand: AppropriatenessBand;
	preanalyticalBand: PreanalyticalBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
