// ──────────────────────────────────────────────
// Core data types (Chronic Obstructive Pulmonary Disease Review — COPD annual
// review)
//
// This is a SEVERITY-CLASSIFICATION and COMPLETENESS instrument, not a
// numeric-score form. The engine derives four independent outputs — the GOLD
// airflow-limitation grade (1–4), the symptom axis, the exacerbation axis, the
// combined ABE assessment group, and the review-completeness grade — plus
// clinician-facing flags. It never sums a total. camelCase property names
// mirror the snake_case SQL columns in
// `sql/04_create_table_chronic_obstructive_pulmonary_disease_review.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'gp'
	| 'practice-nurse'
	| 'respiratory-nurse'
	| 'pharmacist'
	| 'other'
	| '';
export type ReviewType = 'routine-annual' | 'post-exacerbation' | 'opportunistic' | '';
export type AgeBand = '18-39' | '40-59' | '60-79' | '>=80' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type SmokingStatus = 'current' | 'ex' | 'never' | '';
export type Adherence = 'good' | 'partial' | 'poor' | '';
export type VaccineStatus = 'up-to-date' | 'due' | 'declined' | '';
export type PulmonaryRehabStatus =
	| 'completed'
	| 'referred'
	| 'eligible-not-referred'
	| 'not-indicated'
	| '';
export type OxygenUse = 'none' | 'long-term' | 'ambulatory' | '';

/** GOLD airflow-limitation grade (banded from FEV₁ % predicted); null when unrecorded. */
export type GoldGrade = 1 | 2 | 3 | 4 | null;
/** A symptom or exacerbation axis value. */
export type Axis = 'low' | 'high';
/** The combined ABE assessment group; null when no axis data recorded. */
export type AbeGroup = 'A' | 'B' | 'E' | null;
/** The review-completeness grade. */
export type ReviewStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — review context and identification. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO date string; '' when unset. */
	reviewedAt: string;
	reviewType: ReviewType;
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 2 — diagnosis and history. */
export interface Diagnosis {
	diagnosisYear: number | null;
	spirometryConfirmed: YesNo;
	exposureNotes: string;
}

/** Step 3 — post-bronchodilator spirometry. */
export interface Spirometry {
	fev1Litres: number | null;
	/** Drives the GOLD grade. */
	fev1PercentPredicted: number | null;
	fvcLitres: number | null;
	/** Obstruction when < 0.70. */
	fev1FvcRatio: number | null;
	/** ISO date string; '' when unset. */
	spirometryDate: string;
}

/** Step 4 — symptom burden. */
export interface Symptoms {
	/** MRC dyspnoea 1–5 (pulmonary-rehab trigger). */
	mrcGrade: number | null;
	/** mMRC 0–4 (symptom axis). */
	mmrcGrade: number | null;
	/** CAT 0–40 (symptom axis). */
	catScore: number | null;
}

/** Step 5 — exacerbations (past 12 months). */
export interface Exacerbations {
	exacerbationsLast12m: number | null;
	hospitalisationsLast12m: number | null;
	/** ISO date string; '' when unset. */
	lastExacerbationDate: string;
	rescuePackCourses: number | null;
}

/** Step 6 — smoking status and cessation. */
export interface Smoking {
	smokingStatus: SmokingStatus;
	packYears: number | null;
	cessationSupportOffered: YesNo;
}

/** Step 7 — inhaler therapy. */
export interface Inhaler {
	inhaledTherapy: string;
	deviceType: string;
	inhalerTechniqueChecked: YesNo;
	inhalerTechniqueAdequate: YesNo;
	adherence: Adherence;
}

/** Step 8 — vaccinations. */
export interface Vaccinations {
	influenzaVaccine: VaccineStatus;
	pneumococcalVaccine: VaccineStatus;
	covidVaccine: VaccineStatus;
}

/** Step 9 — pulmonary rehabilitation and oxygen. */
export interface Rehab {
	pulmonaryRehabStatus: PulmonaryRehabStatus;
	oxygenUse: OxygenUse;
	restingSpo2: number | null;
}

/** Step 10 — comorbidities and self-management. */
export interface SelfManagement {
	comorbidities: string;
	selfManagementPlan: YesNo;
	rescuePackSupplied: YesNo;
	nextReviewInterval: string;
}

/** Step 11 — clinician free-text note. */
export interface Note {
	clinicianNote: string;
}

/** The full COPD-review data model. */
export interface AssessmentData {
	context: Context;
	diagnosis: Diagnosis;
	spirometry: Spirometry;
	symptoms: Symptoms;
	exacerbations: Exacerbations;
	smoking: Smoking;
	inhaler: Inhaler;
	vaccinations: Vaccinations;
	rehab: Rehab;
	selfManagement: SelfManagement;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-GOLD-GRADE-3-01. */
	id: string;
	/** gold | symptom | exacerbation | abe | completeness */
	section: string;
	category: string;
	description: string;
}

/** A clinician-facing flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A completeness-component row: present when its clinical datum is recorded. */
export interface Component {
	id: string;
	label: string;
	present: (data: AssessmentData) => boolean;
}

/** The full grading result for one review. */
export interface GradingResult {
	goldGrade: GoldGrade;
	symptomBurden: Axis;
	exacerbationRisk: Axis;
	abeGroup: AbeGroup;
	reviewStatus: ReviewStatus;
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
