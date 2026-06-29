// ──────────────────────────────────────────────
// Pulmonary Function Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is nested by wizard
// section (clinician, patient, request, symptoms, background, safety, triage).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints / option lists) ───

/** Requested lung-function test type. */
export type TestType =
	| 'spirometry'
	| 'spirometry-with-reversibility'
	| 'full-lung-function'
	| 'gas-transfer-dlco'
	| 'peak-flow'
	| 'feno'
	| 'other'
	| '';

/** Primary clinical indication for the test. */
export type Indication =
	| 'suspected-asthma'
	| 'suspected-copd'
	| 'breathlessness'
	| 'chronic-cough'
	| 'pre-operative'
	| 'occupational-lung-disease'
	| 'monitoring'
	| 'restrictive-disease'
	| 'other'
	| '';

/** Smoking status. */
export type SmokingStatus = 'never' | 'ex' | 'current' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (1–9 ordinal collapsed to three bands). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — safety / contraindication band. */
export type ContraindicationBand = 'ok' | 'caution' | 'contraindicated' | '';

/** Axis D — triage priority tier. */
export type TriageTier = 'routine' | 'urgent' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

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

/** Patient identification and anthropometry section. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	heightCm: number | null;
	weightKg: number | null;
}

/** Requested test section. */
export interface RequestSection {
	testType: TestType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Respiratory symptoms section. */
export interface SymptomsSection {
	breathlessness: boolean;
	cough: boolean;
	wheeze: boolean;
}

/** Smoking and inhaler background section. */
export interface BackgroundSection {
	smokingStatus: SmokingStatus;
	currentInhalers: string;
}

/** Forced-expiration & infection-control safety screen. */
export interface SafetySection {
	recentRespiratoryInfection: boolean;
	recentMiOrEyeAbdominalSurgery: boolean;
	suspectedActiveTuberculosis: boolean;
	haemoptysis: boolean;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The pulmonary function test request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface PulmonaryFunctionTestRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	background: BackgroundSection;
	safety: SafetySection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'recent-mi-contraindication'
	| 'active-respiratory-infection'
	| 'suspected-tb-infection-control'
	| 'haemoptysis'
	| 'missing-indication'
	| 'missing-clinical-question'
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
	contraindicationBand: ContraindicationBand;
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
export interface DashboardRow {
	id: string;
	patientName: string;
	testType: TestType;
	primaryIndication: Indication;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	contraindicationBand: ContraindicationBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
