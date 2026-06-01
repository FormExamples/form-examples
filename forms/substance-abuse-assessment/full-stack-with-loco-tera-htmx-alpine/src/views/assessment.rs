use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 steps + summary on same page).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("alcohol_use_audit", &data.alcohol_use_audit);
    context.insert("drug_use_dast", &data.drug_use_dast);
    context.insert("substance_use_history", &data.substance_use_history);
    context.insert("withdrawal_assessment", &data.withdrawal_assessment);
    context.insert("mental_health_comorbidities", &data.mental_health_comorbidities);
    context.insert("physical_health_impact", &data.physical_health_impact);
    context.insert("social_legal_impact", &data.social_legal_impact);
    context.insert("previous_treatment_history", &data.previous_treatment_history);
    context.insert("treatment_planning_goals", &data.treatment_planning_goals);
    context
}
