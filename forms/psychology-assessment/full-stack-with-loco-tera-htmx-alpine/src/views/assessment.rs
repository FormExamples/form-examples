//! Tera context builders for the psychology assessment.

use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::dass21_grader::calculate_dass21;
use crate::engine::flagged_issues::detect_additional_flags;
use crate::engine::types::{AssessmentData, GradingResult, SubscaleScore};

/// Display-friendly view of a SubscaleScore for templates.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscaleView {
    pub raw: u32,
    pub scaled: u32,
    pub severity: String,
    pub severity_label: String,
    pub answered: u32,
}

impl From<&SubscaleScore> for SubscaleView {
    fn from(s: &SubscaleScore) -> Self {
        SubscaleView {
            raw: s.raw,
            scaled: s.scaled,
            severity: format!("{:?}", s.severity).to_lowercase(),
            severity_label: s.severity.label().to_string(),
            answered: s.answered,
        }
    }
}

/// Build the Tera context for the single-page assessment form.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &8usize);
    ctx.insert("data", data);
    ctx
}

/// Build the Tera context for the report after submission.
pub fn build_report_context(data: &AssessmentData, id: Uuid) -> Context {
    let outcome = calculate_dass21(data);
    let flags = detect_additional_flags(
        data,
        &outcome.depression,
        &outcome.anxiety,
        &outcome.stress,
    );
    let result = GradingResult {
        depression: outcome.depression.clone(),
        anxiety: outcome.anxiety.clone(),
        stress: outcome.stress.clone(),
        fired_rules: outcome.fired_rules,
        additional_flags: flags,
        timestamp: chrono::Utc::now().to_rfc3339(),
    };

    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", data);
    ctx.insert("result", &result);
    ctx.insert("depression_view", &SubscaleView::from(&result.depression));
    ctx.insert("anxiety_view", &SubscaleView::from(&result.anxiety));
    ctx.insert("stress_view", &SubscaleView::from(&result.stress));
    ctx.insert("timestamp", &result.timestamp);
    ctx
}
