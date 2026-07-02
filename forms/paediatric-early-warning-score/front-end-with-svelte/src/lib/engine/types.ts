// ──────────────────────────────────────────────
// Core assessment data types (Paediatric Early Warning Score — PEWS)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_paediatric_early_warning_score.sql` (and the patient
// table). Ported faithfully from the tested HTML engine
// (`front-end-with-html/js/{types,rules,grader,flags}.js`).
//
// Age-banding is central: the age band is selected first and sets the normal
// ranges for the two rate parameters (respiratory rate and heart rate).
// ──────────────────────────────────────────────

export type ClinicianRole = 'nurse' | 'healthcare-assistant' | 'doctor' | 'other' | '';
export type CareSetting =
	| 'ward'
	| 'childrens-assessment-unit'
	| 'emergency-department'
	| 'other'
	| '';
export type AgeBand = 'neonate' | 'infant' | 'young-child' | 'child' | 'adolescent' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type RespiratoryEffort = 'none' | 'mild' | 'moderate' | 'severe' | '';
export type SupplementalOxygen = 'room-air' | 'low-flow' | 'high-flow' | '';
export type CapillaryRefill = 'under-2s' | '2-3s' | '3-4s' | 'over-4s' | '';
export type Consciousness = 'alert' | 'voice' | 'pain' | 'unresponsive' | '';
export type YesNo = 'yes' | 'no' | '';
export type EscalationBand = 'routine' | 'low' | 'medium' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	observationAt: string;
	careSetting: CareSetting;
}

/**
 * Step 2 — patient identification and age band. The age band is selected first
 * and drives the normal ranges for the rate parameters.
 */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — respiratory domain. */
export interface Respiratory {
	/** breaths/min (scored vs age band). */
	respiratoryRate: number | null;
	respiratoryEffort: RespiratoryEffort;
	/** SpO2 %. */
	oxygenSaturation: number | null;
	supplementalOxygen: SupplementalOxygen;
}

/** Step 4 — cardiovascular domain. */
export interface Cardiovascular {
	/** beats/min (scored vs age band). */
	heartRate: number | null;
	capillaryRefill: CapillaryRefill;
}

/** Step 5 — behaviour / neurological domain. */
export interface Behaviour {
	/** ACVPU consciousness level. */
	consciousness: Consciousness;
}

/** Step 6 — documented-concern override triggers. */
export interface Concern {
	nurseConcern: YesNo;
	parentConcern: YesNo;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full PEWS assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	respiratory: Respiratory;
	cardiovascular: Cardiovascular;
	behaviour: Behaviour;
	concern: Concern;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-RESP-RATE-3-01. */
	id: string;
	/** respiratory-rate | respiratory-effort | oxygen-saturation | supplemental-oxygen | heart-rate | capillary-refill | consciousness | aggregate | single-parameter | concern */
	instrument: string;
	/** routine | low | medium | high | '' */
	band: string;
	/** Subscore points contributed (0-3), or null for non-scoring rows. */
	points: number | null;
	category: string;
	description: string;
}

/** An override trigger that fired (independent of the aggregate). */
export interface FiredTrigger {
	id: string;
	/** single-parameter | nurse-concern | parent-concern */
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The seven PEWS subscores. */
export interface Subscores {
	respiratoryRate: 0 | 1 | 2 | 3 | null;
	respiratoryEffort: 0 | 1 | 2 | 3 | null;
	oxygenSaturation: 0 | 1 | 2 | 3 | null;
	supplementalOxygen: 0 | 1 | 3 | null;
	heartRate: 0 | 1 | 2 | 3 | null;
	capillaryRefill: 0 | 1 | 2 | 3 | null;
	consciousness: 0 | 1 | 2 | 3 | null;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	subscores: Subscores;
	aggregateScore: number;
	maxParameterScore: 0 | 1 | 2 | 3;
	singleParameterTrigger: boolean;
	escalationBand: EscalationBand;
	monitoringFrequency: string;
	recommendation: string;
	complete: boolean;
	firedRules: FiredRule[];
	firedTriggers: FiredTrigger[];
	flaggedIssues: FlaggedIssue[];
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
