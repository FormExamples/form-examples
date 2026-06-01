use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics + 7 HSE domains + Comments).
pub const TOTAL_STEPS: u32 = 9;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("demands", &data.demands);
    context.insert("control", &data.control);
    context.insert("manager_support", &data.manager_support);
    context.insert("peer_support", &data.peer_support);
    context.insert("relationships", &data.relationships);
    context.insert("role", &data.role);
    context.insert("change", &data.change);
    context.insert("additional_comments", &data.additional_comments);
    context
}
