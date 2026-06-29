// ──────────────────────────────────────────────
// Histopathology Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is nested into the
// wizard sections (clinician, patient, specimen, indication, urgency, triage).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints / HTML option lists) ───

/** Requesting clinician's role. */
export type ClinicianRole =
	| 'pathologist'
	| 'surgeon'
	| 'gp'
	| 'dermatologist'
	| 'gastroenterologist'
	| 'radiologist'
	| 'other'
	| '';

/** Tissue specimen type. */
export type SpecimenType =
	| 'biopsy'
	| 'excision'
	| 'resection'
	| 'endoscopic-biopsy'
	| 'skin-lesion'
	| 'frozen-section'
	| 'other'
	| '';

/** Fixative the specimen was placed in. */
export type Fixative = 'formalin' | 'fresh' | 'other' | '';

/** Primary clinical indication for the request. */
export type PrimaryIndication =
	| 'suspected-malignancy'
	| 'cancer-staging'
	| 'inflammatory-disease'
	| 'infection'
	| 'characterise-lesion'
	| 'margin-assessment'
	| 'transplant-monitoring'
	| 'other'
	| '';

/** Requested urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (from the 1–9 ordinal score). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — specimen quality band. */
export type SpecimenQualityBand = 'ok' | 'caution' | 'reject-risk' | '';

/** Axis D — urgency triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician details. */
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
	nhsNumber: string;
	interpreterRequired: boolean;
}

/** The tissue specimen. */
export interface SpecimenSection {
	specimenType: SpecimenType;
	specimenSite: string;
	numberOfSpecimens: number | null;
	fixative: Fixative;
	specimenLabelled: boolean;
}

/** Indication and clinical context. */
export interface IndicationSection {
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	clinicalDetails: string;
	provisionalDiagnosis: string;
	previousHistology: string;
}

/** Urgency and red flags. */
export interface UrgencySection {
	urgentFrozenSection: boolean;
	twoWeekWait: boolean;
	urgency: Urgency;
}

/** Requester / site and triage context. */
export interface TriageSection {
	setting: Setting;
	requestedByDate: string;
	notes: string;
}

/**
 * The tissue histopathology specimen request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface HistopathologyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	specimen: SpecimenSection;
	indication: IndicationSection;
	urgency: UrgencySection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'specimen' | 'completeness' | 'urgency';

/** Flag category (mirrors the grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'frozen-section-urgent'
	| 'specimen-fixation-issue'
	| 'mislabel-risk'
	| 'missing-clinical-details'
	| 'missing-indication'
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
	specimenQualityBand: SpecimenQualityBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	immediate: boolean;
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
	specimenType: SpecimenType;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	specimenQualityBand: SpecimenQualityBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
