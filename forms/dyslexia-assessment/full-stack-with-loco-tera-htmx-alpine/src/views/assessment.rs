use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (matching the 10 assessment steps).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All step partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("developmental_history", &data.developmental_history);
    context.insert("educational_background", &data.educational_background);
    context.insert("reading_assessment", &data.reading_assessment);
    context.insert("writing_spelling", &data.writing_spelling);
    context.insert("phonological_processing", &data.phonological_processing);
    context.insert(
        "working_memory_processing_speed",
        &data.working_memory_processing_speed,
    );
    context.insert("emotional_behavioural", &data.emotional_behavioural);
    context.insert("previous_support", &data.previous_support);
    context.insert(
        "recommendations_support_plan",
        &data.recommendations_support_plan,
    );
    context
}
