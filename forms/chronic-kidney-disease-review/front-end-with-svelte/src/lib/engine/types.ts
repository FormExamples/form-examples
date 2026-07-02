// ──────────────────────────────────────────────
// Core assessment data types (Chronic Kidney Disease Annual Review —
// NICE NG203, KDIGO 2012/2024)
//
// This is NOT a numeric-score form. The engine classifies the patient on the
// KDIGO GFR × albuminuria risk heat-map: it derives the G-stage (G1–G5) from
// the current eGFR, the albuminuria stage (A1–A3) from the urine ACR, indexes
// the pair into the KDIGO risk zone (low / moderate / high / very-high), grades
// REVIEW completeness (complete / partial / incomplete), and — independently —
// raises flags mapped to NICE NG203 referral and safety criteria. It is a
// documentation and classification tool, not a diagnostic or prescribing
// instrument. camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_chronic_kidney_disease_review.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'gp' | 'nurse' | 'pharmacist' | 'nephrology' | 'other' | '';
export type CareSetting =
	| 'general-practice'
	| 'long-term-conditions-clinic'
	| 'community-nephrology'
	| 'other'
	| '';
export type ReviewType = 'annual' | 'interval' | 'post-referral' | '';
export type AgeBand = '18-39' | '40-59' | '60-79' | '>=80' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type DiabetesStatus = 'none' | 'type1' | 'type2' | '';
export type PrimaryCause =
	| 'diabetic'
	| 'hypertensive'
	| 'glomerular'
	| 'polycystic'
	| 'obstructive'
	| 'unknown'
	| 'other'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type AceiArb = 'yes' | 'no' | 'contraindicated' | '';
export type Sglt2i = 'yes' | 'no' | 'not-indicated' | '';
export type Statin = 'yes' | 'no' | 'declined' | '';
export type DoseAdjusted = 'yes' | 'no' | 'not-applicable' | '';
export type ReferralDecision =
	| 'none'
	| 'monitor'
	| 'refer-nephrology'
	| 'already-under-nephrology'
	| '';

export type GfrCategory = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null;
export type AlbuminuriaCategory = 'A1' | 'A2' | 'A3' | null;
export type KdigoRiskZone = 'low' | 'moderate' | 'high' | 'very-high' | null;
export type ReviewStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — review context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO date string; '' when unset. */
	reviewedAt: string;
	careSetting: CareSetting;
	reviewType: ReviewType;
}

/** Step 2 — patient and diagnosis. */
export interface Patient {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	diabetesStatus: DiabetesStatus;
	primaryCause: PrimaryCause;
	monthsSinceDiagnosis: number | null;
}

/** Step 3 — renal function (eGFR) and the prior value for the decline check. */
export interface Renal {
	/** Current eGFR (mL/min/1.73 m²). */
	egfr: number | null;
	/** ISO date string; '' when unset. */
	egfrSampleDate: string;
	previousEgfr: number | null;
	/** ISO date string; '' when unset. */
	previousEgfrDate: string;
}

/** Step 4 — albuminuria (urine ACR). */
export interface Albuminuria {
	/** Urine ACR (mg/mmol). */
	acr: number | null;
	/** ISO date string; '' when unset. */
	acrSampleDate: string;
	acrMeasured: YesNo;
}

/** Step 5 — blood pressure. */
export interface BloodPressure {
	systolicBloodPressure: number | null;
	diastolicBloodPressure: number | null;
}

/** Step 6 — medication review. */
export interface Medication {
	aceiOrArbPrescribed: AceiArb;
	sglt2iPrescribed: Sglt2i;
	statinPrescribed: Statin;
	nephrotoxicDrugPresent: YesNo;
	nephrotoxicDoseAdjusted: DoseAdjusted;
	medicationReviewCompleted: YesNo;
}

/** Step 7 — metabolic bloods. */
export interface Bloods {
	hba1c: number | null;
	potassium: number | null;
	bicarbonate: number | null;
	calcium: number | null;
	phosphate: number | null;
	pth: number | null;
	haemoglobin: number | null;
}

/** Step 8 — referral and summary. */
export interface Summary {
	referralDecision: ReferralDecision;
	clinicalNote: string;
}

/** The full chronic-kidney-disease-annual-review data model. */
export interface AssessmentData {
	context: Context;
	patient: Patient;
	renal: Renal;
	albuminuria: Albuminuria;
	bloodPressure: BloodPressure;
	medication: Medication;
	bloods: Bloods;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A blood-pressure target pair (systolic/diastolic mmHg). */
export interface BpTarget {
	systolic: number;
	diastolic: number;
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

/** A single evaluated / derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	id: string;
	/** gfr-stage | albuminuria-stage | risk-zone | bp-target | completeness */
	section: string;
	category: string;
	description: string;
}

/** A clinician-facing flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** very-high-risk-referral | egfr-referral | acr-referral | … */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A review-completeness component rule. */
export interface ComponentRule {
	/** Stable component key, e.g. egfr. */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** True for the gate component (eGFR). */
	gate?: boolean;
	satisfied: (data: AssessmentData) => boolean;
}

/** The full KDIGO-classification + completeness result for one review. */
export interface GradingResult {
	gfrCategory: GfrCategory;
	albuminuriaCategory: AlbuminuriaCategory;
	kdigoRiskZone: KdigoRiskZone;
	bloodPressureTarget: BpTarget | null;
	bloodPressureAtTarget: boolean | null;
	reviewStatus: ReviewStatus;
	completenessScore: number;
	componentStatuses: ComponentStatus[];
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
