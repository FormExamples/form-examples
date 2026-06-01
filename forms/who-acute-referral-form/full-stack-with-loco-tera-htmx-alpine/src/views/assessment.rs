//! Tera context builders for the WHO Acute Referral Form assessment.

use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (PID, F&T, Situation, Background, Assessment,
/// Recommendations, Provider Sign-off, Receipt).
pub const TOTAL_STEPS: u32 = 8;

/// Build a Tera context for rendering the single-page wizard. All step
/// partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &TOTAL_STEPS);
    ctx.insert("data", data);
    ctx.insert("patient_identification", &data.patient_identification);
    ctx.insert("facility_and_transport", &data.facility_and_transport);
    ctx.insert("situation", &data.situation);
    ctx.insert("background", &data.background);
    ctx.insert("assessment", &data.assessment);
    ctx.insert("recommendations", &data.recommendations);
    ctx.insert(
        "initiating_provider_signoff",
        &data.initiating_provider_signoff,
    );
    ctx.insert(
        "referral_facility_receipt",
        &data.referral_facility_receipt,
    );
    ctx
}
