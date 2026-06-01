use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Privacy Notice, Acknowledgment).
pub const TOTAL_STEPS: u32 = 2;

/// Build a Tera context for rendering the single-page acknowledgment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient", &data.patient);
    context.insert("acknowledgment", &data.acknowledgment);
    context.insert("practice_config", &data.practice_config);
    context
}
