use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 sections, one continuous single-page wizard).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("carer_support", &data.carer_support);
    context.insert("communication_needs", &data.communication_needs);
    context.insert("medical_review", &data.medical_review);
    context.insert("physical_examination", &data.physical_examination);
    context.insert("adaptive_functioning", &data.adaptive_functioning);
    context.insert("behavioural_concerns", &data.behavioural_concerns);
    context.insert("mental_capacity_consent", &data.mental_capacity_consent);
    context.insert("reasonable_adjustments", &data.reasonable_adjustments);
    context.insert("health_action_plan", &data.health_action_plan);
    context
}
