// Generated from sql/. Keep in sync by hand.
// SOURCE: forms/united-states-hipaa-authorization-form/sql/

import "@typespec/openapi3";

@doc("United States HIPAA Authorization Form — TypeSpec models.")
namespace UnitedStatesHipaaAuthorizationForm;

@doc("Patient identification fields for the HIPAA authorization form.")
model Patient {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Patient print name, as it appears on the signed authorization.")
  name: string;

  @doc("Date of birth.")
  birthDate?: plainDate;

  @doc("Social Security Number, optional. Format NNN-NN-NNNN.")
  socialSecurityNumber: string;

  @doc("Street address line.")
  streetAddress: string;

  @doc("City.")
  city: string;

  @doc("US state two-letter abbreviation.")
  state: string;

  @doc("US ZIP code (5 or 9 digit).")
  zipCode: string;

  @doc("Phone number including area code.")
  phone: string;

  @doc("Email address, optional.")
  email: string;
}

@doc("Parent entity for a single HIPAA authorization document.")
model HipaaAuthorization {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the patient who is authorising the disclosure.")
  patientId: string;

  @doc("Lifecycle status.")
  status: "draft" | "submitted" | "valid" | "invalid" | "expired" | "revoked";

  @doc("Source state template the authorization was generated from.")
  stateTemplate: "" | "tn-hs-2557" | "pa-hs-1549" | "hhs-ocr-sample" | "custom";

  @doc("Timestamp when the patient revoked the authorization.")
  revokedAt?: utcDateTime;

  @doc("Method of revocation.")
  revocationMethod: "" | "written" | "electronic" | "in-person";
}

@doc("Identification of the individual who signs the HIPAA authorization.")
model Signer {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Signer relationship to patient.")
  relationship: "" | "self" | "parent-of-minor" | "guardian" | "conservator" | "power-of-attorney" | "executor" | "other-authorized-representative";

  @doc("Print name of the authorized representative.")
  representativeName: string;

  @doc("Free-text description of the representative's authority to act. § 164.508(c)(1)(vi)(B).")
  representativeAuthorityDescription: string;

  @doc("Whether proof of legal authority is attached.")
  representativeAuthorityProofAttached: "" | "yes" | "no";
}

@doc("Person(s) or class of persons authorized to make the disclosure. § 164.508(c)(1)(ii).")
model DisclosingSource {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Whether the disclosing source is identified specifically or as a class.")
  identificationMode: "" | "specific" | "class";

  @doc("Free-text list of specific persons or organizations holding the records.")
  specificPersonsOrOrganizations: string;

  @doc("Free-text description of the class of persons.")
  classDescription: string;

  @doc("Whether the source is a US VA facility (triggers 38 U.S.C. § 7332).")
  isVaFacility: "" | "yes" | "no";

  @doc("Whether the source is a federally assisted SUD program (42 CFR Part 2).")
  isPart2Program: "" | "yes" | "no";
}

@doc("Authorized recipient of the disclosure. § 164.508(c)(1)(iii).")
model AuthorizedRecipient {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Full name of the authorized recipient.")
  recipientName: string;

  @doc("Organisation the recipient belongs to.")
  recipientOrganization: string;

  @doc("Professional role or title of the recipient.")
  recipientRole: string;

  @doc("Postal address of the recipient.")
  recipientAddress: string;

  @doc("Phone number of the recipient.")
  recipientPhone: string;

  @doc("Email address of the recipient.")
  recipientEmail: string;

  @doc("Recipient relationship to patient.")
  recipientRelationshipToPatient: "" | "health-plan" | "state-agency" | "employer" | "attorney" | "researcher" | "family-member" | "self" | "health-care-provider" | "other";
}

@doc("Specific and meaningful description of the PHI to be disclosed. § 164.508(c)(1)(i).")
model RecordsToDisclose {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Include general medical / health records.")
  includeMedicalHealth: "" | "yes" | "no";

  @doc("Patient initials authorising release of general medical / health records.")
  medicalHealthInitials: string;

  @doc("Include mental-health records.")
  includeMentalHealth: "" | "yes" | "no";

  @doc("Patient initials authorising release of mental-health records.")
  mentalHealthInitials: string;

  @doc("Include drug or alcohol treatment / referral records.")
  includeSubstanceUse: "" | "yes" | "no";

  @doc("Patient initials authorising release of substance-use records.")
  substanceUseInitials: string;

  @doc("Whether the 42 CFR Part 2 prohibition-on-redisclosure notice is included.")
  part2RedisclosureNoticeIncluded: "" | "yes" | "no";

  @doc("Include HIV / AIDS test or treatment records.")
  includeHivAids: "" | "yes" | "no";

  @doc("Patient initials authorising release of HIV / AIDS records.")
  hivAidsInitials: string;

  @doc("Whether the state-specific HIV / AIDS consent language is included.")
  hivAidsStateConsentIncluded: "" | "yes" | "no";

  @doc("Include psychotherapy notes. § 164.508(a)(2) requires a separate form.")
  includePsychotherapyNotes: "" | "yes" | "no";

  @doc("Include genetic information.")
  includeGeneticInformation: "" | "yes" | "no";

  @doc("Include reproductive-health-care records (HHS 2024 rule).")
  includeReproductiveHealth: "" | "yes" | "no";

  @doc("Whether the 38 U.S.C. § 7332 notice is included.")
  section7332NoticeIncluded: "" | "yes" | "no";

  @doc("Whether the patient has restricted disclosure to a date range.")
  dateRangeSpecified: "" | "yes" | "no";

  @doc("Start date of the disclosed records.")
  dateFrom?: plainDate;

  @doc("End date of the disclosed records.")
  dateTo?: plainDate;

  @doc("Free-text description of any other PHI to be disclosed.")
  otherDescription: string;
}

@doc("Description of each purpose of the requested use or disclosure. § 164.508(c)(1)(iv).")
model PurposeOfDisclosure {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Array of purpose identifiers (multiple purposes permitted).")
  purposes: string[];

  @doc("Primary purpose.")
  primaryPurpose: "" | "eligibility-determination" | "continuing-treatment" | "insurance-claim" | "legal-proceeding" | "disability-application" | "personal-use" | "research" | "employment" | "at-the-request-of-the-individual" | "other";

  @doc("Free-text details when primary_purpose is other.")
  otherDetails: string;
}

@doc("Expiration date or expiration event for the authorization. § 164.508(c)(1)(v).")
model Expiration {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Expiration mechanism.")
  kind: "" | "date" | "event" | "duration";

  @doc("Calendar expiration date.")
  expirationDate?: plainDate;

  @doc("Free-text expiration event. Cannot be the string 'none'.")
  expirationEvent: string;

  @doc("Validity duration in months from signature.")
  durationMonths?: int32;

  @doc("Human-readable duration label.")
  durationLabel: string;
}

@doc("Patient acknowledgement of HIPAA-required statements. § 164.508(c)(2).")
model PatientRightsAcknowledgement {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Acknowledged right to revoke. § 164.508(c)(2)(i).")
  acknowledgedRightToRevoke: "" | "yes" | "no";

  @doc("Acknowledged revocation procedure.")
  acknowledgedRevocationProcedure: "" | "yes" | "no";

  @doc("Acknowledged no-conditioning. § 164.508(c)(2)(ii).")
  acknowledgedNoConditioning: "" | "yes" | "no";

  @doc("Acknowledged re-disclosure warning. § 164.508(c)(2)(iii).")
  acknowledgedRedisclosureWarning: "" | "yes" | "no";

  @doc("Acknowledged right to copy. § 164.508(c)(4).")
  acknowledgedRightToCopy: "" | "yes" | "no";

  @doc("Acknowledged right to inspect disclosed information.")
  acknowledgedRightToInspectDisclosed: "" | "yes" | "no";
}

@doc("Signature, date, and witness fields. § 164.508(c)(1)(vi).")
model SignatureWitness {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Whether the individual has confirmed the signature.")
  individualSignatureConfirmed: "" | "yes" | "no";

  @doc("URI of the captured electronic signature image.")
  individualSignatureImageUri: string;

  @doc("Date the individual signed the authorization.")
  signatureDate?: plainDate;

  @doc("Optional location where the signature was captured.")
  signedAtLocation: string;

  @doc("Whether a parent or guardian co-signature is required.")
  parentGuardianCoSignatureRequired: "" | "yes" | "no";

  @doc("Name of parent or guardian co-signing.")
  parentGuardianName: string;

  @doc("Whether the parent / guardian has confirmed their co-signature.")
  parentGuardianSignatureConfirmed: "" | "yes" | "no";

  @doc("Date the parent / guardian co-signed.")
  parentGuardianSignatureDate?: plainDate;

  @doc("Name of the witness, when required by state law.")
  witnessName: string;

  @doc("Whether the witness has confirmed their signature.")
  witnessSignatureConfirmed: "" | "yes" | "no";

  @doc("Date the witness signed.")
  witnessDate?: plainDate;

  @doc("Role of the witness.")
  witnessRole: string;
}

@doc("Result of the HIPAA-authorization validity engine.")
model ValidationResult {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent HIPAA authorization.")
  hipaaAuthorizationId: string;

  @doc("Overall validity.")
  validityStatus: "" | "valid" | "invalid";

  @doc("Completeness score 0..100.")
  completenessScore: int32;

  @doc("Human-readable completeness band.")
  completenessStatus: "" | "complete" | "partial" | "empty";

  @doc("Timestamp when the validation was last run.")
  validatedAt?: utcDateTime;

  @doc("Engine version string (semver).")
  validatorVersion: string;
}

@doc("Validation rules that fired during the HIPAA-authorization check.")
model ValidationFiredRule {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent validation result.")
  validationResultId: string;

  @doc("Identifier of the validation rule that fired.")
  ruleId: string;

  @doc("Regulatory citation backing the rule.")
  citation: string;

  @doc("Rule domain.")
  domain: "" | "core-element" | "required-statement" | "sensitive-category" | "compound" | "expiration" | "representative";

  @doc("Human-readable description.")
  description: string;

  @doc("Rule priority.")
  priority: "high" | "medium" | "low";
}

@doc("Additional flags raised during HIPAA-authorization validation.")
model ValidationAdditionalFlag {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when this row was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when this row was updated.")
  updatedAt: utcDateTime;

  @doc("Timestamp when this row was deleted (soft delete).")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent validation result.")
  validationResultId: string;

  @doc("Identifier of the additional flag.")
  flagId: string;

  @doc("Flag category.")
  category: "" | "sensitive-category" | "state-law" | "representative" | "minor" | "language" | "audit" | "reproductive-health";

  @doc("Human-readable message describing the flag.")
  message: string;

  @doc("Flag priority.")
  priority: "high" | "medium" | "low";
}
