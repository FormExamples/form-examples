// ──────────────────────────────────────────────
// HIPAA authorization data model (45 CFR § 164.508)
// ──────────────────────────────────────────────
//
// Mirrors the field set of the static HTML wizard
// (`../front-end-form-with-html/js/types.js`) and the SQL migrations.

export type YesNo = 'yes' | 'no' | '';

export interface Patient {
	name: string;
	birthDate: string | null;
	socialSecurityNumber: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	phone: string;
	email: string;
}

export type SignerRelationship =
	| 'self'
	| 'parent-of-minor'
	| 'guardian'
	| 'power-of-attorney'
	| 'other-authorized-representative'
	| '';

export interface Signer {
	relationship: SignerRelationship;
	representativeName: string;
	representativeAuthorityDescription: string;
	representativeAuthorityProofAttached: YesNo;
}

export type IdentificationMode = 'specific' | 'class' | '';

export interface DisclosingSource {
	identificationMode: IdentificationMode;
	specificPersonsOrOrganizations: string;
	classDescription: string;
	isVaFacility: YesNo;
	isPart2Program: YesNo;
}

export interface AuthorizedRecipient {
	recipientName: string;
	recipientOrganization: string;
	recipientRole: string;
	recipientAddress: string;
	recipientPhone: string;
	recipientEmail: string;
	recipientRelationshipToPatient: string;
}

export interface RecordsToDisclose {
	includeMedicalHealth: YesNo;
	medicalHealthInitials: string;
	includeMentalHealth: YesNo;
	mentalHealthInitials: string;
	includeSubstanceUse: YesNo;
	substanceUseInitials: string;
	part2RedisclosureNoticeIncluded: YesNo;
	includeHivAids: YesNo;
	hivAidsInitials: string;
	hivAidsStateConsentIncluded: YesNo;
	includePsychotherapyNotes: YesNo;
	includeGeneticInformation: YesNo;
	includeReproductiveHealth: YesNo;
	section7332NoticeIncluded: YesNo;
	dateRangeSpecified: YesNo;
	dateFrom: string | null;
	dateTo: string | null;
	otherDescription: string;
}

export type PrimaryPurpose =
	| 'eligibility-determination'
	| 'continuing-treatment'
	| 'insurance-claim'
	| 'legal-proceeding'
	| 'personal-use'
	| 'research'
	| 'at-the-request-of-the-individual'
	| 'other'
	| '';

export interface PurposeOfDisclosure {
	purposes: string[];
	primaryPurpose: PrimaryPurpose;
	otherDetails: string;
}

export type ExpirationKind = 'date' | 'event' | 'duration' | '';

export interface Expiration {
	kind: ExpirationKind;
	expirationDate: string | null;
	expirationEvent: string;
	durationMonths: number | null;
	durationLabel: string;
}

export interface PatientRightsAcknowledgement {
	acknowledgedRightToRevoke: YesNo;
	acknowledgedRevocationProcedure: YesNo;
	acknowledgedNoConditioning: YesNo;
	acknowledgedRedisclosureWarning: YesNo;
	acknowledgedRightToCopy: YesNo;
	acknowledgedRightToInspectDisclosed: YesNo;
}

export interface SignatureWitness {
	individualSignatureConfirmed: YesNo;
	individualSignatureImageUri: string;
	signatureDate: string | null;
	signedAtLocation: string;
	parentGuardianCoSignatureRequired: YesNo;
	parentGuardianName: string;
	parentGuardianSignatureConfirmed: YesNo;
	parentGuardianSignatureDate: string | null;
	witnessName: string;
	witnessSignatureConfirmed: YesNo;
	witnessDate: string | null;
	witnessRole: string;
}

// ──────────────────────────────────────────────
// Full authorization data model
// ──────────────────────────────────────────────

export interface HipaaAuthorization {
	patient: Patient;
	signer: Signer;
	disclosingSource: DisclosingSource;
	authorizedRecipient: AuthorizedRecipient;
	recordsToDisclose: RecordsToDisclose;
	purposeOfDisclosure: PurposeOfDisclosure;
	expiration: Expiration;
	patientRightsAcknowledgement: PatientRightsAcknowledgement;
	signatureWitness: SignatureWitness;
}

// ──────────────────────────────────────────────
// Validity-engine types
// ──────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low';
export type ValidityStatus = 'valid' | 'invalid' | '';
export type CompletenessStatus = 'empty' | 'partial' | 'complete';

/** A core-element / required-statement / sensitive-category rule. */
export interface ValidationRule {
	id: string;
	citation: string;
	domain: string;
	priority: Priority;
	description: string;
	test: (a: HipaaAuthorization) => boolean;
}

/** A rule that fired during validation (a defect in the authorization). */
export interface FiredRule {
	ruleId: string;
	citation: string;
	domain: string;
	priority: Priority;
	description: string;
}

/** A non-gating advisory flag raised during validation. */
export interface AdditionalFlag {
	flagId: string;
	category: string;
	priority: Priority;
	message: string;
}

/** The result of validating a HIPAA authorization. */
export interface ValidationResult {
	validityStatus: ValidityStatus;
	completenessScore: number;
	completenessStatus: CompletenessStatus;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	validatedAt: string;
	validatorVersion: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof HipaaAuthorization;
}
