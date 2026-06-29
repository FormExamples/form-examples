// ──────────────────────────────────────────────
// Holter Monitor Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request is a nested model whose
// sections mirror the six wizard steps.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested ambulatory-monitor type. */
export type MonitorType =
	| '24-hour'
	| '48-hour'
	| '7-day'
	| '14-day'
	| 'event-recorder'
	| 'implantable-loop-recorder'
	| 'other'
	| '';

/** Primary clinical indication for monitoring. */
export type PrimaryIndication =
	| 'palpitations'
	| 'suspected-arrhythmia'
	| 'syncope'
	| 'atrial-fibrillation-detection'
	| 'post-stroke-af-screen'
	| 'rate-control-assessment'
	| 'qt-monitoring'
	| 'pacemaker-check'
	| 'other'
	| '';

/** How often the patient's symptoms occur. */
export type SymptomFrequency = 'daily' | 'weekly' | 'monthly' | 'rare' | '';

/** Known / suspected arrhythmia in the cardiac context. */
export type KnownArrhythmia =
	| 'atrial-fibrillation'
	| 'svt'
	| 'vt'
	| 'heart-block'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (from the 1–9 ordinal score). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis A.2 — symptom-frequency / monitor-duration fit. */
export type MatchFit = 'matched' | 'borderline' | 'mismatched' | '';

/** Axis B — triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Axis D — clinical-priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested model) ───

/** Requesting clinician section. */
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
}

/** Requested-examination section. */
export interface RequestSection {
	monitorType: MonitorType;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms section. */
export interface SymptomsSection {
	palpitations: boolean;
	syncope: boolean;
	presyncope: boolean;
	breathlessness: boolean;
	symptomFrequency: SymptomFrequency;
}

/** Cardiac-context and red-flags section. */
export interface CardiacSection {
	knownArrhythmia: KnownArrhythmia;
	recentStrokeTia: boolean;
	relevantMedications: string;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The ambulatory ECG (Holter) monitoring request — the source-of-truth record
 * the four-axis vetting grade is computed from.
 */
export interface HolterRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	cardiac: CardiacSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'syncope-red-flag'
	| 'suspected-vt'
	| 'post-stroke-af-detection'
	| 'symptom-frequency-monitor-mismatch'
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
 * The computed four-axis vetting grade for an ambulatory ECG monitoring
 * request. Mirrors the form's sql grade table.
 */
export interface GradingResult {
	// Axis A — appropriateness
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	matchFit: MatchFit;
	recommendedMonitor: string;
	// Axis B — urgency / triage
	triageTier: TriageTier;
	targetTimeframe: string;
	// Axis C — completeness
	completenessPercent: number;
	// Axis D — clinical priority
	priorityBand: PriorityBand;
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
	monitorType: MonitorType;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
