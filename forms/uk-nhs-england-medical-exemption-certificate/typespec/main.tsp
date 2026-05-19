// Generated from sql-migrations/. Do not edit by hand.
// SOURCE: forms/uk-nhs-england-medical-exemption-certificate/sql-migrations/

import "@typespec/openapi3";

@doc("UK NHS England Medical Exemption Certificate (FP92A) — TypeSpec models.")
namespace Fp92a;

@doc("Applicant for the FP92A medical exemption certificate.")
model Patient {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Personal title prefix as printed on the FP92A.")
  title: "Mr" | "Mrs" | "Miss" | "Ms" | "Mx" | "Dr" | "Prof" | "Rev" | "Other" | "";

  @doc("Family name (surname) as printed on the FP92A.")
  surname: string;

  @doc("Given names (forenames) as printed on the FP92A.")
  forenames: string;

  @doc("Full display name composed from forenames + surname.")
  name: string;

  @doc("Date of birth - used to derive age and age-based exemption eligibility.")
  birthDate?: plainDate;

  @doc("Sex recorded on the NHS demographic record.")
  sex: "female" | "male" | "intersex" | "unknown" | "";

  @doc("Optional email address for non-statutory contact.")
  email?: string;

  @doc("Optional telephone number.")
  phone?: string;

  @doc("Full UK postal address as printed on the FP92A.")
  postalAddressAsFullText?: string;

  @doc("Country as ISO 3166-1 alpha-2 (expected GB for FP92A applicants).")
  countryAsIso31661Alpha2?: string;

  @doc("UK postcode used by NHSBSA to validate the address.")
  postcode?: string;

  @doc("NHS number (10 digits, Modulus-11 checksum). Required for NHSBSA matching.")
  unitedKingdomNhsNumber?: string;

  @doc("Whether a 16-18 year-old is in full-time education (age-exemption check).")
  fullTimeEducation: "yes" | "no" | "";

  @doc("Pregnancy / post-partum status used to redirect applicants to FW8.")
  pregnancyStatus: "not-pregnant" | "pregnant" | "post-partum-within-12-months" | "";
}

@doc("Practitioner who signs the FP92A and attests to the qualifying condition(s).")
model Practitioner {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Practitioner full name.")
  name: string;

  @doc("Optional practitioner email.")
  email?: string;

  @doc("Practice telephone number printed on the FP92A.")
  phone?: string;

  @doc("Practitioner role / job title.")
  role: "gp" | "hospital-doctor" | "nurse-practitioner" | "pharmacist-prescriber" | "other" | "";

  @doc("Professional registration body (GMC for doctors, NMC for nurses, HCPC, GPhC).")
  registrationBody: "GMC" | "NMC" | "HCPC" | "GPhC" | "other" | "";

  @doc("Professional registration number issued by the registration body.")
  registrationNumber: string;

  @doc("GP surgery / practice / clinic name printed on the FP92A.")
  practiceName: string;

  @doc("NHS practice code (where applicable).")
  practiceCode: string;

  @doc("NHS practitioner code (where applicable).")
  practitionerCode: string;

  @doc("Practice postal address as printed on the FP92A.")
  postalAddressAsFullText?: string;

  @doc("Practice country as ISO 3166-1 alpha-2.")
  countryAsIso31661Alpha2?: string;

  @doc("Practice postcode.")
  postcode?: string;

  @doc("Optional NHS staff number for the practitioner.")
  unitedKingdomNhsNumber?: string;
}

@doc("Closed list of the ten NHSBSA-recognised qualifying conditions for FP92A.")
model EligibleCondition {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Machine-readable condition code from the closed NHSBSA list.")
  code:
    | "permanent-fistula"
    | "hypoadrenalism"
    | "diabetes-insipidus-or-hypopituitarism"
    | "diabetes-mellitus-not-diet-only"
    | "hypoparathyroidism"
    | "myasthenia-gravis"
    | "myxoedema"
    | "epilepsy-on-anticonvulsant"
    | "continuing-physical-disability"
    | "cancer-or-effects";

  @doc("Human-readable label matching the FP92A wording.")
  label: string;

  @doc("Long-form description with NHSBSA inclusion / exclusion criteria.")
  description: string;

  @doc("Whether the application must capture appliance / dressing detail (fistula).")
  requiresApplianceDetail: "yes" | "no";

  @doc("Whether the application must capture substitution-therapy detail (hypoadrenalism, hypopituitarism, hypoparathyroidism, myxoedema).")
  requiresSubstitutionTherapyDetail: "yes" | "no";

  @doc("Whether the practitioner must attest that the patient cannot leave home unaided.")
  requiresDisabilityAttestation: "yes" | "no";

  @doc("Whether the application must capture cancer site and treatment phase.")
  requiresCancerDetail: "yes" | "no";

  @doc("Whether diet-only diabetes is explicitly excluded (true for diabetes mellitus).")
  excludesDietOnlyDiabetes: "yes" | "no";

  @doc("Optional SNOMED CT concept identifier for the condition.")
  snomedCtReference: string;

  @doc("Optional ICD-10 code for the condition.")
  icd10Reference: string;
}

@doc("FP92A medical exemption application instance.")
model Application {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the applicant patient.")
  patientId: string;

  @doc("Foreign key to the signing practitioner.")
  practitionerId: string;

  @doc("Lifecycle status: draft, ready-to-post, posted, issued, rejected, expired, cancelled.")
  status: "draft" | "ready-to-post" | "posted" | "issued" | "rejected" | "expired" | "cancelled";

  @doc("New application, renewal of an expiring certificate, or replacement of a lost certificate.")
  applicationKind: "new" | "renewal" | "replacement" | "";

  @doc("Certificate number of the previous certificate (renewal / replacement).")
  previousCertificateNumber: string;

  @doc("Expiry date of the previous certificate, used for renewal-window checks.")
  previousCertificateExpiryDate?: plainDate;

  @doc("Date the practitioner completed and signed the FP92A.")
  completedDate?: plainDate;

  @doc("Date the FP92A was posted to NHSBSA Bridge House.")
  postedDate?: plainDate;

  @doc("Date the FP92A was acknowledged received by NHSBSA.")
  receivedByNhsbsaDate?: plainDate;

  @doc("Issued certificate number (populated once NHSBSA returns the issued certificate).")
  certificateNumber: string;

  @doc("Date the issued certificate becomes valid.")
  validFrom?: plainDate;

  @doc("Date the issued certificate expires (typically valid_from + 5 years).")
  validUntil?: plainDate;

  @doc("Whether the practitioner has signed in ink before posting.")
  practitionerSignaturePresent: "yes" | "no" | "";

  @doc("Free-text declaration as captured from the FP92A signature panel.")
  practitionerDeclarationText: string;

  @doc("Internal notes about the application.")
  notes: string;
}

@doc("Per-application qualifying conditions with condition-specific detail.")
model ApplicationEligibleCondition {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent application.")
  applicationId: string;

  @doc("Foreign key to the eligible condition (one of the ten NHSBSA-recognised conditions).")
  eligibleConditionId: string;

  @doc("Date the qualifying condition was diagnosed.")
  diagnosisDate?: plainDate;

  @doc("Optional SNOMED CT code for the patient-specific diagnosis.")
  snomedCtCode: string;

  @doc("Optional ICD-10 code for the patient-specific diagnosis.")
  icd10Code: string;

  @doc("Free-text description of the current treatment regimen.")
  treatmentDetail: string;

  @doc("Anatomical site of the fistula (for the fistula condition).")
  fistulaSite: "caecostomy" | "colostomy" | "laryngostomy" | "ileostomy" | "urostomy" | "gastrostomy" | "other" | "";

  @doc("Appliance worn for the fistula (bag, dressing, irrigation kit).")
  applianceType: "one-piece-bag" | "two-piece-bag" | "continuous-dressing" | "irrigation-kit" | "other" | "";

  @doc("Substitution therapy drug and dose (e.g. hydrocortisone 20mg AM / 10mg PM).")
  substitutionTherapy: string;

  @doc("Whether the patient is on the substitution therapy required for eligibility.")
  onSubstitutionTherapy: "yes" | "no" | "";

  @doc("How diabetes is being treated; diet-only excludes the patient from FP92A.")
  diabetesTreatmentMode: "insulin" | "oral-hypoglycaemic" | "insulin-and-oral" | "glp1-agonist" | "diet-only" | "";

  @doc("Anticonvulsant drug and dose (for epilepsy).")
  anticonvulsant: string;

  @doc("Whether the patient receives continuous anticonvulsant therapy.")
  continuousAnticonvulsantTherapy: "yes" | "no" | "";

  @doc("Whether the patient is unable to leave home without the help of another person.")
  cannotLeaveHomeUnaided: "yes" | "no" | "";

  @doc("Description of the help / carer the patient depends on.")
  disabilityCarerDetail: string;

  @doc("Practitioner judgement that the disability is permanent, not temporary.")
  disabilityExpectedToBePermanent: "yes" | "no" | "";

  @doc("Anatomical site or type of cancer.")
  cancerSite: string;

  @doc("Phase of cancer care - active treatment, effects of cancer, effects of treatment, etc.")
  cancerTreatmentPhase: "active-treatment" | "effects-of-cancer" | "effects-of-treatment" | "remission-with-ongoing-treatment" | "palliative" | "";

  @doc("Whether a histological diagnosis has been confirmed for the cancer.")
  histologyConfirmed: "yes" | "no" | "pending" | "";

  @doc("Free-text notes from the practitioner supporting the attestation.")
  practitionerAttestationNotes: string;
}

@doc("Computed eligibility determination for an FP92A application.")
model Grade {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent application (one grade per application).")
  applicationId: string;

  @doc("Eligibility outcome: eligible, ineligible, or requires-clarification.")
  outcome: "eligible" | "ineligible" | "requires-clarification" | "";

  @doc("If ineligible on FP92A, suggested alternative exemption route.")
  redirectTo: "" | "FW8" | "age-exemption" | "low-income-scheme" | "hc1" | "hc2";

  @doc("Headline category as a human-readable label.")
  resultCategory: string;

  @doc("Numeric score (always 1.0 for eligible, 0.0 otherwise).")
  resultScore?: float64;

  @doc("Free-text rationale or summary attached to the grade.")
  resultNotes: string;

  @doc("Date the certificate would become valid (typically completed_date).")
  validFrom?: plainDate;

  @doc("Date the certificate would expire (typically valid_from + validity_years).")
  validUntil?: plainDate;

  @doc("Number of years the certificate is valid for (NHSBSA default: 5).")
  validityYears: int32;

  @doc("Timestamp the grade was last (re-)computed.")
  gradedAt: utcDateTime;
}

@doc("Audit trail of rules that fired when computing an eligibility grade.")
model GradeFiredRule {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent grade.")
  gradeId: string;

  @doc("Stable identifier of the rule that fired.")
  ruleId: string;

  @doc("Rule category: eligible-condition, disqualifying, redirect, completeness, renewal.")
  category: "eligible-condition" | "disqualifying" | "redirect" | "completeness" | "renewal" | "";

  @doc("Human-readable description of why the rule fired.")
  description: string;

  @doc("Severity level for sorting / display.")
  severityLevel: "info" | "low" | "medium" | "high" | "";

  @doc("Optional eligible-condition code the rule was evaluated against.")
  contributingConditionCode: string;
}

@doc("Per-grade advisory flags surfaced to the practitioner.")
model GradeAdditionalFlag {
  @doc("Primary key UUID, auto-generated.")
  id: string;

  @doc("Timestamp when the record was created.")
  createdAt: utcDateTime;

  @doc("Timestamp when the record was updated most-recently.")
  updatedAt: utcDateTime;

  @doc("Timestamp when the record was deleted a.k.a. soft-removed.")
  deletedAt?: utcDateTime;

  @doc("Foreign key to the parent grade.")
  gradeId: string;

  @doc("Stable identifier of the flag.")
  flagId: string;

  @doc("Flag category for grouping in the UI.")
  category: "completeness" | "data-quality" | "workflow" | "education" | "safeguarding" | "pregnancy" | "age-exemption" | "";

  @doc("Human-readable description shown to the practitioner.")
  description: string;

  @doc("Display priority: low, medium, or high.")
  priority: "low" | "medium" | "high" | "";
}
