// ──────────────────────────────────────────────
// Core assessment data types (QRISK3 cardiovascular disease risk score)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_qrisk3_cardiovascular_disease_risk_score.sql`.
//
// ============================================================================
// REPRESENTATIVE MODEL — see `qrisk3-coefficients.ts`. The scoring engine is a
// documented, representative weighted-risk model in the *shape* of QRISK3, not
// the official QRISK3-2017 Cox algorithm. It ranks patients the way QRISK3
// would but its coefficients are illustrative and MUST NOT be used for real
// clinical decision-making. Ported faithfully from the HTML front-end engine.
// ============================================================================
// ──────────────────────────────────────────────

export type ClinicianRole = 'gp' | 'nurse' | 'pharmacist' | 'other' | '';
export type CareSetting = 'general-practice' | 'pharmacy' | 'nhs-health-check' | 'other' | '';
export type Sex = 'female' | 'male' | '';
export type Ethnicity =
	| 'white-or-not-stated'
	| 'indian'
	| 'pakistani'
	| 'bangladeshi'
	| 'other-asian'
	| 'black-caribbean'
	| 'black-african'
	| 'chinese'
	| 'other'
	| '';
export type SmokingStatus = 'non' | 'ex' | 'light' | 'moderate' | 'heavy' | '';
export type DiabetesStatus = 'none' | 'type1' | 'type2' | '';
export type CkdStage = 'none' | 'stage3' | 'stage4' | 'stage5' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'raised' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — patient identification and demographics. */
export interface Identification {
	patientIdentifier: string;
	/** years; QRISK3 valid 25-84. */
	age: number | null;
	/** selects the sex-specific model. */
	sex: Sex;
	/** nine-category QRISK3 ethnicity. */
	ethnicity: Ethnicity;
	/** deprivation score; optional (cohort mean when null). */
	townsendScore: number | null;
	postcode: string;
}

/** Step 3 — eligibility (not model inputs; guard QRISK3 applicability). */
export interface Eligibility {
	hasEstablishedCvd: YesNo;
	hasFamilialHypercholesterolaemia: YesNo;
}

/** Step 4 — lifestyle. */
export interface Lifestyle {
	smokingStatus: SmokingStatus;
	/** kg/m^2. */
	bodyMassIndex: number | null;
}

/** Step 5 — cardiometabolic measurements. */
export interface Cardiometabolic {
	diabetesStatus: DiabetesStatus;
	/** total-cholesterol : HDL ratio. */
	cholesterolHdlRatio: number | null;
	/** mmHg. */
	systolicBloodPressure: number | null;
	/** mmHg (visit-to-visit variability). */
	systolicBloodPressureSd: number | null;
	onBloodPressureTreatment: YesNo;
}

/** Step 6 — comorbidity history. */
export interface Comorbidities {
	familyHistoryChd: YesNo;
	atrialFibrillation: YesNo;
	chronicKidneyDiseaseStage: CkdStage;
	migraine: YesNo;
	rheumatoidArthritis: YesNo;
	systemicLupusErythematosus: YesNo;
	severeMentalIllness: YesNo;
	/** men only; ignored for the female model. */
	erectileDysfunction: YesNo;
}

/** Step 7 — medication. */
export interface Medication {
	onAtypicalAntipsychotics: YesNo;
	onCorticosteroids: YesNo;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full QRISK3 assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	eligibility: Eligibility;
	lifestyle: Lifestyle;
	cardiometabolic: Cardiometabolic;
	comorbidities: Comorbidities;
	medication: Medication;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** One weighted contribution to the linear predictor (mirrors grade_rule). */
export interface Contribution {
	/** Stable id, e.g. C-AGE. */
	id: string;
	/** Human label. */
	factor: string;
	/** The input value shown to the user. */
	value: string;
	/** LP contribution (beta * centred value). */
	weight: number;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	linearPredictor: number;
	/** 0.0..99.9 (one decimal) or null when not computable. */
	tenYearRiskPercent: number | null;
	riskBand: RiskBand;
	/** years, or null when not computable. */
	heartAge: number | null;
	/** true when required inputs are present. */
	computable: boolean;
	contributions: Contribution[];
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
