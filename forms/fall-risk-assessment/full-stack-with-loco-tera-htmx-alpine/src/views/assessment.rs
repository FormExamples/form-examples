use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics, Fall History, MFS, Mobility,
/// Medications, Vision, Environment, Cognitive, Previous Interventions,
/// Prevention Plan).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("fall_history", &data.fall_history);
    context.insert("mfs", &data.mfs);
    context.insert("mobility_gait", &data.mobility_gait);
    context.insert("medication_review", &data.medication_review);
    context.insert("vision_sensory", &data.vision_sensory);
    context.insert("environmental", &data.environmental);
    context.insert("cognitive", &data.cognitive);
    context.insert("previous_interventions", &data.previous_interventions);
    context.insert("prevention_plan", &data.prevention_plan);
    context
}
