//! Core types for the UK MAT B1 maternity certificate engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag. Mirrors the TS `RulePriority`.
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

/// Rule category. Mirrors the TS `RuleCategory`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RuleCategory {
    Completeness,
    Consistency,
    Safety,
    Declaration,
    Timing,
}

// ──────────────────────────────────────────────
// Step 1 — Front page: Patient Identification
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientIdentification {
    pub patient_name: String,
    pub date_of_birth: String,
    pub nhs_number: String,
}

// ──────────────────────────────────────────────
// Step 2 — Part A — Pre-confinement
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreConfinementCertificate {
    pub expected_date_of_confinement: String,
    pub examination_date: String,
}

// ──────────────────────────────────────────────
// Step 3 — Part B — Post-confinement
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostConfinementCertificate {
    pub actual_date_of_birth: String,
    pub expected_date_of_confinement: String,
}

// ──────────────────────────────────────────────
// Step 4 — Issuer Validation
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoctorIssuer {
    pub doctor_name: String,
    pub practice_name: String,
    pub practice_address: String,
    /// "" | "yes" | "no"
    pub stamp_applied: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MidwifeIssuer {
    pub midwife_name: String,
    pub nmc_pin: String,
    pub nmc_expiry_date: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IssuerValidation {
    /// "" | "doctor" | "midwife"
    pub issuer_type: String,
    pub doctor: DoctorIssuer,
    pub midwife: MidwifeIssuer,
    pub certificate_number: String,
    pub issue_date: String,
    /// "" | "yes" | "no"
    pub is_duplicate: String,
    /// "" | "yes" | "no"
    pub duplicate_marker_applied: String,
    /// "" | "yes" | "no"
    pub completed_in_ink: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_identification: PatientIdentification,
    /// "" | "pre" | "post"
    pub certificate_type: String,
    pub pre_confinement: PreConfinementCertificate,
    pub post_confinement: PostConfinementCertificate,
    pub issuer: IssuerValidation,
}

// ──────────────────────────────────────────────
// Validation engine types
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
    pub complete: bool,
    /// "" | "pre" | "post"
    pub certificate_type: String,
    /// "" | "doctor" | "midwife"
    pub issuer_type: String,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub weeks_before_ewc: Option<i64>,
    pub timestamp: String,
}
