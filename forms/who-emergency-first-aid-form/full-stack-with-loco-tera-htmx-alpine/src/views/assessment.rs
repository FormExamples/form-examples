use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the WHO Emergency First Aid Form.
pub const TOTAL_STEPS: u32 = 12;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All step partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_identification", &data.patient_identification);
    context.insert("referral_transport", &data.referral_transport);
    context.insert("situation", &data.situation);
    context.insert("background", &data.background);
    context.insert("major_bleeding", &data.major_bleeding);
    context.insert("airway", &data.airway);
    context.insert("breathing", &data.breathing);
    context.insert("circulation", &data.circulation);
    context.insert("disability", &data.disability);
    context.insert("exposure", &data.exposure);
    context.insert("recommendations", &data.recommendations);
    context.insert("responder_details", &data.responder_details);
    context
}
