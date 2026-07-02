// ──────────────────────────────────────────────
// Core assessment data types (History and Physical Examination — H&P)
//
// The H&P is a DOCUMENTATION and COMPLETENESS instrument, not a numeric-score
// form: the engine grades how thoroughly the clerking has been documented
// (Complete / Partial / Incomplete) and reports a completeness percentage — it
// never sums a total. Ten required components are each evaluated as satisfied or
// missing; two blocking safety flags (allergies not documented; no impression
// and no plan) force an `incomplete` status. camelCase property names mirror the
// snake_case SQL columns in
// `sql/04_create_table_history_and_physical_examination.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'acp' | 'physician-associate' | 'other' | '';
export type CareSetting =
	| 'emergency-department'
	| 'acute-medical-unit'
	| 'ward'
	| 'other'
	| '';
export type AdmissionSource = 'self' | 'gp' | 'ambulance' | 'transfer' | 'other' | '';
export type AgeBand = '18-39' | '40-64' | '65-79' | '80-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type AllergyStatus = 'none-known' | 'has-allergies' | 'not-documented' | '';
export type ConsciousnessLevel = 'alert' | 'voice' | 'pain' | 'unresponsive' | '';

export type CompletenessStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — encounter and clinician. */
export interface Encounter {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	registrationNumber: string;
	/** ISO-ish datetime-local string; '' when unset. */
	clerkedAt: string;
	careSetting: CareSetting;
	admissionSource: AdmissionSource;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** History sections. */
export interface History {
	presentingComplaint: string;
	historyOfPresentingComplaint: string;
	pastMedicalSurgicalHistory: string;
	drugHistory: string;
	allergyStatus: AllergyStatus;
	allergyDetail: string;
	familyHistory: string;
	socialHistory: string;
	systemsReview: string;
}

/** Vital signs — numeric fields are `null` when not measured. */
export interface Vitals {
	/** degrees Celsius; normal 36.1-38.0 */
	temperature: number | null;
	/** bpm; normal 51-90 */
	heartRate: number | null;
	/** /min; normal 12-20 */
	respiratoryRate: number | null;
	/** mmHg; normal 111-219 */
	systolicBloodPressure: number | null;
	/** %; normal >= 96 */
	oxygenSaturation: number | null;
	/** AVPU; anything but alert is flagged */
	consciousnessLevel: ConsciousnessLevel;
}

/** Examination and investigations. */
export interface Examination {
	examCardiovascular: string;
	examRespiratory: string;
	examAbdominal: string;
	examNeurological: string;
	examOther: string;
	investigations: string;
}

/** Impression, plan, and note. */
export interface Assessment {
	impression: string;
	redFlagFindings: string;
	managementPlan: string;
	clinicalNote: string;
}

/** The full H&P clerking data model (nested by wizard section). */
export interface AssessmentData {
	encounter: Encounter;
	identification: Identification;
	history: History;
	vitals: Vitals;
	examination: Examination;
	assessment: Assessment;
}

/**
 * Flat clerking record consumed by the completeness engine — the merge of every
 * section's fields into one object keyed by camelCase SQL column name.
 */
export type ClerkingRecord = Encounter &
	Identification &
	History &
	Vitals &
	Examination &
	Assessment;

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** Per-component documentation status row. */
export interface ComponentStatus {
	/** Stable required-component key, e.g. presenting-complaint. */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** True when the required component is satisfactorily documented. */
	satisfied: boolean;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-COMPONENT-PRESENTING-COMPLAINT-01. */
	id: string;
	/** Required-component id (kebab-case). */
	component: string;
	/** history | examination | vitals | impression | plan | completeness */
	section: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** allergies-not-documented | no-impression-or-plan | abnormal-vitals | ... */
	category: string;
	priority: Priority;
	/** Two categories are blocking — they force an incomplete status. */
	blocking: boolean;
	description: string;
	suggestedAction: string;
}

/** A required-component rule: satisfied when the component is documented. */
export interface ComponentRule {
	id: string;
	/** Required-component id (kebab-case). */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** history | examination | vitals | impression | plan */
	section: string;
	category: string;
	description: string;
	evaluate: (r: ClerkingRecord) => boolean;
}

/** The full completeness result for one clerking. */
export interface GradingResult {
	status: CompletenessStatus;
	/** 0..100. */
	completenessPercent: number;
	componentStatuses: ComponentStatus[];
	satisfiedComponents: string[];
	missingComponents: string[];
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
	/** True when a blocking flag forced the incomplete status. */
	blocking: boolean;
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}
