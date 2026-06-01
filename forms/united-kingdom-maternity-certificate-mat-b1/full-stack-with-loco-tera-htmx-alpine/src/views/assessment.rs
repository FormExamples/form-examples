use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps: 1 Patient ID, 2 Part A, 3 Part B, 4 Issuer.
pub const TOTAL_STEPS: u32 = 4;

/// Build a Tera context for rendering the single-page MAT B1 wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_identification", &data.patient_identification);
    context.insert("certificate_type", &data.certificate_type);
    context.insert("pre_confinement", &data.pre_confinement);
    context.insert("post_confinement", &data.post_confinement);
    context.insert("issuer", &data.issuer);
    context
}
