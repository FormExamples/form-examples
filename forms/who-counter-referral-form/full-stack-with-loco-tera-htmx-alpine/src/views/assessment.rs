use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (matches the 7-step SBAR form structure).
pub const TOTAL_STEPS: u32 = 7;

/// Build a Tera context for rendering the single-page counter-referral wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_identification", &data.patient_identification);
    context.insert("facility_details", &data.facility_details);
    context.insert("situation", &data.situation);
    context.insert("background", &data.background);
    context.insert("assessment", &data.assessment);
    context.insert("recommendations", &data.recommendations);
    context.insert("provider_sign_off", &data.provider_sign_off);
    context
}
