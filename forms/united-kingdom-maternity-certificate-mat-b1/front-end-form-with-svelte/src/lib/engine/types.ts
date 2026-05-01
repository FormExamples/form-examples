// ──────────────────────────────────────────────
// Core form data types — UK DWP MAT B1 (maternity certificate)
// ──────────────────────────────────────────────

/**
 * Which kind of certificate is being issued.
 *
 *   - 'pre'  → Part A only (pre-confinement; pregnancy ongoing).
 *   - 'post' → Part B only (post-confinement; baby has been born).
 *   - ''     → unanswered.
 *
 * Part A and Part B are mutually exclusive on the MAT B1 form.
 */
export type CertificateType = 'pre' | 'post' | '';

/**
 * Who is issuing the certificate. Doctors and registered midwives have
 * different validation requirements.
 */
export type IssuerType = 'doctor' | 'midwife' | '';

/** Generic yes / no / unanswered tri-state. */
export type YesNo = 'yes' | 'no' | '';

// ──────────────────────────────────────────────
// Front page — Patient identification
// ──────────────────────────────────────────────

export interface PatientIdentification {
	/** Patient's full name as it should appear above Part A on the certificate. */
	patientName: string;
	/** Optional date of birth (not required by the DWP form, useful for records). */
	dateOfBirth: string;
	/** Optional NHS number for record-keeping. */
	nhsNumber: string;
}

// ──────────────────────────────────────────────
// Part A — Pre-confinement certificate
// ──────────────────────────────────────────────

export interface PreConfinementCertificate {
	/** Expected date of confinement (EWC) — estimated as accurately as possible. */
	expectedDateOfConfinement: string;
	/** Date the certificate is being issued (must not be > 20 weeks before EWC). */
	examinationDate: string;
}

// ──────────────────────────────────────────────
// Part B — Post-confinement certificate
// ──────────────────────────────────────────────

export interface PostConfinementCertificate {
	/** Baby's actual date of birth. */
	actualDateOfBirth: string;
	/** Expected confinement date (recorded for SMP / MA entitlement). */
	expectedDateOfConfinement: string;
}

// ──────────────────────────────────────────────
// Issuer validation — doctor or midwife
// ──────────────────────────────────────────────

export interface DoctorIssuer {
	/** Doctor's name (typically applied via name-and-address stamp). */
	doctorName: string;
	/** Practice / surgery name. */
	practiceName: string;
	/** Practice address line(s). */
	practiceAddress: string;
	/** Confirmation that the official name-and-address stamp has been applied. */
	stampApplied: YesNo;
}

export interface MidwifeIssuer {
	/** Midwife's full name. */
	midwifeName: string;
	/** NMC personal identification number (PIN). */
	nmcPin: string;
	/** Expiry date of the midwife's NMC registration. */
	nmcExpiryDate: string;
}

export interface IssuerValidation {
	/** Which issuer branch is active. */
	issuerType: IssuerType;
	doctor: DoctorIssuer;
	midwife: MidwifeIssuer;
	/** Pre-printed unique certificate number on the official MAT B1 form. */
	certificateNumber: string;
	/** Date the certificate was signed / issued. */
	issueDate: string;
	/** Whether this is a duplicate replacement of a lost / damaged original. */
	isDuplicate: YesNo;
	/** When `isDuplicate` is 'yes', confirms the form has been marked "DUPLICATE". */
	duplicateMarkerApplied: YesNo;
	/** Confirmation that the certificate is being completed in ink. */
	completedInInk: YesNo;
}

// ──────────────────────────────────────────────
// Full form data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientIdentification: PatientIdentification;
	/** Drives whether Part A or Part B is required. */
	certificateType: CertificateType;
	preConfinement: PreConfinementCertificate;
	postConfinement: PostConfinementCertificate;
	issuer: IssuerValidation;
}

// ──────────────────────────────────────────────
// Validation / rules engine types
// ──────────────────────────────────────────────

export type RulePriority = 'urgent' | 'high' | 'medium' | 'low';

export type RuleCategory =
	| 'completeness'
	| 'consistency'
	| 'safety'
	| 'declaration'
	| 'timing';

/** A validation rule — pure predicate over the form data. */
export interface ValidationRule {
	id: string;
	category: RuleCategory;
	priority: RulePriority;
	description: string;
	/** Returns true when the rule is *triggered* (a problem is detected). */
	evaluate: (data: AssessmentData) => boolean;
	/** Human-readable message emitted when triggered. */
	message: string;
}

export interface FiredRule {
	id: string;
	category: RuleCategory;
	priority: RulePriority;
	description: string;
	message: string;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: RulePriority;
}

export interface ValidationResult {
	/** Form is considered "complete" for the active branch. */
	complete: boolean;
	/** Active certificate branch ('pre', 'post', or '' when unanswered). */
	certificateType: CertificateType;
	/** Active issuer branch ('doctor', 'midwife', or '' when unanswered). */
	issuerType: IssuerType;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	/** Computed weeks between examination/issue date and EWC (negative when after EWC). */
	weeksBeforeEwc: number | null;
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
