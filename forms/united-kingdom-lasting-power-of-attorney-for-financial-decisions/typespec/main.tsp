// Generated from sql/. Do not edit by hand.
// SOURCE: united-kingdom-lasting-power-of-attorney-for-financial-decisions

import "@typespec/http";

using TypeSpec.Http;

@service(#{ title: "LpaFinance" })
namespace LpaFinance;

// ----- Enumerated value unions -----

/** LP1F section 3 decision modes. */
union DecisionMode {
  "single_attorney",
  "jointly_and_severally",
  "jointly",
  "mixed",
  "",
}

/** LP1F section 5 when-attorneys-can-act values. */
union WhenAttorneysCanAct {
  "as_soon_as_registered",
  "only_when_no_capacity",
  "",
}

/** LPA lifecycle status. */
union LpaStatus {
  "draft",
  "ready_for_signing",
  "partially_signed",
  "fully_signed",
  "ready_for_registration",
  "submitted",
  "registered",
  "rejected",
  "",
}

/** Certificate-provider relationship to donor. */
union KnowsDonorAs {
  "friend",
  "professional",
  "",
}

/** Signature role on the LP1F deed or registration application. */
union SignatureRole {
  "donor",
  "certificate_provider",
  "attorney",
  "replacement_attorney",
  "applicant",
  "signing_on_behalf_of_donor",
  "trust_corporation_authorised_person",
}

/** LPC continuation sheet kind. */
union ContinuationSheetKind {
  "1_additional_people",
  "2_additional_information",
  "3_donor_cannot_sign",
  "4_trust_corporation",
}

/** Registration applicant kind. */
union ApplicantKind {
  "donor",
  "attorneys",
  "",
}

/** Registration fee payment method. */
union PaymentMethod {
  "card",
  "cheque",
  "",
}

/** Who receives the registered LPA. */
union RecipientKind {
  "donor",
  "attorney",
  "other",
  "",
}

/** Validation result band. */
union ValidityBand {
  "draft",
  "ready_for_signing",
  "partially_signed",
  "fully_signed",
  "ready_for_registration",
  "submitted",
  "registered",
  "rejected",
}

/** Composite risk grade. */
union CompositeRisk {
  "low",
  "moderate",
  "high",
  "critical",
}

/** Rule / flag priority. */
union RulePriority {
  "low",
  "moderate",
  "high",
  "critical",
}

union FlagPriority {
  "low",
  "moderate",
  "high",
}

// ----- Models (one per SQL table) -----

/** person — every named individual involved in an LPA. */
model Person {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  title: string;
  first_names: string;
  last_name: string;
  other_names: string;
  date_of_birth?: plainDate;
  email: string;
  phone: string;
  /** FK -> Address.id */
  address_id?: string;
  is_trust_corporation: boolean;
  trust_corporation_number: string;
  is_bankrupt: boolean;
  has_debt_relief_order: boolean;
}

/** address — postal address. */
model Address {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  postcode: string;
  country_as_iso_3166_1_alpha_2: string;
}

/** lasting_power_of_attorney — top-level LP1F deed. */
model LastingPowerOfAttorney {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> Person.id */
  @format("uuid") donor_person_id: string;
  decision_mode: DecisionMode;
  decision_mode_mixed_text: string;
  when_attorneys_can_act: WhenAttorneysCanAct;
  preferences_text: string;
  instructions_text: string;
  legal_rights_acknowledged: boolean;
  opg_reference_number: string;
  opg_registration_date?: plainDate;
  status: LpaStatus;
}

/** lpa_attorney — join: original attorneys. */
model LpaAttorney {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  /** FK -> Person.id */
  @format("uuid") person_id: string;
  ordinal: int32;
}

/** lpa_replacement_attorney — join: replacement attorneys. */
model LpaReplacementAttorney {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  /** FK -> Person.id */
  @format("uuid") person_id: string;
  ordinal: int32;
  replacement_step_in_condition: string;
}

/** lpa_certificate_provider — the LP1F section-10 certificate provider. */
model LpaCertificateProvider {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  /** FK -> Person.id */
  @format("uuid") person_id: string;
  knows_donor_as: KnowsDonorAs;
  is_over_eighteen: boolean;
  read_lpa: boolean;
  no_restrictions_on_acting: boolean;
  eligibility_confirmation_at?: utcDateTime;
}

/** lpa_person_to_notify — 0–5 LP1F section-6 persons to notify. */
model LpaPersonToNotify {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  /** FK -> Person.id */
  @format("uuid") person_id: string;
  ordinal: int32;
}

/** lpa_preferences_and_instructions — overflow text for sections 3, 4, 7. */
model LpaPreferencesAndInstructions {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  preferences_overflow_text: string;
  instructions_overflow_text: string;
  decisions_jointly_overflow_text: string;
  replacement_step_in_overflow_text: string;
}

/** lpa_signature — audit log of every signing event. */
model LpaSignature {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  /** FK -> Person.id */
  @format("uuid") signatory_person_id: string;
  role: SignatureRole;
  /** LP1F section: 9, 10, 11 or 15. */
  lp1f_section: int32;
  signature_blob_path: string;
  signed_on?: plainDate;
  signed_on_behalf_full_name: string;
  is_witnessed: boolean;
}

/** lpa_witness — the witness for a witnessable signature. */
model LpaWitness {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LpaSignature.id */
  @format("uuid") signature_id: string;
  /** FK -> Person.id */
  @format("uuid") witness_person_id: string;
  witness_signature_blob_path: string;
  witnessed_on?: plainDate;
}

/** lpa_continuation_sheet — one row per LPC sheet (1–4). */
model LpaContinuationSheet {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  kind: ContinuationSheetKind;
  body_text: string;
  signed_on?: plainDate;
  ordinal: int32;
}

/** lpa_registration_application — LP1F sections 12 and 14. */
model LpaRegistrationApplication {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  applicant_kind: ApplicantKind;
  payment_method: PaymentMethod;
  card_payment_phone: string;
  reduced_fee_requested: boolean;
  has_lpa120a_evidence: boolean;
  is_repeat_application: boolean;
  repeat_case_number: string;
  payment_reference: string;
  payment_date?: plainDate;
  payment_amount?: decimal;
}

/** lpa_registration_recipient — LP1F section 13. */
model LpaRegistrationRecipient {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  recipient_kind: RecipientKind;
  /** FK -> Person.id */
  recipient_person_id?: string;
  company_name: string;
  prefers_post: boolean;
  prefers_phone: boolean;
  prefers_email: boolean;
  prefers_welsh: boolean;
  contact_phone: string;
  contact_email: string;
  other_first_names: string;
  other_last_name: string;
  other_address_line_1: string;
  other_address_line_2: string;
  other_address_line_3: string;
  other_postcode: string;
}

/** lpa_validation_result — validator output band + composite risk. */
model LpaValidationResult {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  validity_band: ValidityBand;
  composite_risk: CompositeRisk;
  computed_at: utcDateTime;
}

/** lpa_validation_rule — fired statutory blocker rule. */
model LpaValidationRule {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  rule_name: string;
  priority: RulePriority;
  statutory_citation: string;
  remediation_hint: string;
  fired_at: utcDateTime;
}

/** lpa_validation_flag — fired non-blocking warning flag. */
model LpaValidationFlag {
  @key @format("uuid") id: string;
  created_at: utcDateTime;
  updated_at: utcDateTime;
  deleted_at?: utcDateTime;
  /** FK -> LastingPowerOfAttorney.id */
  @format("uuid") lpa_id: string;
  flag_name: string;
  priority: FlagPriority;
  category: string;
  remediation_hint: string;
  fired_at: utcDateTime;
}
