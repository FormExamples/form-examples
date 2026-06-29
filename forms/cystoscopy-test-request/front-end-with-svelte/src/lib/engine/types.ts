// ──────────────────────────────────────────────
// Cystoscopy Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request data model is nested by
// section (clinician, patient, request, symptoms, bleeding, triage) to match
// the engine ported from the HTML front-end.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Role of the requesting clinician. */
export type ClinicianRole =
	| 'urologist'
	| 'gp'
	| 'hospital-doctor'
	| 'nurse-cystoscopist'
	| 'other'
	| '';

/** Requested cystoscopy procedure. */
export type Procedure = 'flexible-cystoscopy' | 'rigid-cystoscopy' | 'other' | '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'visible-haematuria'
	| 'non-visible-haematuria'
	| 'recurrent-uti'
	| 'lower-urinary-tract-symptoms'
	| 'bladder-cancer-surveillance'
	| 'suspected-bladder-tumour'
	| 'urethral-stricture'
	| 'catheter-problems'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

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

// ─── The request record ───

/** Requesting clinician and provenance. */
export interface ClinicianSection {
	clinicianName: string;
	clinicianRole: ClinicianRole;
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
	age: number | null;
	nhsNumber: string;
}

/** Requested examination, indication, and clinical question. */
export interface RequestSection {
	procedure: Procedure;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms and red flags. */
export interface SymptomsSection {
	symptomHaematuria: boolean;
	symptomDysuria: boolean;
	symptomFrequency: boolean;
	symptomRetention: boolean;
	visibleHaematuria: boolean;
	currentUti: boolean;
}

/** Bleeding-risk and oncology history. */
export interface BleedingSection {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	previousBladderCancer: boolean;
}

/** Triage and submission. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The cystoscopy request — the source-of-truth record the four-axis vetting
 * grade is computed from.
 */
export interface CystoscopyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	bleeding: BleedingSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'risk';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'visible-haematuria'
	| 'active-uti-defer'
	| 'high-bleeding-risk-anticoag'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: string;
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
