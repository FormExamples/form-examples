use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the anesthesiology assessment.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("planned_surgery", &data.planned_surgery);
    context.insert("medical_history", &data.medical_history);
    context.insert("medications", &data.medications);
    context.insert("allergies", &data.allergies);
    context.insert("previous_anaesthesia", &data.previous_anaesthesia);
    context.insert("social_history", &data.social_history);
    context.insert("vital_signs", &data.vital_signs);
    context.insert("physical_exam", &data.physical_exam);
    context.insert("investigations_and_plan", &data.investigations_and_plan);
    context
}
