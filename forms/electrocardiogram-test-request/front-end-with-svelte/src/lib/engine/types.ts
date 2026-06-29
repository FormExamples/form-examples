// ──────────────────────────────────────────────
// Electrocardiogram (ECG) Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request data model is nested by
// wizard section so step components can capture a live section reference.
// ──────────────────────────────────────────────

// ─── Enumerations ───

/** Requested ECG examination type. */
export type EcgType =
	| 'resting-12-lead'
	| 'exercise-stress'
	| 'ambulatory-holter-24h'
	| 'ambulatory-48h'
	| 'event-recorder'
	| 'other'
	| '';

/** Primary clinical indication for the ECG. */
export type Indication =
	| 'chest-pain'
	| 'palpitations'
	| 'syncope'
	| 'suspected-arrhythmia'
	| 'suspected-mi-acs'
	| 'pre-operative'
	| 'medication-monitoring-qt'
	| 'hypertension'
	| 'heart-failure'
	| 'screening'
	| 'follow-up'
	| 'other'
	| '';

/** Known / suspected arrhythmia detail. */
export type KnownArrhythmia = 'none' | 'af' | 'svt' | 'vt' | 'heart-block' | 'other' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | 'pre-operative' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (from the 1–9 ordinal score). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Axis D — clinical priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician details (wizard step 1). */
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

/** Patient identification (wizard step 2). */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	interpreterRequired: boolean;
}

/** Requested examination (wizard step 3). */
export interface RequestSection {
	ecgType: EcgType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms and red flags (wizard step 4). */
export interface SymptomsSection {
	symptomChestPain: boolean;
	symptomPalpitations: boolean;
	symptomSyncope: boolean;
	symptomBreathlessness: boolean;
	symptomDizziness: boolean;
	currentlySymptomatic: boolean;
	suspectedAcs: boolean;
	knownArrhythmia: KnownArrhythmia;
}

/** Relevant medications (wizard step 5). */
export interface MedicationsSection {
	relevantMedications: string;
}

/** Triage details (wizard step 6). */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	siteName: string;
	notes: string;
}

/**
 * The ECG test request — the source-of-truth record the four-axis vetting grade
 * is computed from.
 */
export interface EcgRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	medications: MedicationsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-acs'
	| 'active-chest-pain'
	| 'syncope-red-flag'
	| 'suspected-vt'
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
 * The computed four-axis vetting grade. Mirrors the form's grade SQL table.
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
	ecgType: EcgType;
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
