// ──────────────────────────────────────────────
// CT Scan Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is sectioned
// (clinician / patient / request / context / contrast / radiation / triage) to
// match the single-page wizard and the source-of-truth HTML engine.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints / HTML option lists) ───

/** CT body region requested. */
export type BodyRegion =
	| 'head'
	| 'neck'
	| 'chest'
	| 'abdomen'
	| 'pelvis'
	| 'abdomen-pelvis'
	| 'spine'
	| 'ct-angiogram'
	| 'ct-colonography'
	| 'whole-body'
	| 'extremity'
	| 'other'
	| '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'trauma'
	| 'suspected-stroke'
	| 'suspected-malignancy'
	| 'cancer-staging'
	| 'pulmonary-embolism'
	| 'abdominal-pain'
	| 'renal-colic'
	| 'infection-abscess'
	| 'pre-surgical-planning'
	| 'follow-up-surveillance'
	| 'headache'
	| 'other'
	| '';

/** Contrast requirement. */
export type ContrastRequired = 'none' | 'iv-iodinated' | 'oral' | 'both' | 'unknown' | '';

/** Previous contrast-reaction severity. */
export type ContrastReaction = 'none' | 'mild' | 'moderate' | 'severe' | 'unknown' | '';

/** Pregnancy status. */
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'possible'
	| 'unknown'
	| 'not-applicable'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — contrast-safety band. */
export type ContrastSafetyBand = 'safe' | 'caution' | 'contraindicated' | '';

/** Axis B — estimated radiation-dose band. */
export type DoseBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (sectioned) ───

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
	weightKg: number | null;
	interpreterRequired: boolean;
}

/** Requested-examination section. */
export interface RequestSection {
	bodyRegion: BodyRegion;
	primaryIndication: Indication;
	clinicalQuestion: string;
}

/** Clinical-context section. */
export interface ContextSection {
	relevantHistory: string;
	relevantPreviousImaging: string;
}

/** Contrast & renal-safety section. */
export interface ContrastSection {
	contrastRequired: ContrastRequired;
	egfr: number | null;
	iodineContrastAllergy: boolean;
	previousContrastReaction: ContrastReaction;
	metformin: boolean;
	diabetes: boolean;
	renalImpairment: boolean;
}

/** Radiation-safety section. */
export interface RadiationSection {
	pregnancyStatus: PregnancyStatus;
	irMeRJustification: string;
}

/** Triage & setting section. */
export interface TriageSection {
	urgency: Urgency;
	setting: Setting;
	requestedByDate: string;
	notes: string;
}

/**
 * The CT scan request — the source-of-truth record the four-axis vetting grade
 * is computed from.
 */
export interface CtScanRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	context: ContextSection;
	contrast: ContrastSection;
	radiation: RadiationSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'pregnancy'
	| 'contrast-allergy'
	| 'renal-impairment'
	| 'metformin-contrast'
	| 'high-radiation-dose'
	| 'unjustified-exposure'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'missing-egfr'
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
	contrastSafetyBand: ContrastSafetyBand;
	estimatedDoseBand: DoseBand;
	renalRisk: boolean;
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
	bodyRegion: BodyRegion;
	primaryIndication: Indication;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	contrastSafetyBand: ContrastSafetyBand;
	estimatedDoseBand: DoseBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
