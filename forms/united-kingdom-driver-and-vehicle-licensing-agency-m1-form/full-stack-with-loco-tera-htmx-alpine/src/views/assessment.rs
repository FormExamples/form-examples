//! Tera context builders for the DVLA M1 form.

use tera::Context;
use uuid::Uuid;

use crate::engine::m1_validator::validate_m1;
use crate::engine::types::AssessmentData;

/// Build the Tera context for the single-page assessment form.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &6usize);
    ctx.insert("data", data);
    ctx
}

/// Build the Tera context for the report after submission.
pub fn build_report_context(data: &AssessmentData, id: Uuid) -> Context {
    let result = validate_m1(data);
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", data);
    ctx.insert("result", &result);
    ctx.insert("timestamp", &result.timestamp);
    ctx
}
