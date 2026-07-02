// ──────────────────────────────────────────────
// Core assessment data types (MEWS)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_modified_early_warning_score.sql`. Ported faithfully from
// the tested HTML engine (`front-end-with-html/js/{types,rules,grader,flags}.js`).
//
// MEWS (Subbe 2001) scores five physiological parameters — systolic blood
// pressure, heart rate, respiratory rate, temperature, and AVPU level of
// consciousness — each 0-3, and sums them to an aggregate of 0-14.
// ──────────────────────────────────────────────

export type ClinicianRole = 'nurse' | 'healthcare-assistant' | 'doctor' | 'other' | '';
export type CareSetting = 'acute-ward' | 'admissions-unit' | 'assessment-unit' | 'other' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
/** AVPU level of consciousness. */
export type Avpu = 'alert' | 'voice' | 'pain' | 'unresponsive' | '';
export type RiskBand = 'low' | 'medium' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	observedAt: string;
	careSetting: CareSetting;
	wardLocation: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — systolic blood pressure (parameter 1). */
export interface BloodPressure {
	/** mmHg. */
	systolicBloodPressure: number | null;
}

/** Step 4 — heart rate (parameter 2). */
export interface HeartRate {
	/** beats/min. */
	heartRate: number | null;
}

/** Step 5 — respiratory rate (parameter 3). */
export interface Respiratory {
	/** breaths/min. */
	respiratoryRate: number | null;
}

/** Step 6 — temperature (parameter 4). */
export interface Temperature {
	/** degrees Celsius. */
	temperature: number | null;
}

/** Step 7 — level of consciousness (parameter 5). */
export interface Consciousness {
	avpu: Avpu;
}

/** Step 8 — trend input and clinician free-text note. */
export interface Summary {
	/**
	 * Aggregate MEWS from the previous observation set, used only to compute the
	 * deteriorating-trend flag; never used in the aggregate itself.
	 */
	previousMewsScore: number | null;
	clinicalNotes: string;
}

/** The full MEWS assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	bloodPressure: BloodPressure;
	heartRate: HeartRate;
	respiratory: Respiratory;
	temperature: Temperature;
	consciousness: Consciousness;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-SBP-3-01. */
	id: string;
	/** systolic-blood-pressure | heart-rate | respiratory-rate | temperature | avpu | aggregate | single-parameter */
	instrument: string;
	/** low | medium | high | '' */
	band: string;
	/** Subscore points contributed (0-3), or 0 for band/trigger rows. */
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

/** The five MEWS subscores (null when the input is unrecorded). */
export interface Subscores {
	systolicBloodPressure: 0 | 1 | 2 | 3 | null;
	heartRate: 0 | 1 | 2 | 3 | null;
	respiratoryRate: 0 | 1 | 2 | 3 | null;
	temperature: 0 | 1 | 2 | 3 | null;
	avpu: 0 | 1 | 2 | 3 | null;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	subscores: Subscores;
	mewsScore: number;
	riskBand: RiskBand;
	singleParameterTrigger: boolean;
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
