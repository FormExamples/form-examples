//! Core types for the UK NHS England FP92A medical exemption engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).
//!
//! The data shape mirrors the SQL schema: patient, practitioner, application,
//! application_eligible_condition, grade, grade_fired_rule, grade_additional_flag.

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RulePriority {
    /// Urgent.
    Urgent,
    /// High.
    High,
    /// Medium.
    Medium,
    /// Low.
    Low,
}

impl RulePriority {
    /// Label.
    #[allow(dead_code)]
    pub fn label(self) -> &'static str {
        match self {
            RulePriority::Urgent => "Urgent",
            RulePriority::High => "High",
            RulePriority::Medium => "Medium",
            RulePriority::Low => "Low",
        }
    }

    /// Order.
    pub fn order(self) -> u8 {
        match self {
            RulePriority::Urgent => 0,
            RulePriority::High => 1,
            RulePriority::Medium => 2,
            RulePriority::Low => 3,
        }
    }
}

/// Rule category for FP92A grading.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RuleCategory {
    /// Eligible condition.
    EligibleCondition,
    /// Disqualifying.
    Disqualifying,
    /// Redirect.
    Redirect,
    /// Completeness.
    Completeness,
    /// Renewal.
    Renewal,
}

// ──────────────────────────────────────────────
// Step 1 — Practitioner identification
// ──────────────────────────────────────────────

/// Practitioner.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Practitioner {
    /// Name.
    pub name: String,
    /// Role.
    pub role: String,
    /// Registration body.
    pub registration_body: String,
    /// Registration number.
    pub registration_number: String,
    /// Practice name.
    pub practice_name: String,
    /// Practice code.
    pub practice_code: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: String,
    /// Postcode.
    pub postcode: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// Completed date.
    pub completed_date: String,
}

// ──────────────────────────────────────────────
// Step 2 — Patient identification
// ──────────────────────────────────────────────

/// Patient.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    /// Title.
    pub title: String,
    /// Surname.
    pub surname: String,
    /// Forenames.
    pub forenames: String,
    /// Birth date.
    pub birth_date: String,
    /// Sex.
    pub sex: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: String,
    /// Postcode.
    pub postcode: String,
    /// United kingdom NHS number.
    pub united_kingdom_nhs_number: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// "" | "yes" | "no"
    pub full_time_education: String,
    /// "" | "not-pregnant" | "pregnant" | "post-partum-within-12-months"
    pub pregnancy_status: String,
}

// ──────────────────────────────────────────────
// Step 3 — Existing exemption check
// ──────────────────────────────────────────────

/// Existing exemption.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExistingExemption {
    /// "" | "new" | "renewal" | "replacement"
    pub application_kind: String,
    /// "" | "yes" | "no"
    pub has_existing_certificate: String,
    /// Previous certificate number.
    pub previous_certificate_number: String,
    /// Previous certificate expiry date.
    pub previous_certificate_expiry_date: String,
}

// ──────────────────────────────────────────────
// Step 6 — Qualifying condition selection &
// Step 7/8 — condition-specific detail
// ──────────────────────────────────────────────

/// Qualifying condition.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QualifyingCondition {
    /// One of the 10 NHSBSA codes (see AGENTS.md).
    pub code: String,
    /// "" | "yes" — practitioner has confirmed this condition applies.
    pub selected: String,
    /// Diagnosis date.
    pub diagnosis_date: String,
    /// Snomed CT code.
    pub snomed_ct_code: String,
    /// Icd10 code.
    pub icd10_code: String,
    /// Treatment detail.
    pub treatment_detail: String,

    // fistula-specific
    /// Fistula site.
    pub fistula_site: String,
    /// Appliance type.
    pub appliance_type: String,

    // substitution-therapy-specific
    /// Substitution therapy.
    pub substitution_therapy: String,
    /// "" | "yes" | "no"
    pub on_substitution_therapy: String,

    // diabetes-specific
    /// "" | "insulin" | "oral-hypoglycaemic" | "insulin-and-oral" | "glp1-agonist" | "diet-only"
    pub diabetes_treatment_mode: String,

    // epilepsy-specific
    /// Anticonvulsant.
    pub anticonvulsant: String,
    /// "" | "yes" | "no"
    pub continuous_anticonvulsant_therapy: String,

    // continuing-physical-disability-specific
    /// "" | "yes" | "no"
    pub cannot_leave_home_unaided: String,
    /// Disability carer detail.
    pub disability_carer_detail: String,
    /// "" | "yes" | "no"
    pub disability_expected_to_be_permanent: String,

    // cancer-specific
    /// Cancer site.
    pub cancer_site: String,
    /// "" | "active-treatment" | "effects-of-cancer" | "effects-of-treatment" | "remission-with-ongoing-treatment" | "palliative"
    pub cancer_treatment_phase: String,
    /// "" | "yes" | "no" | "pending"
    pub histology_confirmed: String,

    /// Practitioner attestation notes.
    pub practitioner_attestation_notes: String,
}

// ──────────────────────────────────────────────
// Step 9 — Practitioner declaration
// ──────────────────────────────────────────────

/// Practitioner declaration.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PractitionerDeclaration {
    /// "" | "yes" | "no"
    pub signature_present: String,
    /// "" | "yes" | "no"
    pub access_to_medical_records: String,
    /// Declaration text.
    pub declaration_text: String,
    /// Signature date.
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Full application data model
// ──────────────────────────────────────────────

/// Application data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplicationData {
    /// Practitioner.
    pub practitioner: Practitioner,
    /// Patient.
    pub patient: Patient,
    /// Existing exemption.
    pub existing_exemption: ExistingExemption,
    /// Step 4 / 5 are computed from `patient` (age, pregnancy status); no
    /// extra fields are needed beyond those captured in `Patient`.
    pub conditions: Vec<QualifyingCondition>,
    /// Declaration.
    pub declaration: PractitionerDeclaration,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Grading engine output types
// ──────────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: RuleCategory,
    /// Priority.
    pub priority: RulePriority,
    /// Description.
    pub description: String,
    /// Message.
    pub message: String,
    /// Contributing condition code.
    pub contributing_condition_code: String,
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
    pub priority: RulePriority,
}

/// Grade result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    /// "" | "eligible" | "ineligible" | "requires-clarification"
    pub outcome: String,
    /// "" | "FW8" | "age-exemption" | "low-income-scheme" | "hc1" | "hc2"
    pub redirect_to: String,
    /// Result category.
    pub result_category: String,
    /// Result score.
    pub result_score: f32,
    /// Result notes.
    pub result_notes: String,
    /// Eligible condition codes.
    pub eligible_condition_codes: Vec<String>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Valid from.
    pub valid_from: String,
    /// Valid until.
    pub valid_until: String,
    /// Validity years.
    pub validity_years: u8,
    /// Timestamp.
    pub timestamp: String,
}
