// ──────────────────────────────────────────────
// Tumor Marker Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the SQL migrations. The request is nested by section (clinician,
// patient, markers, context, triage). The requested markers are BOOLEAN fields
// (mirroring the BOOLEAN columns in SQL migration 04).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requesting-clinician role. */
export type ClinicianRole =
	| 'oncologist'
	| 'gp'
	| 'hospital-doctor'
	| 'urologist'
	| 'gynaecologist'
	| 'clinical-scientist'
	| 'other'
	| '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'suspected-malignancy'
	| 'cancer-monitoring'
	| 'treatment-response'
	| 'recurrence-surveillance'
	| 'screening-high-risk'
	| 'characterise-mass'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** The ten serum tumour-marker boolean field names. */
export type MarkerField =
	| 'psa'
	| 'ca125'
	| 'ca19_9'
	| 'carcinoembryonicAntigenCea'
	| 'alphaFetoproteinAfp'
	| 'betaHcg'
	| 'ca15_3'
	| 'lactateDehydrogenaseLdh'
	| 'calcitonin'
	| 'chromograninA';

// ─── Axis enumerations (grade) ───

/** Axis A — marker-to-indication appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — interpretation safety. */
export type InterpretationBand = 'ok' | 'caution' | 'misuse-risk' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── Request sections ───

/** Requesting clinician (step 1). */
export interface Clinician {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient identification (step 2). */
export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
}

/** Requested serum tumour markers (step 3) — BOOLEAN fields. */
export type Markers = Record<MarkerField, boolean>;

/** Clinical context (step 4). */
export interface Context {
	primaryIndication: Indication;
	clinicalDetails: string;
	knownCancerSite: string;
	onTreatment: boolean;
	previousMarkerValue: number | null;
	previousMarkerDate: string;
}

/** Triage and submission (step 5). */
export interface Triage {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The serum tumour-marker request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface TumorMarkerRequest {
	clinician: Clinician;
	patient: Patient;
	markers: Markers;
	context: Context;
	triage: Triage;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'interpretation' | 'completeness' | 'urgency';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'inappropriate-screening-use'
	| 'marker-indication-mismatch'
	| 'missing-clinical-details'
	| 'missing-indication'
	| 'no-marker-selected'
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
	interpretationBand: InterpretationBand;
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
	indication: Indication;
	markerCount: number;
	urgency: Urgency;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	interpretationBand: InterpretationBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
