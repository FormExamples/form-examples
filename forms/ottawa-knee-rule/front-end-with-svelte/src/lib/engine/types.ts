// ──────────────────────────────────────────────
// Core assessment data types (Ottawa Knee Rule)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ottawa_knee_rule.sql`.
//
// The Ottawa Knee Rule is a DECISION RULE, not a score: a knee radiograph is
// indicated when ANY one of the five criteria is present. There is no total.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse-practitioner'
	| 'physiotherapist'
	| 'paramedic'
	| 'other'
	| '';
export type CareSetting =
	| 'emergency-department'
	| 'minor-injuries-unit'
	| 'urgent-care'
	| 'other'
	| '';
export type InjuryMechanism = 'blunt-trauma' | 'twisting' | 'fall' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type InjuredSide = 'left' | 'right' | '';
export type YesNo = 'yes' | 'no' | '';
export type Decision = 'xray-indicated' | 'xray-not-indicated';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	injuryMechanism: InjuryMechanism;
	/** Hours since the injury; null when unset. Supports the applicability check. */
	hoursSinceInjury: number | null;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	sex: Sex;
	injuredSide: InjuredSide;
}

/** Step 3 — age (criterion 1). */
export interface Age {
	/** Criterion 1 fires when >= 55. Null when unset. */
	ageYears: number | null;
}

/** Step 4 — bony tenderness (criteria 2 and 3). */
export interface Tenderness {
	/** Tenderness at the patella. */
	patellarTenderness: YesNo;
	/** Other bony tenderness (tests isolation for criterion 2). */
	otherBonyTenderness: YesNo;
	/** Criterion 3 — tenderness at the head of the fibula. */
	fibularHeadTenderness: YesNo;
}

/** Step 5 — knee flexion (criterion 4). */
export interface Flexion {
	/** Criterion 4 — inability to flex the knee to 90 degrees. */
	unableToFlex90: YesNo;
}

/** Step 6 — weight-bearing (criterion 5). */
export interface WeightBearing {
	/** Criterion 5 — inability to bear weight (four steps). */
	unableToBearWeight: YesNo;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full Ottawa Knee Rule assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	age: Age;
	tenderness: Tenderness;
	flexion: Flexion;
	weightBearing: WeightBearing;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-AGE-01. */
	id: string;
	/** Criterion slug, or 'decision' for the composite audit row. */
	criterion: string;
	/** Whether the criterion fired (is present). */
	fired: boolean;
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

/** An Ottawa Knee Rule decision rule. */
export interface OttawaRule {
	id: string;
	/** Criterion slug. */
	criterion: string;
	category: string;
	description: string;
	/** True when the criterion is PRESENT for the supplied data. */
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	ageCriterion: boolean;
	isolatedPatellarCriterion: boolean;
	fibularHeadCriterion: boolean;
	flexionCriterion: boolean;
	weightBearingCriterion: boolean;
	/** ANY-of the five criteria. */
	xrayIndicated: boolean;
	decision: Decision;
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
