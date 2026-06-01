use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (1..=9 mirrors the SBAR + logistics + sign-off flow).
pub const TOTAL_STEPS: u32 = 9;

/// Build a Tera context for rendering the single-page transfer wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("requesting_provider", &data.requesting_provider);
    context.insert("receiving_provider", &data.receiving_provider);
    context.insert("patient_demographics", &data.patient_demographics);
    context.insert("situation", &data.situation);
    context.insert("background", &data.background);
    context.insert("assessment", &data.assessment);
    context.insert("recommendation", &data.recommendation);
    context.insert("transfer_logistics", &data.transfer_logistics);
    context.insert("signoff_acknowledgement", &data.signoff_acknowledgement);
    context
}
