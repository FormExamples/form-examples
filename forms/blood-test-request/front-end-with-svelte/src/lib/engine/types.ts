// ──────────────────────────────────────────────
// Blood Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The request orders one or more
// blood-test panels (modelled as BOOLEAN fields) and is graded on four
// independent axes (appropriateness, pre-analytical / specimen safety, request
// completeness, triage priority) plus safety-critical flags.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Primary clinical indication for the request. */
export type PrimaryIndication =
	| 'routine-monitoring'
	| 'anaemia'
	| 'fatigue'
	| 'infection'
	| 'diabetes-monitoring'
	| 'thyroid-symptoms'
	| 'cardiovascular-risk'
	| 'liver-disease'
	| 'renal-monitoring'
	| 'anticoagulation-monitoring'
	| 'pre-operative'
	| 'suspected-malignancy'
	| 'other'
	| '';

/** Whether the specimen has already been collected. */
export type SpecimenCollected = 'yes' | 'no' | '';

/** Fasting status at the time of collection. */
export type FastingStatus = 'fasting' | 'non-fasting' | 'unknown' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'stat' | '';

/** Care setting the request originates from. */
export type Setting = 'gp-surgery' | 'hospital-ward' | 'outpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — request appropriateness (1–9 ordinal). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — pre-analytical / specimen safety. */
export type PreanalyticalBand = 'ok' | 'caution' | 'reject-risk' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'stat' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record sections ───

/** Requesting clinician and contact details. */
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

/** Patient identification. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
}

/**
 * Requested blood-test panels, modelled as BOOLEAN columns. At least one panel
 * should be selected for a request to be actionable.
 */
export interface PanelsSection {
	fullBloodCount: boolean;
	ureaElectrolytes: boolean;
	liverFunction: boolean;
	thyroidFunction: boolean;
	hba1c: boolean;
	lipidProfile: boolean;
	cReactiveProtein: boolean;
	coagulationScreen: boolean;
	boneProfile: boolean;
	ferritinIron: boolean;
	vitaminB12Folate: boolean;
	vitaminD: boolean;
	hba1cMonitoring: boolean;
	glucose: boolean;
	inr: boolean;
	bloodCulture: boolean;
	groupAndSave: boolean;
	crossmatch: boolean;
	troponin: boolean;
	dDimer: boolean;
	amylaseLipase: boolean;
}

/** Clinical context for the request. */
export interface ClinicalSection {
	primaryIndication: PrimaryIndication;
	clinicalDetails: string;
	relevantMedications: string;
}

/** Pre-analytical and specimen-handling information. */
export interface PreanalyticalSection {
	fastingRequired: boolean;
	fastingStatus: FastingStatus;
	specimenCollected: SpecimenCollected;
	collectionDate: string;
	collectionTime: string;
}

/** Patient-safety factors. */
export interface SafetySection {
	knownBloodBorneVirus: boolean;
	difficultVenousAccess: boolean;
}

/** Triage and submission details. */
export interface TriageSection {
	urgency: Urgency;
	setting: Setting;
	notes: string;
}

/**
 * The blood-test request — the source-of-truth record the four-axis vetting
 * grade is computed from.
 */
export interface BloodTestRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	panels: PanelsSection;
	clinical: ClinicalSection;
	preanalytical: PreanalyticalSection;
	safety: SafetySection;
	triage: TriageSection;
}

/** The boolean field name of a single panel. */
export type PanelField = keyof PanelsSection;

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'preanalytical' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'duplicate-recent-test'
	| 'retest-interval-breach'
	| 'fasting-required-not-met'
	| 'missing-clinical-details'
	| 'missing-indication'
	| 'blood-borne-virus-precaution'
	| 'stat-critical'
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

/** Optional engine context passed to the flag detector. */
export interface FlagContext {
	fastingViolation?: boolean;
	preanalyticalBand?: PreanalyticalBand;
	triageTier?: TriageTier;
}

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	preanalyticalBand: PreanalyticalBand;
	fastingViolation: boolean;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	// Derived
	testsSelectedCount: number;
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
	referralDate: string;
	patient: string;
	nhs: string;
	testsSelectedCount: number;
	indication: PrimaryIndication;
	appropriatenessBand: AppropriatenessBand;
	preanalyticalBand: PreanalyticalBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
