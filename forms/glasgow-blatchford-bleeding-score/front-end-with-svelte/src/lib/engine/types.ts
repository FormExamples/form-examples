// ──────────────────────────────────────────────
// Core assessment data types (Glasgow-Blatchford Bleeding Score / GBS)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_glasgow_blatchford_bleeding_score.sql`. Eight weighted
// admission parameters — blood urea, haemoglobin (sex-specific bands), systolic
// blood pressure, pulse, melaena, syncope, hepatic disease, and cardiac failure
// — are summed into a total of 0-23 that bands into a risk level.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'advanced-practitioner' | 'other' | '';
export type CareSetting = 'emergency-department' | 'acute-medical-unit' | 'ward' | 'other' | '';
export type PresentingComplaint = 'haematemesis' | 'coffee-ground' | 'melaena' | 'other' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'very-low' | 'low-moderate' | 'high';
export type Priority = 'high' | 'medium' | 'low' | 'info';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	presentingComplaint: PresentingComplaint;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	/** Selects the haemoglobin band table. */
	sex: Sex;
}

/** Step 3 — laboratory markers (parameters 1 and 2/3). */
export interface Labs {
	/** mmol/L; parameter 1. */
	bloodUrea: number | null;
	/** g/L; parameters 2/3 (sex-specific bands). */
	haemoglobin: number | null;
}

/** Step 4 — haemodynamics (parameters 4 and 5). */
export interface Haemodynamics {
	/** mmHg; parameter 4. */
	systolicBloodPressure: number | null;
	/** beats/min; parameter 5. */
	pulse: number | null;
}

/** Step 5 — clinical markers (parameters 6-9). */
export interface ClinicalMarkers {
	melaenaPresent: YesNo;
	syncope: YesNo;
	hepaticDisease: YesNo;
	cardiacFailure: YesNo;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Glasgow-Blatchford assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	labs: Labs;
	haemodynamics: Haemodynamics;
	clinicalMarkers: ClinicalMarkers;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-BLOOD-UREA-6POINT-01. */
	id: string;
	/**
	 * blood-urea | haemoglobin | systolic-blood-pressure | pulse | melaena |
	 * syncope | hepatic-disease | cardiac-failure | band.
	 */
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

/** A declarative per-parameter scoring rule. */
export interface GbsRule {
	id: string;
	parameter: string;
	/** Points awarded when the rule fires. */
	points: number;
	category: string;
	description: string;
	evaluate: (d: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	bloodUreaPoints: 0 | 2 | 3 | 4 | 6;
	haemoglobinPoints: 0 | 1 | 3 | 6;
	systolicBloodPressurePoints: 0 | 1 | 2 | 3;
	pulsePoint: 0 | 1;
	melaenaPoint: 0 | 1;
	syncopePoint: 0 | 2;
	hepaticDiseasePoint: 0 | 2;
	cardiacFailurePoint: 0 | 2;
	/** 0..23. */
	gbsScore: number;
	riskBand: RiskBand;
	recommendedManagement: string;
	/** True only once all eight parameters are answered and sex is known. */
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
