use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("menstrual_history", &data.menstrual_history);
    context.insert("pain_assessment", &data.pain_assessment);
    context.insert("gastrointestinal_symptoms", &data.gastrointestinal_symptoms);
    context.insert("urinary_symptoms", &data.urinary_symptoms);
    context.insert("fertility_assessment", &data.fertility_assessment);
    context.insert("previous_treatments", &data.previous_treatments);
    context.insert("surgical_history", &data.surgical_history);
    context.insert("quality_of_life", &data.quality_of_life);
    context.insert("treatment_planning", &data.treatment_planning);
    context
}
