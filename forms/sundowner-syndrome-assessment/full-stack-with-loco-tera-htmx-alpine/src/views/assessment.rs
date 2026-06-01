use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 sections of the sundowner assessment).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("cognitive_status", &data.cognitive_status);
    context.insert("behavioural_symptoms", &data.behavioural_symptoms);
    context.insert("temporal_pattern", &data.temporal_pattern);
    context.insert("trigger_identification", &data.trigger_identification);
    context.insert("sleep_wake_cycle", &data.sleep_wake_cycle);
    context.insert("medication_review", &data.medication_review);
    context.insert(
        "environmental_assessment",
        &data.environmental_assessment,
    );
    context.insert("carer_impact", &data.carer_impact);
    context.insert("management_plan", &data.management_plan);
    context
}
