// ──────────────────────────────────────────────
// Bronchoscopy Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is nested by section,
// matching the source-of-truth engine in
// front-end-form-with-html/js/ (emptyRequest()).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested airway-endoscopy procedure. */
export type Procedure =
	| 'flexible-bronchoscopy'
	| 'ebus'
	| 'rigid-bronchoscopy'
	| 'bronchoalveolar-lavage'
	| 'other'
	| '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'suspected-lung-cancer'
	| 'haemoptysis'
	| 'persistent-cough'
	| 'lung-mass-on-imaging'
	| 'mediastinal-lymphadenopathy'
	| 'infection-sampling'
	| 'foreign-body'
	| 'stridor'
	| 'other'
	| '';

/** Severity of reported haemoptysis. */
export type HaemoptysisSeverity = 'mild' | 'moderate' | 'massive' | '';

/** ASA physical-status grade. */
export type AsaGrade = 'I' | 'II' | 'III' | 'IV' | 'V' | '';

/** Planned sedation level. */
export type Sedation = 'none' | 'conscious' | 'deep' | 'general-anaesthetic' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'day-case' | 'community' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — cancer-pathway triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Axis D — pre-procedure risk band. */
export type RiskBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by section) ───

/** Requesting-clinician section. */
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

/** Patient-identification section. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
	interpreterRequired: boolean;
}

/** Requested-procedure section. */
export interface RequestSection {
	procedure: Procedure;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms-and-imaging section. */
export interface SymptomsSection {
	symptomHaemoptysis: boolean;
	haemoptysisSeverity: HaemoptysisSeverity;
	symptomCough: boolean;
	symptomBreathlessness: boolean;
	symptomWeightLoss: boolean;
	imagingFindings: string;
}

/** Bleeding-risk section. */
export interface BleedingSection {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	antiplateletAgent: string;
	plateletCount: number | null;
}

/** Procedural-risk section. */
export interface ProceduralSection {
	oxygenDependent: boolean;
	asaGrade: AsaGrade;
	sedation: Sedation;
	haemodynamicallyUnstable: boolean;
}

/** Triage-and-submit section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The bronchoscopy request — the source-of-truth record the four-axis vetting
 * grade is computed from. Nested by wizard section.
 */
export interface BronchoscopyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	bleeding: BleedingSection;
	procedural: ProceduralSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'risk';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'massive-haemoptysis-emergency'
	| 'high-bleeding-risk-anticoag'
	| 'hypoxia'
	| 'asa-iv'
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

/**
 * The computed four-axis vetting grade.
 *
 * - Axis A: appropriateness (1–9 ordinal score + band).
 * - Axis B: cancer-pathway urgency (triage tier + target timeframe + 2WW
 *   eligibility).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: pre-procedure risk band + recommended anticoagulant action.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	// Axis C
	completenessPercent: number;
	// Axis D
	riskBand: RiskBand;
	anticoagulantAction: string;
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
	procedure: Procedure;
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	riskBand: RiskBand;
	recommendation: Recommendation;
	flagCount: number;
}
