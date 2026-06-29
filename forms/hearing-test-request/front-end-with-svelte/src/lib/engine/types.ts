// ──────────────────────────────────────────────
// Hearing Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations and the HTML front-end JS engine.
// The data model is nested by wizard section (clinician / patient / request /
// symptoms / triage) so step components bind to a stable section reference.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the HTML engine + SQL CHECK constraints) ───

/** Requested audiology examination. */
export type TestType =
	| 'pure-tone-audiometry'
	| 'tympanometry'
	| 'speech-audiometry'
	| 'otoacoustic-emissions'
	| 'auditory-brainstem-response'
	| 'newborn-hearing-screen'
	| 'hearing-aid-assessment'
	| 'other'
	| '';

/** Affected side / laterality of the examination. */
export type Laterality = 'left' | 'right' | 'bilateral' | '';

/** Primary clinical indication for the hearing test. */
export type PrimaryIndication =
	| 'hearing-loss'
	| 'tinnitus'
	| 'vertigo'
	| 'ear-discharge'
	| 'suspected-otosclerosis'
	| 'occupational-noise'
	| 'ototoxic-monitoring'
	| 'developmental-delay-child'
	| 'hearing-aid-review'
	| 'sudden-hearing-loss'
	| 'other'
	| '';

/** How recently a sudden onset of hearing loss began. */
export type OnsetWithinDays = 'within-30-days' | 'more-than-30-days' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'primary-care' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (anchored on BSA / NICE NG98 indication match). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — urgency triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Axis D — clinical priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician / referrer details. */
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

/** Requested examination, indication, and clinical question. */
export interface RequestSection {
	testType: TestType;
	laterality: Laterality;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Presenting symptoms and red flags. */
export interface SymptomsSection {
	hearingLoss: boolean;
	tinnitus: boolean;
	vertigo: boolean;
	otalgia: boolean;
	suddenOnset: boolean;
	onsetWithinDays: OnsetWithinDays;
	earDischarge: boolean;
	ototoxicMedication: boolean;
}

/** Triage details and submission metadata. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The hearing test request — the source-of-truth record the four-axis vetting
 * grade is computed from.
 */
export interface HearingRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'sudden-sensorineural-hearing-loss-urgent'
	| 'unilateral-symptoms-red-flag'
	| 'ear-discharge'
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
 * The computed four-axis vetting grade for a hearing test request.
 *
 * Axis A appropriateness carries a 1–9 ordinal score plus its band; axis B is
 * the urgency triage tier with a target timeframe; axis C is weighted request
 * completeness; axis D is the composite clinical-priority band.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	triageTier: TriageTier;
	targetTimeframe: string;
	// Axis C
	completenessPercent: number;
	// Axis D
	priorityBand: PriorityBand;
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
	testType: TestType;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	appropriatenessScore: number;
	triageTier: TriageTier;
	completenessPercent: number;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
