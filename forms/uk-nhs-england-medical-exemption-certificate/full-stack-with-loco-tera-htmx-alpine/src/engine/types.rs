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
    Urgent,
    High,
    Medium,
    Low,
}

impl RulePriority {
    #[allow(dead_code)]
    pub fn label(self) -> &'static str {
        match self {
            RulePriority::Urgent => "Urgent",
            RulePriority::High => "High",
            RulePriority::Medium => "Medium",
            RulePriority::Low => "Low",
        }
    }

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
    EligibleCondition,
    Disqualifying,
    Redirect,
    Completeness,
    Renewal,
}

// ──────────────────────────────────────────────
// Step 1 — Practitioner identification
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Practitioner {
    pub name: String,
    pub role: String,
    pub registration_body: String,
    pub registration_number: String,
    pub practice_name: String,
    pub practice_code: String,
    pub postal_address_as_full_text: String,
    pub postcode: String,
    pub phone: String,
    pub email: String,
    pub completed_date: String,
}

// ──────────────────────────────────────────────
// Step 2 — Patient identification
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    pub title: String,
    pub surname: String,
    pub forenames: String,
    pub birth_date: String,
    pub sex: String,
    pub postal_address_as_full_text: String,
    pub postcode: String,
    pub united_kingdom_nhs_number: String,
    pub phone: String,
    pub email: String,
    /// "" | "yes" | "no"
    pub full_time_education: String,
    /// "" | "not-pregnant" | "pregnant" | "post-partum-within-12-months"
    pub pregnancy_status: String,
}

// ──────────────────────────────────────────────
// Step 3 — Existing exemption check
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExistingExemption {
    /// "" | "new" | "renewal" | "replacement"
    pub application_kind: String,
    /// "" | "yes" | "no"
    pub has_existing_certificate: String,
    pub previous_certificate_number: String,
    pub previous_certificate_expiry_date: String,
}

// ──────────────────────────────────────────────
// Step 6 — Qualifying condition selection &
// Step 7/8 — condition-specific detail
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QualifyingCondition {
    /// One of the 10 NHSBSA codes (see AGENTS.md).
    pub code: String,
    /// "" | "yes" — practitioner has confirmed this condition applies.
    pub selected: String,
    pub diagnosis_date: String,
    pub snomed_ct_code: String,
    pub icd10_code: String,
    pub treatment_detail: String,

    // fistula-specific
    pub fistula_site: String,
    pub appliance_type: String,

    // substitution-therapy-specific
    pub substitution_therapy: String,
    /// "" | "yes" | "no"
    pub on_substitution_therapy: String,

    // diabetes-specific
    /// "" | "insulin" | "oral-hypoglycaemic" | "insulin-and-oral" | "glp1-agonist" | "diet-only"
    pub diabetes_treatment_mode: String,

    // epilepsy-specific
    pub anticonvulsant: String,
    /// "" | "yes" | "no"
    pub continuous_anticonvulsant_therapy: String,

    // continuing-physical-disability-specific
    /// "" | "yes" | "no"
    pub cannot_leave_home_unaided: String,
    pub disability_carer_detail: String,
    /// "" | "yes" | "no"
    pub disability_expected_to_be_permanent: String,

    // cancer-specific
    pub cancer_site: String,
    /// "" | "active-treatment" | "effects-of-cancer" | "effects-of-treatment" | "remission-with-ongoing-treatment" | "palliative"
    pub cancer_treatment_phase: String,
    /// "" | "yes" | "no" | "pending"
    pub histology_confirmed: String,

    pub practitioner_attestation_notes: String,
}

// ──────────────────────────────────────────────
// Step 9 — Practitioner declaration
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PractitionerDeclaration {
    /// "" | "yes" | "no"
    pub signature_present: String,
    /// "" | "yes" | "no"
    pub access_to_medical_records: String,
    pub declaration_text: String,
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Full application data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApplicationData {
    pub practitioner: Practitioner,
    pub patient: Patient,
    pub existing_exemption: ExistingExemption,
    /// Step 4 / 5 are computed from `patient` (age, pregnancy status); no
    /// extra fields are needed beyond those captured in `Patient`.
    pub conditions: Vec<QualifyingCondition>,
    pub declaration: PractitionerDeclaration,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Grading engine output types
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: RuleCategory,
    pub priority: RulePriority,
    pub description: String,
    pub message: String,
    pub contributing_condition_code: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: RulePriority,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    /// "" | "eligible" | "ineligible" | "requires-clarification"
    pub outcome: String,
    /// "" | "FW8" | "age-exemption" | "low-income-scheme" | "hc1" | "hc2"
    pub redirect_to: String,
    pub result_category: String,
    pub result_score: f32,
    pub result_notes: String,
    pub eligible_condition_codes: Vec<String>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub valid_from: String,
    pub valid_until: String,
    pub validity_years: u8,
    pub timestamp: String,
}
