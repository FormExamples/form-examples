// ──────────────────────────────────────────────
// Core assessment data types (Wells PE)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_wells_score_for_pulmonary_embolism.sql`.
//
// The Wells PE instrument has seven weighted criteria. Six are yes/no enums;
// criterion 3 (heart rate > 100) is derived from a measured numeric heart rate
// (beats/min). Weights (spec §4): DVT signs +3, PE most likely +3, heart rate
// > 100 +1.5, immobilisation/surgery +1.5, previous DVT/PE +1.5, haemoptysis
// +1, malignancy +1, for a total of 0..12.5.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse-practitioner'
	| 'physician-associate'
	| 'other'
	| '';
export type CareSetting =
	| 'emergency-department'
	| 'acute-medical-unit'
	| 'ambulatory'
	| 'other'
	| '';
export type AgeBand = '18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type HaemodynamicStatus = 'stable' | 'unstable' | '';
export type YesNo = 'yes' | 'no' | '';
export type TwoLevelBand = 'likely' | 'unlikely';
export type ThreeLevelBand = 'low' | 'moderate' | 'high';
export type RecommendedPathway = 'ctpa' | 'd-dimer';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — haemodynamic status. */
export interface Haemodynamic {
	haemodynamicStatus: HaemodynamicStatus;
}

/** Step 4 — clinical criteria (criteria 1, 2, 4, 5, 6, 7). */
export interface Criteria {
	/** Criterion 1 (+3). */
	dvtSigns: YesNo;
	/** Criterion 2 (+3). */
	peMostLikely: YesNo;
	/** Criterion 4 (+1.5). */
	immobilisationSurgery: YesNo;
	/** Criterion 5 (+1.5). */
	previousDvtPe: YesNo;
	/** Criterion 6 (+1). */
	haemoptysis: YesNo;
	/** Criterion 7 (+1). */
	malignancy: YesNo;
}

/** Step 5 — observations. Criterion 3 (+1.5) fires when heartRate > 100. */
export interface Observations {
	/** Measured heart rate (beats/min); null when unmeasured. */
	heartRate: number | null;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full Wells PE assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	haemodynamic: Haemodynamic;
	criteria: Criteria;
	observations: Observations;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-DVT-SIGNS-01. */
	id: string;
	/** Criterion slug, or a band audit row. */
	criterion: string;
	/** Points contributed (+3, +1.5, +1, or 0 for audit rows). */
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

/** A Wells PE grading rule. */
export interface WellsRule {
	id: string;
	/** Criterion slug. */
	criterion: string;
	/** Points contributed when the rule fires (+3, +1.5, or +1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	criterionPoints: Record<string, number>;
	/** Total Wells score, range 0..12.5. */
	wellsScore: number;
	twoLevelBand: TwoLevelBand;
	threeLevelBand: ThreeLevelBand;
	recommendedPathway: RecommendedPathway;
	firedCriteria: FiredCriterion[];
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
