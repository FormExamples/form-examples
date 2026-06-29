// ──────────────────────────────────────────────
// Mammography Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the sql/ migrations. The request is a nested record by section
// (clinician / patient / request / symptoms / history / triage), matching the
// HTML front-end's data model and the back-end examples.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested mammography examination type. */
export type ExamType = 'screening' | 'diagnostic' | 'symptomatic' | 'surveillance' | 'other' | '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'routine-screening'
	| 'breast-lump'
	| 'breast-pain'
	| 'nipple-discharge'
	| 'skin-change'
	| 'family-history'
	| 'follow-up-known-cancer'
	| 'post-treatment-surveillance'
	| 'recall-from-screening'
	| 'other'
	| '';

/** Examination laterality. */
export type Laterality = 'left' | 'right' | 'bilateral' | 'not-applicable' | '';

/** Previous-mammogram outcome. */
export type PreviousMammogram = 'none' | 'normal' | 'abnormal' | 'unknown' | '';

/** Pregnancy / lactation status. */
export type PregnancyStatus = 'no' | 'pregnant' | 'lactating' | 'unknown' | '';

/** Requested triage urgency / cancer-pathway tier. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'screening-unit' | 'emergency' | '';

// ─── Grade axis enumerations ───

/** Axis A — appropriateness band (ACR Appropriateness Criteria 1–9). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — cancer-pathway triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | 'emergency';

/** Axis D — clinical priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject';

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the grade_flag SQL CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'breast-lump'
	| 'bloody-nipple-discharge'
	| 'age-below-screening'
	| 'pregnancy-lactating'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

// ─── The request record (nested by section) ───

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
	bodyMassIndex: number | null;
}

/** Requested-examination section. */
export interface RequestSection {
	examType: ExamType;
	primaryIndication: Indication;
	laterality: Laterality;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Breast-symptoms section. */
export interface SymptomsSection {
	symptomLump: boolean;
	symptomPain: boolean;
	symptomNippleDischarge: boolean;
	symptomSkinChange: boolean;
	symptomNippleInversion: boolean;
}

/** Breast-history and risk-factor section. */
export interface HistorySection {
	previousMammogram: PreviousMammogram;
	previousMammogramDate: string;
	familyHistoryBreastCancer: boolean;
	breastImplants: boolean;
	pregnancyOrLactating: PregnancyStatus;
	hormoneReplacementTherapy: boolean;
}

/** Triage section. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	siteName: string;
	notes: string;
}

/**
 * The mammography test request — the source-of-truth record the four-axis
 * grade is computed from.
 */
export interface MammographyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	history: HistorySection;
	triage: TriageSection;
}

// ─── Grading types ───

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

/**
 * The computed four-axis grade: appropriateness (A), cancer-pathway urgency
 * (B), request completeness (C), and clinical priority (D), plus an overall
 * recommendation, the fired-rule audit trail, and safety flags.
 */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	twoWeekWaitRationale: string;
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

/** A wizard step descriptor. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

// ─── Dashboard row ───

/** A graded request row for the vetting dashboard table. */
export interface DashboardRow {
	id: string;
	patientName: string;
	examType: ExamType;
	indication: Indication;
	referralDate: string;
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	twoWeekWaitEligible: boolean;
	completenessPercent: number;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
