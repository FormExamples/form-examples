use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics through Clearance Decision).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page PPE wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("sport_position_details", &data.sport_position_details);
    context.insert("medical_history", &data.medical_history);
    context.insert("family_history", &data.family_history);
    context.insert("menstrual_history_reds", &data.menstrual_history_reds);
    context.insert("cardiovascular_screening", &data.cardiovascular_screening);
    context.insert("musculoskeletal_screening", &data.musculoskeletal_screening);
    context.insert(
        "neurological_concussion_baseline",
        &data.neurological_concussion_baseline,
    );
    context.insert("vision_skin", &data.vision_skin);
    context.insert("clearance_decision", &data.clearance_decision);
    context
}
