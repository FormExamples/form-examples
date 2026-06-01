use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Recipient Details, Code of Conduct Notice,
/// Acknowledgement & Signature).
pub const TOTAL_STEPS: u32 = 3;

/// Build a Tera context for rendering the single-page acknowledgement
/// wizard. All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("recipient_details", &data.recipient_details);
    context.insert(
        "acknowledgement_signature",
        &data.acknowledgement_signature,
    );
    context
}
