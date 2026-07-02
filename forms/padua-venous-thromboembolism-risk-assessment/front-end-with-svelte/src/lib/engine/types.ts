// ──────────────────────────────────────────────
// Core assessment data types (Padua Prediction Score)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_padua_venous_thromboembolism_risk_assessment.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'pharmacist' | 'other' | '';
export type CareSetting = 'acute-medical' | 'general-medical' | 'admissions-unit' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'high';
export type ProphylaxisRecommendation = 'pharmacological' | 'mechanical' | 'none';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	admissionReason: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	/** Patient age in years; drives factor 6 (>= 70). */
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — oncology and thrombosis history. */
export interface History {
	/** Factor 1 (3 points). */
	activeCancer: YesNo;
	/** Factor 2 (3 points). */
	previousVte: YesNo;
	/** Factor 4 (3 points). */
	knownThrombophilia: YesNo;
}

/** Step 4 — mobility and recent events. */
export interface Mobility {
	/** Factor 3 (3 points). */
	reducedMobility: YesNo;
	/** Factor 5 (2 points). */
	recentTraumaOrSurgery: YesNo;
}

/** Step 5 — cardiorespiratory and acute illness. */
export interface Cardiorespiratory {
	/** Factor 7 (1 point). */
	heartOrRespiratoryFailure: YesNo;
	/** Factor 8 (1 point). */
	acuteMiOrIschaemicStroke: YesNo;
	/** Factor 9 (1 point). */
	acuteInfectionOrRheumatological: YesNo;
}

/** Step 6 — metabolic and treatment factors. */
export interface Metabolic {
	/** kg/m^2; drives factor 10 (>= 30). */
	bodyMassIndex: number | null;
	/** Factor 11 (1 point). */
	ongoingHormonalTreatment: YesNo;
}

/** Step 7 — bleeding-risk check (gates the recommendation, not the score). */
export interface Bleeding {
	activeBleeding: YesNo;
	highBleedingRisk: YesNo;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Padua assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	history: History;
	mobility: Mobility;
	cardiorespiratory: Cardiorespiratory;
	metabolic: Metabolic;
	bleeding: Bleeding;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived factor row (mirrors the grade_rule SQL table). */
export interface FiredFactor {
	/** Stable rule id, e.g. R-ACTIVE-CANCER-01. */
	id: string;
	/** camelCase factor key, e.g. activeCancer, or `band` for the audit row. */
	factor: string;
	/** Points contributed. */
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

/** A Padua grading rule. */
export interface PaduaRule {
	id: string;
	/** camelCase factor key, e.g. activeCancer. */
	factor: string;
	/** Points contributed when the rule fires. */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** Per-factor contribution, keyed by factor name; 0 when the factor is absent. */
	factorPoints: Record<string, number>;
	/** Total 0..20. */
	paduaScore: number;
	riskBand: RiskBand;
	prophylaxisRecommendation: ProphylaxisRecommendation;
	firedFactors: FiredFactor[];
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
