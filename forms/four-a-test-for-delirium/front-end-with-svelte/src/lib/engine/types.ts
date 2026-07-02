// ──────────────────────────────────────────────
// Core assessment data types (4AT — rapid delirium and cognitive-impairment
// screen)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_four_a_test_for_delirium.sql`.
// ──────────────────────────────────────────────

export type Setting = 'acute' | 'ed' | 'periop' | 'careHome' | 'community' | 'other' | '';
export type Alertness = 'normal' | 'mildTransient' | 'abnormal' | '';
export type Amt4 = 'noMistakes' | 'oneMistake' | 'twoOrMoreOrUntestable' | '';
export type AttentionMonths = 'sevenOrMore' | 'startsButUnderSevenOrRefuses' | 'untestable' | '';
export type AcuteChange = 'no' | 'yes' | '';
export type AcuteChangeSource = 'patient' | 'collateral' | 'records' | 'none' | '';
export type InterpretationBand = 'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — patient and assessment identification. */
export interface Identification {
	patientIdentifier: string;
	patientName: string;
	/** ISO date string; null when unset. */
	dateOfBirth: string | null;
	/** ISO date string; null when unset. */
	assessmentDate: string | null;
	/** HH:MM string; null when unset. */
	assessmentTime: string | null;
	setting: Setting;
	assessorName: string;
	assessorRole: string;
}

/** Step 2 — item 1 alertness. */
export interface Item1 {
	alertness: Alertness;
}

/** Step 3 — item 2 AMT4 (age, date of birth, place, current year). */
export interface Item2 {
	amt4: Amt4;
}

/** Step 4 — item 3 attention (months of the year backwards). */
export interface Item3 {
	attentionMonths: AttentionMonths;
}

/** Step 5 — item 4 acute change or fluctuating course. */
export interface Item4 {
	acuteChange: AcuteChange;
	acuteChangeSource: AcuteChangeSource;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full 4AT assessment data model. */
export interface AssessmentData {
	identification: Identification;
	item1: Item1;
	item2: Item2;
	item3: Item3;
	item4: Item4;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-ALERTNESS-01. */
	id: string;
	/** alertness | amt4 | attention | acute-change | band */
	item: string;
	/** Points contributed (0, 1, 2, or 4). */
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

/** A 4AT scoring rule. */
export interface FourATRule {
	id: string;
	/** alertness | amt4 | attention | acute-change */
	item: string;
	/** Points contributed when the rule fires (0, 1, 2, or 4). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	item1Score: 0 | 4;
	item2Score: 0 | 1 | 2;
	item3Score: 0 | 1 | 2;
	item4Score: 0 | 4;
	/** Total 0..12. */
	totalScore: number;
	interpretationBand: InterpretationBand;
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
