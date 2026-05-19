//! Tera context builders for the fit-note wizard and report.

use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::grading::grade_fit_note;
use crate::grading::types::{FitNote, Grade};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportResult {
    pub grade: Grade,
    pub timestamp: String,
}

/// Build the Tera context for the ten-step single-page wizard.
pub fn build_form_context(fit_note: &FitNote, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &10usize);
    ctx.insert("data", fit_note);
    ctx
}

/// Build the Tera context for the graded report.
pub fn build_report_context(fit_note: &FitNote, id: Uuid) -> Context {
    let grade = grade_fit_note(fit_note);
    let timestamp = chrono::Utc::now().to_rfc3339();
    let result = ReportResult {
        grade,
        timestamp: timestamp.clone(),
    };

    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", fit_note);
    ctx.insert("result", &result);
    ctx.insert("timestamp", &timestamp);
    ctx
}
