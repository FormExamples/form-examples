use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::types::{AssessmentData, FlaggedIssue, ValidationResult};

/// Total wizard steps (matches the 16-step WHO Prehospital Form).
pub const TOTAL_STEPS: u32 = 16;

/// Persisted grading record written to the JSONB `result` column.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PersistedResult {
    pub validation: ValidationResult,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}

/// Build a Tera context for rendering the single-page prehospital wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("caller_and_scene", &data.caller_and_scene);
    context.insert("chief_complaint_and_vitals", &data.chief_complaint_and_vitals);
    context.insert("high_risk_signs", &data.high_risk_signs);
    context.insert("triage", &data.triage);
    context.insert("airway", &data.airway);
    context.insert("breathing", &data.breathing);
    context.insert("circulation", &data.circulation);
    context.insert("disability", &data.disability);
    context.insert("exposure", &data.exposure);
    context.insert("sample_history", &data.sample_history);
    context.insert("injury_details", &data.injury_details);
    context.insert("physical_exam", &data.physical_exam);
    context.insert("additional_interventions", &data.additional_interventions);
    context.insert("assessment_and_plan", &data.assessment_and_plan);
    context.insert("reassessments", &data.reassessments);
    context.insert("disposition", &data.disposition);
    context
}
