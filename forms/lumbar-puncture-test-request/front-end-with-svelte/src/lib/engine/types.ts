// ──────────────────────────────────────────────
// Lumbar Puncture Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The data model is nested by section
// (clinician, patient, procedure, neuroSafety, bleeding, triage).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Intent of the lumbar puncture. */
export type ProcedureIntent = 'diagnostic' | 'therapeutic' | 'other' | '';

/** Primary clinical indication for the lumbar puncture. */
export type PrimaryIndication =
	| 'suspected-meningitis'
	| 'suspected-subarachnoid-haemorrhage'
	| 'suspected-multiple-sclerosis'
	| 'suspected-guillain-barre'
	| 'idiopathic-intracranial-hypertension'
	| 'suspected-cns-malignancy'
	| 'cns-infection'
	| 'other'
	| '';

/** CT head status before the lumbar puncture. */
export type CtHeadStatus = 'not-required' | 'awaited' | 'done-normal' | 'done-abnormal' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'day-case' | 'emergency' | 'community' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — safety / contraindication band. */
export type ContraindicationBand = 'ok' | 'caution' | 'contraindicated' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

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
}

/** Procedure intent and clinical indication. */
export interface ProcedureSection {
	procedureIntent: ProcedureIntent;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Raised-intracranial-pressure / neurological safety screen. */
export interface NeuroSafetySection {
	suspectedRaisedIntracranialPressure: boolean;
	focalNeurologicalSigns: boolean;
	reducedConsciousness: boolean;
	ctHeadStatus: CtHeadStatus;
}

/** Bleeding / coagulation safety screen. */
export interface BleedingSection {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	antiplateletAgent: string;
	inr: number | null;
	plateletCount: number | null;
	bleedingDisorder: boolean;
	localSkinInfection: boolean;
}

/** Procedure detail and triage. */
export interface TriageSection {
	openingPressureRequired: boolean;
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The lumbar puncture request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface LumbarPunctureRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	procedure: ProcedureSection;
	neuroSafety: NeuroSafetySection;
	bleeding: BleedingSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-raised-icp-needs-imaging'
	| 'suspected-meningitis-emergency'
	| 'coagulopathy'
	| 'high-bleeding-risk-anticoag'
	| 'thrombocytopenia'
	| 'local-infection'
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
	contraindicationBand: ContraindicationBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
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
	primaryIndication: PrimaryIndication;
	procedureIntent: ProcedureIntent;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	contraindicationBand: ContraindicationBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
