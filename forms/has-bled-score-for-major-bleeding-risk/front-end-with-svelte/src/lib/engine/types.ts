// ──────────────────────────────────────────────
// Core assessment data types (HAS-BLED)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_has_bled_score_for_major_bleeding_risk.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'pharmacist' | 'other' | '';
export type CareSetting =
	| 'cardiology'
	| 'general-practice'
	| 'anticoagulation-clinic'
	| 'acute-medical'
	| 'other'
	| '';
export type AnticoagulationStatus = 'on' | 'considering' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'moderate' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	anticoagulationStatus: AnticoagulationStatus;
	/** Paired CHA2DS2-VASc stroke-risk score (0-9); context only. */
	chaDsVascScore: number | null;
}

/** Step 2 — patient identification. `ageYears` also drives criterion E. */
export interface Identification {
	patientIdentifier: string;
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — H, hypertension (criterion 1). */
export interface Hypertension {
	/** Uncontrolled, systolic BP > 160 mmHg. */
	hypertensionUncontrolled: YesNo;
}

/** Step 4 — A, abnormal renal and liver function (criteria 2 and 3). */
export interface OrganFunction {
	/** Dialysis, transplant, or creatinine >= 200 umol/L. */
	abnormalRenalFunction: YesNo;
	/** Cirrhosis, or bilirubin > 2x ULN with transaminases > 3x ULN. */
	abnormalLiverFunction: YesNo;
}

/** Step 5 — S, stroke history (criterion 4). */
export interface Stroke {
	strokeHistory: YesNo;
}

/** Step 6 — B, bleeding history or predisposition (criterion 5). */
export interface Bleeding {
	/** Prior major bleed, diathesis, or anaemia. */
	bleedingHistory: YesNo;
}

/** Step 7 — L, labile INR (criterion 6). */
export interface LabileInr {
	/** Unstable/high INR or time in therapeutic range < 60%. */
	labileInr: YesNo;
}

/**
 * Step 8 — D, drugs and alcohol (criteria 8 and 9). Criterion E (elderly) is
 * derived from `identification.ageYears`, so it has no field of its own.
 */
export interface DrugsAlcohol {
	/** Concomitant antiplatelet agents or NSAIDs. */
	antiplateletOrNsaid: YesNo;
	/** Alcohol units per week; >= 8 scores the criterion. */
	alcoholUnitsPerWeek: number | null;
}

/** Step 9 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full HAS-BLED assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	hypertension: Hypertension;
	organFunction: OrganFunction;
	stroke: Stroke;
	bleeding: Bleeding;
	labileInr: LabileInr;
	drugsAlcohol: DrugsAlcohol;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-ELDERLY-01. */
	id: string;
	/** hypertension | renal | liver | stroke | bleeding | labile-inr | elderly | drugs | alcohol | band */
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

/** A HAS-BLED grading rule. */
export interface HasBledRule {
	id: string;
	/** hypertension | renal | liver | stroke | bleeding | labile-inr | elderly | drugs | alcohol */
	criterion: string;
	/** Points contributed when the rule fires (1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	hypertensionPoint: 0 | 1;
	renalPoint: 0 | 1;
	liverPoint: 0 | 1;
	strokePoint: 0 | 1;
	bleedingPoint: 0 | 1;
	labileInrPoint: 0 | 1;
	elderlyPoint: 0 | 1;
	drugsPoint: 0 | 1;
	alcoholPoint: 0 | 1;
	hasBledScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
	riskBand: RiskBand;
	/** Semicolon-joined summary of correctable bleeding-risk factors present. */
	modifiableFactors: string;
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
