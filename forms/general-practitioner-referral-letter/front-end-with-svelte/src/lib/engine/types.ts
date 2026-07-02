// ──────────────────────────────────────────────
// Core data model (General Practitioner Referral Letter).
//
// A structured primary-care referral to a specialist or service. camelCase
// property names mirror the snake_case SQL columns in
// `sql/04_create_table_general_practitioner_referral_letter.sql` (the referrer
// identity and core patient demographics — which the SQL model keeps in the
// `clinician` and `patient` tables — are carried here on the referral object as
// the front-end contract in spec §3).
//
// Unlike a scored assessment, this is a documentation-completeness and
// urgency-classification instrument: the engine grades a referral's
// completeness (`Complete` / `Incomplete`) with a completeness percentage,
// echoes its urgency (`routine` / `urgent` / `two-week-wait` / `emergency`),
// records which completeness rules fired, and raises flags. There is no numeric
// clinical score.
// ──────────────────────────────────────────────

export type ConsentToShare = 'yes' | 'no' | '';
export type PatientSex = 'female' | 'male' | 'other' | 'unknown' | '';
export type ReferrerRole =
	| 'gp'
	| 'gp-registrar'
	| 'nurse-practitioner'
	| 'pharmacist'
	| 'paramedic'
	| 'other'
	| '';
export type Urgency = 'routine' | 'urgent' | 'two-week-wait' | 'emergency' | '';
export type Status = 'Complete' | 'Incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — referrer details. Identity of the referring clinician. */
export interface Referrer {
	referrerName: string;
	referrerRole: ReferrerRole;
	/** GMC / NMC / GPhC number. */
	referrerRegistrationNumber: string;
	referringPractice: string;
	practiceAddress: string;
	/** Phone / secure email. */
	referrerContact: string;
	/** ISO date string; '' when unset. */
	referralDate: string;
}

/** Step 2 — patient identification. */
export interface Patient {
	/** NHS number or local identifier. */
	patientIdentifier: string;
	patientName: string;
	/** ISO date string; '' when unset. */
	patientDateOfBirth: string;
	patientSex: PatientSex;
	patientAddress: string;
	patientContact: string;
	/** Interpreter / accessibility needs. */
	accessNeeds: string;
}

/** Step 3 — referral destination. */
export interface Destination {
	referralSpecialty: string;
	namedClinician: string;
	receivingOrganisation: string;
}

/** Step 4 — urgency. */
export interface UrgencyInfo {
	urgency: Urgency;
	urgencyReason: string;
	/** Named NICE NG12 criterion. */
	suspectedCancerCriterion: string;
	/** Tumour-site pathway. */
	suspectedCancerPathway: string;
}

/** Step 5 — reason and history. */
export interface Clinical {
	reasonForReferral: string;
	relevantHistory: string;
	presentingProblem: string;
	symptomDuration: string;
	/** Drives the emergency-features flag. */
	redFlagSymptoms: string;
}

/** Step 6 — examination and investigations. */
export interface Examination {
	examinationFindings: string;
	investigationResults: string;
}

/** Step 7 — medications and allergies. */
export interface Medications {
	currentMedications: string;
	allergies: string;
}

/** Step 8 — expectations, consent, and safety-netting. */
export interface Expectations {
	patientExpectations: string;
	consentToShare: ConsentToShare;
	safetyNetting: string;
}

/** Step 9 — summary and review. */
export interface Review {
	clinicalNote: string;
}

/** The full General Practitioner Referral Letter data model. */
export interface AssessmentData {
	referrer: Referrer;
	patient: Patient;
	destination: Destination;
	urgencyInfo: UrgencyInfo;
	clinical: Clinical;
	examination: Examination;
	medications: Medications;
	expectations: Expectations;
	review: Review;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single mandatory-field row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-MANDATORY-PATIENT-IDENTIFIER. */
	id: string;
	/** Short rule key. */
	rule: string;
	satisfied: boolean;
	category: string;
	description: string;
}

/** A referrer-facing flag (mirrors the grade_flag table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/**
 * A mandatory field: its stable identity plus a predicate that reports whether
 * the referral has populated it.
 */
export interface MandatoryField {
	id: string;
	rule: string;
	category: string;
	/** Short human label, used in reports and flags. */
	label: string;
	description: string;
	present: (r: AssessmentData) => boolean;
}

/** The full grading result for one referral. */
export interface GradingResult {
	status: Status;
	/** Echoed urgency classification; '' when not yet selected. */
	urgency: Urgency;
	/** 0..100. */
	completenessPercent: number;
	/** Mandatory fields present. */
	presentCount: number;
	/** Mandatory fields that apply for the selected urgency. */
	mandatoryCount: number;
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
