// ──────────────────────────────────────────────
// Core assessment data types (TIMI UA/NSTEMI risk score)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_timi_risk_score_for_acute_coronary_syndrome.sql`.
// Each of the seven scored criteria is a single yes/no input.
// ──────────────────────────────────────────────

export type ClinicianRole = 'physician' | 'cardiologist' | 'nurse-practitioner' | 'other' | '';
export type CareSetting =
	| 'emergency-department'
	| 'chest-pain-unit'
	| 'ward'
	| 'coronary-care'
	| 'other'
	| '';
export type WorkingDiagnosis = 'unstable-angina' | 'nstemi' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'intermediate' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	workingDiagnosis: WorkingDiagnosis;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	sex: Sex;
}

/** Step 3 — age and coronary risk factors (criteria 1 and 2). */
export interface RiskProfile {
	/** Criterion 1: age >= 65 years. */
	ageOver65: YesNo;
	/** Criterion 2: >= 3 of five CAD risk factors. */
	threeOrMoreCadRiskFactors: YesNo;
}

/** Step 4 — cardiac history and medication (criteria 3 and 4). */
export interface CardiacHistory {
	/** Criterion 3: known CAD, stenosis >= 50%. */
	knownCadStenosis: YesNo;
	/** Criterion 4: aspirin use in the prior 7 days. */
	aspirinUsePrior7Days: YesNo;
}

/** Step 5 — presentation (criterion 5). */
export interface Presentation {
	/** Criterion 5: >= 2 anginal episodes in 24 h. */
	twoOrMoreAnginaEpisodes24h: YesNo;
}

/** Step 6 — investigations (criteria 6 and 7). */
export interface Investigations {
	/** Criterion 6: ST deviation >= 0.5 mm. */
	stDeviation: YesNo;
	/** Criterion 7: elevated troponin / CK-MB. */
	positiveCardiacMarker: YesNo;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full TIMI UA/NSTEMI assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	riskProfile: RiskProfile;
	cardiacHistory: CardiacHistory;
	presentation: Presentation;
	investigations: Investigations;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-AGE-OVER-65-01. */
	id: string;
	/** age | risk-factors | known-cad | aspirin | angina | st-deviation | cardiac-marker | band */
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

/** A TIMI grading rule. */
export interface TimiRule {
	id: string;
	/** age | risk-factors | known-cad | aspirin | angina | st-deviation | cardiac-marker */
	criterion: string;
	/** Points contributed when the rule fires (1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	agePoint: 0 | 1;
	riskFactorPoint: 0 | 1;
	knownCadPoint: 0 | 1;
	aspirinPoint: 0 | 1;
	anginaPoint: 0 | 1;
	stDeviationPoint: 0 | 1;
	cardiacMarkerPoint: 0 | 1;
	timiScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
	riskBand: RiskBand;
	fourteenDayRiskPercent: number;
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
