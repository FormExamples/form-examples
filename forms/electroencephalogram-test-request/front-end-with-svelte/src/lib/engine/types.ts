// ──────────────────────────────────────────────
// Electroencephalogram (EEG) Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The data model is nested by section
// (clinician, patient, request, context, redFlags, triage) so each step
// component binds to a live section reference.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested EEG study type. */
export type EegType =
	| 'routine-awake'
	| 'sleep-deprived'
	| 'ambulatory-24h'
	| 'video-telemetry'
	| 'other'
	| '';

/** Primary clinical indication for the EEG. */
export type Indication =
	| 'suspected-epilepsy'
	| 'seizure-classification'
	| 'status-epilepticus'
	| 'encephalopathy'
	| 'first-seizure'
	| 'funny-turns'
	| 'dementia'
	| 'pre-surgical-evaluation'
	| 'medication-review'
	| 'other'
	| '';

/** Requested triage urgency (Axis B). */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (NICE NG217 / ILAE). */
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

// ─── The request record (nested by section) ───

/** Requesting clinician identification. */
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

/** Requested examination — the highest-value fields. */
export interface RequestSection {
	eegType: EegType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Seizure / epilepsy context. */
export interface ContextSection {
	seizureFrequency: string;
	currentAntiepileptics: string;
	firstSeizure: boolean;
	knownEpilepsy: boolean;
}

/** Red flags that auto-escalate the urgency tier. */
export interface RedFlagsSection {
	recentSeizure: boolean;
	suspectedStatusEpilepticus: boolean;
}

/** Triage details. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The EEG test request — the source-of-truth record the four-axis vetting grade
 * is computed from.
 */
export interface EegRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	context: ContextSection;
	redFlags: RedFlagsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-status-epilepticus'
	| 'recent-first-seizure'
	| 'encephalopathy'
	| 'eeg-not-to-exclude-epilepsy'
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
 * Axes: A appropriateness (1–9 score + band), B urgency (triage tier + target
 * timeframe), C request completeness (0–100%), D clinical priority (band).
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
	eegType: EegType;
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
