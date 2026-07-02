// ──────────────────────────────────────────────
// Core assessment data types (qSOFA)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_quick_sequential_organ_failure_assessment.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'paramedic' | 'other' | '';
export type CareSetting = 'emergency-department' | 'ward' | 'pre-hospital' | 'other' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'lower' | 'higher';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	suspectedSource: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — respiratory rate (criterion 1). */
export interface Respiratory {
	/** breaths/min; positive when >= 22. */
	respiratoryRate: number | null;
}

/** Step 4 — mentation (criterion 2). */
export interface Mentation {
	/** GCS total 3-15; positive when < 15. */
	glasgowComaScale: number | null;
	/** Bedside fallback when GCS unavailable. */
	mentationAltered: YesNo;
}

/** Step 5 — systolic blood pressure (criterion 3). */
export interface Circulation {
	/** mmHg; positive when <= 100. */
	systolicBloodPressure: number | null;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full qSOFA assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	respiratory: Respiratory;
	mentation: Mentation;
	circulation: Circulation;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-RESPIRATORY-RATE-01. */
	id: string;
	/** respiratory-rate | mentation | systolic-blood-pressure | band */
	criterion: string;
	/** Points contributed (0 or 1). */
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

/** A qSOFA grading rule. */
export interface QsofaRule {
	id: string;
	/** respiratory-rate | mentation | systolic-blood-pressure */
	criterion: string;
	/** Points contributed when the rule fires (1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	respiratoryRatePoint: 0 | 1;
	mentationPoint: 0 | 1;
	systolicBloodPressurePoint: 0 | 1;
	qsofaScore: 0 | 1 | 2 | 3;
	riskBand: RiskBand;
	thresholdMet: 'yes' | 'no';
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
