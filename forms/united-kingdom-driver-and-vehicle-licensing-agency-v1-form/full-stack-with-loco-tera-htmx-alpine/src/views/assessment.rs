use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the DVLA V1 form (14).
pub const TOTAL_STEPS: u32 = 14;

/// Build a Tera context for rendering the single-page DVLA V1 wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("personal_details", &data.personal_details);
    context.insert("healthcare_professionals", &data.healthcare_professionals);
    context.insert("eyesight_standards", &data.eyesight_standards);
    context.insert("vision_in_both_eyes", &data.vision_in_both_eyes);
    context.insert("field_of_vision", &data.field_of_vision);
    context.insert("glaucoma", &data.glaucoma);
    context.insert("retinitis_pigmentosa", &data.retinitis_pigmentosa);
    context.insert("laser_treatment", &data.laser_treatment);
    context.insert("blepharospasm", &data.blepharospasm);
    context.insert("night_blindness", &data.night_blindness);
    context.insert("double_vision", &data.double_vision);
    context.insert("other_vision_conditions", &data.other_vision_conditions);
    context.insert("recent_contact", &data.recent_contact);
    context.insert("authorisation", &data.authorisation);
    context
}
