//! Tera context builders for the DVLA B1 assessment.

use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::b1_validator::validate_b1;
use crate::engine::flagged_issues::detect_flagged_issues;
use crate::engine::types::{AssessmentData, FlaggedIssue, ValidationResult};

/// Total wizard steps (13 per the DVLA B1 form).
pub const TOTAL_STEPS: u32 = 13;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportResult {
    pub validation: ValidationResult,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}

/// Build the Tera context for the single-page wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &TOTAL_STEPS);
    ctx.insert("data", data);
    ctx
}

/// Build the Tera context for the report after submission.
pub fn build_report_context(data: &AssessmentData, id: Uuid) -> Context {
    let validation = validate_b1(data);
    let flagged_issues = detect_flagged_issues(data);
    let timestamp = chrono::Utc::now().to_rfc3339();

    let result = ReportResult {
        validation,
        flagged_issues,
        timestamp: timestamp.clone(),
    };

    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", data);
    ctx.insert("result", &result);
    ctx.insert("timestamp", &timestamp);
    ctx
}
