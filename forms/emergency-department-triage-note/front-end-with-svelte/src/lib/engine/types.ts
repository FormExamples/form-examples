// ──────────────────────────────────────────────
// Core assessment data types (Emergency Department Triage Note)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_emergency_department_triage_note.sql` (and the patient
// table). Ported faithfully from the tested HTML engine
// (`front-end-with-html/js/{types,rules,grader,flags}.js`).
//
// This is a CLASSIFICATION form: the engine selects the most urgent Manchester
// Triage System (MTS) priority level justified by the findings; it does NOT sum
// a numeric total.
// ──────────────────────────────────────────────

export type CareSetting =
	| 'emergency-department'
	| 'urgent-treatment-centre'
	| 'minor-injuries-unit'
	| '';
export type ArrivalMode = 'walk-in' | 'ambulance' | 'other' | '';
export type AgeBand = 'paediatric' | 'adult' | 'older-adult' | '';
export type Sex = 'female' | 'male' | 'other' | '';
export type AirOrOxygen = 'air' | 'oxygen' | '';
/** ACVPU consciousness level. */
export type Acvpu = 'A' | 'C' | 'V' | 'P' | 'U' | '';
export type YesNo = 'yes' | 'no' | '';
export type Priority = 'high' | 'medium' | 'low';

/** MTS priority level: 1 (most urgent) to 5 (non-urgent). */
export type PriorityLevel = 1 | 2 | 3 | 4 | 5;
export type PriorityColour = 'red' | 'orange' | 'yellow' | 'green' | 'blue';
export type TargetMinutes = 0 | 10 | 60 | 120 | 240;

/** Step 1 — triage context. */
export interface Context {
	nurseName: string;
	/** ISO-ish datetime-local string; '' when unset. */
	triagedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — arrival. */
export interface Arrival {
	arrivalMode: ArrivalMode;
	/** ISO-ish datetime-local string; '' when unset. */
	arrivedAt: string;
	referralSource: string;
}

/** Step 3 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 4 — presenting complaint. */
export interface Complaint {
	presentingComplaint: string;
	briefHistory: string;
	symptomOnset: string;
}

/** Step 5 — triage vital signs (NEWS2 inputs + optional GCS). */
export interface Vitals {
	/** breaths/min. */
	respiratoryRate: number | null;
	/** SpO2 %. */
	spo2: number | null;
	/** air or supplemental oxygen (NEWS2 +2 weighting). */
	onOxygen: AirOrOxygen;
	/** mmHg. */
	systolicBp: number | null;
	/** beats/min. */
	pulse: number | null;
	/** ACVPU consciousness level. */
	consciousnessAcvpu: Acvpu;
	/** degrees Celsius. */
	temperature: number | null;
	/** optional GCS total (3-15). */
	glasgowComaScale: number | null;
}

/** Step 6 — pain score. */
export interface Pain {
	/** 0-10 numeric rating. */
	painScore: number | null;
}

/** Step 7 — Manchester Triage System discriminator flags (each yes/no). */
export interface Discriminators {
	airwayThreat: YesNo;
	breathingInadequate: YesNo;
	circulationShock: YesNo;
	haemorrhageMajor: YesNo;
	consciousnessReduced: YesNo;
	seizureActive: YesNo;
	focalNeurology: YesNo;
	sepsisFeatures: YesNo;
	chestPainCardiac: YesNo;
	strokeFeatures: YesNo;
	paediatricRedFlag: YesNo;
}

/** Step 8 — free-text triage note. */
export interface Note {
	clinicalNotes: string;
}

/** The full ED triage assessment data model. */
export interface AssessmentData {
	context: Context;
	arrival: Arrival;
	identification: Identification;
	complaint: Complaint;
	vitals: Vitals;
	pain: Pain;
	discriminators: Discriminators;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading (classification) types
// ──────────────────────────────────────────────

/** A fired MTS discriminator: the minimum priority level it forces. */
export interface FiredDiscriminator {
	/** Stable rule id, e.g. D-AIRWAY-THREAT. */
	id: string;
	/** airway | breathing | circulation | disability | temperature | pain | news2 */
	category: string;
	/** MTS minimum level this discriminator forces (1 = most urgent). */
	level: PriorityLevel;
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

/** The seven NEWS2 subscores (supporting aggregate, not the classification). */
export interface Subscores {
	respiratoryRate: 0 | 1 | 2 | 3 | null;
	spo2: 0 | 1 | 2 | 3 | null;
	oxygen: 0 | 2;
	systolicBp: 0 | 1 | 2 | 3 | null;
	pulse: 0 | 1 | 2 | 3 | null;
	consciousness: 0 | 3 | null;
	temperature: 0 | 1 | 2 | 3 | null;
}

/** The full triage classification result for one assessment. */
export interface TriageResult {
	subscores: Subscores;
	news2Total: number;
	news2AnyParameterThree: boolean;
	firedDiscriminators: FiredDiscriminator[];
	priorityLevel: PriorityLevel;
	priorityColour: PriorityColour;
	priorityName: string;
	targetMinutes: TargetMinutes;
	complete: boolean;
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
