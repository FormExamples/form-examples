//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Completion level.
pub type CompletionLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient full name.
    pub patient_full_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient address.
    pub patient_address: String,
    /// Patient phone.
    pub patient_phone: String,
    /// Patient email.
    pub patient_email: String,
    /// Medical record number.
    pub medical_record_number: String,
    /// Social security last four.
    pub social_security_last_four: String,
}

// ─── Requesting Party (Step 2) ──────────────────────────────

/// Requesting party.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RequestingParty {
    /// Requester name.
    pub requester_name: String,
    /// Requester relationship.
    pub requester_relationship: String,
    /// Requester organization.
    pub requester_organization: String,
    /// Requester address.
    pub requester_address: String,
    /// Requester phone.
    pub requester_phone: String,
    /// Requester email.
    pub requester_email: String,
    /// Requester fax.
    pub requester_fax: String,
}

// ─── Records Specification (Step 3) ─────────────────────────

/// Records specification.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RecordsSpecification {
    /// Record type.
    pub record_type: String,
    /// Date range start.
    pub date_range_start: String,
    /// Date range end.
    pub date_range_end: String,
    /// Specific records.
    pub specific_records: String,
    /// Delivery format.
    pub delivery_format: String,
    /// Delivery method.
    pub delivery_method: String,
    /// Urgency level.
    pub urgency_level: String,
}

// ─── Purpose of Release (Step 4) ────────────────────────────

/// Purpose of release.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PurposeOfRelease {
    /// Primary purpose.
    pub primary_purpose: String,
    /// Secondary purpose.
    pub secondary_purpose: String,
    /// Purpose details.
    pub purpose_details: String,
    /// Legal case number.
    pub legal_case_number: String,
    /// Insurance claim number.
    pub insurance_claim_number: String,
    /// Is court ordered.
    pub is_court_ordered: String,
}

// ─── Authorization Scope (Step 5) ───────────────────────────

/// Authorization scope.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AuthorizationScope {
    /// Releasing facility name.
    pub releasing_facility_name: String,
    /// Releasing facility address.
    pub releasing_facility_address: String,
    /// Releasing provider name.
    pub releasing_provider_name: String,
    /// Receiving facility name.
    pub receiving_facility_name: String,
    /// Receiving facility address.
    pub receiving_facility_address: String,
    /// Receiving provider name.
    pub receiving_provider_name: String,
    /// Scope limitation.
    pub scope_limitation: String,
}

// ─── Sensitive Information (Step 6) ─────────────────────────

/// Sensitive information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SensitiveInformation {
    /// Include mental health.
    pub include_mental_health: String,
    /// Include substance abuse.
    pub include_substance_abuse: String,
    /// Include hiv aids.
    pub include_hiv_aids: String,
    /// Include genetic testing.
    pub include_genetic_testing: String,
    /// Include sexual health.
    pub include_sexual_health: String,
    /// Include psychotherapy notes.
    pub include_psychotherapy_notes: String,
    /// Sensitive info acknowledgement.
    pub sensitive_info_acknowledgement: String,
}

// ─── Duration & Expiry (Step 7) ─────────────────────────────

/// Duration expiry.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DurationExpiry {
    /// Authorization start date.
    pub authorization_start_date: String,
    /// Authorization expiry date.
    pub authorization_expiry_date: String,
    /// Expiry event.
    pub expiry_event: String,
    /// Auto renew.
    pub auto_renew: String,
    /// Revocation understood.
    pub revocation_understood: String,
    /// Revocation method.
    pub revocation_method: String,
}

// ─── Verification & Identity (Step 8) ───────────────────────

/// Verification identity.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VerificationIdentity {
    /// Identity verified.
    pub identity_verified: String,
    /// Verification method.
    pub verification_method: String,
    /// Verification document type.
    pub verification_document_type: String,
    /// Verification document number.
    pub verification_document_number: String,
    /// Verified by name.
    pub verified_by_name: String,
    /// Verification date.
    pub verification_date: String,
}

// ─── Signatures & Consent (Step 9) ──────────────────────────

/// Signatures consent.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SignaturesConsent {
    /// Patient signature.
    pub patient_signature: String,
    /// Patient signature date.
    pub patient_signature_date: String,
    /// Witness name.
    pub witness_name: String,
    /// Witness signature.
    pub witness_signature: String,
    /// Witness signature date.
    pub witness_signature_date: String,
    /// Guardian name.
    pub guardian_name: String,
    /// Guardian relationship.
    pub guardian_relationship: String,
    /// Guardian signature.
    pub guardian_signature: String,
    /// Informed consent given.
    pub informed_consent_given: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Reviewer name.
    pub reviewer_name: String,
    /// Reviewer title.
    pub reviewer_title: String,
    /// Review date.
    pub review_date: String,
    /// Review decision.
    pub review_decision: String,
    /// Review notes.
    pub review_notes: String,
    /// Redactions required.
    pub redactions_required: String,
    /// Redaction details.
    pub redaction_details: String,
    /// Compliance confirmed.
    pub compliance_confirmed: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Requesting party.
    pub requesting_party: RequestingParty,
    /// Records specification.
    pub records_specification: RecordsSpecification,
    /// Purpose of release.
    pub purpose_of_release: PurposeOfRelease,
    /// Authorization scope.
    pub authorization_scope: AuthorizationScope,
    /// Sensitive information.
    pub sensitive_information: SensitiveInformation,
    /// Duration expiry.
    pub duration_expiry: DurationExpiry,
    /// Verification identity.
    pub verification_identity: VerificationIdentity,
    /// Signatures consent.
    pub signatures_consent: SignaturesConsent,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
}

/// Additional flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Completion level.
    pub completion_level: CompletionLevel,
    /// Completion score.
    pub completion_score: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
