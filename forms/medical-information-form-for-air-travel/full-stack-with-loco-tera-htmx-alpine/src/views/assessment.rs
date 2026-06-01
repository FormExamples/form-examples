use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (14 per the MEDIF design).
pub const TOTAL_STEPS: u32 = 14;

/// Build a Tera context for rendering the single-page MEDIF wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("submitter", &data.submitter);
    context.insert("passenger", &data.passenger);
    context.insert("trip", &data.trip);
    context.insert("reason", &data.reason);
    context.insert("physician", &data.physician);
    context.insert("diagnosis", &data.diagnosis);
    context.insert("cardiovascular", &data.cardiovascular);
    context.insert("respiratory", &data.respiratory);
    context.insert("recent_events", &data.recent_events);
    context.insert("pregnancy", &data.pregnancy);
    context.insert("communicable", &data.communicable);
    context.insert("inflight_needs", &data.inflight_needs);
    context.insert("medications", &data.medications);
    context.insert("sign_off", &data.sign_off);
    context
}
