// ──────────────────────────────────────────────
// Core assessment data types (Hypertension Annual Review — NICE NG136)
//
// This is NOT a numeric-score form. The engine classifies blood-pressure
// CONTROL (controlled / uncontrolled / severe-uncontrolled) against an age- and
// comorbidity-specific target, assigns a hypertension STAGE, grades REVIEW
// completeness (complete / partial / incomplete), and — independently — raises
// flags. It is a documentation and control-classification tool, not a diagnostic
// or prescribing instrument. camelCase property names mirror the snake_case SQL
// columns in `sql/04_create_table_hypertension_review.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'gp' | 'practice-nurse' | 'pharmacist' | 'other' | '';
export type AgeBand = '18-39' | '40-59' | '60-79' | '>=80' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type Ethnicity =
	| 'white'
	| 'black-african-caribbean'
	| 'south-asian'
	| 'mixed'
	| 'other'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type MonitoringMethod = 'clinic-only' | 'hbpm' | 'abpm' | '';
export type Adherence = 'good' | 'partial' | 'poor' | '';
export type SmokingStatus = 'never' | 'ex' | 'current' | '';

export type ControlClass = 'controlled' | 'uncontrolled' | 'severe-uncontrolled';
export type HypertensionStage = 'none' | 'stage-1' | 'stage-2' | 'stage-3-severe';
export type ReviewStatus = 'complete' | 'partial' | 'incomplete';
export type PrimarySource = 'home' | 'clinic' | 'none';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — review context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO date string; '' when unset. */
	reviewedAt: string;
	practiceSite: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	ethnicity: Ethnicity;
}

/** Step 3 — diagnosis and comorbidity (blood-pressure target drivers). */
export interface Diagnosis {
	/** ISO date string; '' when unset. */
	diagnosisDate: string;
	type2Diabetes: YesNo;
	chronicKidneyDisease: YesNo;
	establishedCvd: YesNo;
	atrialFibrillation: YesNo;
}

/** Step 4 — clinic blood pressure. */
export interface ClinicBp {
	clinicSystolic: number | null;
	clinicDiastolic: number | null;
	posturalDrop: YesNo;
}

/** Step 5 — home / ambulatory blood pressure. */
export interface HomeBp {
	homeSystolic: number | null;
	homeDiastolic: number | null;
	monitoringMethod: MonitoringMethod;
}

/** Step 6 — medication and adherence. */
export interface Medication {
	antihypertensiveAgents: number | null;
	adherence: Adherence;
	sideEffects: YesNo;
}

/** Step 7 — cardiovascular risk. */
export interface CardiovascularRisk {
	qriskPercent: number | null;
	smokingStatus: SmokingStatus;
	statinTherapy: YesNo;
}

/** Step 8 — annual bloods (U&E, HbA1c, lipids). */
export interface Bloods {
	serumCreatinine: number | null;
	egfr: number | null;
	serumPotassium: number | null;
	hba1c: number | null;
	totalCholesterol: number | null;
	hdlCholesterol: number | null;
}

/** Step 9 — urine albumin:creatinine ratio. */
export interface Urine {
	urineAcr: number | null;
}

/** Step 10 — lifestyle. */
export interface Lifestyle {
	bmi: number | null;
	lifestyleAdvice: string;
}

/** Step 11 — complications and target-organ damage. */
export interface Complications {
	complications: string;
}

/** Step 12 — summary and plan. */
export interface Summary {
	reviewContext: string;
}

/** The full hypertension-annual-review data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	diagnosis: Diagnosis;
	clinicBp: ClinicBp;
	homeBp: HomeBp;
	medication: Medication;
	cardiovascularRisk: CardiovascularRisk;
	bloods: Bloods;
	urine: Urine;
	lifestyle: Lifestyle;
	complications: Complications;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A blood-pressure pair (systolic/diastolic mmHg). */
export interface BpPair {
	systolic: number;
	diastolic: number;
}

/** Selected blood-pressure target and its driving group. */
export interface BpTarget {
	clinic: BpPair;
	home: BpPair;
	group: string;
}

/** Bundled control status emitted by the engine. */
export interface ControlStatus {
	controlClass: ControlClass;
	bpTarget: BpTarget;
	primarySource: PrimarySource;
	hypertensionStage: HypertensionStage;
}

/** Per-component completeness status row (review completeness table). */
export interface ComponentStatus {
	/** Stable component key. */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** True when the component is recorded. */
	documented: boolean;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
}

/** A clinician-facing flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** severe-hypertension | uncontrolled-bp | missing-bloods | … */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A review-completeness component rule. */
export interface ComponentRule {
	/** Stable component key, e.g. blood-pressure. */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** True for the gate component (blood pressure). */
	gate?: boolean;
	satisfied: (data: AssessmentData) => boolean;
}

/** The full control + completeness result for one review. */
export interface GradingResult {
	controlStatus: ControlStatus;
	reviewStatus: ReviewStatus;
	componentStatuses: ComponentStatus[];
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
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
