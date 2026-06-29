// ──────────────────────────────────────────────
// Cytology Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request data model is nested by
// wizard section (clinician, patient, request, context, collection, triage),
// matching the source JavaScript engine the front-ends share.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested cytology specimen type. */
export type SpecimenType =
	| 'cervical-smear'
	| 'urine-cytology'
	| 'sputum-cytology'
	| 'fluid-pleural-ascitic'
	| 'fine-needle-aspiration-thyroid'
	| 'fine-needle-aspiration-breast'
	| 'csf-cytology'
	| 'other'
	| '';

/** Primary clinical indication for the cytology examination. */
export type Indication =
	| 'cervical-screening'
	| 'suspected-malignancy'
	| 'haematuria'
	| 'effusion-investigation'
	| 'thyroid-nodule'
	| 'breast-lump'
	| 'follow-up'
	| 'other'
	| '';

/** Previous abnormal cytology grade. */
export type PreviousCytology =
	| 'none'
	| 'borderline'
	| 'low-grade'
	| 'high-grade'
	| 'unknown'
	| '';

/** Whether the specimen has already been collected. */
export type SpecimenCollected = 'yes' | 'no' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (derived from the 1–9 score). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — pre-analytical specimen adequacy band. */
export type PreanalyticalBand = 'ok' | 'caution' | 'reject-risk' | '';

/** Axis D — triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician details. */
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
	interpreterRequired: boolean;
}

/** Requested examination. */
export interface RequestSection {
	specimenType: SpecimenType;
	specimenSite: string;
	primaryIndication: Indication;
	clinicalQuestion: string;
	clinicalDetails: string;
}

/** Cytology context. */
export interface ContextSection {
	hpvTestRequested: boolean;
	previousAbnormalCytology: PreviousCytology;
	lastMenstrualPeriodDate: string;
}

/** Specimen collection (pre-analytical). */
export interface CollectionSection {
	specimenCollected: SpecimenCollected;
	collectionDatetime: string;
}

/** Triage and submission. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The cytology specimen request (referral) — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface CytologyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	context: ContextSection;
	collection: CollectionSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'preanalytical' | 'completeness' | 'urgency';

/** Flag category (mirrors the form's grade-flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'previous-high-grade-cytology'
	| 'specimen-not-collected'
	| 'missing-clinical-details'
	| 'missing-indication'
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
	preanalyticalBand: PreanalyticalBand;
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
	specimenType: SpecimenType;
	primaryIndication: Indication;
	appropriatenessBand: AppropriatenessBand;
	preanalyticalBand: PreanalyticalBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
