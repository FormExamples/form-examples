//! Core types for the DVLA M1 form validation engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority level for a fired rule or additional flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RulePriority {
    Urgent,
    High,
    Medium,
    Low,
}

/// Category of a validation rule.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RuleCategory {
    Completeness,
    Consistency,
    Safety,
    Declaration,
}

// ──────────────────────────────────────────────
// Part A — About You
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersonalDetails {
    pub title: String,
    pub full_name: String,
    pub date_of_birth: String,
    pub address: String,
    pub postcode: String,
    pub email: String,
    pub contact_number: String,
    pub change_of_details: String,
}

// ──────────────────────────────────────────────
// Part B — Healthcare Professionals
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GpDetails {
    pub gp_name: String,
    pub surgery_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsultantDetails {
    pub consultant_name: String,
    pub speciality: String,
    pub department: String,
    pub hospital_name: String,
    pub address: String,
    pub town: String,
    pub postcode: String,
    pub contact_number: String,
    pub email: String,
    pub date_last_seen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HealthcareProfessionals {
    pub gp: GpDetails,
    pub consultant: ConsultantDetails,
}

// ──────────────────────────────────────────────
// Q1 — Diagnosis confirmation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosisConfirmation {
    /// Q1: Have you been diagnosed with a mental health condition?
    /// "yes" | "no" | "" (unanswered).
    pub has_mental_health_diagnosis: String,
}

// ──────────────────────────────────────────────
// Q2 — Mental health conditions
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthConditions {
    pub anxiety_depression_without_impairment: String,
    pub anxiety_depression_with_impairment: String,
    pub bipolar_affective_disorder: String,
    pub eating_disorder: String,
    pub ocd_or_ptsd: String,
    pub personality_disorder: String,
    pub schizophrenia_or_psychosis: String,
    pub other: String,
    pub other_details: String,
}

// ──────────────────────────────────────────────
// Q3 — Recent contact with healthcare professionals
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentContact {
    pub had_recent_contact: String,
    pub doctor_last_date: String,
    pub consultant_last_date: String,
    pub community_psychiatric_nurse_last_date: String,
}

// ──────────────────────────────────────────────
// Applicant's Authorisation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Authorisation {
    pub declaration_confirmed: String,
    pub signatory_name: String,
    pub signature_text: String,
    pub signature_date: String,
    pub electronic_correspondence_consent: String,
    pub dvla_contact_preference: String,
    pub healthcare_professional_contact_preference: String,
}

// ──────────────────────────────────────────────
// Full form data
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub personal_details: PersonalDetails,
    pub healthcare_professionals: HealthcareProfessionals,
    pub diagnosis_confirmation: DiagnosisConfirmation,
    pub mental_health_conditions: MentalHealthConditions,
    pub recent_contact: RecentContact,
    pub authorisation: Authorisation,
}

// ──────────────────────────────────────────────
// Validation engine outputs
// ──────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: RuleCategory,
    pub priority: RulePriority,
    pub description: String,
    pub message: String,
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
pub struct ValidationResult {
    /// True when no completeness rules fired for the active branch.
    pub complete: bool,
    /// True when patient answered Q1 = No (form stops there).
    pub stopped_at_q1: bool,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub condition_count: u32,
    pub timestamp: String,
}

impl RulePriority {
    /// Numeric ordering for priority sort: urgent < high < medium < low.
    pub fn order(self) -> u8 {
        match self {
            RulePriority::Urgent => 0,
            RulePriority::High => 1,
            RulePriority::Medium => 2,
            RulePriority::Low => 3,
        }
    }

    #[allow(dead_code)]
    pub fn label(self) -> &'static str {
        match self {
            RulePriority::Urgent => "Urgent",
            RulePriority::High => "High",
            RulePriority::Medium => "Medium",
            RulePriority::Low => "Low",
        }
    }
}

/// Trim-aware non-empty check, mirrors `isFilled` from the TypeScript engine.
pub fn is_filled(value: &str) -> bool {
    !value.trim().is_empty()
}
