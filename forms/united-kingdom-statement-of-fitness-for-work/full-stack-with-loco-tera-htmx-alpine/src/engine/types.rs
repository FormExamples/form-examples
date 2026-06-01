//! Core types for the UK fit-note grading engine.
//!
//! `serde(rename_all = "camelCase")` is applied to every struct shared
//! with the front-end (the canonical wire format is camelCase) and
//! serialised into the Tera template context.

use serde::{Deserialize, Serialize};

// ──────────────────────────────────────────────
// Step 1 — Issuer (clinician + practice)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Clinician {
    pub name: String,
    /// "" | "doctor" | "nurse" | "occupational_therapist" | "pharmacist" |
    /// "physiotherapist" | "other"
    pub profession: String,
    /// "" | "GMC" | "NMC" | "HCPC" | "GPhC" | "other"
    pub registration_body: String,
    pub registration_number: String,
    /// "" | "yes" | "no"
    pub is_private_practice: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalPractice {
    pub name: String,
    pub postal_address_as_full_text: String,
    pub postcode: String,
    pub ods_code: String,
    /// "" | "primary_care" | "secondary_care_inpatient" |
    /// "secondary_care_discharge" | "occupational_health" | "pharmacy" |
    /// "community_clinic" | "private_practice"
    pub setting: String,
}

// ──────────────────────────────────────────────
// Step 2 — Patient
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    pub name: String,
    pub birth_date: String,
    pub united_kingdom_nhs_number: String,
    pub postal_address_as_full_text: String,
    pub postcode: String,
    pub employer_name: String,
    pub occupation: String,
}

// ──────────────────────────────────────────────
// Full fit-note data model (steps 1–10)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    // Step 1 — Issuer
    pub clinician: Clinician,
    pub medical_practice: MedicalPractice,
    // Step 2 — Patient
    pub patient: Patient,
    // Step 3 — Assessment
    pub assessment_date: String,
    /// "" | "in_person" | "video_call" | "telephone" |
    /// "written_report_from_other_hcp"
    pub assessment_method: String,
    pub general_fitness_considered: String,
    // Step 4 — Diagnosis
    pub diagnosis_text: String,
    pub diagnosis_snomed_code: String,
    pub diagnosis_snomed_display: String,
    pub diagnosis_category: String,
    pub condition_first_recorded_date: String,
    /// "" | "yes" | "no"
    pub is_automatic_disability: String,
    /// "" | "yes" | "no"
    pub is_non_medical: String,
    // Step 5 — Fitness for work
    /// "" | "not_fit" | "may_be_fit"
    pub fitness_for_work: String,
    // Step 6 — Adaptations (visible only when may_be_fit)
    pub adaptation_phased_return: String,
    pub adaptation_altered_hours: String,
    pub adaptation_amended_duties: String,
    pub adaptation_workplace_adaptations: String,
    // Step 7 — Comments
    pub comments: String,
    // Step 8 — Period
    /// "" | "duration" | "from_to"
    pub period_type: String,
    pub period_duration_value: Option<i64>,
    /// "" | "days" | "weeks" | "months"
    pub period_duration_unit: String,
    pub period_from: String,
    pub period_to: String,
    // Step 9 — Follow-up
    pub will_assess_again: String,
    pub planned_review_date: String,
    // Step 10 — Sign-off
    pub issued_at: String,
    /// "" | "digital" | "printed_computer_generated" | "printed_handwritten"
    pub issued_via: String,
    /// "" | "primary_care" | "secondary_care_discharge" |
    /// "occupational_health" | "pharmacy" | "community"
    pub issue_setting: String,
    pub safeguarding_concern: String,
    pub safeguarding_notes: String,
}

// ──────────────────────────────────────────────
// Grade output
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    /// "validity" | "adaptation" | "period" | "safety"
    pub rule_set: String,
    /// "low" | "medium" | "high"
    pub severity: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SafetyFlag {
    pub flag_id: String,
    pub category: String,
    /// "low" | "medium" | "high"
    pub priority: String,
    pub description: String,
    pub suggested_action: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Grade {
    /// "" | "not_fit" | "may_be_fit"
    pub fitness_category: String,
    /// "" | "none" | "light" | "moderate" | "substantial" | "comprehensive"
    pub adaptation_intensity: String,
    pub adaptation_count: u32,
    pub period_days: Option<i64>,
    /// "" | "self_cert_range" | "compliant" | "exceeds_initial_max" |
    /// "long_term" | "very_long_term"
    pub period_compliance: String,
    /// "" | "yes" | "no"
    pub is_within_first_six_months_of_condition: String,
    /// "yes" | "no"
    pub is_valid: String,
    /// "standard" | "refer_occupational_health" | "refer_access_to_work" |
    /// "refer_employment_advisor" | "review_for_validity"
    pub recommendation: String,
    pub fired_rules: Vec<FiredRule>,
    pub safety_flags: Vec<SafetyFlag>,
    pub timestamp: String,
}
