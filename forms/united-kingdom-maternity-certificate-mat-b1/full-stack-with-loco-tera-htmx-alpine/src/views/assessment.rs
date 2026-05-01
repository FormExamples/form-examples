//! Tera context builders for the UK MAT B1 assessment.

use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::mat_b1_validator::validate_mat_b1;
use crate::engine::types::{AssessmentData, ValidationResult};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportResult {
    pub validation: ValidationResult,
    pub timestamp: String,
}

/// Build the Tera context for the single-page wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &4usize);
    ctx.insert("data", data);
    ctx
}

/// Build the Tera context for the report after submission.
pub fn build_report_context(data: &AssessmentData, id: Uuid) -> Context {
    let validation = validate_mat_b1(data);
    let timestamp = validation.timestamp.clone();

    let result = ReportResult {
        validation,
        timestamp: timestamp.clone(),
    };

    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", data);
    ctx.insert("result", &result);
    ctx.insert("timestamp", &timestamp);
    ctx
}
