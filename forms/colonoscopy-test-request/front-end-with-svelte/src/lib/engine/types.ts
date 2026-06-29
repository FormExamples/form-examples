// ──────────────────────────────────────────────
// Colonoscopy Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request is graded on four
// independent axes: A appropriateness (1–9), B cancer-pathway urgency,
// C request completeness, and D pre-procedure risk, plus safety flags.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested lower-GI endoscopy procedure. */
export type Procedure = 'colonoscopy' | 'flexible-sigmoidoscopy' | 'ct-colonography' | 'other' | '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'rectal-bleeding'
	| 'change-in-bowel-habit'
	| 'iron-deficiency-anaemia'
	| 'positive-fit'
	| 'abdominal-mass'
	| 'ibd-diagnosis'
	| 'ibd-surveillance'
	| 'polyp-surveillance'
	| 'crc-screening'
	| 'abnormal-imaging'
	| 'chronic-diarrhoea'
	| 'other'
	| '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Requesting clinician role. */
export type ClinicianRole =
	| 'gastroenterologist'
	| 'colorectal-surgeon'
	| 'gp'
	| 'nurse-endoscopist'
	| 'other'
	| '';

/** Diabetes medication category. */
export type DiabetesMedication = 'none' | 'oral' | 'insulin' | '';

/** ASA physical-status grade. */
export type AsaGrade = 'I' | 'II' | 'III' | 'IV' | 'V' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — cancer-pathway triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Axis D — pre-procedure risk band. */
export type RiskBand = 'low' | 'moderate' | 'high' | '';

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

/** Patient identification and demographics. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
	setting: Setting;
}

/** Requested procedure, indication, and clinical question. */
export interface RequestSection {
	procedure: Procedure;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Lower-GI red flags and triage labs. */
export interface RedFlagsSection {
	weightLoss: boolean;
	anaemia: boolean;
	abdominalMass: boolean;
	rectalBleeding: boolean;
	fitResultUgG: number | null;
	haemoglobinGL: number | null;
}

/** Anticoagulant / antiplatelet / diabetes medication. */
export interface MedicationSection {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	antiplateletAgent: string;
	diabetesMedication: DiabetesMedication;
}

/** Bowel-prep fitness, renal function, and ASA grade. */
export interface FitnessSection {
	fitForBowelPrep: boolean;
	bowelPrepAgent: string;
	chronicKidneyDisease: boolean;
	egfrMlMin: number | null;
	asaGrade: AsaGrade;
}

/** Requested urgency, requested-by date, and notes. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	notes: string;
}

/**
 * The colonoscopy procedure request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface ColonoscopyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	redFlags: RedFlagsSection;
	medication: MedicationSection;
	fitness: FitnessSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'risk';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-cancer-2ww'
	| 'high-bleeding-risk-anticoag'
	| 'unfit-for-prep'
	| 'asa-iv'
	| 'missing-fit'
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
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	twoWeekWaitRationale: string;
	// Axis C
	completenessPercent: number;
	// Axis D
	riskBand: RiskBand;
	anticoagulantAction: string;
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
	procedure: Procedure;
	primaryIndication: Indication;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	riskBand: RiskBand;
	recommendation: Recommendation;
	flagCount: number;
}
