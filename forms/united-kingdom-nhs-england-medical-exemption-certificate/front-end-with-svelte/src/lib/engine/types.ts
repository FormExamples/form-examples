// ──────────────────────────────────────────────
// Core form data types — UK NHS England Medical Exemption Certificate (FP92A)
// ──────────────────────────────────────────────

/** Generic yes / no / unanswered tri-state. */
export type YesNo = 'yes' | 'no' | '';

/** Yes / no / pending (used for cancer histology). */
export type YesNoPending = 'yes' | 'no' | 'pending' | '';

/** Personal title prefix as printed on the FP92A. */
export type Title =
	| 'Mr'
	| 'Mrs'
	| 'Miss'
	| 'Ms'
	| 'Mx'
	| 'Dr'
	| 'Prof'
	| 'Rev'
	| 'Other'
	| '';

/** Recorded sex. */
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';

/** Pregnancy / post-partum status. */
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'post-partum-within-12-months'
	| '';

/** Practitioner role / job title. */
export type PractitionerRole =
	| 'gp'
	| 'hospital-doctor'
	| 'nurse-practitioner'
	| 'pharmacist-prescriber'
	| 'other'
	| '';

/** Professional registration body. */
export type RegistrationBody = 'GMC' | 'NMC' | 'HCPC' | 'GPhC' | 'other' | '';

/** Application kind: new, renewal, or replacement. */
export type ApplicationKind = 'new' | 'renewal' | 'replacement' | '';

/** The ten NHSBSA-recognised qualifying conditions. */
export type EligibleConditionCode =
	| 'permanent-fistula'
	| 'hypoadrenalism'
	| 'diabetes-insipidus-or-hypopituitarism'
	| 'diabetes-mellitus-not-diet-only'
	| 'hypoparathyroidism'
	| 'myasthenia-gravis'
	| 'myxoedema'
	| 'epilepsy-on-anticonvulsant'
	| 'continuing-physical-disability'
	| 'cancer-or-effects';

/** Anatomical site of a fistula. */
export type FistulaSite =
	| 'caecostomy'
	| 'colostomy'
	| 'laryngostomy'
	| 'ileostomy'
	| 'urostomy'
	| 'gastrostomy'
	| 'other'
	| '';

/** Appliance worn for a fistula. */
export type ApplianceType =
	| 'one-piece-bag'
	| 'two-piece-bag'
	| 'continuous-dressing'
	| 'irrigation-kit'
	| 'other'
	| '';

/** Mode of treatment for diabetes mellitus. */
export type DiabetesTreatmentMode =
	| 'insulin'
	| 'oral-hypoglycaemic'
	| 'insulin-and-oral'
	| 'glp1-agonist'
	| 'diet-only'
	| '';

/** Cancer treatment phase. */
export type CancerTreatmentPhase =
	| 'active-treatment'
	| 'effects-of-cancer'
	| 'effects-of-treatment'
	| 'remission-with-ongoing-treatment'
	| 'palliative'
	| '';

/** Eligibility outcome from the grading engine. */
export type Outcome = 'eligible' | 'ineligible' | 'requires-clarification' | '';

/** Suggested redirect when ineligible on FP92A. */
export type RedirectTarget =
	| ''
	| 'FW8'
	| 'age-exemption'
	| 'low-income-scheme'
	| 'hc1'
	| 'hc2';

// ──────────────────────────────────────────────
// Step 1 — Practitioner identification
// ──────────────────────────────────────────────

export interface Practitioner {
	name: string;
	role: PractitionerRole;
	registrationBody: RegistrationBody;
	registrationNumber: string;
	practiceName: string;
	practiceCode: string;
	practitionerCode: string;
	postalAddressAsFullText: string;
	postcode: string;
	countryAsIso31661Alpha2: string;
	phone: string;
	email: string;
	completionDate: string;
}

// ──────────────────────────────────────────────
// Step 2 — Patient identification
// ──────────────────────────────────────────────

export interface Patient {
	title: Title;
	surname: string;
	forenames: string;
	name: string;
	birthDate: string;
	sex: Sex;
	postalAddressAsFullText: string;
	postcode: string;
	countryAsIso31661Alpha2: string;
	unitedKingdomNhsNumber: string;
	phone: string;
	email: string;
	fullTimeEducation: YesNo;
	pregnancyStatus: PregnancyStatus;
}

// ──────────────────────────────────────────────
// Step 3 — Existing exemption check
// ──────────────────────────────────────────────

export interface ExistingExemption {
	hasExistingCertificate: YesNo;
	applicationKind: ApplicationKind;
	previousCertificateNumber: string;
	previousCertificateExpiryDate: string;
}

// ──────────────────────────────────────────────
// Step 4 — Age-based exclusion check (derived from patient.birthDate)
// ──────────────────────────────────────────────

export interface AgeCheckAcknowledgement {
	/** Practitioner has reviewed any age-based exemption advice. */
	practitionerAcknowledgedAgeAdvice: YesNo;
}

// ──────────────────────────────────────────────
// Step 5 — Pregnancy / maternity check
// (pregnancyStatus lives on Patient; this step is purely an acknowledgement.)
// ──────────────────────────────────────────────

export interface PregnancyCheckAcknowledgement {
	practitionerAcknowledgedFw8Redirect: YesNo;
}

// ──────────────────────────────────────────────
// Step 6 / 7 / 8 — Qualifying condition selection + per-condition detail
// ──────────────────────────────────────────────

export interface QualifyingConditionDetail {
	code: EligibleConditionCode;
	selected: boolean;
	diagnosisDate: string;
	snomedCtCode: string;
	icd10Code: string;
	treatmentDetail: string;

	// Fistula-specific
	fistulaSite: FistulaSite;
	applianceType: ApplianceType;

	// Substitution-therapy-specific
	substitutionTherapy: string;
	onSubstitutionTherapy: YesNo;

	// Diabetes-specific
	diabetesTreatmentMode: DiabetesTreatmentMode;

	// Epilepsy-specific
	anticonvulsant: string;
	continuousAnticonvulsantTherapy: YesNo;

	// Continuing-physical-disability-specific
	cannotLeaveHomeUnaided: YesNo;
	disabilityCarerDetail: string;
	disabilityExpectedToBePermanent: YesNo;

	// Cancer-specific
	cancerSite: string;
	cancerTreatmentPhase: CancerTreatmentPhase;
	histologyConfirmed: YesNoPending;

	practitionerAttestationNotes: string;
}

// ──────────────────────────────────────────────
// Step 9 — Practitioner declaration
// ──────────────────────────────────────────────

export interface PractitionerDeclaration {
	practitionerSignaturePresent: YesNo;
	practitionerHasAccessToMedicalRecords: YesNo;
	practitionerDeclarationText: string;
	signatureDate: string;
}

// ──────────────────────────────────────────────
// Full application data model
// ──────────────────────────────────────────────

export interface Fp92aApplication {
	practitioner: Practitioner;
	patient: Patient;
	existingExemption: ExistingExemption;
	ageCheck: AgeCheckAcknowledgement;
	pregnancyCheck: PregnancyCheckAcknowledgement;
	qualifyingConditions: QualifyingConditionDetail[];
	declaration: PractitionerDeclaration;
}

// ──────────────────────────────────────────────
// Grading engine types
// ──────────────────────────────────────────────

export type RulePriority = 'urgent' | 'high' | 'medium' | 'low';

export type RuleCategory =
	| 'eligible-condition'
	| 'disqualifying'
	| 'redirect'
	| 'completeness'
	| 'renewal';

export type FlagCategory =
	| 'completeness'
	| 'data-quality'
	| 'workflow'
	| 'education'
	| 'safeguarding'
	| 'pregnancy'
	| 'age-exemption';

/** A grading rule — pure predicate over the application data. */
export interface ValidationRule {
	id: string;
	category: RuleCategory;
	priority: RulePriority;
	description: string;
	/** Returns true when the rule is *triggered*. */
	evaluate: (data: Fp92aApplication) => boolean;
	/** Human-readable message when the rule fires. */
	message: string;
	/** Optional contributing condition code (for eligible-condition rules). */
	contributingConditionCode?: EligibleConditionCode | '';
}

export interface FiredRule {
	id: string;
	category: RuleCategory;
	priority: RulePriority;
	description: string;
	message: string;
	contributingConditionCode: EligibleConditionCode | '';
}

export interface AdditionalFlag {
	id: string;
	category: FlagCategory | string;
	message: string;
	priority: RulePriority;
}

export interface EligibilityResult {
	outcome: Outcome;
	eligibleConditions: EligibleConditionCode[];
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	/** ISO date (YYYY-MM-DD) when the certificate would become valid. */
	validFrom: string;
	/** ISO date (YYYY-MM-DD) when the certificate would expire (validFrom + 5y). */
	validUntil: string;
	redirectTo: RedirectTarget;
	/** Computed age from the patient's birth date, or null when missing. */
	ageYears: number | null;
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}
