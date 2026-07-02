// ──────────────────────────────────────────────
// Core assessment data types (Rockall Score for Upper Gastrointestinal Bleeding)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_rockall_score_for_upper_gastrointestinal_bleeding.sql`.
// Three clinical parameters — age, shock (derived from systolic blood pressure
// and heart rate), and comorbidity — produce a pre-endoscopy (clinical) Rockall
// score of 0-7; when endoscopy has been performed, two endoscopic parameters —
// diagnosis and stigmata of recent haemorrhage — extend it to a full
// (post-endoscopy) Rockall score of 0-11, banded low / intermediate / high.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse'
	| 'gastroenterologist'
	| 'endoscopist'
	| 'other'
	| '';
export type CareSetting = 'emergency-department' | 'ward' | 'endoscopy-unit' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type Comorbidity = 'none' | 'major' | 'severe' | '';
export type YesNo = 'yes' | 'no' | '';
export type Diagnosis = 'mallory-weiss-or-none' | 'all-other' | 'upper-gi-malignancy' | '';
export type Stigmata = 'none-or-dark-spot' | 'high-risk' | '';
export type RiskBand = 'low' | 'intermediate' | 'high' | 'clinical-only';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	presentingComplaint: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	/** Whole years; scores 0 (< 60), 1 (60-79), 2 (>= 80). */
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — shock (clinical parameter, derived from two vital signs). */
export interface Shock {
	/** mmHg; SBP < 100 scores 2 (hypotension). */
	systolicBloodPressure: number | null;
	/** bpm; HR >= 100 scores 1 (tachycardia) when not hypotensive. */
	heartRate: number | null;
}

/** Step 4 — comorbidity (clinical parameter). */
export interface ComorbidityStep {
	/** none (0), major (2), severe (3). */
	comorbidity: Comorbidity;
}

/** Step 5 — endoscopy (gates the full score) and the two endoscopic parameters. */
export interface Endoscopy {
	endoscopyPerformed: YesNo;
	/** Endoscopic diagnosis (full score only). */
	diagnosis: Diagnosis;
	/** Stigmata of recent haemorrhage (full score only). */
	stigmata: Stigmata;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Rockall assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	shock: Shock;
	comorbidityStep: ComorbidityStep;
	endoscopy: Endoscopy;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-AGE-2POINT-01. */
	id: string;
	/** age | shock | comorbidity | diagnosis | stigmata | band. */
	parameter: string;
	/** Points contributed for the parameter, or null. */
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

/** A declarative per-parameter/band scoring rule. */
export interface RockallRule {
	id: string;
	/** age | shock | comorbidity | diagnosis | stigmata. */
	parameter: string;
	/** Points awarded when the rule fires. */
	points: number;
	category: string;
	description: string;
	evaluate: (d: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	agePoints: 0 | 1 | 2;
	shockPoints: 0 | 1 | 2;
	comorbidityPoints: 0 | 2 | 3;
	/** 0..7 clinical (pre-endoscopy) score. */
	clinicalRockallScore: number;
	diagnosisPoints: 0 | 1 | 2;
	stigmataPoints: 0 | 2;
	/** 0..11 full (post-endoscopy) score, or null when no endoscopy. */
	fullRockallScore: number | null;
	riskBand: RiskBand;
	/** fullRockallScore ?? clinicalRockallScore. */
	score: number;
	/** True when endoscopy has been performed (full score available). */
	endoscopyDone: boolean;
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
