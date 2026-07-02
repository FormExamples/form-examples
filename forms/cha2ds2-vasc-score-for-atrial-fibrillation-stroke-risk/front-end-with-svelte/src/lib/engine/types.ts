// ──────────────────────────────────────────────
// Core assessment data types (CHA2DS2-VASc)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_cha2ds2_vasc.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'pharmacist' | 'other' | '';
export type CareSetting =
	| 'primary-care'
	| 'cardiology'
	| 'anticoagulation-clinic'
	| 'emergency-department'
	| 'other'
	| '';
export type AtrialFibrillationType = 'paroxysmal' | 'persistent' | 'permanent' | 'flutter' | '';
export type Sex = 'female' | 'male' | 'other' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'low' | 'intermediate' | 'high';
export type AnticoagulationRecommendation = 'none' | 'consider' | 'recommended';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	atrialFibrillationType: AtrialFibrillationType;
}

/** Step 2 — patient identification. Age drives the age point; sex the sex point. */
export interface Identification {
	patientIdentifier: string;
	/** Age in years; drives the mutually-exclusive age criteria. */
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — cardiac history (criteria C, H, V). */
export interface Cardiac {
	/** C — CHF / LV dysfunction (1). */
	congestiveHeartFailure: YesNo;
	/** H — hypertension (1). */
	hypertension: YesNo;
	/** V — vascular disease (1). */
	vascularDisease: YesNo;
}

/** Step 4 — metabolic and thromboembolic history (criteria D, S2). */
export interface Metabolic {
	/** D — diabetes mellitus (1). */
	diabetes: YesNo;
	/** S2 — prior stroke / TIA / thromboembolism (2). */
	priorStrokeTiaThromboembolism: YesNo;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full CHA2DS2-VASc assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	cardiac: Cardiac;
	metabolic: Metabolic;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-STROKE-2POINT-01. */
	id: string;
	/**
	 * congestive-heart-failure | hypertension | age | diabetes | stroke |
	 * vascular-disease | sex | risk-band
	 */
	criterion: string;
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

/** A CHA2DS2-VASc grading rule. */
export interface Cha2ds2VascRule {
	id: string;
	/**
	 * congestive-heart-failure | hypertension | age | diabetes | stroke |
	 * vascular-disease | sex
	 */
	criterion: string;
	/** Points contributed when the rule fires. */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	congestiveHeartFailurePoint: 0 | 1;
	hypertensionPoint: 0 | 1;
	agePoint: 0 | 1 | 2;
	diabetesPoint: 0 | 1;
	strokePoint: 0 | 2;
	vascularDiseasePoint: 0 | 1;
	sexPoint: 0 | 1;
	cha2ds2VascScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
	riskBand: RiskBand;
	annualStrokeRatePercent: number;
	anticoagulationRecommendation: AnticoagulationRecommendation;
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
