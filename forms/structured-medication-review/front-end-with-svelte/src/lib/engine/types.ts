// ──────────────────────────────────────────────
// Core data types (Structured Medication Review, SMR)
//
// A documentation form with PARTIAL SCORING: the engine derives a review STATUS
// (complete / incomplete), a polypharmacy band, an anticholinergic-burden sum +
// band, a composite burden band, and per-medicine STOPP/START flags — NOT a
// single numeric score.
//
// camelCase property names mirror the snake_case SQL columns across the parent
// header (`sql/04_create_table_structured_medication_review.sql`) and its
// one-to-many child medicine list
// (`sql/05_create_table_structured_medication_review_medicine.sql`).
// ──────────────────────────────────────────────

export type ClinicianRole = 'clinical-pharmacist' | 'gp' | 'pharmacy-technician' | 'other' | '';
export type CareSetting =
	| 'gp-practice'
	| 'pcn'
	| 'care-home'
	| 'community-pharmacy'
	| 'patient-home'
	| '';
export type ConsultationMode = 'face-to-face' | 'telephone' | 'video' | 'home-visit' | '';
export type AgeBand = '18-39' | '40-64' | '65-74' | '75-84' | '85-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type FrailtyStatus = 'fit' | 'mild' | 'moderate' | 'severe' | '';
export type HighRiskClass =
	| 'anticoagulant'
	| 'insulin'
	| 'opioid'
	| 'dmard'
	| 'lithium'
	| 'methotrexate'
	| 'other'
	| '';
export type Adherence = 'good' | 'partial' | 'poor' | 'unknown' | '';
export type YesNoNa = 'yes' | 'no' | 'na' | '';
export type YesNo = 'yes' | 'no' | '';
export type PolypharmacyBand = 'none' | 'polypharmacy' | 'hyperpolypharmacy';
export type AnticholinergicBand = 'low' | 'significant';
export type BurdenBand = 'low' | 'moderate' | 'high';
export type ReviewStatus = 'complete' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/**
 * One reviewed medicine — mirrors the child table
 * `structured_medication_review_medicine`.
 */
export interface Medicine {
	drugName: string;
	formStrength: string;
	doseRegimen: string;
	indication: string;
	indicationRecorded: YesNo;
	/** Counts toward polypharmacy. */
	isRegular: YesNo;
	isHighRisk: YesNo;
	highRiskClass: HighRiskClass;
	adherence: Adherence;
	/** 0-3 on the ACB scale; `null` when unrecorded. */
	anticholinergicBurdenPoints: number | null;
	monitoringRequired: YesNo;
	monitoringUpToDate: YesNoNa;
	deprescribingCandidate: YesNo;
	/** STOPP code / description, or ''. */
	stoppCriterion: string;
	/** START code / description, or ''. */
	startCriterion: string;
}

/** Step 1 — review context (parent header fields). */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	reviewedAt: string;
	careSetting: CareSetting;
	consultationMode: ConsultationMode;
}

/** Step 2 — patient identification (parent header fields). */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	frailtyStatus: FrailtyStatus;
	livesInCareHome: YesNo;
	longTermConditions: string;
}

/** Step 3 — problems and patient concerns. */
export interface Problems {
	presentingProblems: string;
	patientReportedIssues: string;
	whatMattersToPatient: string;
}

/** Step 5 — monitoring. */
export interface Monitoring {
	monitoringDue: string;
	overdueMonitoringCount: number | null;
}

/** Step 6 — patient goals and shared decisions. */
export interface Goals {
	sharedDecisions: string;
}

/** Step 7 — agreed actions and plan. */
export interface Plan {
	followUpPlan: string;
	followUpDate: string;
	reviewCompleted: YesNo;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full structured-medication-review data model. */
export interface ReviewData {
	context: Context;
	identification: Identification;
	problems: Problems;
	medicines: Medicine[];
	monitoring: Monitoring;
	goals: Goals;
	plan: Plan;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single derived audit row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
}

/** One per-medicine STOPP / START flag. */
export interface MedicineFlag {
	drugName: string;
	criterion: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full grading result for one review. */
export interface GradingResult {
	medicineCount: number;
	regularMedicineCount: number;
	/** Sum of each medicine's ACB points. */
	anticholinergicBurdenScore: number;
	polypharmacyBand: PolypharmacyBand;
	anticholinergicBand: AnticholinergicBand;
	burdenBand: BurdenBand;
	reviewStatus: ReviewStatus;
	stopFlags: MedicineFlag[];
	startFlags: MedicineFlag[];
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
	section: keyof ReviewData;
}
