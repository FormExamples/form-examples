// ──────────────────────────────────────────────
// Core assessment data types (GRACE score for acute coronary syndrome)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_grace_score_for_acute_coronary_syndrome.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'emergency-physician'
	| 'acute-physician'
	| 'cardiologist'
	| 'nurse'
	| 'other'
	| '';
export type CareSetting =
	| 'emergency-department'
	| 'acute-medical-unit'
	| 'coronary-care-unit'
	| 'cardiology-ward'
	| 'other'
	| '';
export type PresentationType = 'nstemi' | 'unstable-angina' | 'stemi' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type KillipClass = 'I' | 'II' | 'III' | 'IV' | '';
export type CreatinineUnit = 'mg/dL' | 'umol/L' | '';
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
	presentationType: PresentationType;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	/** Variable 1 — age in years. */
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — haemodynamics (variables 2 and 3). */
export interface Haemodynamics {
	/** beats/min; variable 2. */
	heartRate: number | null;
	/** mmHg; variable 3 (inverse weight — lower scores higher). */
	systolicBloodPressure: number | null;
}

/** Step 4 — renal function (variable 4). */
export interface Renal {
	/** Raw serum creatinine value; variable 4. */
	serumCreatinine: number | null;
	/** Unit for the raw value; scoring normalises to mg/dL. */
	serumCreatinineUnit: CreatinineUnit;
}

/** Step 5 — heart-failure severity (variable 5). */
export interface HeartFailure {
	killipClass: KillipClass;
}

/** Step 6 — high-risk features (variables 6-8). */
export interface HighRiskFeatures {
	/** Variable 6. */
	cardiacArrestAtAdmission: YesNo;
	/** Variable 7. */
	stSegmentDeviation: YesNo;
	/** Variable 8. */
	elevatedCardiacEnzymes: YesNo;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full GRACE assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	haemodynamics: Haemodynamics;
	renal: Renal;
	heartFailure: HeartFailure;
	highRiskFeatures: HighRiskFeatures;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single per-variable point contribution (mirrors the grade_rule SQL table). */
export interface FiredContributor {
	/** Stable rule id, e.g. R-AGE-01. */
	id: string;
	/**
	 * age | heart-rate | systolic-blood-pressure | creatinine | killip |
	 * cardiac-arrest | st-deviation | elevated-enzymes | band
	 */
	variable: string;
	/** Points contributed by this variable. */
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

/** An ordered banded point-lookup row for a continuous GRACE variable. */
export interface PointBand {
	/** Inclusive upper bound for this band. */
	upTo: number;
	/** Points contributed when the value lands in this band. */
	points: number;
	/** Human-readable band range. */
	label: string;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	agePoints: number;
	heartRatePoints: number;
	sbpPoints: number;
	creatininePoints: number;
	killipPoints: number;
	arrestPoints: number;
	stPoints: number;
	enzymePoints: number;
	gracePoints: number;
	inHospitalMortalityBand: RiskBand;
	sixMonthMortalityBand: RiskBand;
	riskCategory: RiskBand;
	invasiveStrategy: string;
	firedContributors: FiredContributor[];
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
