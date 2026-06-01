use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 sections: demographics through overall climate).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("leadership", &data.leadership);
    context.insert("psych_safety", &data.psych_safety);
    context.insert("inclusion", &data.inclusion);
    context.insert("communication", &data.communication);
    context.insert("collaboration", &data.collaboration);
    context.insert("recognition", &data.recognition);
    context.insert("wellbeing", &data.wellbeing);
    context.insert("career", &data.career);
    context.insert("overall", &data.overall);
    context
}
