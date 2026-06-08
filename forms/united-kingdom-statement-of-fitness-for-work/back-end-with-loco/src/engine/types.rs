//! Core types for the UK fit-note grading engine.
//!
//! `serde(rename_all = "camelCase")` is applied to every struct shared
//! with the front-end (the canonical wire format is camelCase) and
//! serialised into the Tera template context.

use serde::{Deserialize, Serialize};

// ──────────────────────────────────────────────
// Step 1 — Issuer (clinician + practice)
// ──────────────────────────────────────────────

/// Clinician.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Clinician {
    /// Name.
    pub name: String,
    /// "" | "doctor" | "nurse" | "occupational_therapist" | "pharmacist" |
    /// "physiotherapist" | "other"
    pub profession: String,
    /// "" | "GMC" | "NMC" | "HCPC" | "GPhC" | "other"
    pub registration_body: String,
    /// Registration number.
    pub registration_number: String,
    /// "" | "yes" | "no"
    pub is_private_practice: String,
}

/// Medical practice.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalPractice {
    /// Name.
    pub name: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: String,
    /// Postcode.
    pub postcode: String,
    /// Ods code.
    pub ods_code: String,
    /// "" | "primary_care" | "secondary_care_inpatient" |
    /// "secondary_care_discharge" | "occupational_health" | "pharmacy" |
    /// "community_clinic" | "private_practice"
    pub setting: String,
}

// ──────────────────────────────────────────────
// Step 2 — Patient
// ──────────────────────────────────────────────

/// Patient.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Patient {
    /// Name.
    pub name: String,
    /// Birth date.
    pub birth_date: String,
    /// United kingdom NHS number.
    pub united_kingdom_nhs_number: String,
    /// Postal address as full text.
    pub postal_address_as_full_text: String,
    /// Postcode.
    pub postcode: String,
    /// Employer name.
    pub employer_name: String,
    /// Occupation.
    pub occupation: String,
}

// ──────────────────────────────────────────────
// Full fit-note data model (steps 1–10)
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    // Step 1 — Issuer
    /// Clinician.
    pub clinician: Clinician,
    /// Medical practice.
    pub medical_practice: MedicalPractice,
    // Step 2 — Patient
    /// Patient.
    pub patient: Patient,
    // Step 3 — Assessment
    /// Assessment date.
    pub assessment_date: String,
    /// "" | "in_person" | "video_call" | "telephone" |
    /// "written_report_from_other_hcp"
    pub assessment_method: String,
    /// General fitness considered.
    pub general_fitness_considered: String,
    // Step 4 — Diagnosis
    /// Diagnosis text.
    pub diagnosis_text: String,
    /// Diagnosis snomed code.
    pub diagnosis_snomed_code: String,
    /// Diagnosis snomed display.
    pub diagnosis_snomed_display: String,
    /// Diagnosis category.
    pub diagnosis_category: String,
    /// Condition first recorded date.
    pub condition_first_recorded_date: String,
    /// "" | "yes" | "no"
    pub is_automatic_disability: String,
    /// "" | "yes" | "no"
    pub is_non_medical: String,
    // Step 5 — Fitness for work
    /// "" | "not_fit" | "may_be_fit"
    pub fitness_for_work: String,
    // Step 6 — Adaptations (visible only when may_be_fit)
    /// Adaptation phased return.
    pub adaptation_phased_return: String,
    /// Adaptation altered hours.
    pub adaptation_altered_hours: String,
    /// Adaptation amended duties.
    pub adaptation_amended_duties: String,
    /// Adaptation workplace adaptations.
    pub adaptation_workplace_adaptations: String,
    // Step 7 — Comments
    /// Comments.
    pub comments: String,
    // Step 8 — Period
    /// "" | "duration" | "from_to"
    pub period_type: String,
    /// Period duration value.
    pub period_duration_value: Option<i64>,
    /// "" | "days" | "weeks" | "months"
    pub period_duration_unit: String,
    /// Period from.
    pub period_from: String,
    /// Period to.
    pub period_to: String,
    // Step 9 — Follow-up
    /// Will assess again.
    pub will_assess_again: String,
    /// Planned review date.
    pub planned_review_date: String,
    // Step 10 — Sign-off
    /// Issued at.
    pub issued_at: String,
    /// "" | "digital" | "printed_computer_generated" | "printed_handwritten"
    pub issued_via: String,
    /// "" | "primary_care" | "secondary_care_discharge" |
    /// "occupational_health" | "pharmacy" | "community"
    pub issue_setting: String,
    /// Safeguarding concern.
    pub safeguarding_concern: String,
    /// Safeguarding notes.
    pub safeguarding_notes: String,
}

// ──────────────────────────────────────────────
// Grade output
// ──────────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// "validity" | "adaptation" | "period" | "safety"
    pub rule_set: String,
    /// "low" | "medium" | "high"
    pub severity: String,
    /// Description.
    pub description: String,
}

/// Safety flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SafetyFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// "low" | "medium" | "high"
    pub priority: String,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Grade.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Grade {
    /// "" | "not_fit" | "may_be_fit"
    pub fitness_category: String,
    /// "" | "none" | "light" | "moderate" | "substantial" | "comprehensive"
    pub adaptation_intensity: String,
    /// Adaptation count.
    pub adaptation_count: u32,
    /// Period days.
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
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Safety flags.
    pub safety_flags: Vec<SafetyFlag>,
    /// Timestamp.
    pub timestamp: String,
}
