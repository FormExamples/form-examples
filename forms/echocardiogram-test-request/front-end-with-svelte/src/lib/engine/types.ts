// ──────────────────────────────────────────────
// Echocardiogram Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The data model is nested by wizard
// section (clinician, patient, request, symptoms, investigations, redFlags,
// triage) so step components can capture a live section reference.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested echocardiogram study type. */
export type EchoType =
	| 'transthoracic-tte'
	| 'transoesophageal-toe'
	| 'stress-echo'
	| 'contrast-echo'
	| 'other'
	| '';

/** Primary clinical indication for the echo. */
export type PrimaryIndication =
	| 'heart-failure'
	| 'murmur'
	| 'suspected-valve-disease'
	| 'breathlessness'
	| 'palpitations'
	| 'chest-pain'
	| 'hypertension'
	| 'cardiomyopathy'
	| 'endocarditis'
	| 'post-mi'
	| 'pulmonary-hypertension'
	| 'pre-chemotherapy'
	| 'stroke-tia-source'
	| 'congenital'
	| 'surveillance-known-disease'
	| 'other'
	| '';

/** Whether a previous echo has been performed. */
export type PreviousEcho = 'none' | 'yes' | '';

/** New York Heart Association functional class. */
export type NyhaClass = 'i' | 'ii' | 'iii' | 'iv' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACC/AHA/ASE & BSE Appropriate Use Criteria). */
export type AppropriatenessBand =
	| 'appropriate'
	| 'may-be-appropriate'
	| 'rarely-appropriate'
	| '';

/** Axis B — urgency triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Axis D — clinical priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── Nested request sections ───

/** Requesting clinician details (wizard step 1). */
export interface Clinician {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient identification (wizard step 2). */
export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	heightAsCm: number | null;
	weightAsKg: number | null;
	bodyMassIndex: number | null;
}

/** Requested examination and clinical history (wizard steps 3–4). */
export interface RequestDetails {
	echoType: EchoType;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	relevantHistory: string;
	relevantMedications: string;
	previousEcho: PreviousEcho;
	previousEchoDate: string;
	ejectionFractionKnown: number | null;
}

/** Symptoms and functional status (wizard step 5). */
export interface Symptoms {
	breathlessness: boolean;
	chestPain: boolean;
	palpitations: boolean;
	syncope: boolean;
	oedema: boolean;
	nyhaClass: NyhaClass;
}

/** Investigations already performed (wizard step 6). */
export interface Investigations {
	ecgFindings: string;
	bnpOrNtProbnp: number | null;
	knownMurmur: boolean;
	onCardiotoxicChemotherapy: boolean;
}

/** Acute red flags (wizard step 7). */
export interface RedFlags {
	suspectedEndocarditis: boolean;
	severeSymptomaticValve: boolean;
	acuteHeartFailure: boolean;
}

/** Triage and submission details (wizard step 8). */
export interface Triage {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

// ─── The request record ───

/**
 * The echocardiogram test request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface EchoRequest {
	clinician: Clinician;
	patient: Patient;
	request: RequestDetails;
	symptoms: Symptoms;
	investigations: Investigations;
	redFlags: RedFlags;
	triage: Triage;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-endocarditis'
	| 'severe-symptomatic-valve'
	| 'acute-heart-failure'
	| 'raised-bnp'
	| 'rarely-appropriate-indication'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'duplicate-recent-echo'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: Axis | string;
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
 * The computed four-axis vetting grade:
 * - Axis A: appropriateness (1–9 ordinal score + band).
 * - Axis B: urgency triage tier (+ target timeframe).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical priority band (low / moderate / high).
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
export interface EchoRequestRow {
	id: string;
	patientName: string;
	echoType: EchoType;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
