// ──────────────────────────────────────────────
// Endoscopy Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is nested by section
// to match the HTML reference engine and the wizard step structure.
// ──────────────────────────────────────────────

// ─── Enumerations ───

/** Requested GI endoscopy procedure. */
export type RequestedProcedure =
	| 'ogd'
	| 'gastroscopy'
	| 'colonoscopy'
	| 'flexible-sigmoidoscopy'
	| 'ercp'
	| 'eus'
	| 'capsule'
	| 'other'
	| '';

/** Primary clinical indication for the request. */
export type PrimaryIndication =
	| 'dyspepsia'
	| 'gord'
	| 'dysphagia'
	| 'upper-gi-bleeding'
	| 'iron-deficiency-anaemia'
	| 'weight-loss'
	| 'suspected-malignancy'
	| 'barretts-surveillance'
	| 'h-pylori'
	| 'rectal-bleeding'
	| 'change-in-bowel-habit'
	| 'positive-fit'
	| 'ibd-surveillance'
	| 'polyp-surveillance'
	| 'abnormal-imaging'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'day-case' | '';

/** NYHA cardiac functional class. */
export type NyhaClass = '' | 'I' | 'II' | 'III' | 'IV';

/** ASA physical-status grade. */
export type AsaGrade = '' | 'I' | 'II' | 'III' | 'IV' | 'V';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — cancer-pathway urgency / triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';

/** Axis D — pre-procedure risk band. */
export type RiskBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by section) ───

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
	bodyMassIndex: number | null;
	interpreterRequired: boolean;
}

/** Requested procedure, indication and clinical question. */
export interface RequestSection {
	requestedProcedure: RequestedProcedure;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** ALARM red flags and triage labs. */
export interface RedFlagsSection {
	redFlagDysphagia: boolean;
	redFlagWeightLoss: boolean;
	redFlagAnaemia: boolean;
	redFlagGiBleeding: boolean;
	redFlagAbdominalMass: boolean;
	redFlagAgeOver55: boolean;
	fitResultUgG: number | null;
	haemoglobinGL: number | null;
	ferritinUgL: number | null;
}

/** Anticoagulant / antiplatelet and allergy medication. */
export interface MedicationSection {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	antiplateletAgent: string;
	diabetesMedication: string;
	allergies: string;
	latexAllergy: boolean;
}

/** Comorbidities and fitness. */
export interface ComorbiditiesSection {
	cardiacNyhaClass: NyhaClass;
	pacemakerIcd: boolean;
	chronicKidneyDisease: boolean;
	egfrMlMin: number | null;
	sleepApnoea: boolean;
	neutropenia: boolean;
	asaGrade: AsaGrade;
}

/** Infection-control flags and procedure preparation. */
export interface InfectionPrepSection {
	vcjdRisk: boolean;
	cpeCarriage: boolean;
	mrsa: boolean;
	bloodBorneVirus: boolean;
	fitForBowelPrep: boolean;
	bowelPrepAgent: string;
	sedation: string;
	escortAvailable: boolean;
}

/** Triage and submit. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The GI endoscopy request — the source-of-truth record the four-axis vetting
 * grade is computed from.
 */
export interface EndoscopyRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	redFlags: RedFlagsSection;
	medication: MedicationSection;
	comorbidities: ComorbiditiesSection;
	infectionPrep: InfectionPrepSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'risk';

/** Flag category (mirrors the grade_flag CHECK constraint). */
export type FlagCategory =
	| 'acute-gi-bleed'
	| 'suspected-cancer-2ww'
	| 'high-bleeding-risk-anticoag'
	| 'asa-iv'
	| 'unfit-for-prep'
	| 'infection-precaution'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'missing-fit'
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

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A — appropriateness
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B — cancer-pathway urgency
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
	twoWeekWaitRationale: string;
	// Axis C — completeness
	completenessPercent: number;
	// Axis D — pre-procedure risk
	glasgowBlatchfordScore: number;
	rockallScore: number;
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
export interface ReferralRow {
	id: string;
	patientName: string;
	requestedProcedure: RequestedProcedure;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	triageTier: TriageTier;
	completenessPercent: number;
	riskBand: RiskBand;
	recommendation: Recommendation;
	flagCount: number;
}
