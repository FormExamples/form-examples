use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 NICE CG156 fertility-assessment sections).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("reproductive_history", &data.reproductive_history);
    context.insert("menstrual_cycle", &data.menstrual_cycle);
    context.insert("medical_surgical_history", &data.medical_surgical_history);
    context.insert("lifestyle_factors", &data.lifestyle_factors);
    context.insert("medications_supplements", &data.medications_supplements);
    context.insert("partner_semen", &data.partner_semen);
    context.insert("hormone_profile", &data.hormone_profile);
    context.insert("investigations", &data.investigations);
    context.insert("clinical_recommendation", &data.clinical_recommendation);
    context
}
