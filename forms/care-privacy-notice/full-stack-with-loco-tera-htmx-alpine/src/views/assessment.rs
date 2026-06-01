use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Practice Configuration, Privacy Notice, Acknowledgment).
pub const TOTAL_STEPS: u32 = 3;

/// Build a Tera context for rendering the single-page acknowledgement wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("config", &data.config);
    context.insert("acknowledgment", &data.acknowledgment);
    context
}
