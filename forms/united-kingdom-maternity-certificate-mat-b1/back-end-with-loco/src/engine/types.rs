//! Core types for the UK MAT B1 maternity certificate engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag. Mirrors the TS `RulePriority`.
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

/// Rule category. Mirrors the TS `RuleCategory`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RuleCategory {
    /// Completeness.
    Completeness,
    /// Consistency.
    Consistency,
    /// Safety.
    Safety,
    /// Declaration.
    Declaration,
    /// Timing.
    Timing,
}

// ──────────────────────────────────────────────
// Step 1 — Front page: Patient Identification
// ──────────────────────────────────────────────

/// Patient identification.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientIdentification {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// NHS number.
    pub nhs_number: String,
}

// ──────────────────────────────────────────────
// Step 2 — Part A — Pre-confinement
// ──────────────────────────────────────────────

/// Pre confinement certificate.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreConfinementCertificate {
    /// Expected date of confinement.
    pub expected_date_of_confinement: String,
    /// Examination date.
    pub examination_date: String,
}

// ──────────────────────────────────────────────
// Step 3 — Part B — Post-confinement
// ──────────────────────────────────────────────

/// Post confinement certificate.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostConfinementCertificate {
    /// Actual date of birth.
    pub actual_date_of_birth: String,
    /// Expected date of confinement.
    pub expected_date_of_confinement: String,
}

// ──────────────────────────────────────────────
// Step 4 — Issuer Validation
// ──────────────────────────────────────────────

/// Doctor issuer.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DoctorIssuer {
    /// Doctor name.
    pub doctor_name: String,
    /// Practice name.
    pub practice_name: String,
    /// Practice address.
    pub practice_address: String,
    /// "" | "yes" | "no"
    pub stamp_applied: String,
}

/// Midwife issuer.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MidwifeIssuer {
    /// Midwife name.
    pub midwife_name: String,
    /// Nmc pin.
    pub nmc_pin: String,
    /// Nmc expiry date.
    pub nmc_expiry_date: String,
}

/// Issuer validation.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IssuerValidation {
    /// "" | "doctor" | "midwife"
    pub issuer_type: String,
    /// Doctor.
    pub doctor: DoctorIssuer,
    /// Midwife.
    pub midwife: MidwifeIssuer,
    /// Certificate number.
    pub certificate_number: String,
    /// Issue date.
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

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient identification.
    pub patient_identification: PatientIdentification,
    /// "" | "pre" | "post"
    pub certificate_type: String,
    /// Pre confinement.
    pub pre_confinement: PreConfinementCertificate,
    /// Post confinement.
    pub post_confinement: PostConfinementCertificate,
    /// Issuer.
    pub issuer: IssuerValidation,
}

// ──────────────────────────────────────────────
// Validation engine types
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

/// Validation result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Complete.
    pub complete: bool,
    /// "" | "pre" | "post"
    pub certificate_type: String,
    /// "" | "doctor" | "midwife"
    pub issuer_type: String,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Weeks before ewc.
    pub weeks_before_ewc: Option<i64>,
    /// Timestamp.
    pub timestamp: String,
}
