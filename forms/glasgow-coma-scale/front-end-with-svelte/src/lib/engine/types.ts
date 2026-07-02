// ──────────────────────────────────────────────
// Core assessment data types (Glasgow Coma Scale)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_glasgow_coma_scale.sql`.
// ──────────────────────────────────────────────

export type AssessorRole =
	| 'doctor'
	| 'nurse'
	| 'paramedic'
	| 'emergency-medical-technician'
	| 'advanced-clinical-practitioner'
	| 'neuro-observation-staff'
	| 'other'
	| '';
export type Setting = 'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | 'other' | '';
export type YesNo = 'yes' | 'no' | '';
export type EyeResponse = 'spontaneous' | 'to-sound' | 'to-pressure' | 'none' | 'NT' | '';
export type VerbalResponse = 'orientated' | 'confused' | 'words' | 'sounds' | 'none' | 'NT' | '';
export type MotorResponse =
	| 'obeys-commands'
	| 'localising'
	| 'normal-flexion'
	| 'abnormal-flexion'
	| 'extension'
	| 'none'
	| 'NT'
	| '';
export type Reactivity = 'reactive' | 'sluggish' | 'unreactive' | '';
export type SeverityBand = 'mild' | 'moderate' | 'severe' | '';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	assessorName: string;
	assessorRole: AssessorRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	setting: Setting;
	reason: string;
}

/** Step 2 — confounders (each may force a component to NT). */
export interface Confounders {
	intubated: YesNo;
	sedated: YesNo;
	paralysed: YesNo;
}

/** Step 3 — eye opening (E, 1-4), or NT. */
export interface Eye {
	eyeResponse: EyeResponse;
	eyeNotTestableReason: string;
}

/** Step 4 — verbal response (V, 1-5), or NT. */
export interface Verbal {
	verbalResponse: VerbalResponse;
	verbalNotTestableReason: string;
}

/** Step 5 — motor response (M, 1-6), or NT. */
export interface Motor {
	motorResponse: MotorResponse;
	motorNotTestableReason: string;
}

/** Step 6 — pupils (for GCS-Pupils). */
export interface Pupils {
	leftPupilReactivity: Reactivity;
	rightPupilReactivity: Reactivity;
	leftPupilSizeMm: number | null;
	rightPupilSizeMm: number | null;
}

/** Step 7 — trend. */
export interface Trend {
	previousTotal: number | null;
	previousMotorScore: number | null;
	previousAssessedAt: string;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Glasgow Coma Scale assessment data model. */
export interface AssessmentData {
	context: Context;
	confounders: Confounders;
	eye: Eye;
	verbal: Verbal;
	motor: Motor;
	pupils: Pupils;
	trend: Trend;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-EYE-SPONTANEOUS-01. */
	id: string;
	/** eye | verbal | motor | total | pupils | gcs-p | trend | other */
	component: string;
	/** Points contributed, or null for an NT / non-scoring row. */
	points: number | null;
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

/** A descriptor option for one GCS component. */
export interface ComponentOption {
	/** enum stored in state (mirrors the SQL check constraint) */
	value: string;
	/** resolved numeric score, or null for NT */
	score: number | null;
	/** human-readable descriptor for the dropdown */
	label: string;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	eyeScore: number | null;
	verbalScore: number | null;
	motorScore: number | null;
	totalScore: number | null;
	breakdown: string;
	totalDisplay: string;
	severityBand: SeverityBand;
	pupilReactivityScore: number | null;
	gcsP: number | null;
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
