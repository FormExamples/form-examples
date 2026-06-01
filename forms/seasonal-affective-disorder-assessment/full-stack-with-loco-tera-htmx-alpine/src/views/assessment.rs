use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 — see index.md).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("seasonal_pattern_history", &data.seasonal_pattern_history);
    context.insert("current_mood", &data.current_mood);
    context.insert("sleep_energy", &data.sleep_energy);
    context.insert("appetite_weight", &data.appetite_weight);
    context.insert("social_occupational", &data.social_occupational);
    context.insert("light_exposure", &data.light_exposure);
    context.insert("previous_treatments", &data.previous_treatments);
    context.insert("risk_assessment", &data.risk_assessment);
    context.insert("treatment_plan", &data.treatment_plan);
    context
}
