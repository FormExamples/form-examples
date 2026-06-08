//! Engine module.

use serde::{Deserialize, Serialize};

/// Validation result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Validity status.
    pub validity_status: ValidityStatus,
    /// Completeness score.
    pub completeness_score: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Validated at.
    pub validated_at: String,
    /// Validator version.
    pub validator_version: String,
}

/// Validity status.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ValidityStatus {
    /// Valid.
    Valid,
    /// Invalid.
    Invalid,
}

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Citation.
    pub citation: String,
    /// Domain.
    pub domain: String,
    /// Description.
    pub description: String,
    /// Priority.
    pub priority: Priority,
}

/// Additional flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: Priority,
}

/// Priority.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Priority {
    /// High.
    High,
    /// Medium.
    Medium,
    /// Low.
    Low,
}

/// VALIDATOR version.
pub const VALIDATOR_VERSION: &str = "0.1.0";
