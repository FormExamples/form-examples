// ──────────────────────────────────────────────
// Sleep Study Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The model is nested by wizard section
// (clinician, patient, request, scores, symptoms, triage).
// ──────────────────────────────────────────────

// ─── Enumerations ───

/** Requested sleep-study investigation type. */
export type StudyType =
	| 'home-sleep-apnoea-test'
	| 'polysomnography'
	| 'overnight-oximetry'
	| 'multiple-sleep-latency-test'
	| 'actigraphy'
	| 'other'
	| '';

/** Primary clinical indication for the study. */
export type Indication =
	| 'suspected-osa'
	| 'snoring'
	| 'daytime-sleepiness'
	| 'suspected-narcolepsy'
	| 'insomnia'
	| 'restless-legs'
	| 'copd-overlap'
	| 'pre-bariatric'
	| 'driver-assessment'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'home' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — clinical-priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high' | '';

/** Axis D — triage tier. */
export type TriageTier = 'routine' | 'urgent' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician identification and contact. */
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

/** Patient identification and anthropometry. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
	interpreterRequired: boolean;
}

/** Requested study, indication, and clinical question. */
export interface RequestSection {
	studyType: StudyType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Sleep scores and anthropometry that drive the axes. */
export interface ScoresSection {
	epworthScore: number | null;
	stopBangScore: number | null;
	neckCircumferenceCm: number | null;
}

/** Symptom and risk-factor flags. */
export interface SymptomsSection {
	witnessedApnoeas: boolean;
	occupationalDriver: boolean;
	cardiovascularDisease: boolean;
}

/** Triage details. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The sleep-study referral / request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface SleepStudyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	scores: ScoresSection;
	symptoms: SymptomsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'priority' | 'completeness' | 'triage';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'occupational-driver-osa'
	| 'severe-daytime-sleepiness'
	| 'suspected-narcolepsy'
	| 'missing-epworth'
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

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	priorityBand: PriorityBand;
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
	studyType: StudyType;
	primaryIndication: Indication;
	referralDate: string;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	priorityBand: PriorityBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
