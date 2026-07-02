// ──────────────────────────────────────────────
// Core assessment data types (CURB-65 Pneumonia Severity Score)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_curb_65_pneumonia_severity_score.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'physician'
	| 'general-practitioner'
	| 'advanced-nurse-practitioner'
	| 'nurse'
	| 'paramedic'
	| 'pharmacist'
	| 'other'
	| '';
export type CareSetting =
	| 'primary-care'
	| 'emergency-department'
	| 'acute-medical-unit'
	| 'ward'
	| 'community'
	| 'other'
	| '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'intermediate' | 'high';
export type OverrideBand = 'low' | 'intermediate' | 'high' | '';
export type ScoreVariant = 'curb-65' | 'crb-65';
export type Disposition = 'home-outpatient' | 'short-stay-supervised' | 'hospital-admission';
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
	sex: Sex;
}

/** Step 3 — Confusion (criterion C). */
export interface Confusion {
	/** New-onset confusion; positive when 'yes'. */
	confusionPresent: YesNo;
	/** Abbreviated Mental Test 0-10 (supporting evidence, not scored). */
	amtScore: number | null;
}

/** Step 4 — Urea (criterion U). `ureaMeasured` drives the CRB-65 fallback. */
export interface Urea {
	/** When 'no', the four-criterion CRB-65 variant is used. */
	ureaMeasured: YesNo;
	/** Serum urea (mmol/L); positive when > 7. */
	ureaMmolL: number | null;
}

/** Step 5 — Respiratory rate (criterion R). */
export interface Respiratory {
	/** breaths/min; positive when >= 30. */
	respiratoryRate: number | null;
}

/** Step 6 — Blood pressure (criterion B). */
export interface BloodPressure {
	/** mmHg; positive when < 90. */
	systolicBp: number | null;
	/** mmHg; positive when <= 60. */
	diastolicBp: number | null;
}

/** Step 7 — Age (criterion 65). */
export interface Age {
	/** Years; positive when >= 65. */
	ageYears: number | null;
}

/** Step 8 — advisory adjuncts (recorded but not scored). */
export interface Adjuncts {
	/** SpO2 percentage; raises hypoxia flag when < 92. */
	oxygenSaturation: number | null;
	/** Body temperature, degrees Celsius. */
	temperatureC: number | null;
	significantComorbidity: YesNo;
	multilobarChanges: YesNo;
}

/** Step 9 — clinician disposition override and free-text note. */
export interface Disposition9 {
	clinicianOverrideBand: OverrideBand;
	overrideReason: string;
	clinicalNote: string;
}

/** The full CURB-65 assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	confusion: Confusion;
	urea: Urea;
	respiratory: Respiratory;
	bloodPressure: BloodPressure;
	age: Age;
	adjuncts: Adjuncts;
	disposition: Disposition9;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-CONFUSION-01. */
	id: string;
	/** confusion | urea | respiratory-rate | blood-pressure | age | band */
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

/** A CURB-65 grading rule. */
export interface Curb65Rule {
	id: string;
	/** confusion | urea | respiratory-rate | blood-pressure | age */
	criterion: string;
	/** Points contributed when the rule fires (1). */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	confusionScore: 0 | 1;
	ureaScore: 0 | 1;
	respiratoryRateScore: 0 | 1;
	bloodPressureScore: 0 | 1;
	ageScore: 0 | 1;
	curb65Score: 0 | 1 | 2 | 3 | 4 | 5;
	crb65Score: 0 | 1 | 2 | 3 | 4 | null;
	totalScore: number;
	scoreVariant: ScoreVariant;
	riskBand: RiskBand;
	recommendedDisposition: Disposition;
	recommendedSetting: string;
	criteria: {
		confusion: boolean;
		urea: boolean;
		respiratoryRate: boolean;
		bloodPressure: boolean;
		ageOver65: boolean;
	};
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
