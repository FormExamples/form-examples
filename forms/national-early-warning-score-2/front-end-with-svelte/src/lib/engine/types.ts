// ──────────────────────────────────────────────
// Core assessment data types (NEWS2)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_national_early_warning_score_2.sql` (and the patient
// table). Ported faithfully from the tested HTML engine
// (`front-end-with-html/js/{types,rules,grader,flags}.js`).
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse'
	| 'healthcare-assistant'
	| 'paramedic'
	| 'other'
	| '';
export type Spo2Scale = 'scale-1' | 'scale-2' | '';
export type AirOrOxygen = 'air' | 'oxygen' | '';
export type OxygenDevice =
	| 'nasal-cannula'
	| 'simple-face-mask'
	| 'venturi-mask'
	| 'non-rebreather-mask'
	| 'humidified'
	| 'cpap'
	| 'niv'
	| 'tracheostomy'
	| 'ventilator'
	| 'other'
	| '';
/** ACVPU consciousness level. */
export type Acvpu = 'A' | 'C' | 'V' | 'P' | 'U' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'low-medium' | 'medium' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	observationAt: string;
	wardOrLocation: string;
	spo2Scale: Spo2Scale;
	/** Clinician endorsement for Scale 2. */
	spo2Scale2Endorsed: YesNo;
}

/** Step 2 — patient identification and scope screening. */
export interface Identification {
	patientName: string;
	nhsNumber: string;
	/** ISO date string; '' when unset (bound to a Lily date input). */
	birthDate: string;
	isUnder16: YesNo;
	isPregnant: YesNo;
	hasSpinalCordInjury: YesNo;
}

/** Step 3 — respiration rate (parameter 1). */
export interface Respiration {
	/** breaths/min. */
	respiratoryRate: number | null;
}

/** Step 4 — oxygen saturation (parameter 2). */
export interface OxygenSaturation {
	/** SpO2 %. */
	spo2: number | null;
}

/** Step 5 — air or supplemental oxygen (parameter 3, +2 weighting). */
export interface OxygenSupport {
	onOxygen: AirOrOxygen;
	oxygenDevice: OxygenDevice;
	/** litres/min. */
	oxygenFlowRateLMin: number | null;
	/** FiO2 %. */
	inspiredOxygenFractionPercent: number | null;
}

/** Step 6 — systolic blood pressure (parameter 4). */
export interface BloodPressure {
	/** mmHg. */
	systolicBloodPressure: number | null;
	/** mmHg (optional, unscored). */
	diastolicBloodPressure: number | null;
}

/** Step 7 — pulse (parameter 5). */
export interface Pulse {
	/** beats/min. */
	pulse: number | null;
}

/** Step 8 — consciousness / ACVPU (parameter 6). */
export interface Consciousness {
	consciousnessAcvpu: Acvpu;
}

/** Step 9 — temperature (parameter 7). */
export interface Temperature {
	/** degrees Celsius. */
	temperature: number | null;
}

/** Step 10 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full NEWS2 assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	respiration: Respiration;
	oxygenSaturation: OxygenSaturation;
	oxygenSupport: OxygenSupport;
	bloodPressure: BloodPressure;
	pulse: Pulse;
	consciousness: Consciousness;
	temperature: Temperature;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-RESP-RATE-3-01. */
	id: string;
	/** respiratory-rate | spo2 | oxygen | blood-pressure | pulse | consciousness | temperature | aggregate | red-score */
	instrument: string;
	/** low | low-medium | medium | high | '' */
	band: string;
	/** Subscore points contributed (0-3). */
	points: number;
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

/** The seven NEWS2 subscores. */
export interface Subscores {
	respiratoryRate: 0 | 1 | 2 | 3 | null;
	spo2: 0 | 1 | 2 | 3 | null;
	oxygen: 0 | 2;
	systolicBp: 0 | 1 | 2 | 3 | null;
	pulse: 0 | 1 | 2 | 3 | null;
	consciousness: 0 | 3 | null;
	temperature: 0 | 1 | 2 | 3 | null;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	subscores: Subscores;
	aggregate: number;
	redScore: boolean;
	riskBand: RiskBand;
	monitoringFrequency: string;
	recommendation: string;
	complete: boolean;
	firedRules: FiredRule[];
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
