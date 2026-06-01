//! Tera context builders for the WHO Emergency Unit (Trauma) Form assessment.

use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::eu_trauma_validator::validate_eu_trauma;
use crate::engine::flagged_issues::detect_flagged_issues;
use crate::engine::types::{AssessmentData, FlaggedIssue, ValidationResult};

/// Total wizard steps — one per top-level section of the WHO trauma form.
pub const TOTAL_STEPS: u32 = 17;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportResult {
    pub validation: ValidationResult,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}

/// Build a Tera context for rendering the single-page trauma wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context
}

/// Build the Tera context for the report after submission. The grading
/// result is computed by the engine and also returned so the caller can
/// persist it.
pub fn build_report_context(data: &AssessmentData, id: Uuid) -> (Context, ReportResult) {
    let validation = validate_eu_trauma(data);
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
    (ctx, result)
}
