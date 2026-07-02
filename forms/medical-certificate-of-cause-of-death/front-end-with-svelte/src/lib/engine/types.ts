// ──────────────────────────────────────────────
// Core data types (Medical Certificate of Cause of Death — MCCD)
//
// This is a STATUTORY DOCUMENTATION and VALIDITY-CLASSIFICATION instrument, not a
// numeric severity score and NOT a substitute for the certifying doctor's,
// coroner's, or medical examiner's statutory judgement. The engine checks that
// the certificate is internally complete and consistent, classifies it as
// `valid` / `incomplete` / `refer-to-coroner`, derives the underlying cause, and
// raises flagged issues. The prescribed statutory certificate remains the
// definitive legal record.
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_medical_certificate_of_cause_of_death.sql`. Text / enum
// fields default to `''`; numeric, date, and time fields default to `null`.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'female' | 'male' | 'other' | 'unknown' | '';
export type DoctorGrade =
	| 'consultant'
	| 'sas'
	| 'registrar'
	| 'foundation'
	| 'gp'
	| 'other'
	| '';
export type SeenAfterDeathBy = 'certifier' | 'another-practitioner' | 'not-seen' | '';
export type CoronerReason =
	| 'unnatural'
	| 'violent'
	| 'suspicious'
	| 'unknown-cause'
	| 'industrial-disease'
	| 'medical-procedure'
	| 'custody'
	| 'no-attending-practitioner'
	| 'other'
	| 'none'
	| '';
export type MedicalExaminerStatus = 'scrutinised' | 'discussed' | 'pending' | 'not-required' | '';

export type ValidityClass = 'valid' | 'incomplete' | 'refer-to-coroner';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — certification context. */
export interface Certification {
	certifyingDoctorName: string;
	certifyingDoctorGrade: DoctorGrade;
	gmcReference: string;
	placeOfCertification: string;
	/** ISO date string; null when unset. */
	certificationDate: string | null;
	attendedDeceased: YesNo;
	/** ISO date string; null when unset. */
	lastSeenAliveDate: string | null;
}

/** Step 2 — deceased identification. */
export interface Deceased {
	deceasedName: string;
	sex: Sex;
	/** ISO date string; null when unset. */
	dateOfBirth: string | null;
	ageYears: number | null;
	patientIdentifier: string;
}

/** Step 3 — death details. */
export interface Death {
	/** ISO date string; null when unset. */
	dateOfDeath: string | null;
	/** HH:MM string; null when unset. */
	timeOfDeath: string | null;
	placeOfDeath: string;
	seenAfterDeathBy: SeenAfterDeathBy;
}

/** Step 4 — Part I direct causal sequence (I(a) -> I(b) -> I(c)). */
export interface PartI {
	causeIaCondition: string;
	causeIaInterval: string;
	causeIbCondition: string;
	causeIbInterval: string;
	causeIcCondition: string;
	causeIcInterval: string;
}

/** Step 5 — Part II contributory conditions. */
export interface PartII {
	partIiConditions: string;
	partIiInterval: string;
}

/** Step 6 — coroner and medical-examiner referral. */
export interface Referral {
	referredToCoroner: YesNo;
	coronerReason: CoronerReason;
	medicalExaminerStatus: MedicalExaminerStatus;
	certifierNote: string;
}

/** The full Medical Certificate of Cause of Death data model. */
export interface DeathCertificate {
	certification: Certification;
	deceased: Deceased;
	death: Death;
	partI: PartI;
	partII: PartII;
	referral: Referral;
}

// ──────────────────────────────────────────────
// Grading / classification types
// ──────────────────────────────────────────────

/** A certifier- / examiner-facing statutory / safety / governance flag (mirrors grade_flag). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full validity classification result for one certificate. */
export interface ValidationResult {
	validityClass: ValidityClass;
	/** '' when Part I is empty. */
	underlyingCause: string;
	coronerReferralIndicated: boolean;
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
	section: keyof DeathCertificate;
}
